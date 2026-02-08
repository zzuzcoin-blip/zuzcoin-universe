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

// API endpoints
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        project: 'ZUZCOIN Universe',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        contracts: {
            zuz_token: '0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3',
            pyusd_token: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9',
            dex_contract: '0x09970975aa48c718e17db4a18128ebf6806e1f2c',
            network: 'Sepolia Testnet'
        },
        features: [
            'Real DEX Trading',
            '1% Auto-Donation',
            'MetaMask Integration',
            'Token Factory',
            'Digital Notary',
            'ProofChain Ecosystem'
        ]
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║ 🚀 ZUZCOIN UNIVERSE - REAL DEX TRADING              ║');
    console.log('║                                                     ║');
    console.log(`║ 🌐 URL: http://localhost:${PORT}                          ║`);
    console.log(`║ 📊 API: http://localhost:${PORT}/api/status               ║`);
    console.log('║                                                     ║');
    console.log('║ 🔗 REAL CONTRACTS ON SEPOLIA:                       ║');
    console.log('║   • ZUZ Token: 0x4284ecC7E6E560cAfc0bA65CbDFc9c19b  ║');
    console.log('║   • DEX Contract: 0x09970975aa48c718e17db4a18128eb  ║');
    console.log('║   • PYUSD Token: 0xCaC524BcA292aaade2DF8A05cC58F0   ║');
    console.log('║                                                     ║');
    console.log('║ 💝 Every trade automatically donates 1% to charity  ║');
    console.log('╚══════════════════════════════════════════════════════╝');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

// Mobile test endpoint
app.get('/mobile-check', (req, res) => {
    res.json({
        mobile_ready: true,
        viewport: 'width=device-width, initial-scale=1.0',
        media_queries: ['768px', '480px', '360px'],
        timestamp: new Date().toISOString(),
        index_html_updated: fs.statSync('index.html').mtime
    });
});
