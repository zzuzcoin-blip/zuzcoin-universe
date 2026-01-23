const express = require("express");
const Web3 = require("web3");
const app = express();
const PORT = process.env.PORT || 8080;

// Настройки блокчейна для разных окружений
const BLOCKCHAIN_CONFIGS = {
  // Production (Vercel) - используем Polygon Mumbai
  production: {
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001,
    networkName: "Polygon Mumbai Testnet",
    explorer: "https://mumbai.polygonscan.com",
    type: "public"
  },
  
  // Development (Replit) - используем Ganache
  development: {
    rpcUrl: "http://localhost:8547",
    chainId: 7777,
    networkName: "ZUZCOIN ProofChain",
    explorer: "http://localhost:8547",
    type: "local"
  }
};

// Определяем окружение
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const config = isVercel ? BLOCKCHAIN_CONFIGS.production : BLOCKCHAIN_CONFIGS.development;

// Инициализация Web3
let web3;
let blockchainConnected = false;

try {
  web3 = new Web3(config.rpcUrl);
  web3.eth.getBlockNumber().then(() => {
    console.log("✅ Connected to " + config.networkName);
    console.log("🌐 RPC: " + config.rpcUrl);
    blockchainConnected = true;
  }).catch(err => {
    console.log("⚠️  Blockchain warning: " + err.message);
    console.log("🔧 Using demo mode");
  });
} catch (error) {
  console.log("❌ Web3 init error: " + error.message);
}

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
app.get("/", (req, res) => {
  const currentUrl = isVercel ? 
    "https://zuzcoin-platform-roan-delta.vercel.app" : 
    req.protocol + "://" + req.get('host');
  
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ZUZCOIN Universe - ${isVercel ? 'Production' : 'Development'}</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
              font-family: 'Arial', sans-serif; 
              background: linear-gradient(135deg, #0a192f 0%, #1a1a2e 100%);
              color: white; 
              line-height: 1.6;
              min-height: 100vh;
              padding: 20px;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          
          .environment-badge {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 8px 16px;
              background: ${isVercel ? '#4CAF50' : '#FF9800'};
              border-radius: 20px;
              font-weight: bold;
              font-size: 12px;
              z-index: 1000;
          }
          
          header { 
              text-align: center; 
              padding: 40px 20px; 
              background: rgba(0, 0, 0, 0.3);
              border-radius: 20px;
              margin-bottom: 30px;
              border: 1px solid rgba(255, 215, 0, 0.3);
          }
          
          .universe-title {
              font-size: 3em;
              background: linear-gradient(45deg, #FFD93D, #FF6B6B);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 15px;
          }
          
          .card { 
              background: rgba(255, 255, 255, 0.05); 
              padding: 25px; 
              margin: 25px 0; 
              border-radius: 15px; 
              border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          button { 
              padding: 12px 24px; 
              background: linear-gradient(45deg, #FF6B6B, #FFD93D); 
              color: white; 
              border: none; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 16px;
              margin: 10px 5px;
          }
          
          .info-box {
              padding: 15px;
              border-radius: 10px;
              margin: 10px 0;
          }
          
          .success { background: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; }
          .warning { background: rgba(255, 152, 0, 0.2); border: 1px solid #FF9800; }
          .error { background: rgba(244, 67, 54, 0.2); border: 1px solid #F44336; }
          
          input {
              width: 100%;
              padding: 12px;
              margin: 10px 0;
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.1);
              color: white;
              border: 1px solid rgba(255, 255, 255, 0.2);
          }
      </style>
  </head>
  <body>
      <div class="environment-badge">
          ${isVercel ? '🚀 PRODUCTION' : '🔧 DEVELOPMENT'}
      </div>
      
      <div class="container">
          <header>
              <h1 class="universe-title">ZUZCOIN Universe</h1>
              <p>${isVercel ? 'Production Deployment' : 'Development Environment'}</p>
              
              <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin-top: 20px;">
                  <div><strong>🌐 URL:</strong> ${currentUrl}</div>
                  <div><strong>🔗 Network:</strong> ${config.networkName}</div>
                  <div><strong>🆔 Chain ID:</strong> ${config.chainId}</div>
                  <div><strong>📡 RPC:</strong> ${config.rpcUrl}</div>
                  <div><strong>⚡ Status:</strong> ${blockchainConnected ? '🟢 Connected' : '🟡 Demo Mode'}</div>
              </div>
          </header>
          
          <div class="card">
              <h2>📝 Digital Notary</h2>
              <div class="info-box ${blockchainConnected ? 'success' : 'warning'}">
                  ${blockchainConnected ? 
                    '✅ Blockchain connected. Ready for real registrations.' :
                    '🔧 Demo mode. In production, this would use real blockchain.'}
              </div>
              
              <input type="text" id="workTitle" placeholder="Enter work title">
              
              <button onclick="registerCopyright()">Register Copyright (100 ZUZ)</button>
              
              <div id="result" style="margin-top: 15px;"></div>
          </div>
          
          <div class="card">
              <h2>🎯 Next Steps</h2>
              <ol style="margin-left: 20px;">
                  <li><strong>Firebase Authentication</strong> - User registration & login</li>
                  <li><strong>KYC Verification</strong> - Identity verification</li>
                  <li><strong>Mobile App</strong> - React Native application</li>
                  <li><strong>Real Blockchain</strong> - Polygon Mainnet deployment</li>
              </ol>
              
              <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                  <h3>🚀 Ready for Firebase Auth</h3>
                  <p>Next we'll add:</p>
                  <ul style="margin-left: 20px;">
                      <li>Phone/Email registration</li>
                      <li>Email verification codes</li>
                      <li>KYC process with Sumsub</li>
                      <li>Personal wallet creation</li>
                  </ul>
              </div>
          </div>
      </div>

      <script>
          function showResult(message, type) {
              const element = document.getElementById('result');
              element.innerHTML = '<div class="info-box ' + type + '">' + message + '</div>';
          }
          
          function registerCopyright() {
              const title = document.getElementById('workTitle').value;
              if (!title) {
                  showResult('Please enter work title', 'error');
                  return;
              }
              
              showResult('Processing registration...', 'warning');
              
              // Демо-регистрация
              setTimeout(() => {
                  const txHash = '0x' + Date.now().toString(16) + 'abcd';
                  const message = ${isVercel} ? 
                      '✅ <strong>Copyright Registered!</strong><br>Work: "' + title + '"<br>🌐 <em>Production: Would be on Polygon Mumbai</em><br>Demo TX: ' + txHash :
                      '✅ <strong>Copyright Registered!</strong><br>Work: "' + title + '"<br>🔧 <em>Development: On local Ganache</em><br>Demo TX: ' + txHash;
                  
                  showResult(message, 'success');
              }, 1000);
          }
          
          // Показываем подсказку
          window.onload = function() {
              if(${isVercel}) {
                  showResult('🚀 <strong>Production Mode</strong><br>Next: Add Firebase Auth & KYC', 'warning');
              } else {
                  showResult('🔧 <strong>Development Mode</strong><br>Ganache blockchain is running locally', 'success');
              }
          };
      </script>
  </body>
  </html>
  `);
});

// ==================== API ENDPOINTS ====================
app.get("/api/status", (req, res) => {
  res.json({
    environment: isVercel ? "production" : "development",
    blockchain: {
      connected: blockchainConnected,
      network: config.networkName,
      chainId: config.chainId,
      rpcUrl: config.rpcUrl,
      type: config.type
    },
    timestamp: new Date().toISOString(),
    nextSteps: ["Firebase Auth", "KYC Verification", "Mobile App"]
  });
});

app.get("/health", (req, res) => {
  res.json({
    healthy: true,
    service: "ZUZCOIN Universe",
    environment: isVercel ? "production" : "development",
    url: isVercel ? "https://zuzcoin-platform-roan-delta.vercel.app" : "http://localhost:8080"
  });
});

// ==================== ЗАПУСК ====================
app.listen(PORT, () => {
  console.log(`
  ================================================
  🚀 ZUZCOIN UNIVERSE - ${isVercel ? 'PRODUCTION' : 'DEVELOPMENT'}
  ================================================
  
  🌐 Environment: ${isVercel ? 'Production (Vercel)' : 'Development (Replit)'}
  📡 Network: ${config.networkName}
  🆔 Chain ID: ${config.chainId}
  🔗 RPC: ${config.rpcUrl}
  ✅ Status: ${blockchainConnected ? 'Connected' : 'Demo Mode'}
  
  💡 Next: Firebase Authentication + KYC System
  ================================================
  `);
});

module.exports = app;
