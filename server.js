const express = require("express");
const Web3 = require("web3");
const { getBlockchainConfig } = require("./blockchain-config");
const app = express();
const PORT = process.env.PORT || 3000;

// CORS для Vercel
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Инициализация Web3 с правильным RPC
const blockchainConfig = getBlockchainConfig();
const web3 = new Web3(blockchainConfig.rpcUrl);

console.log(`✅ Connected to: ${blockchainConfig.networkName}`);
console.log(`🌐 RPC URL: ${blockchainConfig.rpcUrl}`);
console.log(`🆔 Chain ID: ${blockchainConfig.chainId}`);

// Демо-режим для Vercel (без реальных транзакций)
let demoMode = process.env.VERCEL ? true : false;

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ZUZCOIN Universe - Production</title>
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
          
          .status-indicator {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-right: 8px;
          }
          
          .online { background: #4CAF50; }
          .offline { background: #F44336; }
          
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
              transition: all 0.3s;
          }
          
          .demo-notice {
              background: rgba(255, 152, 0, 0.2);
              border: 1px solid #FF9800;
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <header>
              <h1 class="universe-title">ZUZCOIN Universe</h1>
              <p>Production Deployment • ${blockchainConfig.networkName}</p>
              
              <div style="display: flex; justify-content: center; gap: 30px; margin: 30px 0; flex-wrap: wrap;">
                  <div style="text-align: center;">
                      <div style="font-size: 2.5em">🔗</div>
                      <h3>ProofChain</h3>
                      <p><span class="status-indicator online"></span> ${demoMode ? 'Demo Mode' : 'Connected'}</p>
                  </div>
                  
                  <div style="text-align: center;">
                      <div style="font-size: 2.5em">🔄</div>
                      <h3>ZUZIM DEX</h3>
                      <p><span class="status-indicator online"></span> Ready</p>
                  </div>
                  
                  <div style="text-align: center;">
                      <div style="font-size: 2.5em">🤝</div>
                      <h3>Giving Pledge</h3>
                      <p><span class="status-indicator online"></span> Integrated</p>
                  </div>
              </div>
              
              <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 15px; margin-top: 20px;">
                  <div><strong>🌐 Network:</strong> ${blockchainConfig.networkName}</div>
                  <div><strong>🆔 Chain ID:</strong> ${blockchainConfig.chainId}</div>
                  <div><strong>🔗 Explorer:</strong> ${blockchainConfig.explorer}</div>
                  <div><strong>📡 Status:</strong> <span id="blockchainStatus">🟢 Operational</span></div>
              </div>
          </header>

          ${demoMode ? `
          <div class="demo-notice">
              <h3>🚀 DEMO MODE ACTIVATED</h3>
              <p>This is a production demo on <strong>${blockchainConfig.networkName}</strong>.</p>
              <p>Next: Connect real blockchain, add Firebase Auth, implement KYC.</p>
          </div>
          ` : ''}

          <div class="card">
              <h2>🔗 ProofChain Services</h2>
              <p>Register copyrights and create tokens on blockchain</p>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                  <div style="padding: 20px; background: rgba(255,255,255,0.07); border-radius: 10px;">
                      <h3>📝 Digital Notary</h3>
                      <p><strong>100 ZUZ</strong> per registration</p>
                      <input type="text" id="workTitle" placeholder="Work title" style="width:100%;padding:10px;margin:10px 0;border-radius:5px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);">
                      <button onclick="registerDemo()">Register Copyright</button>
                      <div id="result1" style="margin-top:10px;"></div>
                  </div>
                  
                  <div style="padding: 20px; background: rgba(255,255,255,0.07); border-radius: 10px;">
                      <h3>🪙 Coin Factory</h3>
                      <p><strong>500 ZUZ</strong> per token</p>
                      <input type="text" id="tokenName" placeholder="Token name" style="width:100%;padding:10px;margin:10px 0;border-radius:5px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.2);">
                      <button onclick="createTokenDemo()">Create Token</button>
                      <div id="result2" style="margin-top:10px;"></div>
                  </div>
              </div>
          </div>
          
          <div class="card">
              <h2>📊 System Status</h2>
              <div id="statusInfo">Loading blockchain info...</div>
              <button onclick="checkStatus()">Refresh Status</button>
          </div>
      </div>

      <script>
          function showResult(elementId, message, type) {
              const element = document.getElementById(elementId);
              element.innerHTML = \`<div style="padding:10px;border-radius:5px;background:\${type==='success'?'rgba(76,175,80,0.2)':'rgba(244,67,54,0.2)'};border:1px solid \${type==='success'?'#4CAF50':'#F44336'};">\${message}</div>\`;
          }
          
          function registerDemo() {
              const title = document.getElementById('workTitle').value;
              if (!title) {
                  showResult('result1', 'Please enter work title', 'error');
                  return;
              }
              showResult('result1', '✅ Copyright registered in demo mode. In production this would be on blockchain.', 'success');
          }
          
          function createTokenDemo() {
              const name = document.getElementById('tokenName').value;
              if (!name) {
                  showResult('result2', 'Please enter token name', 'error');
                  return;
              }
              showResult('result2', \`✅ Token "\${name}" created in demo mode. Ready for real blockchain.\`, 'success');
          }
          
          async function checkStatus() {
              const statusEl = document.getElementById('statusInfo');
              statusEl.innerHTML = 'Checking...';
              try {
                  const response = await fetch('/api/status');
                  const data = await response.json();
                  statusEl.innerHTML = \`
                      <div style="padding:15px;background:rgba(76,175,80,0.1);border-radius:10px;">
                          <strong>✅ System Operational</strong><br>
                          Network: \${data.network}<br>
                          Chain ID: \${data.chainId}<br>
                          RPC: \${data.rpcUrl}<br>
                          Mode: \${data.demoMode ? 'Demo' : 'Production'}
                      </div>
                  \`;
              } catch (error) {
                  statusEl.innerHTML = \`<div style="padding:15px;background:rgba(244,67,54,0.1);border-radius:10px;">❌ Error: \${error.message}</div>\`;
              }
          }
          
          // Загружаем статус при старте
          checkStatus();
      </script>
  </body>
  </html>
  `);
});

// ==================== API ENDPOINTS ====================
app.get("/api/status", (req, res) => {
  res.json({
    status: "operational",
    network: blockchainConfig.networkName,
    chainId: blockchainConfig.chainId,
    rpcUrl: blockchainConfig.rpcUrl,
    demoMode: demoMode,
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({
    healthy: true,
    service: "ZUZCOIN Universe API",
    environment: process.env.NODE_ENV || "production",
    blockchain: blockchainConfig.networkName
  });
});

// ==================== ЗАПУСК ====================
app.listen(PORT, () => {
  console.log(\`
  🚀 ZUZCOIN Universe - PRODUCTION
  =================================
  🌐 URL: https://zuzcoin-platform-roan-delta.vercel.app
  📡 Network: \${blockchainConfig.networkName}
  🆔 Chain ID: \${blockchainConfig.chainId}
  ⚙️ Mode: \${demoMode ? 'Demo' : 'Production'}
  ✅ Ready for next steps: Firebase Auth + KYC
  \`);
});

module.exports = app;
