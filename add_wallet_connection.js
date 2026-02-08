const fs = require('fs');

// Читаем index.html
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем кнопку подключения кошелька в верхний правый угол
const walletButton = `
<!-- Wallet Connection Button -->
<div style="position: absolute; top: 20px; right: 20px; z-index: 1000;">
  <button id="connectWallet" style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  ">
    🔗 Connect Wallet
  </button>
  <div id="walletInfo" style="
    margin-top: 10px;
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 10px;
    font-size: 12px;
    display: none;
  ">
    <div>📊 <span id="ethBalance">0 ETH</span></div>
    <div>🪙 <span id="zuzBalance">0 ZUZ</span></div>
  </div>
</div>
`;

// Добавляем скрипт для подключения кошелька
const walletScript = `
<script>
// Wallet Connection
async function connectWallet() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      // Запрос подключения к аккаунтам
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const account = accounts[0];
      document.getElementById('connectWallet').innerHTML = '✅ ' + 
        account.substring(0, 6) + '...' + account.substring(38);
      
      // Показываем информацию о кошельке
      document.getElementById('walletInfo').style.display = 'block';
      
      // Обновляем балансы
      updateBalances(account);
      
      alert('✅ Wallet connected successfully!\\nAddress: ' + account);
    } else {
      alert('⚠️ Please install MetaMask or another Web3 wallet!');
    }
  } catch (error) {
    console.error('Wallet connection error:', error);
    alert('❌ Error connecting wallet: ' + error.message);
  }
}

// Update wallet balances
async function updateBalances(account) {
  try {
    // Get ETH balance
    const ethBalance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [account, 'latest']
    });
    const ethInEth = parseInt(ethBalance) / 1e18;
    document.getElementById('ethBalance').innerText = ethInEth.toFixed(4) + ' ETH';
    
    // Get ZUZ balance (need contract ABI)
    document.getElementById('zuzBalance').innerText = 'Check MetaMask';
    
  } catch (error) {
    console.error('Balance update error:', error);
  }
}

// Add click event to button
document.addEventListener('DOMContentLoaded', function() {
  const connectBtn = document.getElementById('connectWallet');
  if (connectBtn) {
    connectBtn.addEventListener('click', connectWallet);
  }
  
  // Auto-connect if already connected
  if (window.ethereum && window.ethereum.selectedAddress) {
    connectWallet();
  }
});
</script>
`;

// Вставляем кнопку после body тега
if (!html.includes('id="connectWallet"')) {
  html = html.replace('<body>', '<body>' + walletButton);
  
  // Вставляем скрипт перед закрывающим </body>
  html = html.replace('</body>', walletScript + '</body>');
  
  fs.writeFileSync('index.html', html);
  console.log('✅ Wallet connection button added!');
} else {
  console.log('ℹ️ Wallet button already exists');
}
