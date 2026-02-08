const fs = require('fs');

// Прочитаем оригинальный рабочий файл
let workingHtml = fs.readFileSync('index-bybit.html', 'utf8');

// Извлечем секцию подключения кошелька
const walletSectionMatch = workingHtml.match(/<script>[\s\S]*?connectWallet[\s\S]*?<\/script>/);
const walletScript = walletSectionMatch ? walletSectionMatch[0] : '';

if (walletScript) {
    console.log('✅ Found working wallet script in index-bybit.html');
    
    // Создаем новый рабочий файл
    fs.writeFileSync('index-with-working-wallet.html', workingHtml);
    console.log('✅ Created index-with-working-wallet.html');
}

// Также обновим основной index.html
let mainHtml = fs.readFileSync('index.html', 'utf8');

// Удаляем все старые wallet скрипты
mainHtml = mainHtml.replace(/<script src="[^"]*wallet[^"]*"><\/script>/g, '');
mainHtml = mainHtml.replace(/<script>[\s\S]*?connectWallet[\s\S]*?<\/script>/g, '');

// Добавляем рабочий скрипт
const workingScripts = `
  <!-- Ethers.js -->
  <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
  
  <!-- Working Wallet Connector -->
  <script src="working-wallet.js"></script>
`;

mainHtml = mainHtml.replace('</body>', workingScripts + '</body>');
fs.writeFileSync('index.html', mainHtml);

console.log('✅ Restored working wallet connection to index.html');

// Создаем тестовую страницу с оригинальным кодом
fs.writeFileSync('test-original-wallet.html', `
<!DOCTYPE html>
<html>
<head>
    <title>Original Wallet Test</title>
    <meta charset="UTF-8">
    <style>
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            font-family: Arial, sans-serif; 
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container { 
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            text-align: center;
            max-width: 500px;
        }
        h1 { margin-bottom: 30px; }
        button {
            background: #F6851B;
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 18px;
            border-radius: 10px;
            cursor: pointer;
            margin: 20px;
            transition: all 0.3s;
        }
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(246, 133, 27, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🦊 Test Original MetaMask Connection</h1>
        <p>This uses the exact same code that worked before.</p>
        
        <button id="testConnectBtn">Click to Connect MetaMask</button>
        
        <div id="result" style="margin-top: 30px; font-size: 16px;"></div>
    </div>

    <script>
    document.getElementById('testConnectBtn').addEventListener('click', async function() {
        console.log('🔄 Starting MetaMask connection...');
        
        if (typeof window.ethereum === 'undefined') {
            document.getElementById('result').innerHTML = 
                '<span style="color: red;">❌ MetaMask not installed!</span>';
            return;
        }
        
        try {
            // ORIGINAL WORKING CODE
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length > 0) {
                const account = accounts[0];
                document.getElementById('result').innerHTML = 
                    '<span style="color: green;">✅ SUCCESS! Connected: ' + 
                    account.substring(0, 6) + '...' + account.substring(38) + '</span>';
                
                // Get balance
                const balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [account, 'latest']
                });
                
                const ethBalance = parseInt(balance) / 1e18;
                document.getElementById('result').innerHTML += 
                    '<br>📊 Balance: ' + ethBalance.toFixed(4) + ' ETH';
            }
            
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('result').innerHTML = 
                '<span style="color: red;">❌ Error: ' + error.message + '</span>';
        }
    });
    </script>
</body>
</html>
`);

console.log('✅ Created test-original-wallet.html');
