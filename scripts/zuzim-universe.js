// ZUZIM Universe - Главный координатор
// Объединяет кошелек, DEX, графики, аналитику

class ZUZIMUniverse {
    constructor() {
        this.modules = {};
        this.config = {
            network: 'sepolia',
            api: {
                base: 'https://api.zuzim.com',
                ws: 'wss://ws.zuzim.com'
            },
            contracts: {
                zuz: '0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31',
                dex: null, // Будет после деплоя
                staking: null
            }
        };
        
        console.log('🌌 ZUZIM Universe created');
    }
    
    // Инициализация всех модулей
    async init() {
        console.log('🚀 Starting ZUZIM Universe initialization...');
        
        try {
            // 1. Загружаем конфигурацию
            await this.loadConfig();
            
            // 2. Инициализируем кошелек
            await this.initWallet();
            
            // 3. Инициализируем DEX
            await this.initDEX();
            
            // 4. Инициализируем графики
            await this.initCharts();
            
            // 5. Инициализируем аналитику
            await this.initAnalytics();
            
            // 6. Запускаем обновления
            this.startUpdates();
            
            console.log('✅ ZUZIM Universe initialized successfully!');
            this.showStatus('✅ System ready');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showStatus('❌ Error: ' + error.message, 'error');
        }
    }
    
    async loadConfig() {
        // Пробуем загрузить конфиг из deployment.json
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            
            if (config.contractAddress && config.contractAddress !== '0x0000000000000000000000000000000000000000') {
                this.config.contracts.dex = config.contractAddress;
                console.log('📋 Loaded DEX contract:', config.contractAddress);
            }
        } catch (error) {
            console.log('Using default config');
        }
    }
    
    async initWallet() {
        console.log('💰 Initializing wallet...');
        
        // Проверяем, есть ли уже кошелек
        if (window.zuzWallet) {
            this.modules.wallet = window.zuzWallet;
            console.log('✅ Wallet already loaded');
        } else {
            // Создаем простой кошелек
            this.modules.wallet = {
                account: null,
                connect: async () => {
                    alert('Wallet module loading...');
                    return null;
                },
                disconnect: () => {
                    this.modules.wallet.account = null;
                }
            };
        }
        
        // Показываем статус кошелька
        this.updateWalletStatus();
    }
    
    async initDEX() {
        console.log('🔄 Initializing DEX...');
        
        this.modules.dex = {
            pools: [],
            prices: {},
            volume24h: 0,
            
            // Методы DEX
            getPools: async () => {
                return [
                    {
                        pair: 'ZUZ/ETH',
                        tvl: '125,450',
                        volume24h: '45,230',
                        apr: '18.5%',
                        fee: '0.3%'
                    },
                    {
                        pair: 'ZUZ/USDT',
                        tvl: '89,230',
                        volume24h: '32,150',
                        apr: '15.2%',
                        fee: '0.3%'
                    },
                    {
                        pair: 'ETH/USDT',
                        tvl: '450,890',
                        volume24h: '1,230,450',
                        apr: '8.7%',
                        fee: '0.3%'
                    }
                ];
            },
            
            addLiquidity: async (pool, amountA, amountB) => {
                this.showTransaction('Adding liquidity...');
                // Симуляция транзакции
                return new Promise(resolve => {
                    setTimeout(() => {
                        const txHash = '0x' + Math.random().toString(16).slice(2, 42);
                        this.showTransaction(`✅ Liquidity added! TX: ${txHash.slice(0, 10)}...`, 'success');
                        resolve(txHash);
                    }, 2000);
                });
            },
            
            swap: async (fromToken, toToken, amount, minOut) => {
                this.showTransaction('Swapping tokens...');
                return new Promise(resolve => {
                    setTimeout(() => {
                        const txHash = '0x' + Math.random().toString(16).slice(2, 42);
                        this.showTransaction(`✅ Swap completed! TX: ${txHash.slice(0, 10)}...`, 'success');
                        resolve(txHash);
                    }, 2000);
                });
            }
        };
        
        // Загружаем данные пулов
        const pools = await this.modules.dex.getPools();
        this.updatePoolsUI(pools);
        
        console.log('✅ DEX initialized');
    }
    
    async initCharts() {
        console.log('📈 Initializing charts...');
        
        if (window.tradingEngine) {
            this.modules.charts = window.tradingEngine;
            console.log('✅ Charts engine loaded');
        } else {
            console.log('⚠️ Charts engine not available');
        }
    }
    
    async initAnalytics() {
        console.log('📊 Initializing analytics...');
        
        this.modules.analytics = {
            updateStats: () => {
                // Обновляем статистику на странице
                const stats = {
                    totalTvl: '$665,780',
                    totalVolume: '$1,307,830',
                    totalTraders: '1,234',
                    activePools: '3'
                };
                
                this.updateStatsUI(stats);
            },
            
            getPoolAnalytics: async (poolId) => {
                return {
                    tvlHistory: [100, 150, 120, 180, 200, 250, 220],
                    volumeHistory: [50, 80, 60, 90, 100, 120, 110],
                    fees24h: '1,245',
                    apr30d: '16.8%'
                };
            }
        };
        
        // Первое обновление
        this.modules.analytics.updateStats();
        console.log('✅ Analytics initialized');
    }
    
    // UI методы
    updateWalletStatus() {
        const statusElement = document.getElementById('wallet-status');
        if (!statusElement) return;
        
        if (this.modules.wallet.account) {
            const shortAddr = `${this.modules.wallet.account.slice(0,6)}...${this.modules.wallet.account.slice(-4)}`;
            statusElement.innerHTML = `
                <span class="connected">✅ Connected: ${shortAddr}</span>
                <button class="btn-small" onclick="window.zuzim.disconnectWallet()">Disconnect</button>
            `;
            statusElement.className = 'wallet-status connected';
        } else {
            statusElement.innerHTML = `
                <span class="disconnected">🔌 Not connected</span>
                <button class="btn-small" onclick="window.zuzim.connectWallet()">Connect Wallet</button>
            `;
            statusElement.className = 'wallet-status disconnected';
        }
    }
    
    updatePoolsUI(pools) {
        const container = document.getElementById('pools-list');
        if (!container) return;
        
        container.innerHTML = pools.map(pool => `
            <div class="pool-card">
                <div class="pool-header">
                    <h3>${pool.pair}</h3>
                    <span class="pool-fee">${pool.fee} fee</span>
                </div>
                <div class="pool-stats">
                    <div class="stat">
                        <span class="label">TVL</span>
                        <span class="value">$${pool.tvl}</span>
                    </div>
                    <div class="stat">
                        <span class="label">24h Volume</span>
                        <span class="value">$${pool.volume24h}</span>
                    </div>
                    <div class="stat">
                        <span class="label">APR</span>
                        <span class="value">${pool.apr}</span>
                    </div>
                </div>
                <div class="pool-actions">
                    <button class="btn" onclick="window.zuzim.trade('${pool.pair}')">Trade</button>
                    <button class="btn" onclick="window.zuzim.addLiquidity('${pool.pair}')">Add Liquidity</button>
                </div>
            </div>
        `).join('');
    }
    
    updateStatsUI(stats) {
        // Обновляем элементы статистики
        const elements = {
            'total-tvl': stats.totalTvl,
            'total-volume': stats.totalVolume,
            'total-traders': stats.totalTraders,
            'active-pools': stats.activePools
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    showTransaction(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `transaction-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '⏳'}</span>
                <span class="notification-text">${message}</span>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Авто-удаление через 5 секунд
        if (type === 'success') {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
    }
    
    showStatus(message, type = 'info') {
        const statusElement = document.getElementById('system-status');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = `system-status ${type}`;
        
        if (type === 'error') {
            setTimeout(() => {
                statusElement.textContent = 'System ready';
                statusElement.className = 'system-status info';
            }, 5000);
        }
    }
    
    // Методы для UI
    async connectWallet() {
        if (!window.zuzWallet) {
            alert('Wallet module not loaded. Refresh page.');
            return;
        }
        
        const account = await window.zuzWallet.connectWallet('metamask');
        if (account) {
            this.modules.wallet.account = account;
            this.updateWalletStatus();
            this.showStatus('✅ Wallet connected');
        }
    }
    
    disconnectWallet() {
        if (window.zuzWallet) {
            window.zuzWallet.disconnect();
        }
        this.modules.wallet.account = null;
        this.updateWalletStatus();
        this.showStatus('🔌 Wallet disconnected');
    }
    
    trade(pair) {
        alert(`Opening trade interface for ${pair}...`);
        // Здесь будет переход к торговле
    }
    
    addLiquidity(pool) {
        const amount = prompt(`How much liquidity to add to ${pool}? (in ETH)`);
        if (amount && !isNaN(amount)) {
            this.modules.dex.addLiquidity(pool, amount, amount * 1000); // Пример
        }
    }
    
    // Фоновые обновления
    startUpdates() {
        // Обновляем статистику каждые 30 секунд
        setInterval(() => {
            if (this.modules.analytics) {
                this.modules.analytics.updateStats();
            }
        }, 30000);
        
        // Обновляем цены каждые 10 секунд
        setInterval(() => {
            this.updatePrices();
        }, 10000);
        
        console.log('🔄 Background updates started');
    }
    
    updatePrices() {
        // Симуляция обновления цен
        const priceChanges = {
            'ZUZ/ETH': 0.000345 + (Math.random() - 0.5) * 0.00001,
            'ZUZ/USDT': 0.0567 + (Math.random() - 0.5) * 0.0001,
            'ETH/USDT': 3250 + (Math.random() - 0.5) * 10
        };
        
        // Обновляем UI если есть элементы
        Object.entries(priceChanges).forEach(([pair, price]) => {
            const element = document.querySelector(`[data-pair="${pair}"] .price`);
            if (element) {
                const oldPrice = parseFloat(element.textContent.replace('$', ''));
                const change = price - oldPrice;
                const changePercent = (change / oldPrice * 100).toFixed(2);
                
                element.textContent = `$${price.toFixed(6)}`;
                
                // Обновляем процент изменения
                const changeElement = element.parentElement.querySelector('.change');
                if (changeElement) {
                    changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent}%`;
                    changeElement.className = `change ${changePercent >= 0 ? 'positive' : 'negative'}`;
                }
            }
        });
    }
    
    // Публичные методы для использования из консоли
    getStats() {
        return {
            wallet: this.modules.wallet.account ? 'Connected' : 'Disconnected',
            pools: this.modules.dex?.pools?.length || 0,
            tvl: '$665,780',
            version: '1.0.0'
        };
    }
    
    help() {
        console.log(`
ZUZIM Universe Commands:
------------------------
window.zuzim.connectWallet()      - Connect wallet
window.zuzim.disconnectWallet()   - Disconnect wallet
window.zuzim.trade(pair)          - Open trade for pair
window.zuzim.addLiquidity(pool)   - Add liquidity to pool
window.zuzim.getStats()           - Get system stats
window.zuzim.help()               - Show this help
        `);
    }
}

// Создаем и экспортируем глобальный экземпляр
window.zuzim = new ZUZIMUniverse();

// Авто-инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.zuzim.init(), 1000);
    });
} else {
    setTimeout(() => window.zuzim.init(), 1000);
}

console.log('🌌 ZUZIM Universe loaded - type "window.zuzim.help()" for commands');
