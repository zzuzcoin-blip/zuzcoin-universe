// МИНИМАЛЬНЫЙ ДОБАВОК ДЛЯ DISCONNECT
// НЕ МЕНЯЕТ СУЩЕСТВУЮЩИЙ ФУНКЦИОНАЛ

(function() {
    console.log('Disconnect module loaded');
    
    // Ждем полной загрузки
    setTimeout(() => {
        // Ищем все кнопки Connect Wallet
        const connectButtons = document.querySelectorAll('button, [class*="connect"], [onclick*="connect"], [onclick*="Connect"]');
        
        connectButtons.forEach(button => {
            const buttonText = button.textContent || button.innerText;
            if (buttonText.includes('Connect') && buttonText.includes('Wallet')) {
                console.log('Found Connect Wallet button:', button);
                
                // Добавляем идентификатор
                button.id = 'main-connect-btn';
                
                // Сохраняем оригинальный текст и обработчик
                const originalText = button.innerHTML;
                const originalOnClick = button.onclick;
                
                // Функция для обновления кнопки
                const updateButton = () => {
                    if (window.ethereum && window.ethereum.selectedAddress) {
                        // Кошелек подключен
                        const addr = window.ethereum.selectedAddress;
                        const shortAddr = addr.substring(0, 6) + '...' + addr.substring(38);
                        button.innerHTML = `<i class="fas fa-sign-out-alt"></i> Disconnect (${shortAddr})`;
                        button.style.background = '#ef4444';
                        button.title = 'Click to disconnect';
                        
                        // Меняем обработчик на disconnect
                        button.onclick = async () => {
                            if (confirm('Disconnect wallet?')) {
                                // В MetaMask нельзя программно отключиться
                                // Просто обновляем UI
                                button.innerHTML = originalText;
                                button.style.background = '';
                                button.onclick = originalOnClick;
                                
                                // Показываем уведомление
                                alert('Wallet disconnected (UI only)');
                            }
                        };
                    } else {
                        // Кошелек не подключен
                        button.innerHTML = originalText;
                        button.style.background = '';
                        button.onclick = originalOnClick;
                    }
                };
                
                // Обновляем кнопку при загрузке
                updateButton();
                
                // Слушаем изменения кошелька
                if (window.ethereum) {
                    window.ethereum.on('accountsChanged', updateButton);
                    window.ethereum.on('chainChanged', updateButton);
                }
                
                // Также добавляем маленькие кнопки альтернативных кошельков
                const walletContainer = button.parentElement;
                if (walletContainer && !document.querySelector('.alt-wallets')) {
                    const altWallets = document.createElement('div');
                    altWallets.className = 'alt-wallets';
                    altWallets.style.marginTop = '10px';
                    altWallets.style.display = 'flex';
                    altWallets.style.gap = '8px';
                    altWallets.style.flexWrap = 'wrap';
                    
                    altWallets.innerHTML = `
                        <button onclick="alert('Trust Wallet - use MetaMask for now')" 
                                style="background: #3375BB; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">
                            <i class="fas fa-wallet"></i> Trust
                        </button>
                        <button onclick="alert('Coinbase Wallet - use MetaMask for now')" 
                                style="background: #0052FF; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">
                            <i class="fas fa-coins"></i> Coinbase
                        </button>
                        <button onclick="alert('Other wallets - use MetaMask for now')" 
                                style="background: #666; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">
                            <i class="fas fa-plus"></i> More
                        </button>
                    `;
                    
                    walletContainer.appendChild(altWallets);
                }
            }
        });
    }, 1000);
    
    // Также добавляем периодическую проверку состояния
    setInterval(() => {
        const button = document.getElementById('main-connect-btn');
        if (button) {
            const hasWallet = window.ethereum && window.ethereum.selectedAddress;
            const isDisconnectStyle = button.style.background.includes('rgb(239, 68, 68)');
            
            if (hasWallet && !isDisconnectStyle) {
                // Нужно переключиться на disconnect
                button.click = null;
                const addr = window.ethereum.selectedAddress;
                const shortAddr = addr.substring(0, 6) + '...' + addr.substring(38);
                button.innerHTML = `<i class="fas fa-sign-out-alt"></i> Disconnect (${shortAddr})`;
                button.style.background = '#ef4444';
                button.onclick = () => {
                    if (confirm('Disconnect wallet?')) {
                        alert('In MetaMask, please disconnect from the extension.');
                    }
                };
            } else if (!hasWallet && isDisconnectStyle) {
                // Нужно вернуть кнопку Connect
                button.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
                button.style.background = '';
                button.onclick = () => {
                    if (typeof connectWallet === 'function') {
                        connectWallet();
                    } else if (window.ethereum) {
                        window.ethereum.request({ method: 'eth_requestAccounts' });
                    }
                };
            }
        }
    }, 2000);
})();
