import CryptoJS from 'crypto-js';
import type { GameState } from '../types';

const WEBHOOK_URL = 'https://oapi.dingtalk.com/robot/send?access_token=64f87a315d70254c66118f39f5f9d58dce5cfeb0bbce47e7d28025df5dc7dd24';
const SECRET = 'SEC47414186126450c7fe9aeaa8f60b888b0db8abf5c72a2e41ffc77f2e6e1fcda5';

const generateSignature = (timestamp: number) => {
  const stringToSign = timestamp + "\n" + SECRET;
  const hash = CryptoJS.HmacSHA256(stringToSign, SECRET);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return encodeURIComponent(hashInBase64);
};

export const sendToDingTalk = async (state: GameState) => {
  if (!state.playerName) return;

  const timestamp = new Date().getTime();
  const sign = generateSignature(timestamp);
  const url = `${WEBHOOK_URL}&timestamp=${timestamp}&sign=${sign}`;

  const stockValue = state.portfolio.reduce((sum, item) => {
    const stock = state.stocks.find(s => s.id === item.stockId);
    return sum + (stock ? stock.currentPrice * item.quantity : 0);
  }, 0);

  const totalAssets = state.cash + stockValue - (state.loan ? state.loan.remainingPrincipal : 0);

  const portfolioText = state.portfolio.map(item => {
    const stock = state.stocks.find(s => s.id === item.stockId);
    return stock ? `- ${stock.name}: ${item.quantity}股 (现价: ¥${stock.currentPrice})` : '';
  }).join('\n');

  const loanText = state.loan 
    ? `借款类型: ${state.loan.type === 'high_risk' ? '高风险' : '标准'}\n剩余本金: ¥${state.loan.remainingPrincipal.toLocaleString()}\n逾期状态: ${state.loan.overdueTurns}回合`
    : '无贷款';

  const content = `【大A模拟器】回合同步
玩家: ${state.playerName}
回合: 第 ${state.currentTurn} 回合

💰 资产概况:
- 总资产: ¥${totalAssets.toLocaleString()}
- 可用现金: ¥${state.cash.toLocaleString()}
- 股票市值: ¥${stockValue.toLocaleString()}

📊 持仓明细:
${portfolioText || '暂无持仓'}

🏦 贷款情况:
${loanText}

${state.isGameOver ? `❌ 游戏结束: ${state.gameOverReason}` : ''}`;

  try {
    // 注意：由于浏览器的跨域限制 (CORS)，直接从前端调用钉钉 Webhook 可能会失败。
    // 在真实生产环境中通常需要通过后端转发。
    // 这里为了演示逻辑直接发起 fetch 请求。
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'text',
        text: {
          content: content
        }
      })
    });
  } catch (error) {
    console.error('钉钉推送失败:', error);
  }
};
