// ИСПРАВЛЕННЫЙ КОННЕКТОР КОШЕЛЬКОВ - ИНТЕГРАЦИЯ С СУЩЕСТВУЮЩИМ КОДОМ
console.log("🔧 Fixed wallet connector loading...");

// Сохраняем оригинальные функции если они существуют
let originalConnectMetaMask = null;
let originalLoadBalances = null;

// Проверяем и сохраняем оригинальные функции
if (typeof window.connectMetaMask === 'function') {
    originalConnectMetaMask = window.connectMetaMask;
    console.log("✅ Original connectMetaMask found and saved");
}

if (typeof window.loadBalances === 'function') {
    originalLoadBalances = window.loadBalances;
    console.log("✅ Original loadBalances found and saved");
}

// ==================== НАША ФУНКЦИОНАЛЬНОСТЬ ====================

// Показать модальное окно выбора кошелька
function showWalletModal() {
    console.log("🎯 Showing wallet selection modal");
    
    const modalHTML = `
    <div id="walletModal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    ">
        <div style="
            background: #0e1a2d;
            border-radius: 16px;
            padding: 30px;
            width: 400px;
            max-width: 90%;
            border: 1px solid #2a3b54;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: white;">Connect Wallet</h3>
                <button onclick="closeWalletModal()" style="
                    background: none;
                    border: none;
                    color: #8a9bb2;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            
            <div onclick="connectWallet('metamask')" style="
                margin-bottom: 15px;
                padding: 15px;
                background: #1a2b44;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.background='#2a3b54'" 
               onmouseout="this.style.background='#1a2b44'">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 28px; color: #f6851b;">
                        <i class="fab fa-ethereum"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 16px; color: white;">MetaMask</div>
                        <div style="font-size: 13px; color: #8a9bb2;">Browser extension</div>
                    </div>
                </div>
            </div>
            
            <div onclick="connectWallet('trust')" style="
                margin-bottom: 15px;
                padding: 15px;
                background: #1a2b44;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.background='#2a3b54'" 
               onmouseout="this.style.background='#1a2b44'">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 28px; color: #3375bb;">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 16px; color: white;">Trust Wallet</div>
                        <div style="font-size: 13px; color: #8a9bb2;">Mobile wallet</div>
                    </div>
                </div>
            </div>
            
            <div onclick="connectWallet('coinbase')" style="
                margin-bottom: 20px;
                padding: 15px;
                background: #1a2b44;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.background='#2a3b54'" 
               onmouseout="this.style.background='#1a2b44'">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 28px; color: #0052ff;">
                        <i class="fab fa-bitcoin"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 16px; color: white;">Coinbase Wallet</div>
                        <div style="font-size: 13px; color: #8a9bb2;">Web3 wallet</div>
                    </div>
                </div>
            </div>
            
            <button onclick="closeWalletModal()" style="
                width: 100%;
                padding: 14px;
                background: #2a3b54;
                border: none;
                border-radius: 10px;
                color: white;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            " onmouseover="this.style.background='#3a4b64'" 
               onmouseout="this.style.background='#2a3b54'">
                Cancel
            </button>
        </div>
    </div>
    `;
    
    // Удаляем старый модал если есть
    const oldModal = document.getElementById('walletModal');
    if (oldModal) oldModal.remove();
    
    // Добавляем новый модал
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    console.log("✅ Wallet modal displayed");
}

// Закрыть модальное окно
function closeWalletModal() {
    const modal = document.getElementById('walletModal');
    if (modal) modal.remove();
}

// Подключение кошелька
async function connectWallet(walletType) {
    console.log("🔗 Connecting to", walletType);
    
    const connectBtn = document.getElementById('connectWalletBtn');
    if (!connectBtn) return;
    
    // Показываем статус подключения
    connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    connectBtn.disabled = true;
    
    try {
        if (walletType === 'metamask' || walletType === 'trust' || walletType === 'coinbase') {
            // Все три кошелька используют window.ethereum
            await connectViaEthereum();
        }
        
        // Закрываем модальное окно
        closeWalletModal();
        
        console.log("✅ Wallet connected successfully");
        
    } catch (error) {
        console.error("❌ Connection error:", error);
        
        // Восстанавливаем кнопку
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i><span>Connect Wallet</span>';
        connectBtn.disabled = false;
        
        alert("Connection failed: " + error.message);
    }
}

// Подключение через Ethereum провайдер (работает для MetaMask, Trust, Coinbase)
async function connectViaEthereum() {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('No Ethereum wallet found. Please install MetaMask, Trust Wallet, or Coinbase Wallet.');
    }
    
    // Запрашиваем аккаунты
    const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
    }
    
    const userAddress = accounts[0];
    console.log("✅ Connected address:", userAddress);
    
    // Вызываем ОРИГИНАЛЬНУЮ функцию connectMetaMask если она есть
    if (originalConnectMetaMask) {
        console.log("✅ Calling original connectMetaMask function");
        await originalConnectMetaMask();
    } else {
        // Если оригинальной функции нет, делаем базовое подключение
        console.log("⚠️ Original connectMetaMask not found, using basic connection");
        
        // Обновляем кнопку
        const connectBtn = document.getElementById('connectWalletBtn');
        if (connectBtn) {
            const shortAddress = userAddress.substring(0, 6) + '...' + userAddress.substring(38);
            connectBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>' + shortAddress + '</span>';
            connectBtn.classList.add('connected');
            connectBtn.onclick = disconnectWallet;
            connectBtn.disabled = false;
        }
        
        // Показываем балансы
        const balanceContainer = document.getElementById('balanceContainer');
        if (balanceContainer) {
            balanceContainer.style.display = 'flex';
        }
    }
    
    return userAddress;
}

// Отключение кошелька
function disconnectWallet() {
    console.log("🔌 Disconnecting wallet");
    
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i><span>Connect Wallet</span>';
        connectBtn.classList.remove('connected');
        connectBtn.onclick = showWalletModal;
        connectBtn.disabled = false;
    }
    
    // Скрываем балансы
    const balanceContainer = document.getElementById('balanceContainer');
    if (balanceContainer) {
        balanceContainer.style.display = 'none';
    }
    
    // Сбрасываем значения балансов
    const ethBalance = document.getElementById('ethBalance');
    const zuzBalance = document.getElementById('zuzBalance');
    const networkName = document.getElementById('networkName');
    
    if (ethBalance) ethBalance.textContent = '0.00 ETH';
    if (zuzBalance) zuzBalance.textContent = '0 ZUZ';
    if (networkName) networkName.textContent = 'Not Connected';
    
    console.log("✅ Wallet disconnected");
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Fixed wallet connector initialized");
    
    // Находим кнопку подключения
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
        console.log("✅ Found connect button");
        
        // Сохраняем оригинальный обработчик если он есть
        const originalOnClick = connectBtn.onclick;
        
        // Заменяем на нашу функцию
        connectBtn.onclick = showWalletModal;
        
        console.log("✅ Button handler set to showWalletModal");
    } else {
        console.error("❌ Connect button not found!");
    }
    
    // Автоподключение если уже подключен
    if (window.ethereum && window.ethereum.selectedAddress) {
        console.log("🔄 Wallet already connected, updating UI...");
        setTimeout(() => {
            const address = window.ethereum.selectedAddress;
            const connectBtn = document.getElementById('connectWalletBtn');
            if (connectBtn) {
                const shortAddress = address.substring(0, 6) + '...' + address.substring(38);
                connectBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>' + shortAddress + '</span>';
                connectBtn.classList.add('connected');
                connectBtn.onclick = disconnectWallet;
            }
        }, 1000);
    }
});

// Экспортируем функции глобально
window.walletConnect = {
    showWalletModal,
    connectWallet,
    disconnectWallet,
    connectViaEthereum
};

console.log("✅ Fixed wallet connector ready");
