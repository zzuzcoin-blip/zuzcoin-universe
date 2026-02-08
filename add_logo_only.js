// ДОБАВЛЕНИЕ ЛОГОТИПА ZUZCOIN В РАБОЧИЙ КОД
// Минимальные изменения - только замена иконок на логотип

console.log("🎨 Adding ZUZCOIN logo to working interface...");

// Функция для замены иконок на логотип
function replaceIconsWithLogo() {
    console.log("🔄 Replacing icons with ZUZCOIN logo...");
    
    // 1. Заменяем иконку в заголовке
    const headerIcon = document.querySelector('.logo i.fa-coins');
    if (headerIcon) {
        headerIcon.outerHTML = `
            <img src="ZUZCOIN.png" 
                 alt="ZUZCOIN" 
                 style="width: 32px; height: 32px; border-radius: 50%;">
        `;
        console.log("✅ Header icon replaced");
    }
    
    // 2. Обновляем отображение баланса ZUZ
    updateZuzBalanceWithLogo();
    
    // 3. Обновляем баннер DEX
    updateDexBannerWithLogo();
    
    // 4. Обновляем торговую панель
    updateTradingPanelWithLogo();
    
    console.log("✅ All icons replaced with ZUZCOIN logo");
}

// Обновляем отображение баланса ZUZ с логотипом
function updateZuzBalanceWithLogo() {
    const zuzBalanceElement = document.getElementById('zuzBalance');
    if (zuzBalanceElement) {
        const currentValue = zuzBalanceElement.textContent;
        zuzBalanceElement.innerHTML = `
            <img src="ZUZCOIN.png" 
                 alt="ZUZ" 
                 style="width: 16px; height: 16px; margin-right: 5px; border-radius: 50%; vertical-align: middle;">
            ${currentValue}
        `;
        console.log("✅ ZUZ balance display updated");
    }
}

// Обновляем баннер DEX с логотипом
function updateDexBannerWithLogo() {
    const dexBanner = document.getElementById('realDexBanner');
    if (dexBanner) {
        dexBanner.innerHTML = `
            <img src="ZUZCOIN.png" 
                 alt="ZUZ" 
                 style="width: 20px; height: 20px; margin-right: 10px; border-radius: 50%; vertical-align: middle;">
            <strong>🚀 ZUZCOIN DEX LIVE!</strong> ZUZIM DEX: 0x09970975aa48c718e17db4a18128ebf6806e1f2c
            <img src="ZUZCOIN.png" 
                 alt="ZUZ" 
                 style="width: 20px; height: 20px; margin-left: 10px; border-radius: 50%; vertical-align: middle;">
        `;
        console.log("✅ DEX banner updated");
    }
}

// Обновляем торговую панель с логотипом
function updateTradingPanelWithLogo() {
    const tradingPanelTitle = document.querySelector('.real-trading-panel h3');
    if (tradingPanelTitle && tradingPanelTitle.innerHTML.includes('REAL DEX Trading')) {
        tradingPanelTitle.innerHTML = `
            <img src="ZUZCOIN.png" 
                 alt="ZUZ" 
                 style="width: 24px; height: 24px; margin-right: 10px; border-radius: 50%;">
            <i class="fas fa-exchange-alt"></i> ZUZCOIN DEX Trading
        `;
        console.log("✅ Trading panel updated");
    }
}

// Наблюдатель за изменениями баланса
function setupBalanceObserver() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'zuzBalance' && mutation.target.textContent !== mutation.oldValue) {
                // Небольшая задержка чтобы DOM обновился
                setTimeout(updateZuzBalanceWithLogo, 100);
            }
        });
    });
    
    const balanceElement = document.getElementById('zuzBalance');
    if (balanceElement) {
        observer.observe(balanceElement, { 
            characterData: true,
            childList: true,
            subtree: true 
        });
        console.log("✅ Balance observer set up");
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎨 Initializing ZUZCOIN logo integration...");
    
    // Ждем немного чтобы все загрузилось
    setTimeout(() => {
        replaceIconsWithLogo();
        setupBalanceObserver();
        console.log("✅ ZUZCOIN logo integration complete");
    }, 500);
});

// Экспортируем функции для отладки
window.zuzLogo = {
    replaceIcons: replaceIconsWithLogo,
    updateBalance: updateZuzBalanceWithLogo,
    updateBanner: updateDexBannerWithLogo
};
