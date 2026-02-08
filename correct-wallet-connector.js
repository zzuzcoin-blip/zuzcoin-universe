// ===========================================
// CORRECT WALLET CONNECTOR FOR ZUZIM
// Working MetaMask connection
// ===========================================

class CorrectWalletConnector {
  constructor() {
    this.connected = false;
    this.account = null;
    this.init();
  }
  
  init() {
    console.log('🔧 Initializing wallet connector...');
    
    // Проверяем MetaMask
    if (typeof window.ethereum === 'undefined') {
      this.showMetaMaskInstall();
      return;
    }
    
    // Слушаем события MetaMask
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('Accounts changed:', accounts);
      if (accounts.length > 0) {
        this.handleConnected(accounts[0]);
      } else {
        this.handleDisconnected();
      }
    });
    
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    
    // Проверяем уже подключенный аккаунт
    this.checkConnectedAccount();
  }
  
  async checkConnectedAccount() {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      if (accounts.length > 0) {
        this.handleConnected(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking accounts:', error);
    }
  }
  
  async connect() {
    console.log('🦊 Connecting to MetaMask...');
    
    try {
      // ЭТО ВЫЗЫВАЕТ ВСПЛЫВАЮЩЕЕ ОКНО META MASK!
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        this.handleConnected(accounts[0]);
        return accounts[0];
      }
    } catch (error) {
      console.error('❌ MetaMask connection error:', error);
      this.showError(error);
      return null;
    }
  }
  
  handleConnected(account) {
    console.log('✅ Connected:', account);
    this.connected = true;
    this.account = account;
    
    // Обновляем UI
    this.updateUI();
    
    // Обновляем балансы
    this.updateBalances();
    
    // Показываем уведомление
    this.showSuccess('Wallet connected!');
  }
  
  handleDisconnected() {
    this.connected = false;
    this.account = null;
    this.updateUI();
    console.log('👋 Disconnected');
  }
  
  updateUI() {
    const btn = document.getElementById('metaMaskConnectBtn');
    const info = document.getElementById('walletConnectedInfo');
    
    if (!btn) return;
    
    if (this.connected && this.account) {
      btn.innerHTML = `✅ ${this.account.substring(0, 6)}...${this.account.substring(38)}`;
      btn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
      
      if (info) {
        info.style.display = 'block';
        document.getElementById('connectedAddress').textContent = this.account;
      }
    } else {
      btn.innerHTML = '🦊 Connect MetaMask';
      btn.style.background = 'linear-gradient(135deg, #F6851B 0%, #E2761B 100%)';
      
      if (info) {
        info.style.display = 'none';
      }
    }
  }
  
  async updateBalances() {
    if (!this.account) return;
    
    try {
      // ETH баланс
      const ethBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.account, 'latest']
      });
      
      const ethInEth = parseInt(ethBalance) / 1e18;
      
      // ZUZ баланс
      const provider = new ethers.BrowserProvider(window.ethereum);
      const zuzContract = new ethers.Contract(
        '0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3',
        [
          "function balanceOf(address) view returns (uint256)",
          "function decimals() view returns (uint8)",
          "function symbol() view returns (string)"
        ],
        provider
      );
      
      const zuzBalance = await zuzContract.balanceOf(this.account);
      const decimals = await zuzContract.decimals();
      const zuzInTokens = parseInt(zuzBalance) / (10 ** decimals);
      
      // Обновляем отображение
      const ethEl = document.getElementById('ethBalanceDisplay');
      const zuzEl = document.getElementById('zuzBalanceDisplay');
      
      if (ethEl) ethEl.textContent = `${ethInEth.toFixed(4)} ETH`;
      if (zuzEl) zuzEl.textContent = `${zuzInTokens.toFixed(0)} ZUZ`;
      
    } catch (error) {
      console.error('Balance update error:', error);
    }
  }
  
  showSuccess(message) {
    alert(`✅ ${message}`);
  }
  
  showError(error) {
    alert(`❌ Error: ${error.message}`);
  }
  
  showMetaMaskInstall() {
    const modal = `
      <div style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          max-width: 400px;
        ">
          <h2 style="color: #333;">MetaMask Required 🦊</h2>
          <p style="color: #666; margin: 20px 0;">
            You need MetaMask to use ZUZIM Universe.
          </p>
          <button onclick="window.open('https://metamask.io/download/', '_blank')" 
            style="
              background: #F6851B;
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 25px;
              font-weight: bold;
              cursor: pointer;
              margin: 10px;
            ">
            Install MetaMask
          </button>
          <button onclick="document.body.removeChild(this.parentElement.parentElement)" 
            style="
              background: #666;
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 25px;
              font-weight: bold;
              cursor: pointer;
              margin: 10px;
            ">
            Close
          </button>
        </div>
      </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = modal;
    document.body.appendChild(div.firstChild);
  }
}

// Глобальная инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Создаем кнопку если её нет
  if (!document.getElementById('metaMaskConnectBtn')) {
    const walletContainer = document.createElement('div');
    walletContainer.innerHTML = `
      <div style="
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1000;
        text-align: right;
      ">
        <button id="metaMaskConnectBtn" style="
          background: linear-gradient(135deg, #F6851B 0%, #E2761B 100%);
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
          🦊 Connect MetaMask
        </button>
        
        <div id="walletConnectedInfo" style="
          margin-top: 15px;
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 10px;
          font-size: 12px;
          display: none;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        ">
          <div style="margin-bottom: 5px;">📍 <strong>Connected:</strong> <span id="connectedAddress"></span></div>
          <div style="margin-bottom: 5px;">📊 <strong>ETH:</strong> <span id="ethBalanceDisplay">0.0000</span></div>
          <div style="margin-bottom: 5px;">🪙 <strong>ZUZ:</strong> <span id="zuzBalanceDisplay">0</span></div>
          <button onclick="window.walletConnector.handleDisconnected()" style="
            background: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 10px;
            margin-top: 5px;
            cursor: pointer;
          ">
            Disconnect
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(walletContainer.firstChild);
  }
  
  // Инициализируем коннектор
  window.walletConnector = new CorrectWalletConnector();
  
  // Вешаем обработчик на кнопку
  document.getElementById('metaMaskConnectBtn').addEventListener('click', () => {
    window.walletConnector.connect();
  });
  
  console.log('✅ Correct Wallet Connector initialized!');
});
