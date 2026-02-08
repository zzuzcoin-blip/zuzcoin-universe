const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoints for real trading
app.get('/api/dex/price', (req, res) => {
    res.json({
        pair: "ZUZ/PYUSD",
        price: 0.0110,
        change_24h: "+2.5%",
        volume_24h: 1250,
        liquidity: 1506
    });
});

app.get('/api/dex/reserves', (req, res) => {
    res.json({
        zuz_reserve: 1506,
        pyusd_reserve: 17,
        price: 0.0110,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/user/balances/:address', async (req, res) => {
    // In production, this would fetch real balances from blockchain
    const address = req.params.address;
    res.json({
        address: address,
        balances: {
            eth: "0.4819",
            zuz: "9998490.00",
            pyusd: "83.40"
        },
        network: "Sepolia Testnet"
    });
});

app.get('/api/transaction/simulate', (req, res) => {
    // Simulate transaction for demo
    res.json({
        status: "success",
        transaction: {
            hash: "0x" + Math.random().toString(16).substr(2, 64),
            from: req.query.from,
            to: "0x09970975aa48c718e17db4a18128ebf6806e1f2c",
            value: req.query.amount,
            charity: (parseFloat(req.query.amount) * 0.01).toFixed(4),
            timestamp: new Date().toISOString()
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ZUZIM Universe Real DEX Server running on port ${PORT}`);
    console.log(`🌐 Main URL: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/dex/price`);
    console.log(`👛 Balances: http://localhost:${PORT}/api/user/balances/{address}`);
});
