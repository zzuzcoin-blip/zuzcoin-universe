// СКРИПТ ТОЛЬКО ДЛЯ ДОБАВЛЕНИЯ DISCONNECT И КОШЕЛЬКОВ
// НЕ МЕНЯЕТ ИНТЕРФЕЙС!

(function() {
    console.log('Wallet manager: adding disconnect and multi-wallet support');
    
    // Ждем полной загрузки
    setTimeout(function() {
        
        // === 1. НАХОДИМ СУЩЕСТВУЮЩУЮ КНОПКУ CONNECT WALLET ===
        let connectButton = null;
        
        // Ищем по тексту
        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            const text = btn.textContent || btn.innerText;
            if (text.toLowerCase().includes('connect') && text.toLowerCase().includes('wallet')) {
                connectButton = btn;
                break;
            }
        }
        
        // Ищем по классу
        if (!connectButton) {
            connectButton = document.querySelector('.connect-wallet-btn, .wallet-btn, [class*="connect"]');
        }
        
        if (!connectButton) {
            console.log('Connect button not found');
            return;
        }
        
        console.log('Found connect button:', connectButton);
        
        // === 2. СОХРАНЯЕМ ОРИГИНАЛЬНЫЙ ФУНКЦИОНАЛ ===
        const originalHTML = connectButton.innerHTML;
        const originalOnClick = connectButton.onclick;
        const originalClasses = connectButton.className;
        const originalStyle = connectButton.style.cssText;
        
        // === 3. СОЗДАЕМ ДИНАМИЧЕСКИЙ ДРОПДАУН ДЛЯ КОШЕЛЬКОВ ===
        function createWalletDropdown() {
            const dropdown = document.createElement('div');
            dropdown.id = 'wallet-selector-dropdown';
            dropdown.style.cssText = `
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 5px;
                background: #1a1a2e;
                border-radius: 10px;
                padding: 10px;
                min-width: 200px;
                z-index: 1000;
                border: 1px solid #333;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            `;
            
            dropdown.innerHTML = `
                <div style="margin-bottom: 10px; font-size: 12px; color: #888;">Select Wallet:</div>
                <div class="wallet-option" data-wallet="metamask" style="padding: 10px; margin: 5px 0; background: #333; border-radius: 5px; cursor: pointer; display: flex; align-items: center;">
                    <div style="width: 30px; height: 30px; background: #f6851b; border-radius: 5px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-fox" style="color: white;"></i>
                    </div>
                    <span>MetaMask</span>
                </div>
                <div class="wallet-option" data-wallet="trust" style="padding: 10px; margin: 5px 0; background: #333; border-radius: 5px; cursor: pointer; display: flex; align-items: center;">
                    <div style="width: 30px; height: 30px; background: #3375bb; border-radius: 5px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-wallet" style="color: white;"></i>
                    </div>
                    <span>Trust Wallet</span>
                </div>
                <div class="wallet-option" data-wallet="coinbase" style="padding: 10px; margin: 5px 0; background: #333; border-radius: 5px; cursor: pointer; display: flex; align-items: center;">
                    <div style="width: 30px; height: 30px; background: #0052ff; border-radius: 5px; margin-right: 10px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-coins" style="color: white;"></i>
                    </div>
                    <span>Coinbase Wallet</span>
                </div>
                <div id="disconnect-btn" style="padding: 10px; margin: 5px 0; background: #662222; border-radius: 5px; cursor: pointer; display: none; text-align: center; color: #ff6666;">
                    <i class="fas fa-sign-out-alt"></i> Disconnect
                </div>
            `;
            
            // Добавляем в body
            document.body.appendChild(dropdown);
            
            // Обработчики для опций кошельков
            dropdown.querySelectorAll('.wallet-option').forEach(option => {
                option.addEventListener('click', function() {
                    const walletType = this.getAttribute('data-wallet');
                    if (walletType === 'metamask') {
                        // Используем оригинальную функцию подключения
                        if (originalOnClick) {
                            originalOnClick.call(connectButton);
                        } else if (typeof window.ethereum !== 'undefined') {
                            window.ethereum.request({ method: 'eth_requestAccounts' });
                        }
                    } else {
                        alert(walletType + ' Wallet - use MetaMask for now');
                    }
                    dropdown.style.display = 'none';
                });
            });
            
            // Обработчик для disconnect
            dropdown.querySelector('#disconnect-btn').addEventListener('click', function() {
                if (confirm('Disconnect wallet?')) {
                    alert('Disconnected (UI only). For full disconnect use wallet extension.');
                    updateButtonState(false, null);
                }
                dropdown.style.display = 'none';
            });
            
            return dropdown;
        }
        
        // === 4. СОЗДАЕМ ДРОПДАУН И ОБЕРТКУ ===
        const dropdown = createWalletDropdown();
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        
        // Оборачиваем кнопку
        connectButton.parentNode.insertBefore(wrapper, connectButton);
        wrapper.appendChild(connectButton);
        wrapper.appendChild(dropdown);
        
        // === 5. ФУНКЦИЯ ОБНОВЛЕНИЯ СОСТОЯНИЯ КНОПКИ ===
        function updateButtonState(isConnected, address) {
            if (isConnected && address) {
                // Подключено - меняем на Disconnect
                const shortAddr = address.substring(0, 6) + '...' + address.substring(38);
                connectButton.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${shortAddr}`;
                connectButton.style.background = '#662222';
                connectButton.style.color = '#ff9999';
                
                // Показываем кнопку disconnect в dropdown
                dropdown.querySelector('#disconnect-btn').style.display = 'block';
            } else {
                // Не подключено - оригинальный вид
                connectButton.innerHTML = originalHTML;
                connectButton.className = originalClasses;
                connectButton.style.cssText = originalStyle;
                
                // Скрываем кнопку disconnect в dropdown
                dropdown.querySelector('#disconnect-btn').style.display = 'none';
            }
        }
        
        // === 6. ОБРАБОТЧИК КЛИКА ПО КНОПКЕ ===
        connectButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Проверяем состояние подключения
            if (window.ethereum && window.ethereum.selectedAddress) {
                // Уже подключено - показываем dropdown
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                // Не подключено - используем оригинальный функционал
                if (originalOnClick) {
                    originalOnClick.call(this);
                }
            }
        });
        
        // === 7. ПРОВЕРКА ТЕКУЩЕГО СОСТОЯНИЯ ===
        function checkConnection() {
            if (window.ethereum && window.ethereum.selectedAddress) {
                updateButtonState(true, window.ethereum.selectedAddress);
            } else {
                updateButtonState(false, null);
            }
        }
        
        // Проверяем при загрузке
        checkConnection();
        
        // Слушаем изменения
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function(accounts) {
                if (accounts.length > 0) {
                    updateButtonState(true, accounts[0]);
                } else {
                    updateButtonState(false, null);
                }
            });
        }
        
        // Закрываем dropdown при клике вне его
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // === 8. ПЕРИОДИЧЕСКАЯ ПРОВЕРКА ===
        setInterval(checkConnection, 3000);
        
    }, 1500); // Даем время на загрузку
    
})();
