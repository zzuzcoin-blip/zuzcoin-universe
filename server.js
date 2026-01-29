const express = require('express');
const net = require('net');
const path = require('path');
const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Идеология ZUZIM
const ZUZIM_IDEOLOGY = {
    core: "Talmudic Ethics in Blockchain",
    principles: [
        "ZUZ = Ancient silver coin of fair trade",
        "1% Auto-Philanthropy = Tzedakah (charity)",
        "Talmudic debate = Smart contract consensus",
        "Chessed (kindness) = Automated giving",
        "Beth Din courts = DAO governance"
    ]
};

// Находим свободный порт
function findFreePort(startPort = 3000) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findFreePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
    });
}

// ===== API ЭНДПОИНТЫ =====
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        project: 'ZUZCOIN Universe',
        phase: 4,
        phase_name: 'professional_interface_completed',
        ideology: ZUZIM_IDEOLOGY.core,
        mobile_support: true,
        features: [
            "Professional Bybit-style Interface",
            "Mobile Responsive Design",
            "Real MetaMask Integration",
            "ZUZIM DEX Ready",
            "Token Factory System",
            "Digital Notary System",
            "KYC Verification Levels"
        ],
        next_phase: "Phase 5 - Real Contract Deployment on Sepolia",
        timestamp: new Date().toISOString()
    });
});

app.get('/api/philanthropy', (req, res) => {
    res.json({
        total_donated: "124,507.00",
        currency: "USD",
        charities: [
            { name: "Talmudic Scholarship Fund", amount: "45,200.00", donations: 1245 },
            { name: "Community Development", amount: "38,750.00", donations: 987 },
            { name: "Environmental Projects", amount: "27,300.00", donations: 654 },
            { name: "Poverty Alleviation", amount: "13,257.00", donations: 321 }
        ],
        principle: "1% of all transactions auto-donated (Tzedakah)"
    });
});

app.get('/api/dex/pairs', (req, res) => {
    res.json({
        pairs: [
            { symbol: "ZUZ/ETH", price: "0.001543", change: "+2.34%", volume: "1.2M" },
            { symbol: "ZUZ/USDC", price: "1.8542", change: "+1.78%", volume: "850K" },
            { symbol: "ETH/USDC", price: "3204.56", change: "-0.45%", volume: "15.2M" },
            { symbol: "ZUZ/BTC", price: "0.000042", change: "+3.21%", volume: "450K" }
        ],
        last_updated: new Date().toISOString()
    });
});

app.get('/api/wallet/balance/:address', (req, res) => {
    const { address } = req.params;
    
    // Демо-балансы
    const demoBalances = {
        '0x742d35Cc6634C0532925a3b844Bc9e90F1aD04b5': {
            eth: "1.5423",
            zuz: "12500.45",
            usdc: "4500.00"
        },
        'demo': {
            eth: "2.1845",
            zuz: "8500.75",
            usdc: "3200.50"
        }
    };
    
    const balance = demoBalances[address] || {
        eth: "0.0000",
        zuz: "0.0000",
        usdc: "0.0000"
    };
    
    res.json({
        address: address,
        balances: balance,
        network: "Sepolia Testnet",
        timestamp: new Date().toISOString()
    });
});

// ===== ТЕСТОВЫЕ СТРАНИЦЫ =====
app.get('/test-mobile', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mobile Test - ZUZCOIN</title>
            <style>
                body { background: #0a0b0d; color: white; padding: 20px; font-family: Arial; }
                .test-card { background: #1e1f2e; padding: 20px; border-radius: 10px; margin: 10px 0; border: 2px solid #6c5dd3; }
                .success { color: #4CAF50; }
            </style>
        </head>
        <body>
            <h1>📱 Mobile Test Page</h1>
            <div class="test-card">
                <h3 class="success">✅ ZUZCOIN Mobile Interface Test</h3>
                <p>If you can see this page, the server is working correctly.</p>
                <p>Burger menu should be visible on mobile devices.</p>
            </div>
            <a href="/" style="color: #6c5dd3;">← Back to ZUZCOIN</a>
        </body>
        </html>
    `);
});

// ===== ГЛАВНАЯ СТРАНИЦА =====
app.get('/', (req, res) => {
    console.log('📄 Serving main index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== ЗАПУСК СЕРВЕРА =====
async function startServer() {
    try {
        const PORT = 5000;
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log('\n' + '='.repeat(60));
            console.log('🚀 ZUZCOIN UNIVERSE - PROFESSIONAL INTERFACE');
            console.log('='.repeat(60));
            console.log(`🌐 PORT: ${PORT}`);
            console.log(`📡 LOCAL: http://localhost:${PORT}`);
            console.log(`🌍 EXTERNAL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
            console.log('');
            console.log('📱 MOBILE FEATURES:');
            console.log('   • Responsive design (mobile/desktop)');
            console.log('   • Burger menu for mobile navigation');
            console.log('   • Touch-optimized interface');
            console.log('');
            console.log('🎯 IDEOLOGY:');
            console.log(`   ${ZUZIM_IDEOLOGY.core}`);
            console.log('');
            console.log('🔧 API ENDPOINTS:');
            console.log(`   • http://localhost:${PORT}/api/status`);
            console.log(`   • http://localhost:${PORT}/api/philanthropy`);
            console.log(`   • http://localhost:${PORT}/api/dex/pairs`);
            console.log('');
            console.log('='.repeat(60));
            
            // Сохраняем порт
            require('fs').writeFileSync('PORT.txt', PORT.toString());
        });
        
        return server;
    } catch (error) {
        console.error('❌ Startup error:', error);
        console.log('🔄 Retrying in 3 seconds...');
        setTimeout(startServer, 3000);
    }
}

// Запускаем сервер
startServer();
