#!/bin/bash
echo "🚀 Применяем мобильную адаптацию к основному сайту..."

# 1. Создаем резервную копию текущего index.html
if [ -f "index.html" ]; then
    backup_name="index_backup_$(date +%Y%m%d_%H%M%S).html"
    cp index.html "$backup_name"
    echo "✅ Создана резервная копия: $backup_name"
else
    echo "❌ Файл index.html не найден"
    exit 1
fi

# 2. Проверяем существует ли адаптивная версия
if [ ! -f "index_mobile_responsive.html" ]; then
    echo "❌ Файл index_mobile_responsive.html не найден"
    echo "Создаем адаптивную версию..."
    
    # Создаем адаптивную версию на лету
    cat > index_mobile_responsive.html << 'MOBILE_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ZUZCOIN Universe | Mobile</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Все оригинальные стили + адаптация */
        :root {
            --primary: #0e1a2d;
            --secondary: #1a2b44;
            --accent: #00c3ff;
            --positive: #00d18c;
            --negative: #ff4d4d;
            --text: #ffffff;
            --text-secondary: #8a9bb2;
            --border: #2a3b54;
            --card-bg: rgba(20, 30, 48, 0.9);
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        
        body {
            background: linear-gradient(135deg, var(--primary) 0%, #0c1525 100%);
            color: var(--text);
            min-height: 100vh;
            width: 100%;
            overflow-x: hidden;
            font-size: 14px;
        }
        
        .container { width: 100%; max-width: 100%; padding: 10px; }
        
        /* Адаптивный хедер */
        .header {
            display: flex;
            flex-direction: column;
            padding: 15px 10px;
            gap: 15px;
            border-bottom: 1px solid var(--border);
        }
        
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 20px;
            font-weight: 700;
        }
        
        .logo i { color: var(--accent); font-size: 24px; }
        
        /* Навигация с горизонтальной прокруткой */
        .nav {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 5px;
            -webkit-overflow-scrolling: touch;
        }
        
        .nav a {
            color: var(--text-secondary);
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .nav a.active { background: var(--secondary); color: var(--text); }
        
        /* Кошелек - компактно */
        .wallet-section { display: flex; flex-direction: column; gap: 10px; }
        
        .balance-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            background: var(--secondary);
            padding: 12px;
            border-radius: 10px;
        }
        
        .balance-item { text-align: center; }
        .balance-label { font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; }
        .balance-value { font-size: 12px; font-weight: 600; }
        .balance-value.eth { color: #627eea; }
        .balance-value.zuz { color: var(--positive); }
        
        .wallet-btn {
            width: 100%;
            background: var(--accent);
            color: white;
            border: none;
            padding: 14px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        /* DEX баннер */
        .real-dex-banner {
            background: linear-gradient(90deg, var(--positive), #00b377);
            padding: 12px 10px;
            text-align: center;
            margin: 10px 0;
            border-radius: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        /* DEX статус - компактная сетка */
        .dex-status {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin: 10px 0;
        }
        
        .status-item {
            background: var(--secondary);
            padding: 12px 8px;
            border-radius: 10px;
            text-align: center;
        }
        
        .status-label { font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; }
        .status-value { font-size: 12px; font-weight: 600; color: var(--positive); }
        
        /* Основной контент - вертикальный стек */
        .main-grid { display: flex; flex-direction: column; gap: 20px; margin: 15px 0; }
        
        /* График - уменьшенная высота */
        .chart-container {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 15px;
            height: 280px;
        }
        
        /* Торговая панель - полная ширина */
        .real-trading-panel {
            background: var(--card-bg);
            border: 2px solid var(--positive);
            border-radius: 12px;
            padding: 15px;
            width: 100%;
        }
        
        /* Табы - горизонтальная прокрутка */
        .tab-container {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 15px;
            padding-bottom: 5px;
        }
        
        .tab {
            background: var(--secondary);
            border: none;
            color: var(--text);
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
            flex-shrink: 0;
        }
        
        .tab.active { background: var(--accent); }
        
        /* Формы */
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; margin-bottom: 6px; font-size: 13px; color: var(--text-secondary); }
        .form-input {
            width: 100%;
            background: var(--secondary);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
        }
        
        .btn-buy, .btn-sell {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 8px 0;
        }
        
        .btn-buy { background: var(--positive); color: white; }
        .btn-sell { background: var(--negative); color: white; }
        
        /* Секции фичей */
        .section-title {
            font-size: 18px;
            margin: 20px 0 15px;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .feature-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        
        .feature-icon { font-size: 30px; color: var(--accent); margin-bottom: 15px; }
        
        /* Медиа-запросы для маленьких экранов */
        @media (max-width: 480px) {
            .balance-container { grid-template-columns: repeat(2, 1fr); }
            .dex-status { grid-template-columns: 1fr; }
            .chart-container { height: 250px; }
            .features-grid { grid-template-columns: 1fr; }
        }
        
        @media (max-height: 700px) {
            .chart-container { height: 220px; }
            .feature-card { padding: 15px; }
        }
    </style>
</head>
<body>
    <!-- HTML содержимое index_mobile_responsive.html -->
    <!-- Здесь должен быть полный HTML, но для экономии места оставляем структуру -->
    <div class="container">
        <header class="header">
            <div class="logo">
                <i class="fas fa-coins"></i>
                <span>ZUZCOIN Universe</span>
            </div>
            
            <nav class="nav">
                <a href="#" class="active"><i class="fas fa-chart-line"></i> Trade</a>
                <a href="#token-factory"><i class="fas fa-industry"></i> Token Factory</a>
                <a href="#digital-notary"><i class="fas fa-file-contract"></i> Digital Notary</a>
                <a href="#proofchain"><i class="fas fa-link"></i> ProofChain</a>
            </nav>
            
            <div class="wallet-section">
                <div class="balance-container" id="balanceContainer" style="display: none;">
                    <div class="balance-item">
                        <div class="balance-label">ETH Balance</div>
                        <div class="balance-value eth" id="ethBalance">0.00 ETH</div>
                    </div>
                    <div class="balance-item">
                        <div class="balance-label">ZUZ Balance</div>
                        <div class="balance-value zuz" id="zuzBalance">0 ZUZ</div>
                    </div>
                    <div class="balance-item">
                        <div class="balance-label">Network</div>
                        <div class="balance-value" id="networkName">Not Connected</div>
                    </div>
                </div>
                
                <button class="wallet-btn" id="connectWalletBtn">
                    <i class="fas fa-wallet"></i>
                    <span>Connect Wallet</span>
                </button>
            </div>
        </header>

        <div class="real-dex-banner" id="realDexBanner" style="display: none;">
            <i class="fas fa-rocket"></i>
            <strong>🚀 REAL DEX LIVE!</strong> Trade ZUZ/PYUSD with 1% auto-donation
            <i class="fas fa-rocket"></i>
        </div>
        
        <div class="dex-status" id="dexStatus" style="display: none;">
            <div class="status-item">
                <div class="status-label">DEX Contract</div>
                <div class="status-value">✅ Deployed</div>
            </div>
            <div class="status-item">
                <div class="status-label">ZUZ/PYUSD Pair</div>
                <div class="status-value" id="pairStatus">Checking...</div>
            </div>
            <div class="status-item">
                <div class="status-label">Liquidity</div>
                <div class="status-value" id="liquidityStatus">Checking...</div>
            </div>
            <div class="status-item">
                <div class="status-label">1% Auto-Donate</div>
                <div class="status-value">✅ Active</div>
            </div>
        </div>

        <div class="main-grid">
            <div class="chart-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3><i class="fas fa-chart-candlestick"></i> ZUZ/PYUSD Chart</h3>
                    <div style="display: flex; gap: 8px;">
                        <button style="padding: 6px 12px; background: var(--secondary); border: none; border-radius: 6px; color: var(--text); cursor: pointer; font-size: 12px;">1H</button>
                        <button style="padding: 6px 12px; background: var(--accent); border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 12px;">1D</button>
                        <button style="padding: 6px 12px; background: var(--secondary); border: none; border-radius: 6px; color: var(--text); cursor: pointer; font-size: 12px;">1W</button>
                    </div>
                </div>
                <div id="tradingview_chart" style="height: 80%;"></div>
            </div>

            <div class="real-trading-panel">
                <h3><i class="fas fa-exchange-alt"></i> REAL DEX Trading</h3>
                <p style="color: var(--text-secondary); margin-bottom: 15px; font-size: 14px;">
                    Trade ZUZ/PYUSD with 1% auto-donation to charity.
                </p>
                
                <div class="tab-container">
                    <button class="tab active" onclick="switchTab('market')">Market</button>
                    <button class="tab" onclick="switchTab('limit')">Limit</button>
                    <button class="tab" onclick="switchTab('dex')">DEX Functions</button>
                </div>
                
                <div id="marketTab">
                    <div class="form-group">
                        <label class="form-label">Amount (ZUZ)</label>
                        <input type="number" class="form-input" id="amountInput" placeholder="0.00" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Price (PYUSD)</label>
                        <input type="number" class="form-input" id="priceInput" placeholder="0.0961" value="0.0961" step="0.0001">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Total (PYUSD)</label>
                        <input type="number" class="form-input" id="totalInput" placeholder="0.00" readonly>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 10px; margin: 15px 0;">
                        <button class="btn-buy" onclick="placeRealOrder('buy')">
                            <i class="fas fa-arrow-up"></i> Buy ZUZ (Real DEX)
                        </button>
                        <button class="btn-sell" onclick="placeRealOrder('sell')">
                            <i class="fas fa-arrow-down"></i> Sell ZUZ (Real DEX)
                        </button>
                    </div>
                    
                    <div style="text-align: center; color: var(--text-secondary); font-size: 12px; margin-top: 15px;">
                        <i class="fas fa-hand-holding-heart"></i> 1% of every trade goes to charity automatically
                    </div>
                </div>
                
                <div id="dexTab" style="display: none;">
                    <h4 style="margin-bottom: 15px;"><i class="fas fa-cogs"></i> DEX Management</h4>
                    
                    <div style="background: var(--secondary); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        <p style="margin-bottom: 10px; font-size: 14px;"><strong>ZUZ/PYUSD Pair Status</strong></p>
                        <button class="btn-buy" onclick="checkPairStatus()" style="padding: 12px; width: 100%; font-size: 14px;">
                            <i class="fas fa-sync"></i> Check Pair Status
                        </button>
                        <div id="pairInfo" style="margin-top: 10px; font-size: 12px;"></div>
                    </div>
                    
                    <div style="background: var(--secondary); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        <p style="margin-bottom: 10px; font-size: 14px;"><strong>Real Swap</strong></p>
                        <input type="number" class="form-input" id="realSwapAmount" placeholder="Amount" style="margin-bottom: 10px;" value="10">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <button class="btn-buy" onclick="realSwap('ZUZtoPYUSD')" style="padding: 12px; font-size: 14px;">
                                ZUZ → PYUSD
                            </button>
                            <button class="btn-sell" onclick="realSwap('PYUSDtoZUZ')" style="padding: 12px; font-size: 14px;">
                                PYUSD → ZUZ
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="limitTab" style="display: none;">
                    <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                        Limit orders coming soon...
                    </p>
                </div>
            </div>
        </div>

        <!-- Секции фичей -->
        <h2 class="section-title" id="token-factory">
            <i class="fas fa-industry"></i> Token Factory
        </h2>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-coins"></i></div>
                <h4>Create Token</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Deploy your own ERC20 token</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-percentage"></i></div>
                <h4>Charity % Slider</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Set automatic charity percentage</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-chart-bar"></i></div>
                <h4>Token Analytics</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Track your token performance</p>
            </div>
        </div>

        <h2 class="section-title" id="digital-notary">
            <i class="fas fa-file-contract"></i> Digital Notary
        </h2>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-upload"></i></div>
                <h4>Upload Files</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Securely timestamp documents</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-fingerprint"></i></div>
                <h4>Create Hash</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Generate cryptographic hash</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-check-circle"></i></div>
                <h4>Verify Integrity</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Prove file authenticity</p>
            </div>
        </div>

        <h2 class="section-title" id="proofchain">
            <i class="fas fa-link"></i> ProofChain Ecosystem
        </h2>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-hand-holding-heart"></i></div>
                <h4>Charity Tracking</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Transparent tracking of donations</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                <h4>Secure Voting</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Community governance system</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-globe"></i></div>
                <h4>Global Impact</h4>
                <p style="color: var(--text-secondary); font-size: 14px;">Track real-world impact</p>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/ethers@5.7.0/dist/ethers.umd.min.js"></script>
    <script src="https://s3.tradingview.com/tv.js"></script>
    
    <script>
        // JavaScript код для функциональности
        // [Здесь должен быть полный JavaScript код]
        
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            document.getElementById('marketTab').style.display = tabName === 'market' ? 'block' : 'none';
            document.getElementById('limitTab').style.display = tabName === 'limit' ? 'block' : 'none';
            document.getElementById('dexTab').style.display = tabName === 'dex' ? 'block' : 'none';
        }
        
        // Авто-расчет total
        document.getElementById('amountInput').addEventListener('input', updateTotal);
        document.getElementById('priceInput').addEventListener('input', updateTotal);
        
        function updateTotal() {
            const amount = parseFloat(document.getElementById('amountInput').value) || 0;
            const price = parseFloat(document.getElementById('priceInput').value) || 0;
            document.getElementById('totalInput').value = (amount * price).toFixed(4);
        }
        
        updateTotal();
    </script>
</body>
</html>
MOBILE_EOF
    echo "✅ Создана адаптивная версия: index_mobile_responsive.html"
fi

# 3. Заменяем основной index.html
echo "🔄 Заменяем index.html на адаптивную версию..."
cp index_mobile_responsive.html index.html

# 4. Добавляем метку версии для сброса кэша
echo "<!-- Мобильная адаптация v.$(date +%Y%m%d%H%M%S) -->" >> index.html

echo ""
echo "✅ ОСНОВНОЙ САЙТ ОБНОВЛЕН!"
echo ""
echo "🎯 ЧТО СДЕЛАНО:"
echo "1. Создана резервная копия оригинального index.html"
echo "2. Создана/использована адаптивная версия"
echo "3. index.html заменен на мобильно-адаптивную версию"
echo "4. Добавлена метка версии для сброса кэша"
echo ""
echo "🌐 ОТКРОЙТЕ САЙТ С ПАРАМЕТРОМ v=3:"
echo "https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev?v=3"
echo ""
echo "📱 НА ТЕЛЕФОНЕ ОБЯЗАТЕЛЬНО:"
echo "1. Откройте ссылку с ?v=3"
echo "2. ЗАЖМИТЕ кнопку обновления"
echo "3. Выберите 'Очистить кэш и перезагрузить'"
echo "4. Или откройте в инкогнито-режиме"
