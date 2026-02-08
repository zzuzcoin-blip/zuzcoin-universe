// МИНИМАЛЬНЫЙ СКРИПТ ДЛЯ ДОБАВЛЕНИЯ ВЫБОРА КОШЕЛЬКОВ
// НЕ МЕНЯЕТ СУЩЕСТВУЮЩИЙ КОД, ТОЛЬКО РАСШИРЯЕТ ЕГО

(function() {
    console.log('Minimal Wallet Chooser: initializing...');
    
    // Ждем полной загрузки
    setTimeout(() => {
        // 1. НАХОДИМ КНОПКУ CONNECT WALLET
        const connectBtn = document.getElementById('connectWalletBtn');
        if (!connectBtn) {
            console.error('Connect button not found!');
            return;
        }
        
        console.log('Found connect button:', connectBtn);
        
        // 2. СОХРАНЯЕМ ОРИГИНАЛЬНУЮ ФУНКЦИЮ
        const originalConnect = window.connectMetaMask;
        if (!originalConnect) {
            console.error('connectMetaMask function not found!');
            return;
        }
        
        // 3. СОЗДАЕМ ПРОСТОЙ ДРОПДАУН
        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 5px;
            background: #1a1a2e;
            border-radius: 10px;
            padding: 15px;
            width: 200px;
            z-index: 1000;
            border: 1px solid #334155;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        
        dropdown.innerHTML = `
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 10px;">Choose wallet:</div>
            
            <div id="opt-metamask" style="
                display: flex; align-items: center; padding: 10px; margin: 5px 0;
                background: rgba(246, 133, 27, 0.1); border-radius: 8px; cursor: pointer;">
                <div style="width: 30px; height: 30px; background: #f6851b; border-radius: 6px;
                            display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <i class="fas fa-fox" style="color: white;"></i>
                </div>
                <span>MetaMask</span>
            </div>
            
            <div id="opt-trust" style="
                display: flex; align-items: center; padding: 10px; margin: 5px 0;
                background: rgba(51, 117, 187, 0.1); border-radius: 8px; cursor: pointer;">
                <div style="width: 30px; height: 30px; background: #3375bb; border-radius: 6px;
                            display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <i class="fas fa-wallet" style="color: white;"></i>
                </div>
                <span>Trust Wallet</span>
            </div>
            
            <div id="opt-coinbase" style="
                display: flex; align-items: center; padding: 10px; margin: 5px 0;
                background: rgba(0, 82, 255, 0.1); border-radius: 8px; cursor: pointer;">
                <div style="width: 30px; height: 30px; background: #0052ff; border-radius: 6px;
                            display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <i class="fas fa-coins" style="color: white;"></i>
                </div>
                <span>Coinbase Wallet</span>
            </div>
            
            <div id="disconnect-area" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid #334155;">
                <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">Connected:</div>
                <div id="wallet-address" style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px;"></div>
                <div id="btn-disconnect" style="
                    padding: 8px; background: rgba(239, 68, 68, 0.1); color: #ef4444;
                    border-radius: 6px; cursor: pointer; text-align: center;">
                    Disconnect
                </div>
            </div>
        `;
        
        // 4. ОБЕРТЫВАЕМ КНОПКУ
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        
        connectBtn.parentNode.insertBefore(wrapper, connectBtn);
        wrapper.appendChild(connectBtn);
        wrapper.appendChild(dropdown);
        
        // 5. ПЕРЕМЕННЫЕ
        let isConnected = false;
        let currentAddress = null;
        
        // 6. ОБНОВЛЕНИЕ КНОПКИ
        function updateButton() {
            if (isConnected && currentAddress) {
                // Подключено - зеленая кнопка
                const shortAddr = currentAddress.substring(0, 6) + '...' + currentAddress.substring(38);
                connectBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${shortAddr}`;
                connectBtn.style.background = '#10b981';
                
                // Показываем disconnect
                document.getElementById('disconnect-area').style.display = 'block';
                document.getElementById('wallet-address').textContent = currentAddress;
            } else {
                // Не подключено - оригинальная кнопка
                connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                connectBtn.style.background = '';
                
                // Скрываем disconnect
                document.getElementById('disconnect-area').style.display = 'none';
            }
        }
        
        // 7. ФУНКЦИЯ ДЛЯ ПОДКЛЮЧЕНИЯ
        function connectWrapper() {
            originalConnect().then(() => {
                // Проверяем подключение через секунду
                setTimeout(() => {
                    if (window.ethereum && window.ethereum.selectedAddress) {
                        isConnected = true;
                        currentAddress = window.ethereum.selectedAddress;
                        updateButton();
                    }
                }, 1000);
            });
        }
        
        // 8. ФУНКЦИЯ ДЛЯ ОТКЛЮЧЕНИЯ
        function disconnectWrapper() {
            if (confirm('Disconnect wallet?')) {
                isConnected = false;
                currentAddress = null;
                updateButton();
                
                // Скрываем балансы
                const balanceContainer = document.getElementById('balanceContainer');
                if (balanceContainer) {
                    balanceContainer.style.display = 'none';
                }
            }
        }
        
        // 9. ОБРАБОТЧИКИ СОБЫТИЙ
        // Клик по кнопке
        connectBtn.onclick = function(e) {
            e.stopPropagation();
            
            if (isConnected) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        };
        
        // Выбор MetaMask
        document.getElementById('opt-metamask').onclick = function() {
            dropdown.style.display = 'none';
            connectWrapper();
        };
        
        // Выбор Trust Wallet
        document.getElementById('opt-trust').onclick = function() {
            dropdown.style.display = 'none';
            alert('For ZUZIM Real DEX, use MetaMask');
            connectWrapper();
        };
        
        // Выбор Coinbase
        document.getElementById('opt-coinbase').onclick = function() {
            dropdown.style.display = 'none';
            alert('For ZUZIM Real DEX, use MetaMask');
            connectWrapper();
        };
        
        // Disconnect
        document.getElementById('btn-disconnect').onclick = disconnectWrapper;
        
        // Закрытие dropdown
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // 10. ПРОВЕРКА ТЕКУЩЕГО СОСТОЯНИЯ
        if (window.ethereum && window.ethereum.selectedAddress) {
            isConnected = true;
            currentAddress = window.ethereum.selectedAddress;
            updateButton();
        }
        
        // Слушаем изменения
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    isConnected = true;
                    currentAddress = accounts[0];
                    updateButton();
                } else {
                    disconnectWrapper();
                }
            });
        }
        
        console.log('Minimal Wallet Chooser: ready');
        
    }, 2000);
    
})();
