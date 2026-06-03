import type { Stock, GameEvent, GameState, PortfolioItem } from '../types';

export const INITIAL_CASH = 100000;

export const STOCKS: Stock[] = [
  { id: '1', name: '贵州茅台', code: '600519', initialPrice: 1700, currentPrice: 1700, yesterdayClose: 1700, history: [1700], volatility: 0.02, trend: 0.05, sector: ['消费', '白酒'] },
  { id: '2', name: '宁德时代', code: '300750', initialPrice: 160, currentPrice: 160, yesterdayClose: 160, history: [160], volatility: 0.05, trend: 0.1, sector: ['新能源', '锂电池'] },
  { id: '3', name: '招商银行', code: '600036', initialPrice: 32, currentPrice: 32, yesterdayClose: 32, history: [32], volatility: 0.015, trend: 0.02, sector: ['金融', '银行'] },
  { id: '4', name: '中国平安', code: '601318', initialPrice: 45, currentPrice: 45, yesterdayClose: 45, history: [45], volatility: 0.02, trend: -0.01, sector: ['金融', '保险'] },
  { id: '5', name: '隆基绿能', code: '601012', initialPrice: 18, currentPrice: 18, yesterdayClose: 18, history: [18], volatility: 0.06, trend: -0.05, sector: ['新能源', '光伏'] },
  { id: '6', name: '比亚迪', code: '002594', initialPrice: 210, currentPrice: 210, yesterdayClose: 210, history: [210], volatility: 0.04, trend: 0.08, sector: ['汽车', '新能源'] },
  { id: '7', name: '腾讯控股', code: '00700', initialPrice: 380, currentPrice: 380, yesterdayClose: 380, history: [380], volatility: 0.03, trend: 0.04, sector: ['互联网', '游戏'] },
  { id: '8', name: '中芯国际', code: '688981', initialPrice: 45, currentPrice: 45, yesterdayClose: 45, history: [45], volatility: 0.07, trend: 0.12, sector: ['半导体', '芯片'] },
  { id: '9', name: '伊利股份', code: '600887', initialPrice: 28, currentPrice: 28, yesterdayClose: 28, history: [28], volatility: 0.02, trend: 0.01, sector: ['消费', '乳制品'] },
  { id: '10', name: '万科A', code: '000002', initialPrice: 7, currentPrice: 7, yesterdayClose: 7, history: [7], volatility: 0.08, trend: -0.1, sector: ['房地产'] },
  { id: '11', name: '迈瑞医疗', code: '300760', initialPrice: 280, currentPrice: 280, yesterdayClose: 280, history: [280], volatility: 0.03, trend: 0.05, sector: ['医疗', '器械'] },
  { id: '12', name: '北方华创', code: '002371', initialPrice: 300, currentPrice: 300, yesterdayClose: 300, history: [300], volatility: 0.06, trend: 0.15, sector: ['半导体', '设备'] },
  { id: '13', name: '东方财富', code: '300059', initialPrice: 15, currentPrice: 15, yesterdayClose: 15, history: [15], volatility: 0.05, trend: 0.06, sector: ['金融', '互联网'] },
  { id: '14', name: '通威股份', code: '600438', initialPrice: 22, currentPrice: 22, yesterdayClose: 22, history: [22], volatility: 0.07, trend: -0.04, sector: ['新能源', '光伏'] },
  { id: '15', name: '科大讯飞', code: '002230', initialPrice: 42, currentPrice: 42, yesterdayClose: 42, history: [42], volatility: 0.06, trend: 0.08, sector: ['互联网', '人工智能'] },
  { id: '16', name: '爱尔眼科', code: '300015', initialPrice: 12, currentPrice: 12, yesterdayClose: 12, history: [12], volatility: 0.04, trend: -0.02, sector: ['医疗', '服务'] },
  { id: '17', name: '中信证券', code: '600030', initialPrice: 20, currentPrice: 20, yesterdayClose: 20, history: [20], volatility: 0.03, trend: 0.03, sector: ['金融', '证券'] },
  { id: '18', name: '紫金矿业', code: '601899', initialPrice: 16, currentPrice: 16, yesterdayClose: 16, history: [16], volatility: 0.04, trend: 0.07, sector: ['资源', '有色'] },
];

export const EVENTS: GameEvent[] = [
  {
    id: 'e1',
    title: '政策利好新能源',
    description: '政府出台新政策大力支持新能源汽车及光伏产业。',
    impacts: [
      { sector: '新能源', trendChange: [0.1, 0.2] },
      { sector: '汽车', trendChange: [0.05, 0.15] },
    ],
    duration: 5,
  },
  {
    id: 'e2',
    title: '金融监管加强',
    description: '银保监会发布新规，加强对金融机构的风险管理。',
    impacts: [
      { sector: '金融', trendChange: [-0.12, -0.05] },
    ],
    duration: 3,
  },
  {
    id: 'e3',
    title: '芯片工艺突破',
    description: '国内领军企业在3nm工艺上取得重大进展。',
    impacts: [
      { sector: '半导体', trendChange: [0.15, 0.25] },
    ],
    duration: 4,
  },
  {
    id: 'e4',
    title: '消费节来临',
    description: '大型购物节刺激消费需求。',
    impacts: [
      { sector: '消费', trendChange: [0.03, 0.08] },
      { sector: '互联网', trendChange: [0.02, 0.05] },
    ],
    duration: 2,
  },
  {
    id: 'e5',
    title: '房地产调控',
    description: '多地发布楼市限购政策，房企融资收紧。',
    impacts: [
      { sector: '房地产', trendChange: [-0.2, -0.1] },
    ],
    duration: 6,
  },
  {
    id: 'e6',
    title: '创新药获批',
    description: '国内某药企创新药获得国家药监局批准上市。',
    impacts: [
      { sector: '医疗', trendChange: [0.08, 0.18] },
    ],
    duration: 3,
  },
  {
    id: 'e7',
    title: '财务造假丑闻',
    description: '某上市公司被曝出财务造假，面临退市风险。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [-0.6, -0.4] }, // 随机指定一只股票
    ],
    duration: 10,
  },
  {
    id: 'e8',
    title: '全面注册制实施',
    description: '壳资源价值贬值，绩差股面临流动性危机。',
    impacts: [
      { sector: '房地产', trendChange: [-0.08, -0.02] },
      { stockId: 'RANDOM', trendChange: [-0.08, -0.02] },
    ],
    duration: 8,
  },
];

export const simulateNextTurn = (state: GameState): GameState => {
  if (state.isGameOver) return state;

  const nextTurn = state.currentTurn + 1;
  let nextCash = state.cash;
  let nextLoan = state.loan ? { ...state.loan } : undefined;
  let isGameOver = false;
  let gameOverReason = '';

  // 0. 处理贷款还款和利息
  if (nextLoan) {
    const interest = nextLoan.remainingPrincipal * nextLoan.interestRate;
    const minRepayment = interest + (nextLoan.principal * 0.05); // 每回合最少还 5% 本金 + 利息
    
    if (nextCash >= minRepayment) {
      nextCash -= minRepayment;
      nextLoan.remainingPrincipal -= (minRepayment - interest);
      nextLoan.overdueTurns = 0; // 成功还款，清空逾期
    } else {
      // 资金不足还款
      nextLoan.overdueTurns += 1;
      if (nextLoan.overdueTurns >= 3) {
        isGameOver = true;
        gameOverReason = '连续三回合未能按时偿还贷款，银行强制清盘，游戏结束。';
      }
    }

    if (nextLoan.remainingPrincipal <= 0) {
      nextLoan = undefined; // 贷款还清
    }
  }

  // 1. 更新活跃事件
  const nextActiveEvents = state.activeEvents
    .map(ae => {
      const nextRemaining = ae.remainingTurns - 1;
      
      // “财务造假”事件特殊逻辑：5回合后揭示行业
      if (ae.event.id === 'e7' && nextRemaining === 5) {
        const impact = ae.event.impacts.find(i => i.stockId && i.stockId !== 'RANDOM');
        if (impact) {
          const targetStock = state.stocks.find(s => s.id === impact.stockId);
          if (targetStock) {
            ae.event.description += ` 经过进一步调查，该企业属于【${targetStock.sector.join('/')}】板块，市场恐慌蔓延。`;
          }
        }
      }
      
      return { ...ae, remainingTurns: nextRemaining };
    })
    .filter(ae => ae.remainingTurns > 0);

  // 随机触发新事件
  if (Math.random() < 0.25 && nextActiveEvents.length < 4) {
    const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    if (!nextActiveEvents.find(ae => ae.event.id === randomEvent.id)) {
      nextActiveEvents.push({ event: randomEvent, remainingTurns: randomEvent.duration });
    }
  }

  // 2. 更新股票价格
  const nextStocks = state.stocks.map(stock => {
    if (stock.isDelisted) return stock;

    let currentTrend = stock.trend;

    // 应用事件影响
    nextActiveEvents.forEach(ae => {
      ae.event.impacts.forEach(impact => {
        if ((impact.sector && stock.sector.includes(impact.sector)) || impact.stockId === stock.id) {
          const [min, max] = impact.trendChange;
          const actualChange = min + Math.random() * (max - min);
          currentTrend += actualChange;
        }
      });
    });

    // 计算价格变动
    const randomNoise = (Math.random() - 0.5) * 2 * stock.volatility;
    const changePercent = currentTrend / 10 + randomNoise;
    
    let priceChange = stock.currentPrice * changePercent;
    const upperLimit = stock.yesterdayClose * 1.1;
    const lowerLimit = stock.yesterdayClose * 0.9;
    
    let finalPrice = Math.max(lowerLimit, Math.min(upperLimit, stock.currentPrice + priceChange));
    finalPrice = Math.round(finalPrice * 100) / 100;

    // 更新后的退市逻辑：基于初始价格的比例
    // 50% 预警，30% 强制退市
    const isBankruptcyRisk = finalPrice < (stock.initialPrice * 0.5);
    const isDelisted = finalPrice < (stock.initialPrice * 0.3);

    return {
      ...stock,
      yesterdayClose: stock.currentPrice,
      currentPrice: isDelisted ? 0 : finalPrice,
      history: isDelisted ? [...stock.history, 0] : [...stock.history, finalPrice].slice(-20),
      isDelisted,
      isBankruptcyRisk,
    };
  });

  // 3. 更新持仓 (处理退市持仓：价值归零)
  const nextPortfolio = state.portfolio.map(item => {
    const stock = nextStocks.find(s => s.id === item.stockId);
    if (stock?.isDelisted) {
      // 退市后资产归零，但在持仓中保留显示，方便玩家看到亏损
      return {
        ...item,
        availableQuantity: 0, 
      };
    }
    return {
      ...item,
      availableQuantity: item.quantity,
    };
  });

  // 4. 计算总资产
  const stockValue = nextPortfolio.reduce((sum, item) => {
    const stock = nextStocks.find(s => s.id === item.stockId);
    return sum + (stock ? stock.currentPrice * item.quantity : 0);
  }, 0);
  const totalValue = nextCash + stockValue - (nextLoan ? nextLoan.remainingPrincipal : 0);

  return {
    ...state,
    cash: nextCash,
    currentTurn: nextTurn,
    stocks: nextStocks,
    portfolio: nextPortfolio,
    activeEvents: nextActiveEvents,
    loan: nextLoan,
    isGameOver,
    gameOverReason,
    history: [...state.history, { turn: nextTurn, totalValue }],
  };
};

export const takeLoan = (state: GameState, type: 'standard' | 'high_risk'): GameState => {
  if (state.loan || state.isGameOver) return state;

  let principal = 0;
  let interestRate = 0;

  if (type === 'standard') {
    principal = state.cash * 1.5; // 标准贷款：本金的 1.5 倍
    interestRate = 0.01; // 1% 每回合
  } else {
    principal = Math.max(100000, state.cash * 3); // 高风险：至少 10w，或者是本金的 3 倍
    interestRate = 0.05; // 5% 每回合
  }

  return {
    ...state,
    cash: state.cash + principal,
    loan: {
      type,
      principal,
      remainingPrincipal: principal,
      interestRate,
      overdueTurns: 0,
    }
  };
};

export const repayLoan = (state: GameState, amount: number): GameState => {
  if (!state.loan || state.isGameOver || amount <= 0) return state;

  const actualRepay = Math.min(amount, state.cash, state.loan.remainingPrincipal);
  const nextRemaining = state.loan.remainingPrincipal - actualRepay;

  return {
    ...state,
    cash: state.cash - actualRepay,
    loan: nextRemaining <= 0 ? undefined : {
      ...state.loan,
      remainingPrincipal: nextRemaining,
      overdueTurns: 0,
    }
  };
};

export const buyStock = (state: GameState, stockId: string, quantity: number): GameState => {
  const stock = state.stocks.find(s => s.id === stockId);
  if (!stock || stock.isDelisted) return state;

  const cost = stock.currentPrice * quantity;
  if (state.cash < cost) return state;

  const existingItem = state.portfolio.find(item => item.stockId === stockId);
  let nextPortfolio: PortfolioItem[];

  if (existingItem) {
    nextPortfolio = state.portfolio.map(item => 
      item.stockId === stockId 
        ? {
            ...item,
            quantity: item.quantity + quantity,
            averageCost: (item.averageCost * item.quantity + cost) / (item.quantity + quantity),
            // availableQuantity 不变，因为 T+1
          }
        : item
    );
  } else {
    nextPortfolio = [
      ...state.portfolio,
      {
        stockId,
        quantity,
        averageCost: stock.currentPrice,
        availableQuantity: 0, // T+1
      }
    ];
  }

  return {
    ...state,
    cash: state.cash - cost,
    portfolio: nextPortfolio,
  };
};

export const sellStock = (state: GameState, stockId: string, quantity: number): GameState => {
  const stock = state.stocks.find(s => s.id === stockId);
  const portfolioItem = state.portfolio.find(item => item.stockId === stockId);
  
  if (!stock || !portfolioItem || portfolioItem.availableQuantity < quantity) return state;

  const gain = stock.currentPrice * quantity;
  const nextPortfolio = state.portfolio
    .map(item => 
      item.stockId === stockId 
        ? {
            ...item,
            quantity: item.quantity - quantity,
            availableQuantity: item.availableQuantity - quantity,
          }
        : item
    )
    .filter(item => item.quantity > 0);

  return {
    ...state,
    cash: state.cash + gain,
    portfolio: nextPortfolio,
  };
};
