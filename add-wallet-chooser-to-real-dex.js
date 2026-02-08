// ДОБАВЛЕНИЕ ВЫБОРА КОШЕЛЬКОВ К РАБОЧЕЙ ВЕРСИИ REAL DEX
// НЕ МЕНЯЕТ ИНТЕРФЕЙС, ТОЛЬКО ДОБАВЛЯЕТ ФУНКЦИОНАЛ

(function() {
    console.log('Wallet Chooser for Real DEX: loading...');
    
    // Ждем полной загрузки страницы
    setTimeout(function() {
        
        // 1. НАХОДИМ КНОПКУ CONNECT WALLET В РАБОЧЕЙ ВЕРСИИ
        const connectBtn = document.getElementById('connectWalletBtn');
        if (!connectBtn) {
            console.error('Connect Wallet button not found!');
            return;
        }
        
        console.log('Found Connect Wallet button in Real DEX version');
        
        // 2. СОХРАНЯЕМ ОРИГИНАЛЬНЫЙ ФУНКЦИОНАЛ
        const originalHTML = connectBtn.innerHTML;
        const originalOnClick = connectBtn.onclick;
        
        // 3. СОЗДАЕМ ДРОПДАУН ДЛЯ ВЫБОРА КОШЕЛЬКОВ
        const dropdown = document.createElement('div');
        dropdown.id = 'realDexWalletDropdown';
        dropdown.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 5px;
            background: #1a1a2e;
            border-radius: 12px;
            padding: 15px;
            width: 260px;
            z-index: 10000;
            border: 1px solid #334155;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            font-family: 'Inter', sans-serif;
        `;
        
        dropdown.innerHTML = `
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 12px; font-weight: 600; text-transform: uppercase;">
                SELECT WALLET
            </div>
            
            <!-- MetaMask -->
            <div class="wallet-option" data-wallet="metamask" style="
                display: flex; align-items: center; padding: 12px; margin: 8px 0;
                background: rgba(246, 133, 27, 0.1); border-radius: 10px; cursor: pointer;
                border: 1px solid rgba(246, 133, 27, 0.3); transition: all 0.2s;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f6851b, #e2761b);
                            border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <i class="fas fa-fox" style="color: white; font-size: 20px;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 15px;">MetaMask</div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">For ZUZIM Real DEX</div>
                </div>
            </div>
            
            <!-- Trust Wallet -->
            <div class="wallet-option" data-wallet="trust" style="
                display: flex; align-items: center; padding: 12px; margin: 8px 0;
                background: rgba(51, 117, 187, 0.1); border-radius: 10px; cursor: pointer;
                border: 1px solid rgba(51, 117, 187, 0.3); transition: all 0.2s;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3375bb, #1c5aa5);
                            border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <i class="fas fa-wallet" style="color: white; font-size: 20px;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 15px;">Trust Wallet</div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Mobile wallet</div>
                </div>
            </div>
            
            <!-- Coinbase Wallet -->
            <div class="wallet-option" data-wallet="coinbase" style="
                display: flex; align-items: center; padding: 12px; margin: 8px 0;
                background: rgba(0, 82, 255, 0.1); border-radius: 10px; cursor: pointer;
                border: 1px solid rgba(0, 82, 255, 0.3); transition: all 0.2s;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0052ff, #0041cc);
                            border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                    <i class="fas fa-coins" style="color: white; font-size: 20px;"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 15px;">Coinbase Wallet</div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Exchange wallet</div>
                </div>
            </div>
            
            <!-- Disconnect Section -->
            <div id="disconnectSection" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #334155;">
                <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px; font-weight: 600;">CONNECTED</div>
                <div id="connectedAddress" style="font-size: 11px; color: #cbd5e1; margin-bottom: 12px; word-break: break-all;"></div>
                <div id="disconnectBtn" style="
                    display: flex; align-items: center; justify-content: center; padding: 10px;
                    background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 8px;
                    cursor: pointer; font-weight: 600; border: 1px solid rgba(239, 68, 68, 0.3);
                    transition: all 0.2s;">
                    <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>
                    Disconnect
                </div>
            </div>
        `;
        
        // 4. СОЗДАЕМ ОБЕРТКУ ДЛЯ КНОПКИ
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        
        // Оборачиваем кнопку
        connectBtn.parentNode.insertBefore(wrapper, connectBtn);
        wrapper.appendChild(connectBtn);
        wrapper.appendChild(dropdown);
        
        // 5. НАСТРОЙКА ПОВЕДЕНИЯ
        let isConnected = false;
        let currentAddress = null;
        
        // Функция для обновления состояния кнопки
        function updateButtonState() {
            if (isConnected && currentAddress) {
                // Подключено - зеленая кнопка с адресом
                const shortAddr = currentAddress.substring(0, 6) + '...' + currentAddress.substring(38);
                connectBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${shortAddr}`;
                connectBtn.style.background = '#10b981'; // Зеленый
                
                // Показываем секцию disconnect в dropdown
                document.getElementById('disconnectSection').style.display = 'block';
                document.getElementById('connectedAddress').textContent = currentAddress;
            } else {
                // Не подключено - оригинальная кнопка
                connectBtn.innerHTML = originalHTML;
                connectBtn.style.background = ''; // Возвращаем оригинальный цвет
                
                // Скрываем секцию disconnect
                document.getElementById('disconnectSection').style.display = 'none';
            }
        }
        
        // Функция для подключения MetaMask (используем оригинальную функцию)
        function connectMetaMaskWrapper() {
            // Вызываем оригинальную функцию connectMetaMask
            if (typeof window.connectMetaMask === 'function') {
                window.connectMetaMask();
            }
            
            // Проверяем подключение через секунду
            setTimeout(function() {
                if (window.ethereum && window.ethereum.selectedAddress) {
                    isConnected = true;
                    currentAddress = window.ethereum.selectedAddress;
                    updateButtonState();
                }
            }, 1000);
        }
        
        // Функция для отключения
        function disconnectWallet() {
            if (confirm('Disconnect wallet from ZUZIM Real DEX?')) {
                isConnected = false;
                currentAddress = null;
                updateButtonState();
                
                // Также скрываем балансы если они показываются
                const balanceContainer = document.getElementById('balanceContainer');
                if (balanceContainer) {
                    balanceContainer.style.display = 'none';
                }
                
                alert('Wallet disconnected from UI. For full disconnect, use wallet extension.');
            }
        }
        
        // 6. ОБРАБОТЧИКИ СОБЫТИЙ
        // Клик по кнопке Connect Wallet
        connectBtn.onclick = function(e) {
            e.stopPropagation();
            
            if (isConnected) {
                // Если подключен - показываем dropdown с disconnect
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                // Если не подключен - показываем выбор кошелька
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        };
        
        // Выбор MetaMask
        dropdown.querySelector('[data-wallet="metamask"]').addEventListener('click', function() {
            dropdown.style.display = 'none';
            connectMetaMaskWrapper();
        });
        
        // Выбор Trust Wallet
        dropdown.querySelector('[data-wallet="trust"]').addEventListener('click', function() {
            dropdown.style.display = 'none';
            alert('Trust Wallet: Use MetaMask for full ZUZIM Real DEX functionality');
            connectMetaMaskWrapper();
        });
        
        // Выбор Coinbase Wallet
        dropdown.querySelector('[data-wallet="coinbase"]').addEventListener('click', function() {
            dropdown.style.display = 'none';
            alert('Coinbase Wallet: Use MetaMask for full ZUZIM Real DEX functionality');
            connectMetaMaskWrapper();
        });
        
        // Кнопка Disconnect
        document.getElementById('disconnectBtn').addEventListener('click', disconnectWallet);
        
        // Закрытие dropdown при клике вне его
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // 7. ДОБАВЛЯЕМ HOVER ЭФФЕКТЫ
        const walletOptions = dropdown.querySelectorAll('.wallet-option');
        walletOptions.forEach(option => {
            option.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });
            
            option.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Hover для кнопки disconnect
        const disconnectBtn = document.getElementById('disconnectBtn');
        disconnectBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(239, 68, 68, 0.2)';
            this.style.transform = 'translateY(-1px)';
        });
        
        disconnectBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(239, 68, 68, 0.1)';
            this.style.transform = 'translateY(0)';
        });
        
        // 8. ПРОВЕРКА ТЕКУЩЕГО СОСТОЯНИЯ
        function checkInitialConnection() {
            if (window.ethereum && window.ethereum.selectedAddress) {
                isConnected = true;
                currentAddress = window.ethereum.selectedAddress;
                updateButtonState();
            }
        }
        
        checkInitialConnection();
        
        // Слушаем изменения в MetaMask
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function(accounts) {
                if (accounts.length > 0) {
                    isConnected = true;
                    currentAddress = accounts[0];
                    updateButtonState();
                } else {
                    // Пользователь отключился в MetaMask
                    disconnectWallet();
                }
            });
        }
        
        console.log('Wallet Chooser for Real DEX: initialized successfully');
        
    }, 2000); // Даем время на загрузку реального DEX
    
})();
