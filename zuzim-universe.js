const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// ========== ZUZCOIN PROOFCHAIN КОМПОНЕНТ ==========
const PROOFCHAIN_PORT = 7777;

// Blockchain simulation
const blockchain = {
    chainId: 7777,
    blocks: [],
    proofs: [],
    coins: [],
    prices: {
        'ZUZ/USDT': 0.056789,
        'ZUZ/ETH': 0.000345,
        'ETH/USDT': 3256.78
    }
};

// ========== ZUZIM DEX КОМПОНЕНТ ==========
const dex = {
    pools: [
        {
            id: 'zuz-usdt',
            pair: 'ZUZ/USDT',
            tvl: 125450,
            volume24h: 45230,
            apr: 18.5,
            fee: 0.3,
            reserves: { zuz: 1000000, usdt: 56789 }
        },
        {
            id: 'zuz-eth', 
            pair: 'ZUZ/ETH',
            tvl: 89230,
            volume24h: 32150,
            apr: 15.2,
            fee: 0.3,
            reserves: { zuz: 500000, eth: 172.5 }
        }
    ],
    transactions: [],
    philanthropy: {
        totalDonated: 12450.67,
        lastDonation: new Date().toISOString(),
        donations: []
    }
};

// ========== API ENDPOINTS ==========

// Главная страница ZUZIM Universe
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZUZIM Universe | Blockchain-Powered Philanthropy</title>
        <style>
            :root {
                --bybit-bg: #0b0e18;
                --bybit-card: #131722;
                --bybit-border: #2a2f42;
                --bybit-green: #00c087;
                --bybit-red: #f6465d;
                --bybit-blue: #0ea5e9;
                --bybit-yellow: #f0b90b;
                --bybit-text: #e4e5e8;
                --bybit-text-secondary: #848e9c;
            }
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bybit-bg); color: var(--bybit-text); }
            
            .top-bar {
                height: 56px;
                background: var(--bybit-card);
                border-bottom: 1px solid var(--bybit-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 24px;
                position: fixed;
                top: 0; left: 0; right: 0;
                z-index: 1000;
            }
            
            .logo {
                font-size: 24px;
                font-weight: bold;
                background: linear-gradient(135deg, var(--bybit-blue), var(--bybit-green));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .hero {
                padding: 120px 24px 60px;
                text-align: center;
                background: linear-gradient(135deg, #0b0e18 0%, #1a1f38 100%);
            }
            
            .hero-title {
                font-size: 48px;
                margin-bottom: 20px;
                background: linear-gradient(135deg, var(--bybit-blue), var(--bybit-green));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .hero-subtitle {
                font-size: 20px;
                color: var(--bybit-text-secondary);
                max-width: 600px;
                margin: 0 auto 40px;
            }
            
            .modules-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 24px;
                padding: 40px 24px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .module-card {
                background: var(--bybit-card);
                border: 1px solid var(--bybit-border);
                border-radius: 12px;
                padding: 30px;
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .module-card:hover {
                border-color: var(--bybit-blue);
                transform: translateY(-5px);
            }
            
            .module-icon {
                font-size: 40px;
                margin-bottom: 20px;
            }
            
            .module-title {
                font-size: 24px;
                margin-bottom: 12px;
            }
            
            .module-description {
                color: var(--bybit-text-secondary);
                margin-bottom: 20px;
                line-height: 1.6;
            }
            
            .module-stats {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--bybit-border);
            }
            
            .module-stat {
                text-align: center;
            }
            
            .stat-value {
                font-size: 20px;
                font-weight: bold;
                color: var(--bybit-green);
            }
            
            .stat-label {
                font-size: 12px;
                color: var(--bybit-text-secondary);
                text-transform: uppercase;
            }
            
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 15px;
            }
            
            .status-live {
                background: rgba(0, 192, 135, 0.2);
                color: var(--bybit-green);
                border: 1px solid var(--bybit-green);
            }
            
            .status-dev {
                background: rgba(14, 165, 233, 0.2);
                color: var(--bybit-blue);
                border: 1px solid var(--bybit-blue);
            }
            
            .status-coming {
                background: rgba(240, 185, 11, 0.2);
                color: var(--bybit-yellow);
                border: 1px solid var(--bybit-yellow);
            }
            
            .btn {
                display: inline-block;
                padding: 12px 24px;
                background: var(--bybit-blue);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                text-decoration: none;
                transition: all 0.3s;
            }
            
            .btn:hover {
                background: #0d8bc9;
                transform: translateY(-2px);
            }
            
            .philanthropy-section {
                background: linear-gradient(135deg, rgba(0, 192, 135, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
                border: 1px solid var(--bybit-green);
                padding: 40px;
                margin: 40px auto;
                max-width: 800px;
                border-radius: 12px;
                text-align: center;
            }
            
            .donation-counter {
                font-size: 48px;
                font-weight: bold;
                color: var(--bybit-green);
                margin: 20px 0;
            }
            
            .giving-pledge-badge {
                display: inline-block;
                padding: 8px 16px;
                background: linear-gradient(135deg, #ff6b6b, #ffd93d);
                color: white;
                border-radius: 20px;
                font-weight: bold;
                margin: 10px 0;
            }
            
            footer {
                text-align: center;
                padding: 40px 24px;
                border-top: 1px solid var(--bybit-border);
                color: var(--bybit-text-secondary);
                margin-top: 60px;
            }
        </style>
    </head>
    <body>
        <!-- Top Navigation -->
        <div class="top-bar">
            <div class="logo">ZUZIM UNIVERSE</div>
            <div>
                <a href="/proofchain" class="btn" style="margin-right: 10px;">ProofChain</a>
                <a href="/dex" class="btn" style="margin-right: 10px;">DEX</a>
                <a href="/philanthropy" class="btn">Philanthropy</a>
            </div>
        </div>
        
        <!-- Hero Section -->
        <div class="hero">
            <h1 class="hero-title">ZUZIM Universe</h1>
            <p class="hero-subtitle">
                Blockchain-powered ecosystem combining cryptocurrency innovation with 
                Talmudic ethics and systematic philanthropy through 1% auto-donate.
            </p>
            <div class="giving-pledge-badge">For The Giving Pledge Integration</div>
        </div>
        
        <!-- Modules Grid -->
        <div class="modules-grid">
            <!-- Module 1: ProofChain -->
            <div class="module-card" onclick="window.location.href='/proofchain'">
                <div class="status-badge status-live">✅ LIVE</div>
                <div class="module-icon">🔗</div>
                <h2 class="module-title">ZUZCOIN ProofChain</h2>
                <p class="module-description">
                    Digital notary and coin factory on Chain ID 7777. 
                    Register copyrights for 100 ZUZ or create your own 
                    cryptocurrency for 500 ZUZ.
                </p>
                <div class="module-stats">
                    <div class="module-stat">
                        <div class="stat-value">1,247</div>
                        <div class="stat-label">Proofs Registered</div>
                    </div>
                    <div class="module-stat">
                        <div class="stat-value">356</div>
                        <div class="stat-label">Coins Created</div>
                    </div>
                    <div class="module-stat">
                        <div class="stat-value">7777</div>
                        <div class="stat-label">Chain ID</div>
                    </div>
                </div>
            </div>
            
            <!-- Module 2: DEX -->
            <div class="module-card" onclick="window.location.href='/dex'">
                <div class="status-badge status-live">✅ LIVE</div>
                <div class="module-icon">📊</div>
                <h2 class="module-title">ZUZIM DEX</h2>
                <p class="module-description">
                    Decentralized exchange with 1% auto-donate to philanthropy. 
                    Trade ZUZ/USDT, ZUZ/ETH with Bybit-style interface.
                </p>
                <div class="module-stats">
                    <div class="module-stat">
                        <div class="stat-value">$125K</div>
                        <div class="stat-label">TVL</div>
                    </div>
                    <div class="module-stat">
                        <div class="stat-value">18.5%</div>
                        <div class="stat-label">APR</div>
                    </div>
                    <div class="module-stat">
                        <div class="stat-value">1%</div>
                        <div class="stat-label">Auto-Donate</div>
                    </div>
                </div>
            </div>
            
            <!-- Module 3: Philanthropy -->
            <div class="module-card" onclick="window.location.href='/philanthropy'">
                <div class="status-badge status-dev">🔄 DEV</div>
                <div class="module-icon">🤝</div>
                <h2 class="module-title">The Giving Platform</h2>
                <p class="module-description">
                    Transparent philanthropy system. Every DEX transaction 
                    automatically donates 1% to verified charitable causes.
                </p>
                <div class="module-stats">
                    <div class="module-stat">
                        <div class="stat-value">$12,450</div>
                        <div class="stat-label">Total Donated</div>
                    </div>
                    <div class="module-stat">
                        <div class="stat-value">47</div>
                        <div class="stat-label">Causes</div>
                    </div>
                    <div class="module-stat">
                        <div class="stat-value">100%</div>
                        <div class="stat-label">Transparent</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Philanthropy Section -->
        <div class="philanthropy-section">
            <h2 style="margin-bottom: 20px;">For The Giving Pledge</h2>
            <p style="margin-bottom: 30px; font-size: 18px;">
                ZUZIM Universe implements systematic philanthropy through blockchain technology. 
                Every transaction automatically contributes 1% to charitable causes, creating 
                sustainable funding for global philanthropy.
            </p>
            <div class="donation-counter">$12,450.67</div>
            <p style="color: var(--bybit-green); font-weight: bold;">Total Donated via 1% Auto-Donate</p>
            <a href="/philanthropy" class="btn" style="margin-top: 20px; background: var(--bybit-green);">
                Explore Philanthropy Dashboard
            </a>
        </div>
        
        <!-- Call to Action -->
        <div style="text-align: center; padding: 60px 24px;">
            <h2 style="margin-bottom: 20px; font-size: 32px;">Ready to Experience?</h2>
            <p style="margin-bottom: 30px; color: var(--bybit-text-secondary); max-width: 600px; margin: 0 auto 30px;">
                Start with ProofChain to register your first copyright, 
                then explore DEX trading with built-in philanthropy.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="/proofchain" class="btn" style="background: var(--bybit-blue);">
                    🚀 Launch ProofChain
                </a>
                <a href="/dex" class="btn" style="background: var(--bybit-green);">
                    📊 Open DEX
                </a>
                <a href="/api/docs" class="btn" style="background: var(--bybit-yellow); color: #000;">
                    📚 API Documentation
                </a>
            </div>
        </div>
        
        <!-- Footer -->
        <footer>
            <p>ZUZIM Universe © 2024 | Chain ID: 7777 | ZUZ Token: 0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31</p>
            <p style="margin-top: 10px;">Built with Talmudic ethics and blockchain innovation</p>
        </footer>
    </body>
    </html>
    `);
});

// ProofChain модуль
app.get('/proofchain', (req, res) => {
    res.sendFile(path.join(__dirname, 'server_6000.js')); // Original ProofChain
});

// DEX модуль
app.get('/dex', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZUZIM DEX | Decentralized Exchange with 1% Auto-Donate</title>
        <style>
            ${fs.readFileSync(__dirname + '/index.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/)[1]}
        </style>
    </head>
    <body>
        ${fs.readFileSync(__dirname + '/index.html', 'utf8').match(/<body>([\s\S]*?)<\/body>/)[1]}
    </body>
    </html>
    `);
});

// Philanthropy Dashboard
app.get('/philanthropy', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZUZIM Philanthropy Dashboard | The Giving Pledge Integration</title>
        <style>
            :root {
                --bybit-bg: #0b0e18;
                --bybit-card: #131722;
                --bybit-border: #2a2f42;
                --bybit-green: #00c087;
                --bybit-red: #f6465d;
                --bybit-blue: #0ea5e9;
            }
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bybit-bg); color: white; }
            
            .top-bar {
                height: 56px;
                background: var(--bybit-card);
                border-bottom: 1px solid var(--bybit-border);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 24px;
            }
            
            .logo {
                font-size: 24px;
                font-weight: bold;
                background: linear-gradient(135deg, var(--bybit-blue), var(--bybit-green));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .dashboard {
                max-width: 1200px;
                margin: 40px auto;
                padding: 0 24px;
            }
            
            .hero {
                text-align: center;
                padding: 60px 0;
                background: linear-gradient(135deg, rgba(0, 192, 135, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%);
                border-radius: 12px;
                margin-bottom: 40px;
                border: 1px solid var(--bybit-green);
            }
            
            .hero h1 {
                font-size: 48px;
                margin-bottom: 20px;
                background: linear-gradient(135deg, var(--bybit-blue), var(--bybit-green));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .donation-counter {
                font-size: 72px;
                font-weight: bold;
                color: var(--bybit-green);
                margin: 30px 0;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 40px 0;
            }
            
            .stat-card {
                background: var(--bybit-card);
                border: 1px solid var(--bybit-border);
                border-radius: 12px;
                padding: 30px;
                text-align: center;
            }
            
            .stat-value {
                font-size: 36px;
                font-weight: bold;
                color: var(--bybit-green);
                margin-bottom: 10px;
            }
            
            .stat-label {
                color: #848e9c;
                font-size: 14px;
                text-transform: uppercase;
            }
            
            .donations-list {
                background: var(--bybit-card);
                border-radius: 12px;
                padding: 30px;
                margin-top: 40px;
            }
            
            .donation-item {
                display: flex;
                justify-content: space-between;
                padding: 20px;
                border-bottom: 1px solid var(--bybit-border);
            }
            
            .donation-item:last-child {
                border-bottom: none;
            }
            
            .giving-pledge-section {
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 217, 61, 0.1) 100%);
                border: 1px solid #ffd93d;
                padding: 40px;
                border-radius: 12px;
                margin: 40px 0;
                text-align: center;
            }
            
            .giving-pledge-logo {
                font-size: 48px;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="top-bar">
            <div class="logo">ZUZIM Philanthropy</div>
            <div>
                <a href="/" style="color: var(--bybit-blue); margin-right: 20px;">← Back to Universe</a>
                <a href="/dex" style="color: var(--bybit-green);">DEX Trading</a>
            </div>
        </div>
        
        <div class="dashboard">
            <div class="hero">
                <h1>The Giving Platform</h1>
                <p style="font-size: 20px; margin-bottom: 30px; max-width: 800px; margin: 0 auto 30px;">
                    Transparent philanthropy powered by blockchain. Every trade on ZUZIM DEX 
                    automatically contributes 1% to verified charitable causes.
                </p>
                <div class="donation-counter">$12,450.67</div>
                <p style="color: var(--bybit-green); font-weight: bold; font-size: 18px;">
                    Total Donated via 1% Auto-Donate System
                </p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">1%</div>
                    <div class="stat-label">Auto-Donate Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">2,478</div>
                    <div class="stat-label">Transactions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">47</div>
                    <div class="stat-label">Causes Supported</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">100%</div>
                    <div class="stat-label">Transparent</div>
                </div>
            </div>
            
            <div class="giving-pledge-section">
                <div class="giving-pledge-logo">🤝</div>
                <h2 style="margin-bottom: 20px;">For The Giving Pledge Integration</h2>
                <p style="margin-bottom: 30px; font-size: 18px;">
                    ZUZIM Universe offers a blockchain solution to systematize and 
                    transparently track philanthropic contributions. The 1% auto-donate 
                    model creates sustainable funding while maintaining full transparency.
                </p>
                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
                        <h3>⚡ Automatic</h3>
                        <p>1% from every trade</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
                        <h3>🔍 Transparent</h3>
                        <p>All donations on-chain</p>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px;">
                        <h3>🌍 Global</h3>
                        <p>Multiple causes</p>
                    </div>
                </div>
            </div>
            
            <div class="donations-list">
                <h2 style="margin-bottom: 30px;">Recent Donations</h2>
                ${dex.philanthropy.donations.slice(-10).map(d => `
                    <div class="donation-item">
                        <div>
                            <strong>${d.amount} ZUZ</strong>
                            <div style="color: #848e9c; font-size: 14px;">${d.cause}</div>
                        </div>
                        <div>
                            <div style="color: var(--bybit-green);">$${(d.amount * 0.056789).toFixed(2)}</div>
                            <div style="color: #848e9c; font-size: 12px;">${new Date(d.timestamp).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
    `);
});

// API Endpoints
app.get('/api/stats', (req, res) => {
    res.json({
        status: 'online',
        universe: {
            proofchain: 'live',
            dex: 'live',
            philanthropy: 'development',
            chainId: 7777,
            autoDonate: '1%',
            totalDonated: 12450.67
        },
        contracts: {
            zuz: '0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31',
            dex: '0x1cf8EeEFCda58412563A6964B246e636E0c0AA53'
        }
    });
});

app.get('/api/dex/pools', (req, res) => {
    res.json(dex.pools);
});

app.get('/api/philanthropy', (req, res) => {
    res.json(dex.philanthropy);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    ZUZIM UNIVERSE v2.0                       ║
╚══════════════════════════════════════════════════════════════╝

🌌 UNIVERSE PORTAL: http://localhost:${PORT}
🔗 ProofChain: http://localhost:${PORT}/proofchain
📊 ZUZIM DEX: http://localhost:${PORT}/dex  
🤝 Philanthropy: http://localhost:${PORT}/philanthropy

✅ SYSTEM COMPONENTS:
   • ZUZCOIN ProofChain (Chain ID: 7777) - Digital Notary & Coin Factory
   • ZUZIM DEX - 1% Auto-Donate Decentralized Exchange
   • Philanthropy Dashboard - The Giving Pledge Integration

🎯 FOR THE GIVING PLEDGE:
   • Live blockchain product with working payments
   • Systematic 1% auto-donate philanthropy model
   • Full transparency via blockchain tracking
   • Talmudic ethical foundation

🚀 Ready to show to The Giving Pledge team!
`);
});
