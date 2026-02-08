// МУЛЬТИКОШЕЛЬКОВЫЙ ВЫБОР ДЛЯ ZUZIM UNIVERSE
// НЕ МЕНЯЕТ СУЩЕСТВУЮЩИЙ ИНТЕРФЕЙС!

(function() {
    console.log('Multi-wallet selector loading...');
    
    // Ждем полной загрузки
    setTimeout(function() {
        
        // === 1. НАХОДИМ СУЩЕСТВУЮЩУЮ КНОПКУ CONNECT WALLET ===
        let connectBtn = null;
        
        // Ищем по тексту (точное совпадение)
        const allButtons = document.querySelectorAll('button');
        for (let btn of allButtons) {
            const btnText = btn.textContent || btn.innerText || '';
            if (btnText.trim() === 'Connect Wallet' || btnText.includes('Connect') && btnText.includes('Wallet')) {
                connectBtn = btn;
                break;
            }
        }
        
        // Ищем по классу если не нашли по тексту
        if (!connectBtn) {
            connectBtn = document.querySelector('.connect-wallet-btn, .wallet-btn');
        }
        
        if (!connectBtn) {
            console.log('Connect Wallet button not found');
            return;
        }
        
        console.log('Found Connect Wallet button:', connectBtn);
        
        // === 2. СОХРАНЯЕМ ОРИГИНАЛЬНЫЙ ФУНКЦИОНАЛ ===
        const originalHTML = connectBtn.innerHTML;
        const originalOnClick = connectBtn.onclick;
        const originalClasses = connectBtn.className;
        const originalStyle = connectBtn.style.cssText;
        
        // === 3. СОЗДАЕМ ДРОПДАУН ДЛЯ ВЫБОРА КОШЕЛЬКА ===
        function createWalletDropdown() {
            const dropdown = document.createElement('div');
            dropdown.id = 'zuzim-wallet-dropdown';
            dropdown.style.cssText = `
                display: none;
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 5px;
                background: #1a1a2e;
                border-radius: 10px;
                padding: 15px;
                min-width: 220px;
                z-index: 10000;
                border: 1px solid #334155;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                font-family: inherit;
            `;
            
            dropdown.innerHTML = `
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase;">SELECT WALLET</div>
                
                <div class="wallet-option" data-wallet="metamask" 
                     style="display: flex; align-items: center; padding: 12px; margin: 8px 0; 
                            background: rgba(246, 133, 27, 0.1); border-radius: 8px; cursor: pointer;
                            border: 1px solid rgba(246, 133, 27, 0.3); transition: all 0.2s;">
                    <div style="width: 32px; height: 32px; background: #f6851b; border-radius: 6px; 
                                display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                        <i class="fas fa-fox" style="color: white; font-size: 16px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">MetaMask</div>
                        <div style="font-size: 11px; color: #94a3b8;">Most popular</div>
                    </div>
                </div>
                
                <div class="wallet-option" data-wallet="trust" 
                     style="display: flex; align-items: center; padding: 12px; margin: 8px 0; 
                            background: rgba(51, 117, 187, 0.1); border-radius: 8px; cursor: pointer;
                            border: 1px solid rgba(51, 117, 187, 0.3); transition: all 0.2s;">
                    <div style="width: 32px; height: 32px; background: #3375bb; border-radius: 6px; 
                                display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                        <i class="fas fa-wallet" style="color: white; font-size: 16px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">Trust Wallet</div>
                        <div style="font-size: 11px; color: #94a3b8;">Mobile wallet</div>
                    </div>
                </div>
                
                <div class="wallet-option" data-wallet="coinbase" 
                     style="display: flex; align-items: center; padding: 12px; margin: 8px 0; 
                            background: rgba(0, 82, 255, 0.1); border-radius: 8px; cursor: pointer;
                            border: 1px solid rgba(0, 82, 255, 0.3); transition: all 0.2s;">
                    <div style="width: 32px; height: 32px; background: #0052ff; border-radius: 6px; 
                                display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                        <i class="fas fa-coins" style="color: white; font-size: 16px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">Coinbase Wallet</div>
                        <div style="font-size: 11px; color: #94a3b8;">Exchange wallet</div>
                    </div>
                </div>
                
                <div id="disconnect-option" 
                     style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #334155;">
                    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">CONNECTED WALLET</div>
                    <div id="connected-address" style="font-size: 11px; color: #cbd5e1; margin-bottom: 10px; word-break: break-all;"></div>
                    <div id="disconnect-btn" 
                         style="display: flex; align-items: center; justify-content: center; padding: 10px;
                                background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 8px; 
                                cursor: pointer; font-weight: 600; border: 1px solid rgba(239, 68, 68, 0.3);">
                        <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>
                        Disconnect
                    </div>
                </div>
            `;
            
            // Добавляем hover эффекты
            const options = dropdown.querySelectorAll('.wallet-option');
            options.forEach(opt => {
                opt.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                });
                opt.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
            
            return dropdown;
        }
        
        // === 4. СОЗДАЕМ И ДОБАВЛЯЕМ ДРОПДАУН ===
        const walletDropdown = createWalletDropdown();
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.position = 'relative';
        buttonWrapper.style.display = 'inline-block';
        
        // Оборачиваем кнопку
        connectBtn.parentNode.insertBefore(buttonWrapper, connectBtn);
        buttonWrapper.appendChild(connectBtn);
        buttonWrapper.appendChild(walletDropdown);
        
        // === 5. ФУНКЦИИ ДЛЯ РАБОТЫ С КОШЕЛЬКАМИ ===
        let isConnected = false;
        let currentAddress = null;
        
        function connectMetaMask() {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.request({ method: 'eth_requestAccounts' })
                    .then(accounts => {
                        if (accounts.length > 0) {
                            isConnected = true;
                            currentAddress = accounts[0];
                            updateButtonState();
                            updateDropdown();
                            console.log('Connected to MetaMask:', currentAddress);
                        }
                    })
                    .catch(err => {
                        console.error('MetaMask connection error:', err);
                        alert('Failed to connect MetaMask: ' + err.message);
                    });
            } else {
                alert('Please install MetaMask extension!');
            }
        }
        
        function disconnectWallet() {
            if (confirm('Disconnect wallet?')) {
                isConnected = false;
                currentAddress = null;
                updateButtonState();
                updateDropdown();
                console.log('Wallet disconnected');
            }
        }
        
        function updateButtonState() {
            if (isConnected && currentAddress) {
                // Подключено - зеленый цвет, показываем адрес
                const shortAddr = currentAddress.substring(0, 6) + '...' + currentAddress.substring(38);
                connectBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${shortAddr}`;
                connectBtn.style.background = '#10b981'; // Зеленый
                connectBtn.style.color = 'white';
                connectBtn.style.borderColor = '#10b981';
            } else {
                // Не подключено - возвращаем оригинальный вид
                connectBtn.innerHTML = originalHTML;
                connectBtn.className = originalClasses;
                connectBtn.style.cssText = originalStyle;
            }
        }
        
        function updateDropdown() {
            const disconnectSection = walletDropdown.querySelector('#disconnect-option');
            const disconnectBtn = walletDropdown.querySelector('#disconnect-btn');
            const addressSpan = walletDropdown.querySelector('#connected-address');
            
            if (isConnected && currentAddress) {
                disconnectSection.style.display = 'block';
                addressSpan.textContent = currentAddress;
                
                // Обработчик для disconnect
                disconnectBtn.onclick = disconnectWallet;
            } else {
                disconnectSection.style.display = 'none';
            }
        }
        
        // === 6. ОБРАБОТЧИКИ СОБЫТИЙ ===
        // Обработчик для кнопки Connect Wallet
        connectBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isConnected) {
                // Если уже подключен - показываем dropdown для отключения
                walletDropdown.style.display = walletDropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                // Если не подключен - показываем dropdown для выбора кошелька
                walletDropdown.style.display = walletDropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
        
        // Обработчики для выбора кошельков
        walletDropdown.querySelectorAll('.wallet-option').forEach(option => {
            option.addEventListener('click', function() {
                const walletType = this.getAttribute('data-wallet');
                walletDropdown.style.display = 'none';
                
                if (walletType === 'metamask') {
                    connectMetaMask();
                } else {
                    // Для Trust Wallet и Coinbase - сообщение
                    const walletNames = {
                        'trust': 'Trust Wallet',
                        'coinbase': 'Coinbase Wallet'
                    };
                    alert(`${walletNames[walletType]} - please use MetaMask for now with ZUZIM Universe`);
                    
                    // Все равно подключаем MetaMask если пользователь хочет
                    if (confirm('Use MetaMask instead?')) {
                        connectMetaMask();
                    }
                }
            });
        });
        
        // Закрываем dropdown при клике вне его
        document.addEventListener('click', function(e) {
            if (!buttonWrapper.contains(e.target)) {
                walletDropdown.style.display = 'none';
            }
        });
        
        // === 7. ПРОВЕРКА ТЕКУЩЕГО СОСТОЯНИЯ ПРИ ЗАГРУЗКЕ ===
        function checkInitialState() {
            if (window.ethereum && window.ethereum.selectedAddress) {
                isConnected = true;
                currentAddress = window.ethereum.selectedAddress;
                updateButtonState();
                updateDropdown();
            }
        }
        
        checkInitialState();
        
        // Слушаем изменения аккаунтов
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function(accounts) {
                if (accounts.length > 0) {
                    isConnected = true;
                    currentAddress = accounts[0];
                } else {
                    isConnected = false;
                    currentAddress = null;
                }
                updateButtonState();
                updateDropdown();
            });
        }
        
        console.log('Multi-wallet selector initialized successfully');
        
    }, 1000); // Даем время на загрузку страницы
    
})();
