#!/bin/bash

echo "🔄 Создаем обновленный интерфейс с реальным балансом ZUZ..."

# Сначала создаем новый index.html
cat > index.html << 'HTML_EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZUZCOIN Universe | Token Factory & Digital Notary</title>
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
            --card-bg: rgba(20, 30, 48, 0.8);
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
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid var(--border);
            background: rgba(14, 26, 45, 0.95);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 700;
            color: var(--accent);
        }
        
        .logo i {
            color: var(--positive);
        }
        
        .nav {
            display: flex;
            gap: 30px;
        }
        
        .nav a {
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            padding: 8px 0;
            position: relative;
        }
        
        .nav a:hover, .nav a.active {
            color: var(--text);
        }
        
        .nav a.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--accent);
        }
        
        /* Wallet Button */
        .wallet-btn {
            background: linear-gradient(90deg, var(--accent), #0099cc);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
        }
        
        .wallet-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 195, 255, 0.3);
        }
        
        .wallet-btn.connected {
            background: linear-gradient(90deg, var(--positive), #00b377);
        }
        
        /* Balance Display */
        .balance-container {
            display: flex;
            align-items: center;
            gap: 15px;
            background: var(--card-bg);
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid var(--border);
        }
        
        .balance-item {
            text-align: center;
            padding: 0 15px;
            border-right: 1px solid var(--border);
        }
        
        .balance-item:last-child {
            border-right: none;
        }
        
        .balance-label {
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }
        
        .balance-value {
            font-size: 18px;
            font-weight: 600;
            color: var(--text);
        }
        
        .balance-value.zuz {
            color: var(--positive);
        }
        
        .balance-value.eth {
            color: var(--accent);
        }
        
        /* Main Grid */
        .main-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-top: 30px;
        }
        
        /* Chart Container */
        .chart-container {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            border: 1px solid var(--border);
            height: 500px;
        }
        
        /* Trading Panel */
        .trading-panel {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            border: 1px solid var(--border);
        }
        
        .tab-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            background: var(--secondary);
            border: none;
            color: var(--text-secondary);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .tab.active {
            background: var(--accent);
            color: white;
        }
        
        /* Form Styles */
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        .form-input {
            width: 100%;
            padding: 14px;
            background: var(--secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: var(--text);
            font-size: 16px;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        /* Slider */
        .slider-container {
            background: var(--secondary);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        
        .slider-value {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: var(--positive);
            margin-bottom: 10px;
        }
        
        .slider {
            width: 100%;
            height: 8px;
            -webkit-appearance: none;
            background: linear-gradient(90deg, var(--positive), var(--accent));
            border-radius: 4px;
            outline: none;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 24px;
            height: 24px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
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
            transition: transform 0.2s;
            margin-top: 10px;
        }
        
        .btn-buy {
            background: linear-gradient(90deg, var(--positive), #00b377);
            color: white;
        }
        
        .btn-sell {
            background: linear-gradient(90deg, var(--negative), #ff3333);
            color: white;
        }
        
        .btn-buy:hover, .btn-sell:hover {
            transform: translateY(-2px);
        }
        
        /* Section Cards */
        .section-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 25px;
            margin-top: 20px;
            border: 1px solid var(--border);
        }
        
        .section-title {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            color: var(--accent);
            font-size: 20px;
        }
        
        /* Notary */
        .file-upload-area {
            border: 2px dashed var(--border);
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.3s;
            margin-bottom: 20px;
        }
        
        .file-upload-area:hover {
            border-color: var(--accent);
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: 30px 0;
            margin-top: 50px;
            border-top: 1px solid var(--border);
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        }
        
        .modal-content {
            background: var(--primary);
            border-radius: 16px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            border: 1px solid var(--border);
        }
        
        .wallet-option {
            background: var(--secondary);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 15px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            transition: background 0.3s;
        }
        
        .wallet-option:hover {
            background: var(--accent);
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
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
            
            <div style="display: flex; align-items: center; gap: 15px;">
                <!-- Balance Display -->
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
                
                <!-- Wallet Button -->
                <button class="wallet-btn" id="connectWalletBtn">
                    <i class="fas fa-wallet"></i>
                    <span>Connect Wallet</span>
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <div class="main-grid">
            <!-- Left Column: Chart -->
            <div class="chart-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3><i class="fas fa-chart-candlestick"></i> ZUZ/USDT Chart</h3>
                    <div style="display: flex; gap: 10px;">
                        <button style="padding: 6px 12px; background: var(--secondary); border: none; border-radius: 6px; color: var(--text); cursor: pointer;">1H</button>
                        <button style="padding: 6px 12px; background: var(--accent); border: none; border-radius: 6px; color: white; cursor: pointer;">1D</button>
                        <button style="padding: 6px 12px; background: var(--secondary); border: none; border-radius: 6px; color: var(--text); cursor: pointer;">1W</button>
                    </div>
                </div>
                <!-- TradingView Chart -->
                <div id="tradingview_chart" style="height: 90%;"></div>
            </div>

            <!-- Right Column: Trading Panel -->
            <div class="trading-panel">
                <div class="tab-container">
                    <button class="tab active" onclick="switchTab('market')">Market</button>
                    <button class="tab" onclick="switchTab('limit')">Limit</button>
                    <button class="tab" onclick="switchTab('stop')">Stop</button>
                </div>
                
                <div id="marketTab">
                    <div class="form-group">
                        <label class="form-label">Amount (ZUZ)</label>
                        <input type="number" class="form-input" id="amountInput" placeholder="0.00" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Price (USDT)</label>
                        <input type="number" class="form-input" id="priceInput" placeholder="0.50" value="0.50" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Total (USDT)</label>
                        <input type="number" class="form-input" id="totalInput" placeholder="0.00" readonly>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                        <button class="btn-buy" onclick="placeOrder('buy')">
                            <i class="fas fa-arrow-up"></i> Buy ZUZ
                        </button>
                        <button class="btn-sell" onclick="placeOrder('sell')">
                            <i class="fas fa-arrow-down"></i> Sell ZUZ
                        </button>
                    </div>
                    
                    <div style="text-align: center; color: var(--text-secondary); font-size: 12px; margin-top: 20px;">
                        <i class="fas fa-info-circle"></i> 1% of every trade goes to charity
                    </div>
                </div>
                
                <div id="limitTab" style="display: none;">
                    <!-- Limit order content would go here -->
                </div>
            </div>
        </div>

        <!-- Token Factory Section -->
        <div class="section-card" id="token-factory">
            <div class="section-title">
                <i class="fas fa-industry"></i>
                <h2>Token Factory</h2>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                Create your own token with built-in philanthropy. 1-10% of every transaction automatically donated to charity.
            </p>
            
            <div class="slider-container">
                <div class="slider-value" id="charityPercent">5%</div>
                <div style="text-align: center; color: var(--text-secondary); margin-bottom: 15px;">
                    Charity Percentage (1-10%)
                </div>
                <input type="range" min="1" max="10" value="5" class="slider" id="charitySlider" oninput="updateCharityPercent(this.value)">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label class="form-label">Token Name</label>
                    <input type="text" class="form-input" id="tokenName" placeholder="e.g., HopeCoin">
                </div>
                <div class="form-group">
                    <label class="form-label">Token Symbol</label>
                    <input type="text" class="form-input" id="tokenSymbol" placeholder="e.g., HOPE">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Initial Supply</label>
                <input type="number" class="form-input" id="tokenSupply" placeholder="1000000">
            </div>
            
            <button class="btn-buy" onclick="createToken()" style="margin-top: 20px;">
                <i class="fas fa-plus-circle"></i> Create Token (Requires ETH)
            </button>
        </div>

        <!-- Digital Notary Section -->
        <div class="section-card" id="digital-notary">
            <div class="section-title">
                <i class="fas fa-file-contract"></i>
                <h2>Digital Notary</h2>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                Upload any document to create an immutable proof of existence on the blockchain. Timestamped and verifiable forever.
            </p>
            
            <div class="file-upload-area" id="fileUploadArea" onclick="document.getElementById('fileInput').click()">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--accent); margin-bottom: 15px;"></i>
                <h3 style="margin-bottom: 10px;">Drop your file here or click to browse</h3>
                <p style="color: var(--text-secondary);">PDF, DOC, JPG, PNG up to 10MB</p>
            </div>
            
            <input type="file" id="fileInput" style="display: none;" onchange="handleFileUpload(this.files)">
            
            <div id="fileInfo" style="display: none; background: var(--secondary); padding: 15px; border-radius: 10px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600;" id="fileName"></div>
                        <div style="font-size: 12px; color: var(--text-secondary);" id="fileSize"></div>
                    </div>
                    <button class="btn-buy" onclick="notarizeDocument()" style="padding: 10px 20px;">
                        <i class="fas fa-stamp"></i> Notarize
                    </button>
                </div>
            </div>
            
            <div id="notarizationResult" style="display: none; background: var(--positive); padding: 15px; border-radius: 10px; margin-top: 20px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 24px;"></i>
                    <div>
                        <div style="font-weight: 600;">Document Notarized!</div>
                        <div style="font-size: 12px;" id="transactionHash"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ProofChain Ecosystem -->
        <div class="section-card" id="proofchain">
            <div class="section-title">
                <i class="fas fa-link"></i>
                <h2>ProofChain Ecosystem</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: var(--secondary); padding: 20px; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-hand-holding-heart" style="color: var(--positive); font-size: 24px;"></i>
                        <h3>Philanthropy</h3>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 14px;">
                        1% of every transaction automatically donated to The Giving Pledge.
                    </p>
                </div>
                
                <div style="background: var(--secondary); padding: 20px; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-code-branch" style="color: var(--accent); font-size: 24px;"></i>
                        <h3>Smart Contracts</h3>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 14px;">
                        Verified contracts on Etherscan for complete transparency.
                    </p>
                </div>
                
                <div style="background: var(--secondary); padding: 20px; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <i class="fas fa-shield-alt" style="color: #ffd700; font-size: 24px;"></i>
                        <h3>Digital Notary</h3>
                    </div>
                    <p style="color: var(--text-secondary); font-size: 14px;">
                        Immutable document timestamping on the blockchain.
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
                <a href="#" style="color: var(--text-secondary); text-decoration: none;">Terms</a>
                <a href="#" style="color: var(--text-secondary); text-decoration: none;">Privacy</a>
                <a href="#" style="color: var(--text-secondary); text-decoration: none;">Docs</a>
                <a href="#" style="color: var(--text-secondary); text-decoration: none;">Support</a>
            </div>
            <p>ZUZCOIN Universe © 2024 | 1% for philanthropy, 100% for the future</p>
            <p style="margin-top: 10px; font-size: 12px;">
                Contract: <span id="contractAddress">0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3</span> | 
                <a href="https://sepolia.etherscan.io/address/0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3" 
                   style="color: var(--accent); text-decoration: none;" target="_blank">
                   View on Etherscan
                </a>
            </p>
        </footer>
    </div>

    <!-- Wallet Modal -->
    <div class="modal" id="walletModal">
        <div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>Connect Wallet</h3>
                <button onclick="closeModal()" style="background: none; border: none; color: var(--text); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="wallet-option" onclick="connectMetaMask()">
                    <i class="fab fa-ethereum"></i> MetaMask
                </button>
                <button class="wallet-option" onclick="connectWalletConnect()">
                    <i class="fas fa-wallet"></i> WalletConnect
                </button>
                <button class="wallet-option" onclick="connectCoinbase()">
                    <i class="fab fa-bitcoin"></i> Coinbase Wallet
                </button>
            </div>
        </div>
    </div>

    <script src="https://unpkg.com/web3@1.7.0/dist/web3.min.js"></script>
    <script src="https://unpkg.com/ethers@5.7.0/dist/ethers.umd.min.js"></script>
    <script src="https://s3.tradingview.com/tv.js"></script>
    
    <script>
        // State variables
        let provider;
        let userAddress;
        let zuzContract;
        
        // ZUZ Token Contract Address (Sepolia)
        const ZUZ_TOKEN_ADDRESS = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
        const ZUZ_TOKEN_ABI = [
            {"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},
            {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
            {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},
            {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},
            {"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"}
        ];
        
        // Initialize TradingView Chart
        function initTradingView() {
            if (typeof TradingView !== 'undefined') {
                new TradingView.widget({
                    "width": "100%",
                    "height": "100%",
                    "symbol": "COINBASE:ETHUSD",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#0e1a2d",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_chart"
                });
            }
        }
        
        // Wallet Connection Functions
        async function connectMetaMask() {
            try {
                if (window.ethereum) {
                    provider = new ethers.providers.Web3Provider(window.ethereum);
                    
                    // Request account access
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    userAddress = accounts[0];
                    
                    console.log("Connected to MetaMask:", userAddress);
                    
                    // Update UI
                    updateWalletUI(true);
                    closeModal();
                    
                    // Load balances
                    await loadBalances();
                    
                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length > 0) {
                            userAddress = accounts[0];
                            loadBalances();
                        } else {
                            // User disconnected
                            updateWalletUI(false);
                        }
                    });
                    
                    // Listen for chain changes
                    window.ethereum.on('chainChanged', () => {
                        window.location.reload();
                    });
                    
                } else {
                    alert("Please install MetaMask extension!");
                    window.open("https://metamask.io/download/", "_blank");
                }
            } catch (error) {
                console.error("MetaMask connection error:", error);
                alert("Connection failed: " + error.message);
            }
        }
        
        async function loadBalances() {
            try {
                if (!provider || !userAddress) return;
                
                console.log("Loading balances for:", userAddress);
                
                // Get ETH balance
                const ethBalance = await provider.getBalance(userAddress);
                const ethFormatted = ethers.utils.formatEther(ethBalance);
                document.getElementById('ethBalance').textContent = 
                    `${parseFloat(ethFormatted).toFixed(4)} ETH`;
                
                // Get ZUZ balance
                zuzContract = new ethers.Contract(ZUZ_TOKEN_ADDRESS, ZUZ_TOKEN_ABI, provider);
                
                try {
                    const balance = await zuzContract.balanceOf(userAddress);
                    const decimals = await zuzContract.decimals();
                    const zuzFormatted = ethers.utils.formatUnits(balance, decimals);
                    
                    document.getElementById('zuzBalance').textContent = 
                        `${parseFloat(zuzFormatted).toLocaleString('en-US', {maximumFractionDigits: 0})} ZUZ`;
                    
                    console.log("ZUZ Balance loaded:", zuzFormatted, "ZUZ");
                } catch (zuzError) {
                    console.error("Error loading ZUZ balance:", zuzError);
                    document.getElementById('zuzBalance').textContent = "Error loading";
                }
                
                // Get network name
                const network = await provider.getNetwork();
                let networkName = "Unknown";
                if (network.chainId === 1) networkName = "Ethereum Mainnet";
                else if (network.chainId === 11155111) networkName = "Sepolia Testnet";
                else if (network.chainId === 5) networkName = "Goerli Testnet";
                else networkName = `Chain ID: ${network.chainId}`;
                
                document.getElementById('networkName').textContent = networkName;
                
            } catch (error) {
                console.error("Error loading balances:", error);
            }
        }
        
        function updateWalletUI(connected) {
            const btn = document.getElementById('connectWalletBtn');
            const balanceContainer = document.getElementById('balanceContainer');
            
            if (connected) {
                btn.innerHTML = '<i class="fas fa-check-circle"></i><span>Connected</span>';
                btn.classList.add('connected');
                balanceContainer.style.display = 'flex';
            } else {
                btn.innerHTML = '<i class="fas fa-wallet"></i><span>Connect Wallet</span>';
                btn.classList.remove('connected');
                balanceContainer.style.display = 'none';
            }
        }
        
        function openWalletModal() {
            document.getElementById('walletModal').style.display = 'flex';
        }
        
        function closeModal() {
            document.getElementById('walletModal').style.display = 'none';
        }
        
        // Trading Functions
        function switchTab(tabName) {
            // Update tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Show/hide content
            document.getElementById('marketTab').style.display = 'none';
            document.getElementById('limitTab').style.display = 'none';
            
            if (tabName === 'market') {
                document.getElementById('marketTab').style.display = 'block';
            } else if (tabName === 'limit') {
                document.getElementById('limitTab').style.display = 'block';
            }
        }
        
        function placeOrder(type) {
            const amount = document.getElementById('amountInput').value;
            const price = document.getElementById('priceInput').value;
            
            if (!amount || amount <= 0) {
                alert("Please enter a valid amount");
                return;
            }
            
            const total = (amount * price).toFixed(2);
            
            if (type === 'buy') {
                alert(`✅ Buy order placed!\nAmount: ${amount} ZUZ\nPrice: ${price} USDT\nTotal: ${total} USDT\n\n(Note: This is a demo. Real trading requires DEX contract.)`);
            } else {
                alert(`✅ Sell order placed!\nAmount: ${amount} ZUZ\nPrice: ${price} USDT\nTotal: ${total} USDT\n\n(Note: This is a demo. Real trading requires DEX contract.)`);
            }
        }
        
        // Token Factory Functions
        function updateCharityPercent(value) {
            document.getElementById('charityPercent').textContent = value + '%';
        }
        
        function createToken() {
            const name = document.getElementById('tokenName').value;
            const symbol = document.getElementById('tokenSymbol').value;
            const supply = document.getElementById('tokenSupply').value;
            const charity = document.getElementById('charitySlider').value;
            
            if (!name || !symbol || !supply) {
                alert("Please fill in all fields");
                return;
            }
            
            alert(`🚀 Creating token:\nName: ${name}\nSymbol: ${symbol}\nSupply: ${supply}\nCharity: ${charity}%\n\n(Note: This requires deploying a real contract. Coming soon!)`);
        }
        
        // Digital Notary Functions
        function handleFileUpload(files) {
            if (files.length > 0) {
                const file = files[0];
                const fileSize = (file.size / (1024*1024)).toFixed(2);
                
                document.getElementById('fileName').textContent = file.name;
                document.getElementById('fileSize').textContent = `${fileSize} MB`;
                document.getElementById('fileInfo').style.display = 'block';
                
                // Store file for notarization
                window.selectedFile = file;
            }
        }
        
        function notarizeDocument() {
            if (!window.selectedFile) {
                alert("Please select a file first");
                return;
            }
            
            // Simulate notarization
            const hash = "0x" + Math.random().toString(16).substr(2, 64);
            
            document.getElementById('transactionHash').textContent = `Transaction: ${hash}`;
            document.getElementById('notarizationResult').style.display = 'block';
            
            alert(`✅ Document notarized!\nFile: ${window.selectedFile.name}\nHash: ${hash}\n\n(Note: Real notarization requires blockchain transaction.)`);
        }
        
        // WalletConnect and Coinbase stubs
        function connectWalletConnect() {
            alert("WalletConnect integration coming soon!");
        }
        
        function connectCoinbase() {
            alert("Coinbase Wallet integration coming soon!");
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize chart
            initTradingView();
            
            // Set up event listeners
            document.getElementById('connectWalletBtn').addEventListener('click', openWalletModal);
            
            // Update total when amount or price changes
            document.getElementById('amountInput').addEventListener('input', updateTotal);
            document.getElementById('priceInput').addEventListener('input', updateTotal);
            
            // Check if already connected to MetaMask
            if (window.ethereum && window.ethereum.selectedAddress) {
                console.log("Already connected to MetaMask");
                connectMetaMask();
            }
            
            // Check every 5 seconds if MetaMask is installed
            const checkMetaMaskInterval = setInterval(() => {
                if (window.ethereum && !userAddress) {
                    // MetaMask is installed but not connected
                    console.log("MetaMask detected, but not connected");
                    clearInterval(checkMetaMaskInterval);
                }
            }, 5000);
        });
        
        function updateTotal() {
            const amount = document.getElementById('amountInput').value;
            const price = document.getElementById('priceInput').value;
            
            if (amount && price) {
                const total = (amount * price).toFixed(2);
                document.getElementById('totalInput').value = total;
            }
        }
        
        // Auto-refresh balances every 30 seconds
        setInterval(() => {
            if (userAddress) {
                console.log("Auto-refreshing balances...");
                loadBalances();
            }
        }, 30000);
        
        // Add debug info
        console.log("ZUZCOIN Universe Interface Loaded");
        console.log("ZUZ Token Address:", ZUZ_TOKEN_ADDRESS);
    </script>
</body>
</html>
HTML_EOF

echo "✅ Интерфейс обновлен!"
echo "📊 Теперь интерфейс будет показывать реальный баланс ZUZ из MetaMask"

# Перезапускаем сервер
echo "🚀 Перезапускаем сервер..."
pkill -f "node server" 2>/dev/null || true
sleep 2
node server.js > /tmp/zuzcoin_final.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > server.pid
sleep 3

echo ""
echo "=================================================="
echo "🎉 ИНТЕРФЕЙС ОБНОВЛЕН!"
echo "=================================================="
echo ""
echo "🌐 ОТКРОЙТЕ ССЫЛКУ:"
echo "https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev"
echo ""
echo "🎯 ДЕЙСТВИЯ ДЛЯ ПРОВЕРКИ:"
echo "1. Нажмите 'Connect Wallet' → выберите MetaMask"
echo "2. Подтвердите подключение в MetaMask"
echo "3. Убедитесь, что видите баланс ETH и 10,000,000 ZUZ"
echo "4. Проверьте разделы Token Factory и Digital Notary"
echo ""
echo "📊 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:"
echo "• В хедере появится ваш баланс ETH"
echo "• Рядом будет показано: 10,000,000 ZUZ"
echo "• Network будет показывать: Sepolia Testnet"
echo ""
echo "⚠️  ЕСЛИ БАЛАНС НЕ ПОКАЗЫВАЕТ:"
echo "1. Убедитесь что MetaMask подключен к Sepolia сети"
echo "2. Проверьте что в MetaMask видно 10M ZUZ"
echo "3. Обновите страницу интерфейса"
echo "=================================================="
