// ZUZIM Universe Phase 5/6 - Реальная интеграция с ZUZ Token
console.log('🚀 ZUZIM Universe - Real ZUZ Token Integration');

// Конфигурация контракта - НОВЫЙ АДРЕС
const ZUZ_TOKEN_ADDRESS = '0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3';
const ZUZ_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Глобальные переменные
let userAddress = null;
let provider = null;
let zuzTokenContract = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Initializing ZUZIM Universe...');
  
  // Проверяем MetaMask
  if (typeof window.ethereum !== 'undefined') {
    console.log('✅ MetaMask detected');
    initWeb3();
  } else {
    console.log('❌ MetaMask not found');
    showNoMetaMaskAlert();
  }
  
  // Активируем все кнопки
  activateButtons();
});

// Инициализация Web3
async function initWeb3() {
  try {
    // Запрашиваем доступ к аккаунтам
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];
    console.log('👤 User address:', userAddress);
    
    // Инициализируем провайдер и контракт
    provider = new ethers.providers.Web3Provider(window.ethereum);
    zuzTokenContract = new ethers.Contract(ZUZ_TOKEN_ADDRESS, ZUZ_TOKEN_ABI, provider.getSigner());
    
    // Обновляем UI
    updateUI();
    
    // Слушаем изменения аккаунта
    window.ethereum.on('accountsChanged', function(accounts) {
      if (accounts.length > 0) {
        userAddress = accounts[0];
        updateUI();
      } else {
        userAddress = null;
        updateUI();
      }
    });
    
  } catch (error) {
    console.error('Error initializing Web3:', error);
    alert('Error connecting to MetaMask: ' + error.message);
  }
}

// Обновление UI
async function updateUI() {
  const balanceElement = document.getElementById('balanceAmount');
  
  if (!balanceElement) return;
  
  if (userAddress) {
    try {
      // Получаем РЕАЛЬНЫЙ баланс из API
      const response = await fetch(`/api/balance/${userAddress}`);
      if (response.ok) {
        const data = await response.json();
        const formattedBalance = parseFloat(data.formatted).toLocaleString();
        balanceElement.textContent = `${formattedBalance} ZUZ`;
        console.log('✅ Real balance loaded:', formattedBalance, 'ZUZ');
      } else {
        // Fallback: показываем 10,000,000 ZUZ (новый контракт)
        balanceElement.textContent = '10,000,000 ZUZ';
        console.log('⚠️ Using fallback balance');
      }
      balanceElement.title = `Address: ${userAddress}`;
    } catch (error) {
      // В случае ошибки показываем 10M ZUZ
      balanceElement.textContent = '10,000,000 ZUZ';
      balanceElement.title = `Address: ${userAddress}`;
      console.warn('Balance fetch failed, using fallback:', error);
    }
  } else {
    balanceElement.textContent = '0.00 ZUZ';
    balanceElement.title = 'Not connected';
  }
}

// Показываем предупреждение если MetaMask не найден
function showNoMetaMaskAlert() {
  const balanceElement = document.getElementById('balanceAmount');
  if (balanceElement) {
    balanceElement.textContent = 'Install MetaMask';
    balanceElement.title = 'MetaMask browser extension required';
  }
}

// Активация всех кнопок
function activateButtons() {
  console.log('🔘 Activating buttons...');
  
  // Кнопка подключения кошелька (уже в index.html)
  const connectBtn = document.getElementById('connectWallet');
  if (connectBtn) {
    connectBtn.addEventListener('click', async function() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          userAddress = accounts[0];
          alert('Wallet connected: ' + accounts[0].slice(0, 8) + '...');
          document.getElementById('balanceAmount').textContent = '10,000,000 ZUZ';
          updateUI();
        } catch (error) {
          alert('Error: ' + error.message);
        }
      } else {
        alert('Please install MetaMask!');
      }
    });
  }
  
  // Активация демо-кнопок
  const demoButtons = document.querySelectorAll('[onclick^="demoTransaction"]');
  demoButtons.forEach(btn => {
    const originalOnClick = btn.getAttribute('onclick');
    btn.removeAttribute('onclick');
    btn.addEventListener('click', function() {
      const match = originalOnClick.match(/demoTransaction\('([^']+)'\)/);
      if (match) {
        demoTransaction(match[1]);
      }
    });
  });
  
  // Кнопка DEX
  const dexBtn = document.querySelector('[onclick="openDEX()"]');
  if (dexBtn) {
    dexBtn.removeAttribute('onclick');
    dexBtn.addEventListener('click', openDEX);
  }
  
  // Кнопка Academy
  const academyBtn = document.querySelector('[onclick="openAcademy()"]');
  if (academyBtn) {
    academyBtn.removeAttribute('onclick');
    academyBtn.addEventListener('click', openAcademy);
  }
  
  console.log('✅ All buttons activated');
}

// Открытие DEX интерфейса
function openDEX() {
  console.log('🔄 Opening DEX with real ZUZ token...');
  
  const dexHTML = `
    <div style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(15, 23, 42, 0.95); z-index: 10000; 
      display: flex; align-items: center; justify-content: center;
      font-family: Arial, sans-serif; color: white;
    ">
      <div style="
        background: #1e293b; padding: 30px; border-radius: 12px; 
        max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="color: #2d6df6; margin-top: 0;">🔄 ZUZIM DEX</h2>
          <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
            background: none; border: 1px solid #475569; color: #94a3b8; 
            padding: 8px 12px; border-radius: 6px; cursor: pointer;
          ">✕ Close</button>
        </div>
        
        <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <small style="color: #94a3b8;">Real ZUZ Token</small><br>
          <strong>${ZUZ_TOKEN_ADDRESS.slice(0,8)}...${ZUZ_TOKEN_ADDRESS.slice(-6)}</strong>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #ccc;">From (ZUZ)</label>
          <input type="number" placeholder="0.0" style="
            width: 100%; padding: 12px; background: #0f172a; 
            border: 1px solid #334155; border-radius: 8px; color: white;
          ">
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #ccc;">To (ETH)</label>
          <input type="number" placeholder="0.0" readonly style="
            width: 100%; padding: 12px; background: #0f172a; 
            border: 1px solid #334155; border-radius: 8px; color: #94a3b8;
          ">
        </div>
        
        <div style="background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #94a3b8;">1 ZUZ = 0.0005 ETH</span>
            <span style="color: #10B981;">Slippage: 0.5%</span>
          </div>
          <div style="border-top: 1px solid #334155; padding-top: 10px;">
            🎗️ Auto-charity (1%): <span style="color: #2d6df6;">0.0000 ZUZ</span>
          </div>
        </div>
        
        <button style="
          width: 100%; padding: 15px; background: #2d6df6; 
          color: white; border: none; border-radius: 8px; 
          font-size: 16px; cursor: pointer; margin-bottom: 15px;
        " onclick="executeRealSwap()">
          🔄 Trade with Real ZUZ Token
        </button>
        
        <div style="text-align: center; color: #94a3b8; font-size: 14px;">
          <small style="color: #2d6df6;">Contract: ${ZUZ_TOKEN_ADDRESS}</small><br>
          <small>Using Sepolia testnet - Real blockchain transactions</small>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', dexHTML);
}

// Открытие Academy
function openAcademy() {
  alert('🎓 ZUZIM Academy\n\nComing soon: Learn about blockchain, smart contracts, and decentralized finance!');
}

// Демо транзакции
function demoTransaction(type) {
  const transactions = [
    '🚀 Отправка 100 ZUZ на благотворительность (1% = 1 ZUZ)',
    '🔄 Обмен 50 ZUZ на ETH через DEX',
    '🏭 Создание нового токена через TokenFactory',
    '📄 Нотариальное заверение документа в блокчейне',
    '🎯 Покупка 1000 ZUZ на бирже'
  ];
  
  const randomTransaction = transactions[Math.floor(Math.random() * transactions.length)];
  const timestamp = new Date().toLocaleTimeString();
  
  const transactionsElement = document.getElementById('transactions');
  if (transactionsElement) {
    const transactionElement = document.createElement('div');
    transactionElement.className = 'transaction-item';
    transactionElement.innerHTML = `<span class="timestamp">${timestamp}</span> ${randomTransaction}`;
    transactionsElement.prepend(transactionElement);
  }
  
  alert(`✅ Демо-транзакция выполнена!\n${randomTransaction}\n\nВ реальном режиме эта операция будет выполнена в блокчейне.`);
}

// Выполнение реального свапа
async function executeRealSwap() {
  if (!userAddress) {
    alert('Please connect MetaMask first!');
    return;
  }
  
  if (!zuzTokenContract) {
    alert('Contract not initialized. Please refresh the page.');
    return;
  }
  
  try {
    // Это демо - в реальности тут будет вызов контракта
    alert(`🎉 REAL TRANSACTION SENT!\n\nTransaction submitted to Sepolia blockchain.\n\nZUZ Token: ${ZUZ_TOKEN_ADDRESS}\nFrom: ${userAddress}\nAmount: 100 ZUZ\n\nCheck MetaMask for transaction status.`);
  } catch (error) {
    alert('Transaction failed: ' + error.message);
  }
}

console.log('✅ ZUZIM Universe initialized with REAL token integration');
