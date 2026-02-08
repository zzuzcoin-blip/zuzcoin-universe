const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Главная страница (Dashboard)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ZUZIM DEX страница
app.get('/dex', (req, res) => {
    res.sendFile(__dirname + '/dex.html');
});

// API статус
app.get('/api/status', (req, res) => {
    res.json({
        status: "online",
        ecosystem: "ZUZCOIN Universe v3.0",
        network: "Sepolia Testnet",
        chainId: 11155111,
        contract: "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
        dex: "ZUZIM DEX Active",
        features: ["ZUZCOIN Token", "ZUZIM DEX", "Token Factory", "Digital Notary", "KYC", "1% Auto-Philanthropy"],
        timestamp: new Date().toISOString()
    });
});

// API баланса
app.get('/api/balance/:address', async (req, res) => {
    try {
        const ethers = require('ethers');
        const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
        const contract = new ethers.Contract(
            "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
            ["function balanceOf(address) view returns (uint256)"],
            provider
        );
        const balance = await contract.balanceOf(req.params.address);
        res.json({
            address: req.params.address,
            balanceWei: balance.toString(),
            balanceZUZ: ethers.utils.formatUnits(balance, 18),
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Статические файлы
app.use(express.static(__dirname));

app.listen(port, () => {
    console.log(`🚀 ZUZCOIN Universe Server v2.0`);
    console.log(`📊 Dashboard: http://localhost:${port}/`);
    console.log(`🔄 ZUZIM DEX: http://localhost:${port}/dex`);
    console.log(`🌐 Network: Sepolia Testnet`);
    console.log(`❤️  1% Auto-Philanthropy Active`);
});
