// МИКРО-SCRIPT ТОЛЬКО ДЛЯ DISCONNECT
// Добавляется к существующей кнопке

(function() {
    // Ждем загрузки
    setTimeout(() => {
        // Ищем кнопку Connect Wallet
        const buttons = document.getElementsByTagName('button');
        let connectBtn = null;
        
        for (let btn of buttons) {
            if (btn.textContent.includes('Connect') && btn.textContent.includes('Wallet')) {
                connectBtn = btn;
                break;
            }
        }
        
        if (!connectBtn) {
            // Ищем по классу
            connectBtn = document.querySelector('.connect-wallet-btn, .wallet-btn');
        }
        
        if (connectBtn) {
            console.log('Found connect button, adding disconnect feature');
            
            // Сохраняем оригинал
            const originalHTML = connectBtn.innerHTML;
            const originalOnClick = connectBtn.onclick;
            const originalStyle = connectBtn.style.cssText;
            
            // Функция обновления кнопки
            function updateButton() {
                if (window.ethereum && window.ethereum.selectedAddress) {
                    // Подключено - показываем Disconnect
                    const addr = window.ethereum.selectedAddress;
                    const shortAddr = addr.slice(0,6) + '...' + addr.slice(-4);
                    connectBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Disconnect (${shortAddr})`;
                    connectBtn.style.background = '#dc2626';
                    connectBtn.style.color = 'white';
                    
                    // Disconnect функция
                    connectBtn.onclick = function() {
                        if (confirm('Disconnect wallet?')) {
                            alert('To fully disconnect, please use MetaMask extension.');
                            // Обновляем UI
                            connectBtn.innerHTML = originalHTML;
                            connectBtn.style.cssText = originalStyle;
                            connectBtn.onclick = originalOnClick;
                        }
                    };
                } else {
                    // Не подключено - оставляем как было
                    connectBtn.innerHTML = originalHTML;
                    connectBtn.style.cssText = originalStyle;
                    connectBtn.onclick = originalOnClick;
                }
            }
            
            // Обновляем при загрузке
            updateButton();
            
            // Следим за изменениями
            if (window.ethereum) {
                window.ethereum.on('accountsChanged', updateButton);
            }
            
            // Периодическая проверка
            setInterval(updateButton, 2000);
        }
    }, 1000);
})();
