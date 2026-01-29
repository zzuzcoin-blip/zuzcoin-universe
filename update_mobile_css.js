const fs = require('fs');
let mobileCss = fs.readFileSync('mobile.css', 'utf8');

// Удаляем все старые стили для бургер-меню
const lines = mobileCss.split('\n');
let newLines = [];
let inBurgerSection = false;
let skipNext = false;

for (let i = 0; i < lines.length; i++) {
  if (skipNext) {
    skipNext = false;
    continue;
  }
  
  const line = lines[i];
  
  // Пропускаем старые секции бургер-меню
  if (line.includes('mobile-menu-btn') || 
      line.includes('burger-line') ||
      line.includes('🍔') ||
      line.includes('БУРГЕР') ||
      line.includes('бургер')) {
    
    // Проверяем начало медиа-запроса
    if (line.includes('@media')) {
      inBurgerSection = true;
      // Пропускаем до закрывающей скобки
      let braceCount = 0;
      for (let j = i; j < lines.length; j++) {
        if (lines[j].includes('{')) braceCount++;
        if (lines[j].includes('}')) {
          braceCount--;
          if (braceCount === 0) {
            i = j; // Переходим к концу медиа-запроса
            break;
          }
        }
      }
      continue;
    }
    
    // Пропускаем отдельные стили
    if (inBurgerSection && line.includes('}')) {
      inBurgerSection = false;
    }
    if (inBurgerSection) continue;
  }
  
  newLines.push(line);
}

// Добавляем только необходимые общие стили для мобильных
const essentialMobileStyles = `

/* ===== ОСНОВНЫЕ МОБИЛЬНЫЕ СТИЛИ ===== */
@media (max-width: 768px) {
  /* Фиксируем ширину контента */
  body {
    overflow-x: hidden !important;
    width: 100vw !important;
    max-width: 100vw !important;
    padding-top: 64px !important;
  }
  
  /* Main content адаптация */
  .main-content {
    margin-left: 0 !important;
    padding: 16px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* Карточки в одну колонку */
  .stats-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  .ecosystem-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  
  /* Карточки по ширине экрана */
  .stat-card, .feature-card, .card {
    width: calc(100% - 32px) !important;
    max-width: 100% !important;
    margin: 0 auto 16px auto !important;
    box-sizing: border-box !important;
  }
  
  /* Sidebar адаптация */
  .sidebar {
    position: fixed !important;
    left: -240px !important;
    top: 64px !important;
    height: calc(100vh - 64px) !important;
    width: 240px !important;
    z-index: 1000 !important;
    transition: left 0.3s ease !important;
    background: #0a0b0d !important;
    border-right: 1px solid #1e1f2e !important;
  }
  
  .sidebar.open {
    left: 0 !important;
  }
  
  /* Mobile overlay */
  .mobile-overlay {
    display: none;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }
  
  .mobile-overlay.active {
    display: block;
  }
  
  /* Улучшаем кнопки для тач-интерфейса */
  button, .btn, .connect-btn {
    min-height: 44px !important; /* Минимальный размер для пальцев */
    padding: 10px 16px !important;
  }
  
  /* Уменьшаем размеры текста */
  h1 { font-size: 24px !important; }
  h2 { font-size: 20px !important; }
  h3 { font-size: 18px !important; }
  
  /* Таблицы с горизонтальным скроллом */
  table, .table-container {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Очень маленькие экраны */
@media (max-width: 480px) {
  .main-content {
    padding: 12px !important;
  }
  
  .stat-card, .feature-card, .card {
    width: calc(100% - 24px) !important;
    padding: 12px !important;
  }
  
  .top-bar {
    height: 60px !important;
    padding: 0 8px !important;
  }
}

/* Горизонтальная ориентация на мобильных */
@media (max-width: 768px) and (orientation: landscape) {
  .sidebar {
    width: 200px !important;
  }
  
  .main-content {
    padding: 12px !important;
  }
  
  /* Бургер-меню ДОЛЖЕН быть виден в ландшафте */
  .mobile-menu-btn {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}
`;

// Объединяем
mobileCss = newLines.join('\n') + essentialMobileStyles;

// Сохраняем очищенный mobile.css
fs.writeFileSync('mobile.css', mobileCss);
console.log('✅ Mobile.css очищен и обновлен');
