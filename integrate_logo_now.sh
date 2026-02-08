#!/bin/bash
echo "=== ИНТЕГРАЦИЯ ЛОГОТИПА ZUZCOIN ==="
echo ""

# Создаем резервную копию оригинального index.html
if [ -f "index.html" ]; then
    cp index.html "index_backup_$(date +%Y%m%d_%H%M%S).html"
    echo "✅ Создана резервная копия index.html"
else
    echo "❌ index.html не найден!"
    exit 1
fi

echo ""
echo "Создаем patched_index.html с интегрированным логотипом..."
echo ""

# Создаем патченную версию
cat > patched_index.html << 'PATCHED'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZUZCOIN Universe | Web3 Ecosystem</title>
    <!-- Фавиконка ZUZCOIN -->
    <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICAgIDxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjE0IiBmaWxsPSIjMDBjM2ZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMS41Ii8+CiAgICA8dGV4dCB4PSIxNiIgeT0iMTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj5aPC90ZXh0Pgo8L3N2Zz4=" type="image/svg+xml">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
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
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, var(--primary) 0%, #0c1525 100%);
            color: var(--text);
            min-height: 100vh;
            width: 100%;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header - кошелек СПРАВА */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid var(--border);
        }
        
        /* ОБНОВЛЕННЫЙ ЛОГОТИП */
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 700;
        }
        
        .logo-img {
            height: 50px;
            width: auto;
            vertical-align: middle;
        }
        
        .logo-text {
            margin-left: 0;
            font-size: 20px;
            font-weight: 600;
            background: linear-gradient(90deg, var(--accent), var(--positive));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .nav {
            display: flex;
            gap: 30px;
        }
        
        .nav a {
            color: var(--text-secondary);
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s;
        }
        
        .nav a:hover, .nav a.active {
            background: var(--secondary);
            color: var(--text);
        }
        
        /* Wallet section - СПРАВА */
        .wallet-section {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .balance-container {
            display: flex;
            gap: 20px;
            background: var(--secondary);
            padding: 12px 20px;
            border-radius: 10px;
        }
        
        .balance-item {
            text-align: center;
        }
        
        .balance-label {
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }
        
        .balance-value {
            font-size: 14px;
            font-weight: 600;
        }
        
        .balance-value.eth {
            color: #627eea;
        }
        
        .balance-value.zuz {
            color: var(--positive);
        }
        
        /* Кнопка Connect/Disconnect */
        .wallet-btn {
            background: var(--accent);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .wallet-btn:hover {
            background: #00b0e0;
        }
        
        .wallet-btn.connected {
            background: var(--positive);
        }
        
        .wallet-btn.connected:hover {
            background: #00b377;
        }
        
        /* DEX Status - компактный */
        .dex-status {
            background: var(--secondary);
            padding: 12px 20px;
            border-radius: 10px;
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .dex-status-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .dex-status-badge {
            background: var(--positive);
            color: white;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .dex-status-text {
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        .dex-stats {
            display: flex;
            gap: 20px;
        }
        
        .dex-stat-item {
            text-align: center;
        }
        
        .dex-stat-label {
            font-size: 11px;
            color: var(--text-secondary);
        }
        
        .dex-stat-value {
            font-size: 13px;
            font-weight: 600;
            color: var(--positive);
        }
        
        /* Main Grid */
        .main-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin: 30px 0;
        }
        
        /* Chart Container */
        .chart-container {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 25px;
            height: 500px;
        }
        
        /* Trading Panel */
        .trading-panel {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 25px;
        }
        
        /* Tabs */
        .tab-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .tab {
            flex: 1;
            background: var(--secondary);
            border: none;
            color: var(--text);
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .tab:hover {
            background: #2a3b54;
        }
        
        .tab.active {
            background: var(--accent);
        }
        
        /* Forms */
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-secondary);
        }
        
        .form-input {
            width: 100%;
            background: var(--secondary);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 12px;
            border-radius: 8px;
            font-size: 16px;
        }
        
        /* Buttons */
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
            margin: 10px 0;
            transition: all 0.3s;
        }
        
        .btn-buy {
            background: var(--positive);
            color: white;
        }
        
        .btn-buy:hover {
            background: #00b377;
        }
        
        .btn-sell {
            background: var(--negative);
            color: white;
        }
        
        .btn-sell:hover {
            background: #e04545;
        }
        
        /* Features Grid */
        .section-title {
            font-size: 20px;
            margin: 40px 0 20px;
            color: var(--text);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .feature-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 25px;
            text-align: center;
            transition: all 0.3s;
            cursor: pointer;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent);
        }
        
        .feature-icon {
            font-size: 40px;
            color: var(--accent);
            margin-bottom: 15px;
        }
        
        /* Wallet Modal */
        .wallet-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .wallet-modal-content {
            background: var(--primary);
            border-radius: 16px;
            padding: 30px;
            width: 90%;
            max-width: 400px;
            border: 1px solid var(--border);
        }
        
        .wallet-option {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: var(--secondary);
            border-radius: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .wallet-option:hover {
            background: #2a3b54;
            transform: translateX(5px);
        }
        
        .wallet-icon {
            font-size: 24px;
            color: var(--accent);
        }
        
        /* Mobile Adaptation */
        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                gap: 15px;
            }
            
            .logo {
                flex-direction: column;
                text-align: center;
                gap: 5px;
            }
            
            .logo-img {
                height: 40px;
            }
            
            .logo-text {
                font-size: 18px;
            }
            
            .nav {
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
            }
            
            .wallet-section {
                flex-direction: column;
                width: 100%;
            }
            
            .balance-container {
                width: 100%;
                justify-content: space-around;
            }
            
            .dex-status {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }
            
            .dex-status-content {
                flex-direction: column;
                gap: 10px;
            }
            
            .dex-stats {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .main-grid {
                grid-template-columns: 1fr;
            }
            
            .chart-container {
                height: 350px;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .balance-container {
                flex-direction: column;
                gap: 10px;
            }
            
            .chart-container {
                height: 280px;
                padding: 15px;
            }
            
            .trading-panel {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <!-- ОБНОВЛЕННЫЙ ЛОГОТИП ZUZCOIN -->
            <div class="logo">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCAyMDAgNTAiPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJjb2luR3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMGMzZmYiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDA5OWNjIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxjaXJjbGUgY3g9IjI1IiBjeT0iMjUiIHI9IjIwIiBmaWxsPSJ1cmwoI2luY2x1ZGUtY29pbkdyYWQpIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPHRleHQgeD0iMjUiIHk9IjI4IiB0ZXh0LWFuY2hvcj9ib2xkIj5aPC90ZXh0PgogICAgPHRleHQgeD0iNjAiIHk9IjMyIiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9IkludGVyLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iNjAwIj5aVVpDT0lOPC90ZXh0Pgo8L3N2Zz4=" 
                     alt="ZUZCOIN" class="logo-img">
                <span class="logo-text">Universe</span>
            </div>
            
            <nav class="nav">
                <a href="#" class="active"><i class="fas fa-chart-line"></i> Trade</a>
                <a href="#token-factory"><i class="fas fa-industry"></i> Token Factory</a>
                <a href="#digital-notary"><i class="fas fa-file-contract"></i> Digital Notary</a>
                <a href="#proofchain"><i class="fas fa-link"></i> ProofChain</a>
            </nav>
            
            <!-- Wallet Section - СПРАВА -->
            <div class="wallet-section">
                <div class="balance-container" id="balanceContainer" style="display: none;">
                    <div class="balance-item">
                        <div class="balance-label">ETH</div>
                        <div class="balance-value eth" id="ethBalance">0.00</div>
                    </div>
                    <div class="balance-item">
                        <div class="balance-label">ZUZ</div>
                        <div class="balance-value zuz" id="zuzBalance">0</div>
                    </div>
                    <div class="balance-item">
                        <div class="balance-label">Network</div>
                        <div class="balance-value" id="networkName">-</div>
                    </div>
                </div>
                
                <button class="wallet-btn" id="connectWalletBtn">
                    <i class="fas fa-wallet"></i>
                    <span>Connect Wallet</span>
                </button>
            </div>
        </header>

        <!-- DEX Status - компактный -->
        <div class="dex-status" id="dexStatus">
            <div class="dex-status-content">
                <div class="dex-status-badge">DEX LIVE</div>
                <div class="dex-status-text">ZUZ/PYUSD Trading • 1% Auto-Donation Active</div>
            </div>
            <div class="dex-stats">
                <div class="dex-stat-item">
                    <div class="dex-stat-label">Reserves</div>
                    <div class="dex-stat-value" id="dexReserves">-</div>
                </div>
                <div class="dex-stat-item">
                    <div class="dex-stat-label">Price</div>
                    <div class="dex-stat-value" id="dexPrice">-</div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-grid">
            <!-- Chart -->
            <div class="chart-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3><i class="fas fa-chart-candlestick"></i> ZUZ/PYUSD Chart</h3>
                    <div style="display: flex; gap: 10px;">
                        <button style="padding: 6px 12px; background: var(--secondary); border: none; border-radius: 6px; color: var(--text); cursor: pointer; transition: all 0.3s;" 
                                onmouseover="this.style.background='#2a3b54'" 
                                onmouseout="this.style.background='var(--secondary)'">1H</button>
                        <button style="padding: 6px 12px; background: var(--accent); border: none; border-radius: 6px; color: white; cursor: pointer;">1D</button>
                        <button style="padding: 6px 12px; background: var(--secondary); border: none; border-radius: 6px; color: var(--text); cursor: pointer; transition: all 0.3s;"
                                onmouseover="this.style.background='#2a3b54'" 
                                onmouseout="this.style.background='var(--secondary)'">1W</button>
                    </div>
                </div>
                <div id="tradingview_chart" style="height: 90%;"></div>
            </div>

            <!-- Trading Panel -->
            <div class="trading-panel">
                <h3><i class="fas fa-exchange-alt"></i> Trading Panel</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    Swap ZUZ/PYUSD with 1% auto-donation
                </p>
                
                <div class="tab-container">
                    <button class="tab active" onclick="switchTab('market')">Market</button>
                    <button class="tab" onclick="switchTab('limit')">Limit</button>
                    <button class="tab" onclick="switchTab('liquidity')">Liquidity</button>
                </div>
                
                <div id="marketTab">
                    <div class="form-group">
                        <label class="form-label">Amount (ZUZ)</label>
                        <input type="number" class="form-input" id="amountInput" placeholder="0.00" step="0.01" value="10">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">You Receive (PYUSD)</label>
                        <input type="number" class="form-input" id="receiveInput" placeholder="0.00" readonly>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                        <button class="btn-buy" onclick="executeTrade('buy')">
                            <i class="fas fa-arrow-up"></i> Buy ZUZ
                        </button>
                        <button class="btn-sell" onclick="executeTrade('sell')">
                            <i class="fas fa-arrow-down"></i> Sell ZUZ
                        </button>
                    </div>
                    
                    <div style="text-align: center; color: var(--text-secondary); font-size: 12px; margin-top: 20px;">
                        <i class="fas fa-hand-holding-heart"></i> 1% donated to charity
                    </div>
                </div>
                
                <div id="limitTab" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">Limit Price (PYUSD)</label>
                        <input type="number" class="form-input" placeholder="0.0961" step="0.0001">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Amount (ZUZ)</label>
                        <input type="number" class="form-input" placeholder="0.00" step="0.01">
                    </div>
                    
                    <button class="btn-buy" style="margin-top: 10px;">
                        <i class="fas fa-clock"></i> Place Limit Order
                    </button>
                </div>
                
                <div id="liquidityTab" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">ZUZ Amount</label>
                        <input type="number" class="form-input" placeholder="0.00" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">PYUSD Amount</label>
                        <input type="number" class="form-input" placeholder="0.00" step="0.01">
                    </div>
                    
                    <button class="btn-buy" style="margin-top: 10px;">
                        <i class="fas fa-plus-circle"></i> Add Liquidity
                    </button>
                </div>
            </div>
        </div>

        <!-- Features -->
        <h2 class="section-title" id="token-factory">
            <i class="fas fa-industry"></i> Token Factory
        </h2>
        
        <div class="features-grid">
            <div class="feature-card" onclick="showComingSoon('Token Factory')">
                <div class="feature-icon"><i class="fas fa-coins"></i></div>
                <h4>Create Token</h4>
                <p>Deploy your own ERC20 token with custom name, symbol and supply</p>
            </div>
            
            <div class="feature-card" onclick="showComingSoon('Charity Slider')">
                <div class="feature-icon"><i class="fas fa-percentage"></i></div>
                <h4>Charity % Slider</h4>
                <p>Set automatic charity percentage for your token transactions</p>
            </div>
            
            <div class="feature-card" onclick="showComingSoon('Token Analytics')">
                <div class="feature-icon"><i class="fas fa-chart-bar"></i></div>
                <h4>Token Analytics</h4>
                <p>Track your token performance and transactions</p>
            </div>
        </div>

        <h2 class="section-title" id="digital-notary">
            <i class="fas fa-file-contract"></i> Digital Notary
        </h2>
        
        <div class="features-grid">
            <div class="feature-card" onclick="showComingSoon('File Upload')">
                <div class="feature-icon"><i class="fas fa-upload"></i></div>
                <h4>Upload Files</h4>
                <p>Securely timestamp and store documents on blockchain</p>
            </div>
            
            <div class="feature-card" onclick="showComingSoon('Hash Creation')">
                <div class="feature-icon"><i class="fas fa-fingerprint"></i></div>
                <h4>Create Hash</h4>
                <p>Generate unique cryptographic hash for your files</p>
            </div>
            
            <div class="feature-card" onclick="showComingSoon('Integrity Verification')">
                <div class="feature-icon"><i class="fas fa-check-circle"></i></div>
                <h4>Verify Integrity</h4>
                <p>Prove file authenticity and timestamp</p>
            </div>
        </div>

        <h2 class="section-title" id="proofchain">
            <i class="fas fa-link"></i> ProofChain Ecosystem
        </h2>
        
        <div class="features-grid">
            <div class="feature-card" onclick="showComingSoon('Charity Tracking')">
                <div class="feature-icon"><i class="fas fa-hand-holding-heart"></i></div>
                <h4>Charity Tracking</h4>
                <p>Transparent tracking of all charity donations</p>
            </div>
            
            <div class="feature-card" onclick="showComingSoon('Secure Voting')">
                <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                <h4>Secure Voting</h4>
                <p>Community governance and voting system</p>
            </div>
            
            <div class="feature-card" onclick="showComingSoon('Global Impact')">
                <div class="feature-icon"><i class="fas fa-globe"></i></div>
                <h4>Global Impact</h4>
                <p>Track real-world impact of donations</p>
            </div>
        </div>
    </div>

    <!-- Wallet Modal -->
    <div class="wallet-modal" id="walletModal">
        <div class="wallet-modal-content">
            <h3 style="margin-bottom: 20px; text-align: center;">Connect Wallet</h3>
            
            <div class="wallet-option" onclick="connectWallet('metamask')">
                <div class="wallet-icon"><i class="fab fa-ethereum"></i></div>
                <div>
                    <div style="font-weight: 600;">MetaMask</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Browser extension</div>
                </div>
            </div>
            
            <div class="wallet-option" onclick="connectWallet('walletconnect')">
                <div class="wallet-icon"><i class="fas fa-qrcode"></i></div>
                <div>
                    <div style="font-weight: 600;">WalletConnect</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Mobile wallets</div>
                </div>
            </div>
            
            <div class="wallet-option" onclick="connectWallet('coinbase')">
                <div class="wallet-icon"><i class="fab fa-bitcoin"></i></div>
                <div>
                    <div style="font-weight: 600;">Coinbase Wallet</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">Web3 wallet</div>
                </div>
            </div>
            
            <button style="width: 100%; padding: 12px; background: var(--secondary); border: none; border-radius: 10px; color: var(--text); margin-top: 20px; cursor: pointer;"
                    onclick="closeWalletModal()">
                Cancel
            </button>
        </div>
    </div>

    <script src="https://unpkg.com/ethers@5.7.0/dist/ethers.umd.min.js"></script>
    <script src="https://s3.tradingview.com/tv.js"></script>
    
    <script>
        // Configuration
        const DEX_CONFIG = {
            address: "0x09970975aa48c718e17db4a18128ebf6806e1f2c",
            zuzToken: "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
            pyusdToken: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9"
        };
        
        let provider, signer, userAddress;
        let isConnected = false;
        
        // Wallet Modal
        function showWalletModal() {
            document.getElementById('walletModal').style.display = 'flex';
        }
        
        function closeWalletModal() {
            document.getElementById('walletModal').style.display = 'none';
        }
        
        // Connect Wallet
        async function connectWallet(walletType) {
            closeWalletModal();
            
            try {
                document.getElementById('connectWalletBtn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
                
                if (walletType === 'metamask') {
                    if (typeof window.ethereum === 'undefined') {
                        alert('Please install MetaMask!');
                        document.getElementById('connectWalletBtn').innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                        return;
                    }
                    
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    
                    // Listen for account changes
                    window.ethereum.on('accountsChanged', handleAccountsChanged);
                    window.ethereum.on('chainChanged', handleChainChanged);
                }
                
                signer = provider.getSigner();
                userAddress = await signer.getAddress();
                
                // Update UI
                isConnected = true;
                updateWalletUI();
                await loadBalances();
                await loadDexData();
                
            } catch (error) {
                console.error("Connection error:", error);
                document.getElementById('connectWalletBtn').innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                alert("Connection failed: " + error.message);
            }
        }
        
        // Disconnect Wallet
        function disconnectWallet() {
            isConnected = false;
            provider = null;
            signer = null;
            userAddress = null;
            
            document.getElementById('connectWalletBtn').innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
            document.getElementById('connectWalletBtn').classList.remove('connected');
            document.getElementById('balanceContainer').style.display = 'none';
            
            document.getElementById('ethBalance').textContent = '0.00';
            document.getElementById('zuzBalance').textContent = '0';
            document.getElementById('networkName').textContent = '-';
            document.getElementById('dexReserves').textContent = '-';
            document.getElementById('dexPrice').textContent = '-';
        }
        
        // Update Wallet UI
        function updateWalletUI() {
            if (isConnected) {
                document.getElementById('connectWalletBtn').innerHTML = 
                    '<i class="fas fa-check-circle"></i> ' + 
                    userAddress.substring(0, 6) + '...' + userAddress.substring(38);
                document.getElementById('connectWalletBtn').classList.add('connected');
                document.getElementById('connectWalletBtn').onclick = disconnectWallet;
                document.getElementById('balanceContainer').style.display = 'flex';
            } else {
                document.getElementById('connectWalletBtn').innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                document.getElementById('connectWalletBtn').classList.remove('connected');
                document.getElementById('connectWalletBtn').onclick = showWalletModal;
                document.getElementById('balanceContainer').style.display = 'none';
            }
        }
        
        // Load Balances
        async function loadBalances() {
            try {
                const ethBalance = await provider.getBalance(userAddress);
                document.getElementById('ethBalance').textContent = 
                    parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4);
                
                const zuzABI = ["function balanceOf(address) view returns (uint256)"];
                const zuzContract = new ethers.Contract(DEX_CONFIG.zuzToken, zuzABI, provider);
                const zuzBalance = await zuzContract.balanceOf(userAddress);
                
                document.getElementById('zuzBalance').textContent = 
                    parseInt(ethers.utils.formatUnits(zuzBalance, 18)).toLocaleString();
                
                const network = await provider.getNetwork();
                document.getElementById('networkName').textContent = 
                    network.name.charAt(0).toUpperCase() + network.name.slice(1);
                    
            } catch (error) {
                console.error("Balance error:", error);
            }
        }
        
        // Load DEX Data
        async function loadDexData() {
            try {
                const dexABI = ["function getReserves(address tokenA, address tokenB) view returns (uint256 reserveA, uint256 reserveB)"];
                const dexContract = new ethers.Contract(DEX_CONFIG.address, dexABI, provider);
                const reserves = await dexContract.getReserves(DEX_CONFIG.zuzToken, DEX_CONFIG.pyusdToken);
                
                const zuzReserve = parseFloat(ethers.utils.formatUnits(reserves[0], 18));
                const pyusdReserve = parseFloat(ethers.utils.formatUnits(reserves[1], 6));
                const price = (pyusdReserve / zuzReserve).toFixed(4);
                
                document.getElementById('dexReserves').textContent = 
                    `${zuzReserve.toFixed(0)}/${pyusdReserve.toFixed(0)}`;
                document.getElementById('dexPrice').textContent = `${price} PYUSD`;
                
            } catch (error) {
                console.error("DEX data error:", error);
            }
        }
        
        // Event Handlers
        function handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                userAddress = accounts[0];
                updateWalletUI();
                loadBalances();
            }
        }
        
        function handleChainChanged() {
            window.location.reload();
        }
        
        // Trading Functions
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            event.target.classList.add('active');
            
            document.getElementById('marketTab').style.display = tabName === 'market' ? 'block' : 'none';
            document.getElementById('limitTab').style.display = tabName === 'limit' ? 'block' : 'none';
            document.getElementById('liquidityTab').style.display = tabName === 'liquidity' ? 'block' : 'none';
        }
        
        function executeTrade(type) {
            if (!isConnected) {
                showWalletModal();
                return;
            }
            
            const amount = document.getElementById('amountInput').value;
            if (!amount || amount <= 0) {
                alert("Please enter amount!");
                return;
            }
            
            alert(`${type === 'buy' ? 'Buy' : 'Sell'} ${amount} ZUZ\n1% will be donated to charity`);
        }
        
        function showComingSoon(feature) {
            alert(`${feature} - Coming Soon!`);
        }
        
        // Auto-calculate receive amount
        function updateReceiveAmount() {
            const amount = parseFloat(document.getElementById('amountInput').value) || 0;
            const price = 0.0961; // Current price
            const receive = (amount * price * 0.996).toFixed(4); // 0.3% fee + 1% charity
            document.getElementById('receiveInput').value = receive;
        }
        
        // Initialize
        window.addEventListener('load', () => {
            // Initialize TradingView
            if (typeof TradingView !== 'undefined') {
                new TradingView.widget({
                    "container_id": "tradingview_chart",
                    "width": "100%",
                    "height": "100%",
                    "symbol": "ETHUSD",
                    "interval": "D",
                    "timezone": "exchange",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#0e1a2d",
                    "enable_publishing": false,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true
                });
            }
            
            // Setup wallet button
            document.getElementById('connectWalletBtn').onclick = showWalletModal;
            
            // Setup auto-calculation
            document.getElementById('amountInput').addEventListener('input', updateReceiveAmount);
            updateReceiveAmount();
            
            // Check if already connected
            if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
                setTimeout(async () => {
                    await connectWallet('metamask');
                }, 1000);
            }
            
            // Close modal on outside click
            document.getElementById('walletModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeWalletModal();
                }
            });
        });
    </script>
</body>
</html>
PATCHED

echo "✅ Создан patched_index.html с интегрированным логотипом"
echo ""
echo "=== ИНСТРУКЦИЯ ==="
echo "1. Просмотрите логотип в ZUZCOIN_final_logo.html"
echo "2. Замените index.html на patched_index.html:"
echo "   mv patched_index.html index.html"
echo "3. Или сравните изменения:"
echo "   diff index.html patched_index.html | head -50"
echo ""
echo "Логотип интегрирован:"
echo "- В хедере (вместо иконки монеты)"
echo "- Как фавиконка вкладки"
echo "- С сохранением всего функционала MetaMask и DEX"
