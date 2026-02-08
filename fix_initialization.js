// ИСПРАВЛЕННАЯ ИНИЦИАЛИЗАЦИЯ ДЛЯ ZUZCOIN
document.addEventListener('DOMContentLoaded', function() {
    console.log("ZUZCOIN Universe initialized");
    
    // Инициализация TradingView
    if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
            "container_id": "tradingview_chart",
            "width": "100%",
            "height": "100%",
            "symbol": "ETHUSD",
            "interval": "D",
            "timezone": "exchange",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#0e1a2d",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "details": true,
            "studies": ["RSI@tv-basicstudies"],
            "show_popup_button": true,
            "popup_width": "1000",
            "popup_height": "650"
        });
    }
    
    // Назначаем кнопке правильный обработчик
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
        console.log("✅ Connect button found");
        
        // Проверяем если уже есть функция showWalletModal
        if (typeof showWalletModal === 'function') {
            connectBtn.onclick = showWalletModal;
            console.log("Button handler set to showWalletModal");
        } else {
            console.log("showWalletModal not found, using fallback");
            connectBtn.onclick = function() {
                alert("Wallet modal function not loaded yet. Please refresh the page.");
            };
        }
    } else {
        console.error("❌ Connect button not found!");
    }
    
    // Авто-подключение если уже подключен в MetaMask
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
        console.log("Already connected to MetaMask, auto-connecting...");
        setTimeout(() => {
            if (typeof connectMetaMask === 'function') {
                connectMetaMask();
            }
        }, 1000);
    }
    
    // Авто-расчет total
    const amountInput = document.getElementById('amountInput');
    const priceInput = document.getElementById('priceInput');
    const totalInput = document.getElementById('totalInput');
    
    function updateTotal() {
        const amount = parseFloat(amountInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        if (totalInput) {
            totalInput.value = (amount * price).toFixed(4);
        }
    }
    
    if (amountInput && priceInput) {
        amountInput.addEventListener('input', updateTotal);
        priceInput.addEventListener('input', updateTotal);
        updateTotal(); // Initial calculation
    }
    
    console.log("✅ Initialization complete");
});
