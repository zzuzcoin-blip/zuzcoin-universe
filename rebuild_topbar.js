const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('🔨 ПЕРЕСТРАИВАЕМ TOP-BAR ПРАВИЛЬНО');

// Удаляем весь существующий top-bar
const topBarRegex = /<div class="top-bar">[\s\S]*?<\/div>/;
const oldTopBar = html.match(topBarRegex);
if (oldTopBar) {
  console.log('Найден старый top-bar, заменяем...');
}

// Новый ПРАВИЛЬНЫЙ top-bar
const newTopBar = `<div class="top-bar">
  <!-- БУРГЕР-МЕНЮ - всегда слева и всегда видим на мобильных -->
  <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Меню">
    <span class="burger-line"></span>
    <span class="burger-line"></span>
    <span class="burger-line"></span>
  </button>
  
  <!-- Логотип -->
  <div class="logo">ZUZCOIN</div>
  
  <!-- Правая часть -->
  <div class="top-bar-right">
    <!-- Мобильный баланс (только на мобильных) -->
    <div class="mobile-balance" id="mobileBalance">0 ETH</div>
    
    <!-- Кнопка подключения кошелька -->
    <button class="connect-btn" id="connectBtn">
      <span class="btn-text">Connect Wallet</span>
      <span class="btn-icon">🔗</span>
    </button>
  </div>
</div>`;

// Заменяем top-bar
if (oldTopBar) {
  html = html.replace(topBarRegex, newTopBar);
} else {
  // Ищем body и вставляем после него
  html = html.replace('<body>', `<body>\n${newTopBar}`);
}

// Добавляем ГАРАНТИРОВАННЫЕ стили для бургер-меню
const guaranteedStyles = `
<style>
/* ===== ГАРАНТИРОВАННЫЕ СТИЛИ ДЛЯ БУРГЕР-МЕНЮ ===== */
/* Базовые стили - всегда */
.mobile-menu-btn {
  display: none; /* По умолчанию скрыт на десктопе */
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  margin: 0;
  position: relative;
  z-index: 1000;
}

/* Полоски бургера */
.burger-line {
  display: block;
  width: 24px;
  height: 3px;
  background: #6c5dd3;
  border-radius: 2px;
  margin: 4px 0;
  transition: all 0.3s ease;
}

/* Ховер-эффект */
.mobile-menu-btn:hover .burger-line {
  background: #8a7cff;
}

/* Анимация открытия */
.mobile-menu-btn.active .burger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active .burger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .burger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ===== НА МОБИЛЬНЫХ - ВСЕГДА ПОКАЗЫВАЕМ ===== */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    visibility: visible !important;
    opacity: 1 !important;
    width: 48px;
    height: 48px;
  }
  
  /* Перебиваем ВСЕ возможные скрытия */
  .mobile-menu-btn[style*="display: none"],
  .mobile-menu-btn[style*="display:none"],
  .mobile-menu-btn[hidden] {
    display: flex !important;
    visibility: visible !important;
  }
  
  /* Улучшаем top-bar для мобильных */
  .top-bar {
    padding: 0 12px !important;
    justify-content: space-between !important;
  }
  
  .top-bar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .mobile-balance {
    font-size: 12px;
    background: rgba(108, 93, 211, 0.1);
    padding: 4px 8px;
    border-radius: 10px;
    color: #6c5dd3;
  }
  
  .connect-btn .btn-text {
    display: none;
  }
  
  .connect-btn .btn-icon {
    display: inline;
    font-size: 16px;
  }
}

/* Для очень маленьких экранов */
@media (max-width: 480px) {
  .mobile-menu-btn {
    width: 44px;
    height: 44px;
    padding: 10px;
  }
  
  .burger-line {
    width: 20px;
    height: 2.5px;
  }
  
  .logo {
    font-size: 14px !important;
  }
}

/* Для десктопа - скрываем мобильный баланс */
@media (min-width: 769px) {
  .mobile-balance {
    display: none !important;
  }
  
  .connect-btn .btn-icon {
    display: none;
  }
  
  .connect-btn .btn-text {
    display: inline;
  }
}
</style>`;

// Вставляем стили в head
html = html.replace('</head>', guaranteedStyles + '\n</head>');

// Добавляем ГАРАНТИРОВАННЫЙ JavaScript
const guaranteedJS = `
<script>
// ===== ГАРАНТИРОВАННЫЙ КОД ДЛЯ БУРГЕР-МЕНЮ =====
(function() {
  console.log('🚀 Инициализация гарантированного бургер-меню');
  
  const burgerBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');
  const mobileOverlay = document.getElementById('mobileOverlay') || createOverlay();
  
  // Создаем overlay если нет
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mobileOverlay';
    overlay.className = 'mobile-overlay';
    overlay.style.cssText = \`
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;
    \`;
    document.body.appendChild(overlay);
    return overlay;
  }
  
  // Функция открытия/закрытия меню
  function toggleMenu() {
    if (!burgerBtn || !sidebar) return;
    
    const isOpening = !burgerBtn.classList.contains('active');
    
    burgerBtn.classList.toggle('active');
    sidebar.classList.toggle('open');
    mobileOverlay.style.display = isOpening ? 'block' : 'none';
    
    // Блокируем скролл тела при открытом меню
    document.body.style.overflow = isOpening ? 'hidden' : '';
    
    console.log(\`🍔 Меню \${isOpening ? 'открыто' : 'закрыто'}\`);
  }
  
  // Вешаем обработчики если элементы существуют
  if (burgerBtn) {
    burgerBtn.addEventListener('click', toggleMenu);
    console.log('✅ Обработчик клика добавлен на бургер');
    
    // Гарантируем видимость на мобильных
    function checkAndFixVisibility() {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        // ФОРСИРУЕМ видимость на мобильных
        burgerBtn.style.display = 'flex';
        burgerBtn.style.visibility = 'visible';
        burgerBtn.style.opacity = '1';
      } else {
        // На десктопе скрываем
        burgerBtn.style.display = 'none';
      }
    }
    
    // Проверяем при загрузке и изменении размера
    checkAndFixVisibility();
    window.addEventListener('resize', checkAndFixVisibility);
    window.addEventListener('orientationchange', checkAndFixVisibility);
    
    // Таймер для гарантии
    setInterval(checkAndFixVisibility, 1000);
  } else {
    console.error('❌ Бургер-кнопка не найдена!');
  }
  
  // Закрытие по клику на overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      if (burgerBtn && burgerBtn.classList.contains('active')) {
        toggleMenu();
      }
    });
  }
  
  // Закрытие по Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burgerBtn && burgerBtn.classList.contains('active')) {
      toggleMenu();
    }
  });
  
  // Обновляем мобильный баланс
  function updateMobileBalance(balance) {
    const mobileBalanceEl = document.getElementById('mobileBalance');
    if (mobileBalanceEl) {
      mobileBalanceEl.textContent = balance.toFixed(4) + ' ETH';
    }
  }
  
  // Экспортируем для использования
  window.toggleMobileMenu = toggleMenu;
  window.updateMobileBalance = updateMobileBalance;
  
  console.log('✅ Гарантированный бургер-меню инициализирован');
})();
</script>`;

// Вставляем JavaScript перед закрывающим body
html = html.replace('</body>', guaranteedJS + '\n</body>');

// Сохраняем
fs.writeFileSync('index.html', html);
console.log('✅ Top-bar полностью перестроен с гарантированным бургер-меню');
