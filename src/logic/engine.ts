import type { Stock, GameEvent, GameState, PortfolioItem } from '../types';

export const INITIAL_CASH = 100000;

export const STOCKS: Stock[] = [
  { id: '1', name: '贵州茅台', code: '600519', initialPrice: 1700, currentPrice: 1700, yesterdayClose: 1700, history: [1700], volatility: 0.02, trend: 0.05, sector: ['消费', '白酒'], totalShares: 1000000 },
  { id: '2', name: '宁德时代', code: '300750', initialPrice: 160, currentPrice: 160, yesterdayClose: 160, history: [160], volatility: 0.05, trend: 0.1, sector: ['新能源', '锂电池'], totalShares: 2000000 },
  { id: '3', name: '招商银行', code: '600036', initialPrice: 32, currentPrice: 32, yesterdayClose: 32, history: [32], volatility: 0.015, trend: 0.02, sector: ['金融', '银行'], totalShares: 5000000 },
  { id: '4', name: '中国平安', code: '601318', initialPrice: 45, currentPrice: 45, yesterdayClose: 45, history: [45], volatility: 0.02, trend: -0.01, sector: ['金融', '保险'], totalShares: 4000000 },
  { id: '5', name: '隆基绿能', code: '601012', initialPrice: 18, currentPrice: 18, yesterdayClose: 18, history: [18], volatility: 0.06, trend: -0.05, sector: ['新能源', '光伏'], totalShares: 3000000 },
  { id: '6', name: '比亚迪', code: '002594', initialPrice: 210, currentPrice: 210, yesterdayClose: 210, history: [210], volatility: 0.04, trend: 0.08, sector: ['汽车', '新能源'], totalShares: 1500000 },
  { id: '7', name: '腾讯控股', code: '00700', initialPrice: 380, currentPrice: 380, yesterdayClose: 380, history: [380], volatility: 0.03, trend: 0.04, sector: ['互联网', '游戏'], totalShares: 8000000 },
  { id: '8', name: '中芯国际', code: '688981', initialPrice: 45, currentPrice: 45, yesterdayClose: 45, history: [45], volatility: 0.07, trend: 0.12, sector: ['半导体', '芯片'], totalShares: 6000000 },
  { id: '9', name: '伊利股份', code: '600887', initialPrice: 28, currentPrice: 28, yesterdayClose: 28, history: [28], volatility: 0.02, trend: 0.01, sector: ['消费', '乳制品'], totalShares: 2500000 },
  { id: '10', name: '万科A', code: '000002', initialPrice: 7, currentPrice: 7, yesterdayClose: 7, history: [7], volatility: 0.08, trend: -0.1, sector: ['房地产'], totalShares: 10000000 },
  { id: '11', name: '迈瑞医疗', code: '300760', initialPrice: 280, currentPrice: 280, yesterdayClose: 280, history: [280], volatility: 0.03, trend: 0.05, sector: ['医疗', '器械'], totalShares: 800000 },
  { id: '12', name: '北方华创', code: '002371', initialPrice: 300, currentPrice: 300, yesterdayClose: 300, history: [300], volatility: 0.06, trend: 0.15, sector: ['半导体', '设备'], totalShares: 500000 },
  { id: '13', name: '东方财富', code: '300059', initialPrice: 15, currentPrice: 15, yesterdayClose: 15, history: [15], volatility: 0.05, trend: 0.06, sector: ['金融', '互联网'], totalShares: 12000000 },
  { id: '14', name: '通威股份', code: '600438', initialPrice: 22, currentPrice: 22, yesterdayClose: 22, history: [22], volatility: 0.07, trend: -0.04, sector: ['新能源', '光伏'], totalShares: 4500000 },
  { id: '15', name: '科大讯飞', code: '002230', initialPrice: 42, currentPrice: 42, yesterdayClose: 42, history: [42], volatility: 0.06, trend: 0.08, sector: ['互联网', '人工智能'], totalShares: 2200000 },
  { id: '16', name: '爱尔眼科', code: '300015', initialPrice: 12, currentPrice: 12, yesterdayClose: 12, history: [12], volatility: 0.04, trend: -0.02, sector: ['医疗', '服务'], totalShares: 9000000 },
  { id: '17', name: '中信证券', code: '600030', initialPrice: 20, currentPrice: 20, yesterdayClose: 20, history: [20], volatility: 0.03, trend: 0.03, sector: ['金融', '证券'], totalShares: 15000000 },
  { id: '18', name: '紫金矿业', code: '601899', initialPrice: 16, currentPrice: 16, yesterdayClose: 16, history: [16], volatility: 0.04, trend: 0.07, sector: ['资源', '有色'], totalShares: 20000000 },
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
      { stockId: 'RANDOM', trendChange: [-0.6, -0.4] },
    ],
    duration: 10,
    minHoldingPercentage: 50, // 控股股东才能提前获知核心财务风险
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
  {
    id: 'e9',
    title: '重组传闻',
    description: '市场传闻某上市公司正在洽谈资产重组，或有重大利好。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.3, 0.5] },
    ],
    duration: 6,
    minHoldingPercentage: 5, // 举牌线，开始接触核心变动
  },
  {
    id: 'e10',
    title: '股权激励计划',
    description: '某上市公司拟推行大规模股权激励计划，管理层利益深度绑定。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.1, 0.2] },
    ],
    duration: 4,
    minHoldingPercentage: 10, // 重要股东参与决策
  },
  {
    id: 'e11',
    title: '管理层内斗',
    description: '某上市公司爆发激烈的股权之争，管理层震荡。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [-0.3, -0.15] },
    ],
    duration: 5,
    minHoldingPercentage: 34, // 拥有否决权时才能感知深层内斗
  },
  {
    id: 'e12',
    title: '大股东减持',
    description: '某上市公司重要股东披露减持计划。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [-0.15, -0.05] },
    ],
    duration: 7,
    minHoldingPercentage: 5,
  },
  {
    id: 'e13',
    title: '全球市场大涨',
    description: '隔夜美股创历史新高，带动全球风险偏好回升。',
    impacts: [
      { sector: '互联网', trendChange: [0.05, 0.1] },
      { sector: '半导体', trendChange: [0.05, 0.1] },
    ],
    duration: 2,
  },
  {
    id: 'e14',
    title: '央行意外降准',
    description: '央行宣布下调存款准备金率，释放长期流动性。',
    impacts: [
      { sector: '金融', trendChange: [0.05, 0.12] },
      { sector: '房地产', trendChange: [0.04, 0.1] },
    ],
    duration: 3,
  },
  {
    id: 'e15',
    title: '大宗商品暴涨',
    description: '国际地缘政治冲突升级，原油及有色金属价格大幅飙升。',
    impacts: [
      { sector: '资源', trendChange: [0.1, 0.25] },
      { sector: '新能源', trendChange: [-0.05, -0.02] },
    ],
    duration: 4,
  },
  {
    id: 'e16',
    title: '定向增发方案',
    description: '某上市公司拟向特定对象增发股票募集资金，用于核心业务扩张。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.1, 0.25] },
    ],
    duration: 5,
    minHoldingPercentage: 5,
  },
  {
    id: 'e17',
    title: '重大资产处置',
    description: '某上市公司拟剥离非核心亏损资产，聚焦主业。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.15, 0.3] },
    ],
    duration: 4,
    minHoldingPercentage: 34, // 关键决策点
  },
  {
    id: 'e18',
    title: '私有化要约',
    description: '某上市公司获得绝对控股股东发起的私有化要约，溢价空间巨大。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.4, 0.8] },
    ],
    duration: 3,
    minHoldingPercentage: 67, // 绝对控制权下的终极利好
  },
  {
    id: 'e19',
    title: '更换核心管理层',
    description: '某上市公司聘请业内知名CEO，预期开启经营转型。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.1, 0.3] },
    ],
    duration: 5,
    minHoldingPercentage: 50,
  },
  {
    id: 'e20',
    title: '大宗交易机会',
    description: '由于您资金实力雄厚，有机构投资者联系您，愿以低于市价9折的价格大宗转让某公司股票。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.05, 0.15] },
    ],
    duration: 3,
    minTotalAssets: 1000000, // 资产达到100万解锁
    isDiscountEvent: true,
  },
  {
    id: 'e22',
    title: '资本大鳄动向',
    description: '您在高端酒会上获悉，某资本大鳄正计划联手坐庄某只绩优股。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.5, 1.2] },
    ],
    duration: 4,
    minTotalAssets: 20000000, // 资产达到2000万解锁
  },
  {
    id: 'e23',
    title: '散户筹码派发',
    description: '市场散户恐慌抛售，您作为资深藏家可以趁机低价吸纳某优质资产。',
    impacts: [
      { stockId: 'RANDOM', trendChange: [0.2, 0.4] },
    ],
    duration: 6,
    minTotalAssets: 500000, // 资产达到50万解锁
    isDiscountEvent: true,
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

  // 处理主动调研逻辑
  let researchCD = Math.max(0, state.researchState.cooldown - 1);
  let currentResearch = state.researchState.activeTask;

  if (currentResearch) {
    if (currentResearch.remainingTurnsToResult > 0) {
      currentResearch.remainingTurnsToResult -= 1;
      // 结果刚刚返回
      if (currentResearch.remainingTurnsToResult === 0) {
        const impactValue = currentResearch.intensity === 'high' ? [0.15, 0.3] : (currentResearch.intensity === 'medium' ? [0.1, 0.2] : [0.05, 0.1]);
        const researchEvent = {
          id: `research_${Date.now()}`,
          title: `【调研报告】${currentResearch.sectors.join('/')}板块分析`,
          description: `深度调研显示，${currentResearch.sectors.join('/')}板块基本面发生重大边际改善，机构资金正加速流入。`,
          impacts: currentResearch.sectors.map(s => ({ sector: s, trendChange: impactValue as [number, number] })),
          duration: currentResearch.remainingTurnsOfImpact
        };
        nextActiveEvents.push({ event: researchEvent, remainingTurns: researchEvent.duration });
      }
    } else if (currentResearch.remainingTurnsOfImpact > 0) {
      currentResearch.remainingTurnsOfImpact -= 1;
    }

    // 调研任务彻底结束
    if (currentResearch.remainingTurnsToResult === 0 && currentResearch.remainingTurnsOfImpact === 0) {
      currentResearch = undefined;
    }
  }

  // 2. 随机触发新事件
  let turnsSinceLastEvent = state.turnsSinceLastEvent + 1;
  const shouldForceEvent = turnsSinceLastEvent >= 5;
  const randomTrigger = Math.random() < 0.4; // 基础频率提高到 40%

  if ((shouldForceEvent || randomTrigger) && nextActiveEvents.length < 5) {
    const rawEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    if (!nextActiveEvents.find(ae => ae.event.id === rawEvent.id)) {
      // 克隆事件以支持动态修改
      const event = JSON.parse(JSON.stringify(rawEvent)) as GameEvent;
      
      // 处理随机股票占位符
      let targetStockName = '';
      event.impacts.forEach(impact => {
        if (impact.stockId === 'RANDOM') {
          const randomStock = state.stocks[Math.floor(Math.random() * state.stocks.length)];
          impact.stockId = randomStock.id;
          targetStockName = randomStock.name;
        }
      });

      // 如果有目标股票，更新描述中的“某上市公司”
      let discountData;
      if (event.isDiscountEvent && targetStockName) {
        const stock = state.stocks.find(s => s.name === targetStockName)!;
        // 大宗交易份额为总股本的 1-3%
        const availableShares = Math.floor(stock.totalShares * (0.01 + Math.random() * 0.02) / 100) * 100;
        // 价格为现价的 85-95 折
        const discountRate = 0.85 + Math.random() * 0.1;
        discountData = {
          stockId: stock.id,
          availableShares,
          price: Number((stock.currentPrice * discountRate).toFixed(2))
        };
        event.description += ` 此次释放份额约为 ${availableShares.toLocaleString()} 股，转让单价为 ¥${discountData.price}。`;
      }

      if (targetStockName) {
        event.description = event.description.replace('某上市公司', `【${targetStockName}】`);
      }

      nextActiveEvents.push({ event, remainingTurns: event.duration, discountData });
      turnsSinceLastEvent = 0; // 重置计数器
    }
  }

  // 3. 模拟股价变动
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
    turnsSinceLastEvent,
    researchState: {
      activeTask: currentResearch,
      cooldown: researchCD
    },
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
