export const VERSION = '1.0.0';

export type Stock = {
  id: string;
  name: string;
  code: string;
  initialPrice: number;
  currentPrice: number;
  yesterdayClose: number;
  history: number[];
  volatility: number; // 0-1
  trend: number; // -1 to 1
  sector: string[];
  totalShares: number; // 总股本
  isDelisted?: boolean;
  isBankruptcyRisk?: boolean; // 面值低于1元预警
}

export type PortfolioItem = {
  stockId: string;
  quantity: number;
  averageCost: number;
  availableQuantity: number; // T+1 规则：当天买入的不可卖出
}

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  impacts: {
    sector?: string;
    stockId?: string;
    trendChange: [number, number];
  }[];
  duration: number; // 持续回合数
  minHoldingPercentage?: number; // 最低持股比例要求 (0-100)
  minTotalAssets?: number; // 最低总资产要求
  isDiscountEvent?: boolean; // 是否是折价买入事件
}

export type ActiveEvent = {
  event: GameEvent;
  remainingTurns: number;
  discountData?: {
    stockId: string;
    availableShares: number;
    price: number;
  };
};

export type GameState = {
  playerName?: string;
  cash: number;
  stocks: Stock[];
  portfolio: PortfolioItem[];
  currentTurn: number;
  activeEvents: ActiveEvent[];
  history: {
    turn: number;
    totalValue: number;
  }[];
  turnsSinceLastEvent: number; // 距离上一次资讯出现的的回合数
  researchState: {
    activeTask?: ResearchTask;
    cooldown: number;
  };
  loan?: {
    type: 'standard' | 'high_risk';
    principal: number;
    remainingPrincipal: number;
    interestRate: number;
    overdueTurns: number; // 连续未全额还款的回合数
  };
  isGameOver: boolean;
  gameOverReason?: string;
}

export interface ResearchTask {
  sectors: string[];
  intensity: 'low' | 'medium' | 'high';
  remainingTurnsToResult: number; // 距离结果返回的回合数
  remainingTurnsOfImpact: number; // 结果生效的持续回合数
}

export interface ResearchConfig {
  label: string;
  costBase: number;
  delay: number;
  duration: number;
  cd: number;
}
