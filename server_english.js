const express = require('express');
const app = express();
const PORT = 8080;

// Main page (English)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZUZCOIN ProofChain - Digital Notary & Coin Factory</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { text-align: center; padding: 40px 20px; }
        .logo { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px; }
        .logo-img { width: 80px; height: 80px; border-radius: 50%; border: 3px solid #ffd93d; }
        .main-title { font-size: 2.5em; color: #ffd93d; margin: 0; }
        .tagline { font-size: 1.2em; opacity: 0.9; margin-bottom: 30px; }
        .nav-buttons { display: flex; gap: 15px; justify-content: center; margin: 30px 0; flex-wrap: wrap; }
        .nav-button { padding: 12px 20px; background: rgba(255, 255, 255, 0.1); color: white; text-decoration: none; border-radius: 10px; transition: all 0.3s; }
        .nav-button:hover { background: rgba(255, 255, 255, 0.2); }
        .card { background: rgba(255, 255, 255, 0.08); padding: 25px; margin: 20px 0; border-radius: 15px; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 30px 0; }
        .service-card { background: rgba(255, 255, 255, 0.08); padding: 25px; border-radius: 15px; text-align: center; }
        .price-tag { background: rgba(255, 215, 0, 0.2); padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; display: inline-block; }
        button, .button { width: 100%; padding: 12px; background: linear-gradient(45deg, #ff6b6b, #ffd93d); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 10px 0; }
        .giving-pledge { background: rgba(0, 100, 0, 0.2); border: 2px solid #4CAF50; }
        .giving-pledge h2 { color: #4CAF50; }
        footer { text-align: center; padding: 30px 20px; margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
        @media (max-width: 768px) {
            .main-title { font-size: 2em; }
            .nav-buttons { flex-direction: column; align-items: center; }
            .nav-button { width: 100%; max-width: 250px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <div class="logo-img">
                    <img src="https://i.ibb.co/XrtMMvSn/Zuz.png" alt="ZUZCOIN" style="width:100%;height:100%;border-radius:50%;">
                </div>
                <h1 class="main-title">ZUZCOIN PROOFCHAIN</h1>
            </div>
            <div class="tagline">
                Digital Notary • Coin Factory • Blockchain Philanthropy
            </div>
            
            <div class="nav-buttons">
                <a href="#services" class="nav-button">🚀 Services</a>
                <a href="#coin-creator" class="nav-button">🪙 Create Coin</a>
                <a href="#giving-pledge" class="nav-button">🤝 Philanthropy</a>
            </div>
        </header>

        <!-- Quick Start -->
        <div class="card">
            <h2>🚀 Quick Start</h2>
            <p>Start protecting your intellectual property or create your own cryptocurrency in minutes.</p>
            <input type="text" placeholder="Enter your project name..." style="width:100%;padding:12px;border-radius:8px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);margin:15px 0;">
        </div>

        <!-- Services -->
        <div class="services" id="services">
            <div class="service-card">
                <div style="font-size:2.5em;margin-bottom:10px">📝</div>
                <h3>Copyright Registration</h3>
                <div class="price-tag">100 ZUZ</div>
                <p>Protect your ideas, code, designs, and content on the blockchain.</p>
                <button onclick="showCopyrightForm()">📝 Register Copyright</button>
            </div>
            
            <div class="service-card">
                <div style="font-size:2.5em;margin-bottom:10px">🪙</div>
                <h3>Create Cryptocurrency</h3>
                <div class="price-tag">500 ZUZ</div>
                <p>Launch your own token with blockchain patent and marketing guide.</p>
                <button onclick="showCoinCreator()">🪙 Create Coin</button>
            </div>
            
            <div class="service-card">
                <div style="font-size:2.5em;margin-bottom:10px">💳</div>
                <h3>ZUZ Wallet</h3>
                <p>Buy ZUZ tokens to use ProofChain services.</p>
                <button onclick="showWallet()">💳 Open Wallet</button>
            </div>
        </div>

        <!-- Coin Creator -->
        <div class="card" id="coin-creator" style="display:none;">
            <h2>🪙 Create Your Cryptocurrency</h2>
            <input type="text" placeholder="Coin Name (e.g., MyToken)" style="width:100%;padding:12px;margin:10px 0;border-radius:8px;background:rgba(255,255,255,0.1);color:white;">
            <input type="text" placeholder="Symbol (e.g., MTK)" style="width:100%;padding:12px;margin:10px 0;border-radius:8px;background:rgba(255,255,255,0.1);color:white;">
            <input type="number" placeholder="Total Supply" style="width:100%;padding:12px;margin:10px 0;border-radius:8px;background:rgba(255,255,255,0.1);color:white;">
            <button>🪙 Create Coin (500 ZUZ)</button>
        </div>

        <!-- For The Giving Pledge -->
        <div class="card giving-pledge" id="giving-pledge">
            <h2>🤝 For The Giving Pledge</h2>
            <p><strong>ZUZIM DEX Integration (Coming Q1 2024)</strong></p>
            <p>When ZUZIM DEX launches, 1% of every transaction will be automatically donated to The Giving Pledge charities.</p>
            
            <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:10px;margin:15px 0;">
                <h3>How It Works:</h3>
                <ul style="text-align:left;">
                    <li>✅ User creates coin on ProofChain (500 ZUZ)</li>
                    <li>✅ Coin is automatically listed on ZUZIM DEX</li>
                    <li>✅ Every trade includes 1% auto-donate</li>
                    <li>✅ Funds are transparently distributed via blockchain</li>
                    <li>✅ Real-time tracking of philanthropic impact</li>
                </ul>
            </div>
            
            <div style="text-align:center;margin:20px 0;">
                <p><strong>ZUZ = Ancient Jewish coin | Talmudic ethics of Tzedakah (charity)</strong></p>
                <p>Combining blockchain technology with millennia-old philanthropic principles.</p>
            </div>
        </div>

        <!-- Network Status -->
        <div class="card">
            <h2>📊 Network Status</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:15px 0;">
                <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:10px;">
                    <strong>ZUZCOIN ProofChain</strong><br>
                    <span style="color:#4CAF50;">🟢 ONLINE</span><br>
                    Chain ID: 7777
                </div>
                <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:10px;">
                    <strong>ZUZ Token (BSC)</strong><br>
                    <span style="color:#4CAF50;">🟢 ACTIVE</span><br>
                    0x60cA3145F64919F26b47a2270F4cE36F239033e9
                </div>
            </div>
            <button onclick="showNetworkStatus()">📊 View Detailed Status</button>
        </div>

        <footer>
            <p>ZUZCOIN ProofChain © 2024 - Blockchain Philanthropy Platform</p>
            <p style="margin-top:10px;opacity:0.7;">
                Integrated with The Giving Pledge Philanthropy Initiative<br>
                <small>All prices in ZUZ tokens. ZUZ available on PancakeSwap and NOWPayments.</small>
            </p>
        </footer>
    </div>

    <script>
        function showCopyrightForm() {
            alert("Copyright Registration: 100 ZUZ\n\nThis feature is fully functional in the complete ZUZCOIN ProofChain system.");
        }
        
        function showCoinCreator() {
            document.getElementById('coin-creator').style.display = 'block';
            window.scrollTo({top: document.getElementById('coin-creator').offsetTop - 100, behavior: 'smooth'});
        }
        
        function showWallet() {
            alert("ZUZ Wallet\n\nBalance: 0 ZUZ\n\nZUZ tokens are required for ProofChain services.\nAvailable on PancakeSwap and NOWPayments.");
        }
        
        function showNetworkStatus() {
            alert("Network Status\n\n🔗 ZUZCOIN ProofChain: ONLINE (Chain ID: 7777)\n🔗 Binance Smart Chain: CONNECTED\n🔗 Ethereum: CONNECTED\n\n1% Auto-Donate: Ready for Giving Pledge Integration");
        }
        
        // Auto-scroll to Giving Pledge section
        window.onload = function() {
            if(window.location.hash === '#giving-pledge') {
                document.getElementById('giving-pledge').scrollIntoView();
            }
        };
    </script>
</body>
</html>
    `);
});

// API endpoint for The Giving Pledge
app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        platform: 'ZUZCOIN ProofChain',
        chainId: 7777,
        services: {
            digital_notary: { price: '100 ZUZ', status: 'active' },
            coin_factory: { price: '500 ZUZ', status: 'active' },
            blockchain: { status: 'connected', networks: ['BSC', 'Ethereum'] }
        },
        philanthropy: {
            feature: '1% auto-donate',
            status: 'development',
            launch: 'Q1 2024',
            giving_pledge: 'integration_proposed'
        }
    });
});

// Simple health check
app.get('/health', (req, res) => {
    res.send('ZUZCOIN ProofChain: ONLINE');
});

app.listen(PORT, () => {
    console.log(`✅ ZUZCOIN ProofChain (English) running on port ${PORT}`);
    console.log(`🌐 Main Page: http://localhost:${PORT}`);
    console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
    console.log(`🎯 For The Giving Pledge: Ready for demonstration`);
});
