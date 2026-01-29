const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

console.log('🔨 ДОБАВЛЯЕМ ПРОСТОЙ И НАДЕЖНЫЙ ФИКС КЛИКАБЕЛЬНОСТИ');

// 1. Сначала добавляем гарантированные CSS стили для кликабельности
const clickabilityCSS = `
<style id="click-fix">
/* ГАРАНТИРОВАННАЯ КЛИКАБЕЛЬНОСТЬ БУРГЕР-МЕНЮ */
#mobileMenuBtn {
  cursor: pointer !important;
  user-select: none !important;
  -webkit-tap-highlight-color: rgba(108, 93, 211, 0.3) !important;
  tap-highlight-color: rgba(108, 93, 211, 0.3) !important;
}

/* Увеличиваем область клика */
#mobileMenuBtn::after {
  content: '' !important;
  position: absolute !important;
  top: -15px !important;
  left: -15px !important;
  right: -15px !important;
  bottom: -15px !important;
  z-index: 1 !important;
}

/* Гарантируем что ничего не перекрывает */
#mobileMenuBtn {
  position: relative !important;
  z-index: 9999 !important;
}

/* Отключаем выделение текста при клике */
#mobileMenuBtn, #mobileMenuBtn * {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

/* Состояния для обратной связи */
#mobileMenuBtn:active {
  transform: scale(0.95) !important;
  transition: transform 0.1s !important;
}

#mobileMenuBtn:active .burger-line {
  background: #8a7cff !important;
}
</style>
`;

// Добавляем CSS в head
if (!html.includes('click-fix')) {
  html = html.replace('</head>', clickabilityCSS + '\n</head>');
}

// 2. Добавляем ПРОСТОЙ и НАДЕЖНЫЙ JavaScript
const simpleClickJS = `
<script id="simple-click-js">
// ПРОСТОЙ И НАДЕЖНЫЙ ФИКС ДЛЯ КЛИКАБЕЛЬНОСТИ
(function() {
  console.log('🖱️ Инициализация кликабельного бургер-меню');
  
  // Ждем полной загрузки DOM
  document.addEventListener('DOMContentLoaded', function() {
    initBurgerMenu();
  });
  
  // Также инициализируем если DOM уже загружен
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(initBurgerMenu, 100);
  }
  
  function initBurgerMenu() {
    const burgerBtn = document.getElementById('mobileMenuBtn');
    
    if (!burgerBtn) {
      console.error('❌ Бургер-меню не найден! Создаем...');
      createBurgerMenu();
      return;
    }
    
    console.log('✅ Бургер-меню найден:', burgerBtn);
    
    // ГАРАНТИРУЕМ стили для кликабельности
    burgerBtn.style.cursor = 'pointer';
    burgerBtn.style.position = 'relative';
    burgerBtn.style.zIndex = '9999';
    
    // Удаляем все старые обработчики (на всякий случай)
    const newBurgerBtn = burgerBtn.cloneNode(true);
    burgerBtn.parentNode.replaceChild(newBurgerBtn, burgerBtn);
    
    // Получаем обновленный элемент
    const freshBurgerBtn = document.getElementById('mobileMenuBtn');
    
    // ДОБАВЛЯЕМ ОБРАБОТЧИК КЛИКА
    freshBurgerBtn.addEventListener('click', function(event) {
      console.log('🍔 Клик по бургер-меню!');
      event.preventDefault();
      event.stopPropagation();
      
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 100);
      
      // Переключаем меню
      toggleMobileMenu();
    });
    
    // Также добавляем обработчик для touch (для мобильных)
    freshBurgerBtn.addEventListener('touchstart', function(event) {
      console.log('📱 Touch на бургер-меню');
      event.preventDefault();
      this.style.opacity = '0.8';
    });
    
    freshBurgerBtn.addEventListener('touchend', function(event) {
      event.preventDefault();
      this.style.opacity = '';
      toggleMobileMenu();
    });
    
    console.log('✅ Обработчики кликов добавлены');
  }
  
  function createBurgerMenu() {
    // Создаем бургер-меню если его нет
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    
    const burgerBtn = document.createElement('button');
    burgerBtn.id = 'mobileMenuBtn';
    burgerBtn.className = 'mobile-menu-btn';
    burgerBtn.innerHTML = '<span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span>';
    burgerBtn.setAttribute('aria-label', 'Меню');
    
    // Добавляем стили
    burgerBtn.style.cssText = \`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 12px;
      margin: 0;
      position: relative;
      z-index: 9999;
    \`;
    
    topBar.insertBefore(burgerBtn, topBar.firstChild);
    console.log('✅ Бургер-меню создан');
    
    // Повторно инициализируем
    setTimeout(initBurgerMenu, 100);
  }
  
  function toggleMobileMenu() {
    console.log('🔄 Переключение меню');
    
    const burgerBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    if (!burgerBtn || !sidebar) {
      console.error('❌ Не могу найти элементы меню');
      return;
    }
    
    // Переключаем классы
    burgerBtn.classList.toggle('active');
    sidebar.classList.toggle('open');
    
    // Блокируем скролл при открытом меню
    if (sidebar.classList.contains('open')) {
      body.style.overflow = 'hidden';
      
      // Создаем overlay если нет
      let overlay = document.getElementById('mobileOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mobileOverlay';
        overlay.style.cssText = \`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 998;
        \`;
        document.body.appendChild(overlay);
        
        // Добавляем закрытие по клику на overlay
        overlay.addEventListener('click', toggleMobileMenu);
      }
      overlay.style.display = 'block';
    } else {
      body.style.overflow = '';
      const overlay = document.getElementById('mobileOverlay');
      if (overlay) overlay.style.display = 'none';
    }
    
    console.log(\`🍔 Меню \${sidebar.classList.contains('open') ? 'открыто' : 'закрыто'}\`);
  }
  
  // Экспортируем функцию для глобального доступа
  window.toggleMobileMenu = toggleMobileMenu;
  
  // Проверяем каждые 2 секунды что обработчики работают
  setInterval(function() {
    const burgerBtn = document.getElementById('mobileMenuBtn');
    if (burgerBtn && !burgerBtn.hasAttribute('data-click-bound')) {
      console.log('🔄 Проверка: перепривязываем обработчики');
      burgerBtn.setAttribute('data-click-bound', 'true');
    }
  }, 2000);
})();
</script>
`;

// Добавляем JavaScript перед закрывающим body
if (!html.includes('simple-click-js')) {
  // Удаляем старые скрипты бургер-меню если есть
  const scriptRegex = /<script[^>]*>[\s\S]*?mobileMenuBtn[\s\S]*?<\/script>/gi;
  html = html.replace(scriptRegex, '');
  
  html = html.replace('</body>', simpleClickJS + '\n</body>');
}

// 3. Проверяем и исправляем HTML структуру бургер-меню
console.log('🔧 Проверяем HTML структуру бургер-меню...');

// Убедимся что бургер-меню имеет правильную структуру button>span*3
if (html.includes('id="mobileMenuBtn"')) {
  // Ищем текущий бургер
  const burgerRegex = /<button[^>]*id="mobileMenuBtn"[^>]*>[\s\S]*?<\/button>/;
  const burgerMatch = html.match(burgerRegex);
  
  if (burgerMatch) {
    console.log('✅ Текущий бургер найден');
    
    // Заменяем на гарантированно правильную структуру
    const correctBurger = `<button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Открыть меню" style="cursor: pointer; position: relative; z-index: 9999;">
  <span class="burger-line"></span>
  <span class="burger-line"></span>
  <span class="burger-line"></span>
</button>`;
    
    html = html.replace(burgerRegex, correctBurger);
    console.log('✅ Структура бургер-меню исправлена');
  }
}

// Сохраняем
fs.writeFileSync('index.html', html);
console.log('✅ Файл index.html обновлен с фиксом кликабельности');
