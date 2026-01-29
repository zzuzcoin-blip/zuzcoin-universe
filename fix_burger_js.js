// ФОРС-ФИКС БУРГЕР-МЕНЮ - всегда видим на мобильных
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем инлайновый стиль с высшим приоритетом
const burgerForceStyle = `
<style id="burger-force-fix">
/* !!! ВЫСШИЙ ПРИОРИТЕТ ДЛЯ БУРГЕР-МЕНЮ !!! */
@media (max-width: 768px) {
  #mobileMenuBtn {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 9999 !important;
    width: 30px !important;
    height: 24px !important;
    margin-right: 15px !important;
    cursor: pointer !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }
  
  #mobileMenuBtn span {
    display: block !important;
    width: 100% !important;
    height: 3px !important;
    background: #6c5dd3 !important;
    border-radius: 3px !important;
    margin: 4px 0 !important;
    transition: all 0.3s ease !important;
  }
  
  /* Перебиваем ВСЕ возможные скрытия */
  #mobileMenuBtn[style*="display: none"],
  #mobileMenuBtn[style*="display:none"],
  #mobileMenuBtn[hidden],
  #mobileMenuBtn.hidden {
    display: flex !important;
    visibility: visible !important;
  }
}

/* Анимация */
#mobileMenuBtn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px) !important;
}

#mobileMenuBtn.active span:nth-child(2) {
  opacity: 0 !important;
}

#mobileMenuBtn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px) !important;
}
</style>
`;

// Добавляем инлайновый JavaScript для гарантии
const burgerForceScript = `
<script>
// ГАРАНТИРОВАННОЕ ОТОБРАЖЕНИЕ БУРГЕР-МЕНЮ
(function() {
  console.log('🔧 Проверка бургер-меню...');
  
  function ensureBurgerVisible() {
    const burger = document.getElementById('mobileMenuBtn');
    if (!burger) {
      console.error('❌ Бургер-меню не найден!');
      // Создаем если не существует
      const topBar = document.querySelector('.top-bar');
      if (topBar) {
        const newBurger = document.createElement('button');
        newBurger.id = 'mobileMenuBtn';
        newBurger.className = 'mobile-menu-btn';
        newBurger.innerHTML = '<span></span><span></span><span></span>';
        topBar.insertBefore(newBurger, topBar.firstChild);
        console.log('✅ Бургер-меню создан');
      }
      return;
    }
    
    // Гарантируем видимость
    burger.style.display = 'flex';
    burger.style.visibility = 'visible';
    burger.style.opacity = '1';
    burger.style.position = 'relative';
    burger.style.zIndex = '9999';
    
    console.log('✅ Бургер-меню гарантированно видим');
  }
  
  // Проверяем сразу
  ensureBurgerVisible();
  
  // И при загрузке
  window.addEventListener('load', ensureBurgerVisible);
  
  // И каждые 2 секунды на всякий случай
  setInterval(ensureBurgerVisible, 2000);
  
  // Также проверяем ориентацию
  window.addEventListener('orientationchange', function() {
    setTimeout(ensureBurgerVisible, 100);
  });
  
  // И ресайз
  window.addEventListener('resize', function() {
    setTimeout(ensureBurgerVisible, 100);
  });
})();
</script>
`;

// Вставляем стили в head
if (!html.includes('burger-force-fix')) {
  html = html.replace('</head>', burgerForceStyle + '\n</head>');
}

// Вставляем скрипт перед закрывающим body
if (!html.includes('ГАРАНТИРОВАННОЕ ОТОБРАЖЕНИЕ')) {
  html = html.replace('</body>', burgerForceScript + '\n</body>');
}

// Также обновляем сам HTML бургер-меню чтобы он был правильным
if (html.includes('mobile-menu-btn')) {
  // Убедимся что у кнопки есть правильный HTML
  html = html.replace(
    'id="mobileMenuBtn"',
    'id="mobileMenuBtn" class="mobile-menu-btn" style="display: flex; visibility: visible;"'
  );
}

fs.writeFileSync('index.html', html);
console.log('✅ Форс-фикс бургер-меню применен!');
