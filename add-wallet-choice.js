// МИНИМАЛЬНОЕ РАСШИРЕНИЕ ДЛЯ ВЫБОРА КОШЕЛЬКОВ
// НЕ МЕНЯЕТ СУЩЕСТВУЮЩИЙ ФУНКЦИОНАЛ!

(function() {
    console.log('ZUZIM Wallet Choice: initializing...');
    
    // Ждем полной загрузки
    setTimeout(function() {
        
        // 1. НАХОДИМ ОРИГИНАЛЬНУЮ КНОПКУ
        let originalBtn = null;
        
        // Способ 1: Ищем по ID
        originalBtn = document.getElementById('connect-wallet-btn');
        
        // Способ 2: Ищем по классу
        if (!originalBtn) {
            originalBtn = document.querySelector('.connect-wallet-btn, .wallet-btn');
        }
        
        // Способ 3: Ищем по тексту
        if (!originalBtn) {
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.textContent && btn.textContent.includes('Connect Wallet')) {
                    originalBtn = btn;
                    break;
                }
            }
        }
        
        if (!originalBtn) {
            console.error('Original Connect Wallet button not found!');
            return;
        }
        
        console.log('Found original button:', originalBtn);
        
        // 2. СОХРАНЯЕМ ОРИГИНАЛЬНЫЙ ФУНКЦИОНАЛ
        const originalHTML = originalBtn.innerHTML;
        const originalClass = originalBtn.className;
        const originalStyle = originalBtn.style.cssText;
        const originalOnClick = originalBtn.onclick;
        
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
            width: 240px;
            z-index: 1000;
            border: 1px solid #334155;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        `;
        
        dropdown.innerHTML = `
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 10px;">Choose Wallet:</div>
            
            <div id="opt-metamask" style="
                display: flex; align-items: center; padding: 12px; margin: 8px 0;
                background: rgba(246, 133, 27, 0.1); border-radius: 8px; cursor: pointer;
                border: 1px solid rgba(246, 133, 27, 0.3);">
                <div style="width: 32px; height: 32px; background: #f6851b; border-radius: 6px;
                            display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <i class="fas fa-fox" style="color: white;"></i>
                </div>
                <span style="font-weight: 600;">MetaMask</span>
            </div>
            
            <div id="opt-trust" style="
                display: flex; align-items: center; padding: 12px; margin: 8px 0;
                background: rgba(51, 117, 187, 0.1); border-radius: 8px; cursor: pointer;
                border: 1px solid rgba(51, 117, 187, 0.3);">
                <div style="width: 32px; height: 32px; background: #3375bb; border-radius: 6px;
                            display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <i class="fas fa-wallet" style="color: white;"></i>
                </div>
                <span style="font-weight: 600;">Trust Wallet</span>
            </div>
            
            <div id="opt-coinbase" style="
                display: flex; align-items: center; padding: 12px; margin: 8px 0;
                background: rgba(0, 82, 255, 0.1); border-radius: 8px; cursor: pointer;
                border: 1px solid rgba(0, 82, 255, 0.3);">
                <div style="width: 32px; height: 32px; background: #0052ff; border-radius: 6px;
                            display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                    <i class="fas fa-coins" style="color: white;"></i>
                </div>
                <span style="font-weight: 600;">Coinbase Wallet</span>
            </div>
            
            <div id="disconnect-area" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #334155;">
                <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">Connected:</div>
                <div id="wallet-address" style="font-size: 11px; color: #cbd5e1; margin-bottom: 10px;"></div>
                <div id="btn-disconnect" style="
                    padding: 10px; background: rgba(239, 68, 68, 0.1); color: #ef4444;
                    border-radius: 6px; cursor: pointer; text-align: center; font-weight: 600;">
                    Disconnect
                </div>
            </div>
        `;
        
        // 4. ОБЕРТЫВАЕМ КНОПКУ
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        
        originalBtn.parentNode.insertBefore(wrapper, originalBtn);
        wrapper.appendChild(originalBtn);
        wrapper.appendChild(dropdown);
        
        // 5. ОСНОВНАЯ ЛОГИКА
        let isConnected = false;
        
        // Функция для подключения
        function connectWallet() {
            // Используем оригинальный функционал
            if (originalOnClick) {
                originalOnClick.call(originalBtn);
            } else if (typeof connectWallet === 'function') {
                window.connectWallet();
            }
            
            // Через секунду проверяем подключение
            setTimeout(function() {
                if (window.ethereum && window.ethereum.selectedAddress) {
                    setConnected(window.ethereum.selectedAddress);
                }
            }, 1000);
        }
        
        // Функция установки состояния "подключено"
        function setConnected(address) {
            isConnected = true;
            
            // Меняем кнопку на зеленую
            const shortAddr = address.substring(0, 6) + '...' + address.substring(38);
            originalBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${shortAddr}`;
            originalBtn.style.background = '#10b981';
            originalBtn.style.color = 'white';
            
            // Показываем disconnect в dropdown
            document.getElementById('disconnect-area').style.display = 'block';
            document.getElementById('wallet-address').textContent = address;
        }
        
        // Функция отключения
        function disconnectWallet() {
            if (confirm('Disconnect wallet?')) {
                isConnected = false;
                
                // Восстанавливаем оригинальную кнопку
                originalBtn.innerHTML = originalHTML;
                originalBtn.className = originalClass;
                originalBtn.style.cssText = originalStyle;
                
                // Скрываем disconnect
                document.getElementById('disconnect-area').style.display = 'none';
            }
        }
        
        // 6. ОБРАБОТЧИКИ СОБЫТИЙ
        // Клик по основной кнопке
        originalBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isConnected) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            } else {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
        
        // Выбор MetaMask
        document.getElementById('opt-metamask').addEventListener('click', function() {
            dropdown.style.display = 'none';
            connectWallet();
        });
        
        // Выбор Trust Wallet
        document.getElementById('opt-trust').addEventListener('click', function() {
            dropdown.style.display = 'none';
            alert('Use MetaMask for ZUZIM Universe');
            connectWallet();
        });
        
        // Выбор Coinbase
        document.getElementById('opt-coinbase').addEventListener('click', function() {
            dropdown.style.display = 'none';
            alert('Use MetaMask for ZUZIM Universe');
            connectWallet();
        });
        
        // Disconnect
        document.getElementById('btn-disconnect').addEventListener('click', disconnectWallet);
        
        // Закрытие dropdown
        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
        
        // 7. ПРОВЕРКА НАЧАЛЬНОГО СОСТОЯНИЯ
        if (window.ethereum && window.ethereum.selectedAddress) {
            setConnected(window.ethereum.selectedAddress);
        }
        
        // Слушаем изменения
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', function(accounts) {
                if (accounts.length > 0) {
                    setConnected(accounts[0]);
                } else {
                    disconnectWallet();
                }
            });
        }
        
        console.log('ZUZIM Wallet Choice: initialized');
        
    }, 1500);
    
})();
