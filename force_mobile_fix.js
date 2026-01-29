// Сильный фикс для мобильной ширины
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем инлайновые стили для гарантированного фикса
const mobileFixStyle = `
<style id="mobile-force-fix">
/* ФОРС-ФИКС ДЛЯ МОБИЛЬНЫХ */
@media (max-width: 768px) {
  /* ЭКСТРЕННЫЙ ФИКС - никаких выходов за экран! */
  * {
    max-width: 100vw !important;
    box-sizing: border-box !important;
  }
  
  /* Тело строго по ширине экрана */
  body {
    width: 100vw !important;
    overflow-x: hidden !important;
    position: relative;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Контейнеры не могут быть шире экрана */
  #root, .app, .container {
    width: 100vw !important;
    max-width: 100vw !important;
    overflow: hidden !important;
  }
  
  /* Абсолютный фикс для всех карточек */
  [class*="card"], [class*="Card"] {
    width: calc(100vw - 32px) !important;
    margin-left: auto !important;
    margin-right: auto !important;
    display: block !important;
  }
  
  /* Глобальный запрет горизонтального скролла */
  html {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
}
</style>
`;

// Вставляем стили в head
if (!html.includes('mobile-force-fix')) {
  html = html.replace('</head>', mobileFixStyle + '\n</head>');
}

// Также добавим проверку ширины в JavaScript
const mobileCheckScript = `
<script>
// ЭКСТРЕННАЯ ПРОВЕРКА ШИРИНЫ
(function() {
  function checkMobileWidth() {
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const bodyWidth = document.body.scrollWidth;
    
    if (bodyWidth > viewportWidth) {
      console.log('⚠️ Обнаружен выход за экран:', bodyWidth, '>', viewportWidth);
      
      // Принудительно фиксим
      document.body.style.overflowX = 'hidden';
      document.body.style.width = viewportWidth + 'px';
      
      // Фиксим все широкие элементы
      document.querySelectorAll('*').forEach(el => {
        const elWidth = el.scrollWidth;
        if (elWidth > viewportWidth) {
          el.style.maxWidth = '100%';
          el.style.overflowX = 'hidden';
        }
      });
    }
  }
  
  // Проверяем при загрузке и изменении размера
  window.addEventListener('load', checkMobileWidth);
  window.addEventListener('resize', checkMobileWidth);
  setTimeout(checkMobileWidth, 1000);
})();
</script>
`;

// Вставляем скрипт перед закрывающим body
if (!html.includes('ЭКСТРЕННАЯ ПРОВЕРКА ШИРИНЫ')) {
  html = html.replace('</body>', mobileCheckScript + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log('✅ ФОРС-ФИКС ширины применен!');
