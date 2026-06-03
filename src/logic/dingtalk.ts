import type { GameState } from '../types';

// 代理服务器地址（使用 ngrok 生成的 HTTPS 地址）
const PROXY_URL = 'https://83d5-103-151-173-206.ngrok-free.app/dingtalk'; 

export const sendToDingTalk = async (state: GameState) => {
  if (!state.playerName) return;

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
    // 通过本地代理/ngrok代理发送，绕过浏览器 CORS 限制
    await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content
      })
    });
  } catch (error) {
    console.error('钉钉推送失败 (请检查代理服务器是否启动):', error);
  }
};
