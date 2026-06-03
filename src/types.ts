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
}

export type GameState = {
  playerName?: string;
  cash: number;
  stocks: Stock[];
  portfolio: PortfolioItem[];
  currentTurn: number;
  activeEvents: { event: GameEvent; remainingTurns: number }[];
  history: {
    turn: number;
    totalValue: number;
  }[];
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
