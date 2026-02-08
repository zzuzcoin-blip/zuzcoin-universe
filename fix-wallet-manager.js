const fs = require('fs');

// Создаем правильный wallet manager
const walletManagerHTML = `<!DOCTYPE html>
<html>
<head>
    <title>ZUZIM Wallet Manager</title>
    <style>
        body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: white;
            font-family: 'Arial', sans-serif;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #00ff88;
            margin-bottom: 40px;
        }
        .wallet-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .wallet-option {
            display: flex;
            align-items: center;
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .wallet-option:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }
        .wallet-icon {
            font-size: 24px;
            margin-right: 15px;
        }
        .wallet-info {
            flex-grow: 1;
        }
        .wallet-name {
            font-weight: bold;
            font-size: 18px;
        }
        .wallet-desc {
            font-size: 12px;
            color: #aaa;
            margin-top: 5px;
        }
        button {
            background: #F6851B;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s;
        }
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(246, 133, 27, 0.4);
        }
        .disconnect-btn {
            background: #ff4444;
        }
        #status {
            margin-top: 30px;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            font-weight: bold;
        }
        .connected { background: rgba(76, 175, 80, 0.2); }
        .disconnected { background: rgba(255, 152, 0, 0.2); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 ZUZIM Wallet Manager</h1>
        
        <div class="wallet-card">
            <h2>Current Status</h2>
            <div id="status">Checking...</div>
            <div id="accountInfo" style="display: none; margin-top: 20px;">
                <p>📍 Address: <span id="currentAddress"></span></p>
                <p>📊 ETH Balance: <span id="currentEthBalance"></span></p>
                <p>🪙 ZUZ Balance: <span id="currentZuzBalance"></span></p>
                <button class="disconnect-btn" onclick="disconnectWallet()">🚪 Disconnect / Switch Wallet</button>
                <p style="font-size: 12px; color: #aaa; margin-top: 10px;">
                    Clicking "Disconnect" will clear the connection and allow you to connect a different wallet.
                </p>
            </div>
        </div>
        
        <div class="wallet-card">
            <h2>Connect New Wallet</h2>
            
            <div class="wallet-option" onclick="connectMetaMask()">
                <div class="wallet-icon">🦊</div>
                <div class="wallet-info">
                    <div class="wallet-name">MetaMask</div>
                    <div class="wallet-desc">Most popular Ethereum wallet</div>
                </div>
                <div>→</div>
            </div>
        </div>
        
        <div class="wallet-card">
            <h3>How to switch wallets:</h3>
            <ol>
                <li>Click "Disconnect / Switch Wallet" button above</li>
                <li>MetaMask will ask for confirmation to disconnect</li>
                <li>Click "MetaMask" option to reconnect</li>
                <li>MetaMask popup will appear asking to select account</li>
                <li>Select a different account or wallet</li>
            </ol>
        </div>
    </div>

    <script>
    // Check current status
    async function checkStatus() {
        const statusDiv = document.getElementById('status');
        const accountInfo = document.getElementById('accountInfo');
        
        if (typeof window.ethereum === 'undefined') {
            statusDiv.innerHTML = '❌ No Web3 wallet detected';
            statusDiv.className = 'disconnected';
            return;
        }
        
        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_accounts' 
            });
            
            if (accounts.length > 0) {
                const account = accounts[0];
                statusDiv.innerHTML = \`✅ Connected to MetaMask\`;
                statusDiv.className = 'connected';
                
                // Show account info
                accountInfo.style.display = 'block';
                document.getElementById('currentAddress').textContent = 
                    account.substring(0, 6) + '...' + account.substring(38);
                
                // Get ETH balance
                const ethBalance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [account, 'latest']
                });
                document.getElementById('currentEthBalance').textContent = 
                    (parseInt(ethBalance) / 1e18).toFixed(4) + ' ETH';
                
                // Try to get ZUZ balance
                try {
                    if (typeof ethers !== 'undefined') {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const zuzContract = new ethers.Contract(
                            '0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3',
                            ['function balanceOf(address) view returns (uint256)'],
                            provider
                        );
                        const zuzBalance = await zuzContract.balanceOf(account);
                        document.getElementById('currentZuzBalance').textContent = 
                            (parseInt(zuzBalance) / 1e18).toFixed(0) + ' ZUZ';
                    }
                } catch (zuzError) {
                    document.getElementById('currentZuzBalance').textContent = 'Check MetaMask';
                }
                
            } else {
                statusDiv.innerHTML = '⚠️ Not connected';
                statusDiv.className = 'disconnected';
                accountInfo.style.display = 'none';
            }
            
        } catch (error) {
            statusDiv.innerHTML = \`❌ Error: \${error.message}\`;
            statusDiv.className = 'disconnected';
        }
    }
    
    // Connect MetaMask
    async function connectMetaMask() {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask first!');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }
        
        try {
            // THIS WILL SHOW METAMASK POPUP!
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                alert(\`✅ Connected: \${accounts[0].substring(0,6)}...\${accounts[0].substring(38)}\`);
                checkStatus();
            }
        } catch (error) {
            alert(\`❌ Error: \${error.message}\`);
        }
    }
    
    // Disconnect wallet - THIS WILL TRIGGER METAMASK TO ASK FOR NEW CONNECTION
    async function disconnectWallet() {
        try {
            // Method 1: Try to revoke permissions (triggers MetaMask popup)
            await window.ethereum.request({
                method: 'wallet_revokePermissions',
                params: [{
                    eth_accounts: {}
                }]
            });
            alert('✅ Permissions revoked. You can now connect a different wallet.');
            checkStatus();
        } catch (error) {
            console.log('Could not revoke permissions, trying alternative method');
            
            // Method 2: Clear local storage and reload
            localStorage.removeItem('walletconnect');
            localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
            
            alert('✅ Local connection cleared. Page will reload.');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
    
    // Initialize
    checkStatus();
    // Check every 5 seconds
    setInterval(checkStatus, 5000);
    </script>
</body>
</html>`;

fs.writeFileSync('wallet-manager.html', walletManagerHTML);

// Также добавляем кнопку выхода в основной интерфейс
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем кнопку выхода если её нет
if (!html.includes('disconnectWalletMain')) {
    const disconnectButton = `
    <div style="position: absolute; top: 20px; right: 20px; z-index: 1000;">
        <button onclick="disconnectWalletMain()" style="
            background: #ff4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
        ">
            🚪 Switch Wallet
        </button>
    </div>
    <script>
    function disconnectWalletMain() {
        if (confirm('Switch to a different wallet?')) {
            window.open('/wallet-manager.html', '_blank');
        }
    }
    </script>
    `;
    
    html = html.replace('<body>', '<body>' + disconnectButton);
    fs.writeFileSync('index.html', html);
}

console.log('✅ Wallet manager fixed and added to index.html');
