import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  ChevronRight, Play
} from 'lucide-react';
import type { GameState } from './types';
import { 
  STOCKS, INITIAL_CASH, simulateNextTurn, buyStock, sellStock, takeLoan, repayLoan
} from './logic/engine';
import { sendToDingTalk } from './logic/dingtalk';
import './index.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedState = localStorage.getItem('bigAgame_save');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
    return {
      playerName: '',
      cash: INITIAL_CASH,
      stocks: STOCKS,
      portfolio: [],
      currentTurn: 1,
      activeEvents: [],
      history: [{ turn: 1, totalValue: INITIAL_CASH }],
      isGameOver: false,
    };
  });

  const [tempPlayerName, setTempPlayerName] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(() => {
    return localStorage.getItem('bigAgame_started') === 'true';
  });

  // 自动保存逻辑
  useEffect(() => {
    if (isGameStarted) {
      localStorage.setItem('bigAgame_save', JSON.stringify(gameState));
      localStorage.setItem('bigAgame_started', 'true');
    }
  }, [gameState, isGameStarted]);
  const [selectedStockId, setSelectedStockId] = useState<string>(STOCKS[0].id);
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio' | 'loan'>('market');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [buyLots, setBuyLots] = useState<number>(1);
  const [sellShares, setSellShares] = useState<number>(100);
  const [toast, setToast] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleBuy = () => {
    setIsBuyModalOpen(true);
    setBuyLots(1);
  };

  const handleSell = () => {
     const portfolioItem = gameState.portfolio.find(p => p.stockId === selectedStockId);
     if (!portfolioItem || portfolioItem.availableQuantity <= 0) {
       showToast('没有可用持仓');
       return;
     }
     setIsSellModalOpen(true);
     setSellShares(Math.min(100, portfolioItem.availableQuantity));
   };

   useEffect(() => {
     if (!isGameStarted || gameState.isGameOver) {
       document.body.style.overflow = 'hidden';
     } else {
       document.body.style.overflow = 'auto';
     }
     return () => {
       document.body.style.overflow = 'auto';
     };
   }, [isGameStarted, gameState.isGameOver]);

   const selectedStock = useMemo(() => {
     const stock = gameState.stocks.find(s => s.id === selectedStockId);
     return stock || gameState.stocks[0]; // 回退到第一只股票以防万一
   }, [gameState.stocks, selectedStockId]);

   const totalStockValue = useMemo(() => {
     return gameState.portfolio.reduce((sum, item) => {
       const stock = gameState.stocks.find(s => s.id === item.stockId);
       return sum + (stock ? stock.currentPrice * item.quantity : 0);
     }, 0);
   }, [gameState.portfolio, gameState.stocks]);

   const totalAssets = gameState.cash + totalStockValue;

   const handleNextTurn = () => {
     if (cooldown > 0) return;
     const nextState = simulateNextTurn(gameState);
     setGameState(nextState);
     sendToDingTalk(nextState);
     
     setCooldown(5);
     const timer = setInterval(() => {
       setCooldown(prev => {
         if (prev <= 1) {
           clearInterval(timer);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
   };

   const handleStartGame = () => {
    setGameState(prev => ({ ...prev, playerName: tempPlayerName.trim() || undefined }));
    setIsGameStarted(true);
  };

  const handleResetGame = () => {
    if (window.confirm('确定要清除所有存档重新开始吗？')) {
      setIsGameStarted(false);
      localStorage.clear();
      window.location.reload();
    }
  };

   const confirmBuy = () => {
    const quantity = buyLots * 100;
    const newState = buyStock(gameState, selectedStockId, quantity);
    if (newState.cash !== gameState.cash) {
      setGameState(newState);
      showToast(`成功买入 ${selectedStock.name} ${quantity} 股`);
      setIsBuyModalOpen(false);
    } else {
      showToast('资金不足或购买失败');
    }
  };

  const confirmSell = () => {
    const newState = sellStock(gameState, selectedStockId, sellShares);
    if (newState.cash !== gameState.cash) {
      setGameState(newState);
      showToast(`成功卖出 ${selectedStock.name} ${sellShares} 股`);
      setIsSellModalOpen(false);
    } else {
      showToast('卖出失败');
    }
  };

  const handleTakeLoan = (type: 'standard' | 'high_risk') => {
    setGameState(prev => takeLoan(prev, type));
  };

  const handleRepayLoan = (amount: number) => {
    setGameState(prev => repayLoan(prev, amount));
  };

  const chartData = useMemo(() => {
    if (!selectedStock || !selectedStock.history) return [];
    return selectedStock.history.map((price, index) => ({
      name: `T-${selectedStock.history.length - index}`,
      price,
    }));
  }, [selectedStock]);

  return (
    <div className="app">
      {isBuyModalOpen && (
        <div className="full-screen-overlay">
          <div className="overlay-content card" style={{ background: '#222', border: '1px solid #ff4d4f' }}>
            <h2 style={{ color: '#ff4d4f', margin: 0 }}>买入 {selectedStock.name}</h2>
            <p style={{ opacity: 0.8 }}>当前价格: ¥{selectedStock.currentPrice.toFixed(2)}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '1rem 0' }}>
              <button className="btn-small" style={{ padding: '10px 15px' }} onClick={() => setBuyLots(prev => Math.max(1, prev - 1))}>-1手</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{buyLots}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>手 (共 {buyLots * 100} 股)</div>
              </div>
              <button className="btn-small" style={{ padding: '10px 15px' }} onClick={() => setBuyLots(prev => prev + 1)}>+1手</button>
            </div>

            <div style={{ width: '100%', display: 'flex', gap: '10px', marginBottom: '1rem' }}>
              <button className="btn" style={{ flex: 1, background: '#444' }} onClick={() => setBuyLots(1)}>重置 (1手)</button>
              <button className="btn" style={{ flex: 1, background: '#444' }} onClick={() => {
                const maxLots = Math.floor(gameState.cash / (selectedStock.currentPrice * 100));
                setBuyLots(Math.max(1, maxLots));
              }}>全仓</button>
            </div>

            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div className="flex-between">
                <span>所需金额:</span>
                <span style={{ fontWeight: 'bold' }}>¥{(selectedStock.currentPrice * buyLots * 100).toLocaleString()}</span>
              </div>
              <div className="flex-between">
                <span>可用现金:</span>
                <span>¥{gameState.cash.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button className="btn" style={{ flex: 1, background: '#666' }} onClick={() => setIsBuyModalOpen(false)}>取消</button>
              <button 
                className="btn btn-danger" 
                style={{ flex: 2 }} 
                onClick={confirmBuy}
                disabled={gameState.cash < selectedStock.currentPrice * buyLots * 100}
              >
                确认买入
              </button>
            </div>
          </div>
        </div>
      )}

      {isSellModalOpen && (
        <div className="full-screen-overlay">
          <div className="overlay-content card" style={{ background: '#222', border: '1px solid #52c41a' }}>
            <h2 style={{ color: '#52c41a', margin: 0 }}>卖出 {selectedStock.name}</h2>
            <p style={{ opacity: 0.8 }}>当前价格: ¥{selectedStock.currentPrice.toFixed(2)}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '1rem 0' }}>
              <button className="btn-small" style={{ padding: '10px 15px' }} onClick={() => setSellShares(prev => Math.max(0, prev - 10))}>-10股</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{sellShares}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>股</div>
              </div>
              <button className="btn-small" style={{ padding: '10px 15px' }} onClick={() => {
                const available = gameState.portfolio.find(p => p.stockId === selectedStockId)?.availableQuantity || 0;
                setSellShares(prev => Math.min(available, prev + 10));
              }}>+10股</button>
            </div>

            <div style={{ width: '100%', textAlign: 'left', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <div className="flex-between">
                <span>预估收入:</span>
                <span style={{ fontWeight: 'bold', color: '#52c41a' }}>¥{(selectedStock.currentPrice * sellShares).toLocaleString()}</span>
              </div>
              <div className="flex-between">
                <span>可用持仓:</span>
                <span>{gameState.portfolio.find(p => p.stockId === selectedStockId)?.availableQuantity || 0} 股</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button className="btn" style={{ flex: 1, background: '#666' }} onClick={() => setIsSellModalOpen(false)}>取消</button>
              <button 
                className="btn btn-success" 
                style={{ flex: 2 }} 
                onClick={confirmSell}
                disabled={sellShares <= 0 || sellShares > (gameState.portfolio.find(p => p.stockId === selectedStockId)?.availableQuantity || 0)}
              >
                确认卖出
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
      {!isGameStarted && (
        <div className="full-screen-overlay">
          <div className="overlay-content">
            <h1 className="overlay-title">欢迎来到大A模拟器</h1>
            <div>
              <p style={{ marginBottom: '1rem' }}>请输入您的玩家名称以开始游戏：</p>
              <input 
                type="text" 
                value={tempPlayerName}
                onChange={(e) => setTempPlayerName(e.target.value)}
                placeholder="玩家名称"
                style={{ 
                  padding: '12px 20px', fontSize: '1.2rem', borderRadius: '8px', 
                  border: '1px solid #333', background: '#222', color: 'white',
                  width: '100%', boxSizing: 'border-box'
                }}
              />
            </div>
            <button 
              className="btn btn-start" 
              style={{ padding: '12px 30px', fontSize: '1.1rem', width: 'auto', minWidth: '200px' }}
              onClick={handleStartGame}
            >
              {tempPlayerName.trim() ? '开始游戏' : '匿名开始 (不启用钉钉)'}
            </button>
          </div>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="full-screen-overlay">
          <div className="overlay-content">
            <h1 style={{ color: '#ff4d4f', fontSize: '3rem', margin: 0 }}>游戏结束</h1>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>{gameState.gameOverReason}</p>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => {
                setGameState({
                  playerName: gameState.playerName,
                  cash: INITIAL_CASH,
                  stocks: STOCKS,
                  portfolio: [],
                  currentTurn: 1,
                  activeEvents: [],
                  history: [{ turn: 1, totalValue: INITIAL_CASH }],
                  isGameOver: false,
                });
              }}>重新开始</button>
              <button className="btn" style={{ background: '#666', color: 'white', flex: 1 }} onClick={() => {
                setIsGameStarted(false);
                setGameState({
                  playerName: '',
                  cash: INITIAL_CASH,
                  stocks: STOCKS,
                  portfolio: [],
                  currentTurn: 1,
                  activeEvents: [],
                  history: [{ turn: 1, totalValue: INITIAL_CASH }],
                  isGameOver: false,
                });
              }}>换个名字</button>
            </div>
          </div>
        </div>
      )}
      <header className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, color: '#1890ff', fontSize: '1.5rem' }}>大A模拟器</h1>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
              {gameState.playerName ? (
                <>玩家: <span style={{ color: '#fff', fontWeight: 'bold' }}>{gameState.playerName}</span> | </>
              ) : (
                <span style={{ color: '#aaa' }}>匿名模式 | </span>
              )}
              第 {gameState.currentTurn} 回合
            </p>
            <button 
              className="btn" 
              onClick={handleResetGame}
              style={{ background: 'transparent', color: '#666', fontSize: '0.7rem', padding: '2px 4px', border: '1px solid #444', marginTop: '8px' }}
            >
              重置存档
            </button>
          </div>
          <div className="header-stats" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <div className="stats-grid">
              <div style={{ textAlign: 'right' }}>
                <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>可用现金</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>¥{gameState.cash.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ opacity: 0.7, fontSize: '0.75rem' }}>总资产</div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: totalAssets >= INITIAL_CASH ? '#ff4d4f' : '#52c41a' }}>
                  ¥{totalAssets.toLocaleString()}
                </div>
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleNextTurn} 
              disabled={cooldown > 0}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', minWidth: '100px', justifyContent: 'center' }}
            >
              <Play size={14} /> {cooldown > 0 ? `${cooldown}s` : '下一回合'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-container">
        <section>
          <div className="card">
            <div className="tab-container">
              <div 
                className={`tab ${activeTab === 'market' ? 'active' : ''}`}
                onClick={() => setActiveTab('market')}
              >
                行情中心
              </div>
              <div 
                className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                我的持仓
              </div>
              <div 
                className={`tab ${activeTab === 'loan' ? 'active' : ''}`}
                onClick={() => setActiveTab('loan')}
              >
                银行贷款
              </div>
            </div>

            {activeTab === 'market' ? (
              <div className="table-container">
                <table className="stock-table desktop-only">
                  <thead>
                    <tr>
                      <th>名称/代码</th>
                      <th>现价</th>
                      <th>涨跌幅</th>
                      <th>板块</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.stocks.map(stock => {
                      const change = ((stock.currentPrice - stock.yesterdayClose) / stock.yesterdayClose) * 100;
                      return (
                        <tr 
                          key={stock.id} 
                          onClick={() => setSelectedStockId(stock.id)}
                          style={{ 
                            cursor: 'pointer', 
                            background: selectedStockId === stock.id ? '#333' : 'transparent',
                            opacity: stock.isDelisted ? 0.5 : 1
                          }}
                        >
                          <td>
                            <div style={{ fontWeight: 'bold' }}>
                              {stock.name}
                              {stock.isDelisted && <span style={{ marginLeft: '5px', fontSize: '0.7rem', background: '#666', padding: '2px 4px', borderRadius: '2px' }}>已退市</span>}
                              {stock.isBankruptcyRisk && !stock.isDelisted && <span style={{ marginLeft: '5px', fontSize: '0.7rem', background: '#ff4d4f', color: 'white', padding: '2px 4px', borderRadius: '2px' }}>退市风险</span>}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{stock.code}</div>
                          </td>
                          <td style={{ fontWeight: 'bold' }}>{stock.isDelisted ? '-' : stock.currentPrice.toFixed(2)}</td>
                          <td className={change >= 0 ? 'up' : 'down'}>
                            {stock.isDelisted ? '-' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
                          </td>
                          <td>{stock.sector.join('/')}</td>
                          <td><ChevronRight size={16} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mobile-card-list mobile-only">
                  {gameState.stocks.map(stock => {
                    const change = ((stock.currentPrice - stock.yesterdayClose) / stock.yesterdayClose) * 100;
                    return (
                      <div 
                        key={stock.id} 
                        className="mobile-stock-card"
                        onClick={() => setSelectedStockId(stock.id)}
                        style={{ 
                          border: selectedStockId === stock.id ? '1px solid #1890ff' : '1px solid transparent',
                          opacity: stock.isDelisted ? 0.5 : 1
                        }}
                      >
                        <div className="card-row">
                          <div style={{ fontWeight: 'bold' }}>
                            {stock.name} <span style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 'normal' }}>{stock.code}</span>
                          </div>
                          <div className={change >= 0 ? 'up' : 'down'} style={{ fontWeight: 'bold' }}>
                            {stock.isDelisted ? '-' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
                          </div>
                        </div>
                        <div className="card-row">
                          <div className="card-label">{stock.sector.join('/')}</div>
                          <div className="card-value">¥{stock.isDelisted ? '-' : stock.currentPrice.toFixed(2)}</div>
                        </div>
                        {(stock.isDelisted || stock.isBankruptcyRisk) && (
                          <div style={{ fontSize: '0.7rem', display: 'flex', gap: '5px' }}>
                            {stock.isDelisted && <span style={{ background: '#666', padding: '2px 4px', borderRadius: '2px' }}>已退市</span>}
                            {stock.isBankruptcyRisk && !stock.isDelisted && <span style={{ background: '#ff4d4f', color: 'white', padding: '2px 4px', borderRadius: '2px' }}>退市风险</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : activeTab === 'portfolio' ? (
              <div className="table-container">
                <table className="stock-table desktop-only">
                  <thead>
                    <tr>
                      <th>名称</th>
                      <th>持仓/可用</th>
                      <th>成本/现价</th>
                      <th>盈亏</th>
                      <th>盈亏率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.portfolio.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>暂无持仓</td></tr>
                    ) : (
                      gameState.portfolio.map(item => {
                        const stock = gameState.stocks.find(s => s.id === item.stockId)!;
                        const profit = (stock.currentPrice - item.averageCost) * item.quantity;
                        const profitRate = ((stock.currentPrice - item.averageCost) / item.averageCost) * 100;
                        return (
                          <tr 
                            key={item.stockId}
                            onClick={() => {
                              setSelectedStockId(item.stockId);
                              setActiveTab('market');
                            }}
                            style={{ cursor: 'pointer', background: selectedStockId === item.stockId ? '#333' : 'transparent' }}
                          >
                            <td>{stock.name}</td>
                            <td>{item.quantity} / {item.availableQuantity}</td>
                            <td>{item.averageCost.toFixed(2)} / {stock.currentPrice.toFixed(2)}</td>
                            <td className={profit >= 0 ? 'up' : 'down'}>
                              {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                            </td>
                            <td className={profitRate >= 0 ? 'up' : 'down'}>
                              {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                <div className="mobile-card-list mobile-only">
                  {gameState.portfolio.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>暂无持仓</div>
                  ) : (
                    gameState.portfolio.map(item => {
                      const stock = gameState.stocks.find(s => s.id === item.stockId)!;
                      const profit = (stock.currentPrice - item.averageCost) * item.quantity;
                      const profitRate = ((stock.currentPrice - item.averageCost) / item.averageCost) * 100;
                      return (
                        <div 
                          key={item.stockId} 
                          className="mobile-stock-card"
                          onClick={() => {
                            setSelectedStockId(item.stockId);
                            setActiveTab('market');
                          }}
                          style={{ 
                            border: selectedStockId === item.stockId ? '1px solid #1890ff' : '1px solid transparent'
                          }}
                        >
                          <div className="card-row">
                            <div style={{ fontWeight: 'bold' }}>{stock.name}</div>
                            <div className={profit >= 0 ? 'up' : 'down'} style={{ fontWeight: 'bold' }}>
                              {profit >= 0 ? '+' : ''}{profit.toFixed(2)} ({profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%)
                            </div>
                          </div>
                          <div className="card-row">
                            <div className="card-label">持仓/可用</div>
                            <div className="card-value">{item.quantity} / {item.availableQuantity}</div>
                          </div>
                          <div className="card-row">
                            <div className="card-label">成本/现价</div>
                            <div className="card-value">{item.averageCost.toFixed(2)} / {stock.currentPrice.toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem' }}>
                {!gameState.loan ? (
                  <div className="loan-grid">
                    <div className="card" style={{ border: '1px solid #333' }}>
                      <h4>信用贷款 (标准)</h4>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>额度：当前现金的 150%</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>利率：1% / 每回合</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>特点：利息低，适合短期周转</p>
                      <button 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={() => handleTakeLoan('standard')}
                      >
                        申请贷款 (约 ¥{(gameState.cash * 1.5).toLocaleString()})
                      </button>
                    </div>
                    <div className="card" style={{ border: '1px solid #ff4d4f' }}>
                      <h4>高利贷 (高风险)</h4>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>额度：保底 ¥100,000 或现金 300%</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>利率：5% / 每回合</p>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>特点：利息极高，受本金波动影响巨大</p>
                      <button 
                        className="btn btn-danger" 
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={() => handleTakeLoan('high_risk')}
                      >
                        申请贷款 (约 ¥{Math.max(100000, gameState.cash * 3).toLocaleString()})
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ border: `2px solid ${gameState.loan.type === 'high_risk' ? '#ff4d4f' : '#1890ff'}` }}>
                    <div className="flex-between">
                      <h3>当前贷款：{gameState.loan.type === 'high_risk' ? '高风险高利贷' : '标准信用贷'}</h3>
                      <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                        {gameState.loan.overdueTurns > 0 ? `逾期中！已连续 ${gameState.loan.overdueTurns} 回合未足额还款` : '正常还款中'}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '1rem 0' }}>
                      <div>
                        <p>初始本金：¥{gameState.loan.principal.toLocaleString()}</p>
                        <p>剩余欠款：¥{gameState.loan.remainingPrincipal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p>回合利率：{(gameState.loan.interestRate * 100).toFixed(0)}%</p>
                        <p>预估下回合扣款：¥{(gameState.loan.remainingPrincipal * gameState.loan.interestRate + gameState.loan.principal * 0.05).toLocaleString()}</p>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid #333', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>* 贷款每回合会自动扣除 (利息 + 5% 本金)。如果现金不足，将计入逾期。</p>
                      <p style={{ fontSize: '0.9rem', color: '#ff4d4f' }}>* 连续 3 回合逾期，银行将强制清盘，游戏结束。</p>
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-success" onClick={() => handleRepayLoan(10000)}>还款 ¥10,000</button>
                        <button className="btn btn-success" onClick={() => handleRepayLoan(50000)}>还款 ¥50,000</button>
                        <button className="btn btn-primary" onClick={() => handleRepayLoan(gameState.loan?.remainingPrincipal || 0)}>全额还清</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card">
            <h3 className="panel-title">个股详情: {selectedStock.name}</h3>
            <div style={{ height: '200px', marginBottom: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                    contentStyle={{ background: '#222', border: 'none' }}
                    itemStyle={{ color: '#1890ff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#1890ff" 
                    strokeWidth={2} 
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1rem' }}>
              <button 
                className="btn btn-danger" 
                onClick={handleBuy}
                disabled={selectedStock.isDelisted}
              >
                {selectedStock.isDelisted ? '禁止买入' : '买入'}
              </button>
              <button 
                className="btn btn-success" 
                onClick={handleSell}
                disabled={selectedStock.isDelisted || !(gameState.portfolio.find(p => p.stockId === selectedStockId)?.availableQuantity! > 0)}
              >
                {selectedStock.isDelisted ? '禁止卖出' : '卖出'}
              </button>
            </div>
            {selectedStock.isDelisted && (
              <p style={{ color: '#ff4d4f', fontSize: '0.8rem', marginTop: '10px', fontWeight: 'bold' }}>
                该股票已退市，价值归零且无法交易。
              </p>
            )}
            <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '10px' }}>
              * A股实行 T+1 交易制度，当日买入需次日方可卖出。
            </p>
          </div>

          <div className="card">
            <h3 className="panel-title">实时资讯</h3>
            {gameState.activeEvents.length === 0 ? (
              <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>暂无重大市场资讯</p>
            ) : (
              gameState.activeEvents.map(ae => (
                <div key={ae.event.id} className="event-card">
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{ae.event.title}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{ae.event.description}</div>
                  <div style={{ fontSize: '0.75rem', color: '#faad14', marginTop: '4px' }}>
                    影响中... 剩余 {ae.remainingTurns} 回合
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
