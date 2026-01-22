const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZUZCOIN ProofChain - Blockchain Philanthropy</title>
    <style>
        body { font-family: Arial; margin: 0; padding: 20px; background: #0a0e17; color: white; }
        .container { max-width: 1000px; margin: 0 auto; }
        header { text-align: center; padding: 40px 0; }
        h1 { color: #FFD700; font-size: 2.8em; margin: 0; }
        .subtitle { color: #aaa; font-size: 1.2em; margin: 10px 0 30px; }
        .card { background: rgba(255,255,255,0.05); border-radius: 15px; padding: 25px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.1); }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .service { background: rgba(255,255,255,0.07); padding: 20px; border-radius: 10px; text-align: center; }
        .price { background: rgba(255,215,0,0.15); display: inline-block; padding: 5px 15px; border-radius: 20px; margin: 10px 0; }
        .pledge { background: rgba(46, 125, 50, 0.2); border: 2px solid #4CAF50; }
        .status { display: inline-block; background: rgba(76, 175, 80, 0.2); color: #4CAF50; padding: 3px 10px; border-radius: 10px; }
        footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #888; }
        @media (max-width: 768px) {
            .services { grid-template-columns: 1fr; }
            h1 { font-size: 2em; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>ZUZCOIN PROOFCHAIN</h1>
            <div class="subtitle">Digital Notary • Coin Factory • Blockchain Philanthropy</div>
        </header>

        <div class="card">
            <h2>🚀 Get Started</h2>
            <p>Enter your project name to begin:</p>
            <input type="text" placeholder="Your Project Name" style="width:100%;padding:12px;border-radius:8px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);margin:10px 0;">
            <button style="background:linear-gradient(45deg,#FF6B6B,#FFD93D);color:white;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;width:100%;font-weight:bold;">Start Now</button>
        </div>

        <div class="services">
            <div class="service">
                <div style="font-size:2.5em">📝</div>
                <h3>Copyright Registration</h3>
                <div class="price">100 ZUZ</div>
                <p>Protect your intellectual property on blockchain</p>
            </div>
            <div class="service">
                <div style="font-size:2.5em">🪙</div>
                <h3>Create Cryptocurrency</h3>
                <div class="price">500 ZUZ</div>
                <p>Launch your token with 1% auto-donate to charity</p>
            </div>
            <div class="service">
                <div style="font-size:2.5em">💎</div>
                <h3>ZUZ Token</h3>
                <p>0x60cA3145F64919F26b47a2270F4cE36F239033e9</p>
                <p>Available on PancakeSwap & NOWPayments</p>
            </div>
        </div>

        <div class="card pledge">
            <h2 style="color:#4CAF50">🤝 For The Giving Pledge</h2>
            <p><strong>ZUZIM DEX Integration (Launching Q1 2024)</strong></p>
            <p>Every transaction on ZUZIM DEX includes 1% automatic donation to The Giving Pledge charities.</p>
            <ul>
                <li>✅ Transparent blockchain distribution</li>
                <li>✅ Real-time impact tracking</li>
                <li>✅ DAO governance for fund allocation</li>
                <li>✅ Automated, sustainable funding</li>
            </ul>
            <p><em>ZUZ = Ancient Jewish coin | Talmudic ethics of Tzedakah (charity)</em></p>
        </div>

        <div class="card">
            <h2>📊 Network Status</h2>
            <p>ZUZCOIN ProofChain: <span class="status">🟢 ONLINE</span> (Chain ID: 7777)</p>
            <p>Connected to: Binance Smart Chain, Ethereum Mainnet</p>
            <p>ZUZ Token (BSC): 0x60cA3145F64919F26b47a2270F4cE36F239033e9</p>
        </div>

        <div class="card">
            <h2>🎯 Why ZUZCOIN for The Giving Pledge?</h2>
            <p>1. <strong>Automated Funding:</strong> 1% from every transaction, 24/7</p>
            <p>2. <strong>Complete Transparency:</strong> Every donation on blockchain</p>
            <p>3. <strong>New Donor Base:</strong> Cryptocurrency community engagement</p>
            <p>4. <strong>Ethical Foundation:</strong> Talmudic principles of charity</p>
            <p>5. <strong>Zero Administrative Overhead:</strong> Smart contract automation</p>
        </div>

        <footer>
            <p>ZUZCOIN ProofChain © 2024 - Blockchain Philanthropy Platform</p>
            <p>Integrated with The Giving Pledge Philanthropy Initiative</p>
            <p><small>All prices in ZUZ tokens. Platform ready for integration.</small></p>
        </footer>
    </div>
</body>
</html>
    `);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'operational',
        platform: 'ZUZCOIN ProofChain',
        version: '1.0.0',
        chainId: 7777,
        services: {
            digital_notary: { active: true, price: '100 ZUZ' },
            coin_factory: { active: true, price: '500 ZUZ' },
            blockchain: { connected: true, networks: ['BSC', 'Ethereum'] }
        },
        philanthropy: {
            feature: '1% auto-donate',
            status: 'ready_for_integration',
            partner: 'The Giving Pledge',
            launch: 'Q1 2024'
        },
        token: {
            address: '0x60cA3145F64919F26b47a2270F4cE36F239033e9',
            network: 'Binance Smart Chain',
            symbol: 'ZUZ'
        }
    });
});

app.listen(PORT, () => {
    console.log('🚀 ZUZCOIN ProofChain running on port ' + PORT);
});
