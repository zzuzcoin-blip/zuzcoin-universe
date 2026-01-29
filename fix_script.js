// Восстановление всех функций ZUZCOIN Universe
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 ZUZCOIN Universe загружен");
    
    // 1. Кнопка Connect MetaMask
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
        connectBtn.onclick = async function() {
            if (!window.ethereum) {
                alert('Пожалуйста, установите MetaMask!');
                return;
            }
            try {
                this.innerHTML = '<span class="loader"></span> Connecting...';
                this.disabled = true;
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                const address = accounts[0];
                document.getElementById('walletAddress').textContent = 
                    address.slice(0, 10) + '...' + address.slice(-4);
                this.innerHTML = '<i class="fas fa-check"></i> Connected';
                this.style.background = '#10b981';
                updateBalances(address);
            } catch (error) {
                this.innerHTML = '<i class="fas fa-plug"></i> Connect MetaMask';
                this.disabled = false;
                alert('Ошибка подключения: ' + error.message);
            }
        };
        console.log("✅ Кнопка Connect настроена");
    }
    
    // 2. Кнопка Send ZUZ
    const sendBtn = document.getElementById('sendZuzBtn');
    if (sendBtn) {
        sendBtn.onclick = async function() {
            if (!window.ethereum?.selectedAddress) {
                alert('Подключите MetaMask сначала!');
                return;
            }
            
            const amount = prompt('Сколько ZUZ отправить?', '10');
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                alert('Пожалуйста, введите корректное количество');
                return;
            }
            
            const toAddress = prompt('Адрес получателя:', '0x...');
            if (!toAddress || !toAddress.startsWith('0x') || toAddress.length !== 42) {
                alert('Пожалуйста, введите корректный адрес Ethereum (42 символа)');
                return;
            }
            
            const confirmMsg = `Отправить ${amount} ZUZ на адрес ${toAddress.slice(0, 10)}...?\n\n` +
                              `1% (${(amount * 0.01).toFixed(4)} ZUZ) пойдёт на филантропию.\n` +
                              `Получатель получит: ${(amount * 0.99).toFixed(4)} ZUZ`;
            
            if (confirm(confirmMsg)) {
                try {
                    this.innerHTML = '<span class="loader"></span> Отправка...';
                    this.disabled = true;
                    
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(
                        "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31",
                        [
                            "function transfer(address to, uint256 amount) returns (bool)",
                            "function decimals() view returns (uint8)"
                        ],
                        signer
                    );
                    
                    const decimals = await contract.decimals();
                    const amountWei = ethers.utils.parseUnits(amount, decimals);
                    const tx = await contract.transfer(toAddress, amountWei);
                    
                    alert(`✅ Транзакция отправлена!\nХэш: ${tx.hash}\n\n1% зарезервировано для филантропии.`);
                    
                    // Обновляем баланс через 5 секунд
                    setTimeout(() => {
                        updateBalances(window.ethereum.selectedAddress);
                        this.innerHTML = '<i class="fas fa-paper-plane"></i> Send ZUZ (1% auto-donate)';
                        this.disabled = false;
                    }, 5000);
                    
                } catch (error) {
                    alert('❌ Ошибка отправки: ' + error.message);
                    this.innerHTML = '<i class="fas fa-paper-plane"></i> Send ZUZ (1% auto-donate)';
                    this.disabled = false;
                }
            }
        };
        console.log("✅ Кнопка Send настроена");
    }
    
    // 3. Quick Actions кнопки
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.onclick = function() {
            const action = this.querySelector('span').textContent;
            alert(`🚧 ${action} - скоро будет доступно в следующем обновлении!`);
        };
    });
    console.log("✅ Quick Actions настроены");
    
    // 4. Проверка API
    checkAPI();
    
    // 5. Если кошелёк уже подключен
    if (window.ethereum?.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        const addrEl = document.getElementById('walletAddress');
        if (addrEl) {
            addrEl.textContent = address.slice(0, 10) + '...' + address.slice(-4);
            addrEl.style.color = '#60a5fa';
        }
        
        if (connectBtn) {
            connectBtn.innerHTML = '<i class="fas fa-check"></i> Connected';
            connectBtn.style.background = '#10b981';
        }
        
        // Обновляем балансы
        updateBalances(address);
    }
    
    // 6. События MetaMask
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                updateBalances(accounts[0]);
            } else {
                // Если отключили кошелёк
                document.getElementById('walletAddress').textContent = 'Not connected';
                document.getElementById('ethBalance').textContent = '0.0000 ETH';
                document.getElementById('zuzBalance').textContent = '0.0000 ZUZ';
                if (connectBtn) {
                    connectBtn.innerHTML = '<i class="fas fa-plug"></i> Connect MetaMask';
                    connectBtn.style.background = '';
                }
            }
        });
    }
    
    console.log("✅ Все функции готовы к работе!");
});

// Функция обновления балансов
async function updateBalances(address) {
    if (!address) return;
    
    try {
        // ETH баланс
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const ethBalance = await provider.getBalance(address);
        document.getElementById('ethBalance').textContent = 
            parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4) + ' ETH';
    } catch (e) {
        console.log("Ошибка обновления ETH:", e);
    }
    
    try {
        // ZUZ баланс
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
            "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31",
            [
                "function balanceOf(address) view returns (uint256)",
                "function symbol() view returns (string)"
            ],
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
        console.log("Ошибка обновления ZUZ:", e);
        document.getElementById('zuzBalance').textContent = 'Error';
        document.getElementById('zuzBalance').style.color = '#ef4444';
    }
}

// Функция проверки API
async function checkAPI() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        const apiEl = document.getElementById('apiStatus');
        apiEl.innerHTML = '✅ Online';
        apiEl.style.color = '#10b981';
    } catch (error) {
        document.getElementById('apiStatus').innerHTML = '❌ Offline';
        document.getElementById('apiStatus').style.color = '#ef4444';
    }
}

// Делаем функции доступными из консоли
window.updateBalances = updateBalances;
window.checkAPI = checkAPI;
