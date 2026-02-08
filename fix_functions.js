// Восстановление всех функций ZUZCOIN Universe
console.log("🔄 Восстанавливаю функциональность...");

// 1. Восстанавливаем обработчики кнопок
function restoreButtonHandlers() {
    // Кнопка Connect MetaMask
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
        connectBtn.onclick = async function() {
            if (!window.ethereum) {
                alert('Установите MetaMask!');
                return;
            }
            try {
                this.innerHTML = '<span class="loader"></span> Connecting...';
                this.disabled = true;
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                document.getElementById('walletAddress').textContent = 
                    address.slice(0, 10) + '...' + address.slice(-4);
                this.innerHTML = '<i class="fas fa-check"></i> Connected';
                this.style.background = '#10b981';
                updateBalances(address);
            } catch (error) {
                this.innerHTML = '<i class="fas fa-plug"></i> Connect MetaMask';
                this.disabled = false;
                alert('Ошибка: ' + error.message);
            }
        };
        console.log("✅ Кнопка Connect восстановлена");
    }
    
    // Кнопка Send ZUZ
    const sendBtn = document.getElementById('sendZuzBtn');
    if (sendBtn) {
        sendBtn.onclick = async function() {
            if (!window.ethereum?.selectedAddress) {
                alert('Подключите MetaMask сначала!');
                return;
            }
            
            const amount = prompt('Сколько ZUZ отправить?', '10');
            if (!amount || isNaN(amount)) return;
            
            const toAddress = prompt('Адрес получателя:', '0x...');
            if (!toAddress || !toAddress.startsWith('0x')) return;
            
            if (confirm(`Отправить ${amount} ZUZ?\n1% (${amount * 0.01} ZUZ) пойдет на филантропию`)) {
                try {
                    this.innerHTML = '<span class="loader"></span> Отправка...';
                    this.disabled = true;
                    
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(
                        "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
                        ["function transfer(address to, uint256 amount) returns (bool)", "function decimals() view returns (uint8)"],
                        signer
                    );
                    
                    const decimals = await contract.decimals();
                    const amountWei = ethers.utils.parseUnits(amount, decimals);
                    const tx = await contract.transfer(toAddress, amountWei);
                    
                    alert(`✅ Успешно! Хэш: ${tx.hash}`);
                    setTimeout(() => updateBalances(window.ethereum.selectedAddress), 3000);
                    
                } catch (error) {
                    alert('Ошибка: ' + error.message);
                } finally {
                    this.innerHTML = '<i class="fas fa-paper-plane"></i> Send ZUZ (1% auto-donate)';
                    this.disabled = false;
                }
            }
        };
        console.log("✅ Кнопка Send восстановлена");
    }
    
    // Кнопки Quick Actions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.onclick = function() {
            const action = this.querySelector('span').textContent;
            alert(`🚧 ${action} - скоро будет доступно!`);
        };
    });
    console.log("✅ Quick Actions восстановлены");
}

// 2. Функция обновления балансов
async function updateBalances(address) {
    if (!address) return;
    
    // Обновляем ETH
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const ethBalance = await provider.getBalance(address);
        document.getElementById('ethBalance').textContent = 
            parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4) + ' ETH';
    } catch (e) {}
    
    // Обновляем ZUZ
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
            "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
            ["function balanceOf(address) view returns (uint256)", "function symbol() view returns (string)"],
            provider
        );
        
        const [balanceWei, symbol] = await Promise.all([
            contract.balanceOf(address),
            contract.symbol()
        ]);
        
        const balanceZUZ = ethers.utils.formatUnits(balanceWei, 18);
        const balanceEl = document.getElementById('zuzBalance');
        balanceEl.textContent = parseFloat(balanceZUZ).toFixed(4) + ' ' + symbol;
        balanceEl.style.color = '#10b981';
        
    } catch (e) {
        console.log("Ошибка обновления баланса:", e);
    }
}

// 3. Проверка API статуса
async function checkAPI() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        const apiEl = document.getElementById('apiStatus');
        apiEl.innerHTML = '✅ Online';
        apiEl.style.color = '#10b981';
    } catch (error) {
        document.getElementById('apiStatus').innerHTML = '❌ Offline';
    }
}

// 4. Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Восстанавливаю ZUZCOIN Universe...");
    
    // Восстанавливаем кнопки
    restoreButtonHandlers();
    
    // Проверяем API
    checkAPI();
    
    // Если кошелек уже подключен
    if (window.ethereum?.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        const addrEl = document.getElementById('walletAddress');
        if (addrEl) {
            addrEl.textContent = address.slice(0, 10) + '...' + address.slice(-4);
            addrEl.style.color = '#60a5fa';
        }
        
        const connectBtn = document.getElementById('connectWalletBtn');
        if (connectBtn) {
            connectBtn.innerHTML = '<i class="fas fa-check"></i> Connected';
            connectBtn.style.background = '#10b981';
        }
        
        // Обновляем балансы
        updateBalances(address);
    }
    
    // События MetaMask
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                updateBalances(accounts[0]);
            }
        });
    }
    
    console.log("✅ Все функции восстановлены!");
    console.log("💡 Для ручного обновления баланса введите: updateBalances('ваш_адрес')");
});

// Экспортируем функции для консоли
window.restoreButtons = restoreButtonHandlers;
window.updateBalances = updateBalances;
window.checkAPI = checkAPI;
