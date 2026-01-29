const fs = require('fs');

// Читаем текущий index.html
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем метатег для мобильной адаптации в head
html = html.replace(
  '</head>',
  `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="mobile.css">
  <style>
    /* Скрываем кнопку меню по умолчанию */
    .mobile-menu-btn { display: none; }
    .mobile-overlay { display: none; }
    .mobile-wallet { display: none; }
  </style>
  </head>`
);

// Обновляем top-bar для мобильной версии
html = html.replace(
  '<div class="top-bar">',
  `<div class="top-bar">
    <div class="mobile-menu-btn" id="mobileMenuBtn">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="logo">ZUZCOIN</div>
    <div style="display: flex; align-items: center;">
      <div class="mobile-wallet" id="mobileWallet">0 ETH</div>
      <button class="connect-btn" id="connectBtn">Connect Wallet</button>
    </div>`
);

// Добавляем overlay для мобильного меню
html = html.replace(
  '</body>',
  `<div class="mobile-overlay" id="mobileOverlay"></div>
  
  <script>
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileWallet = document.getElementById('mobileWallet');
    
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      sidebar.classList.toggle('open');
      mobileOverlay.classList.toggle('active');
    });
    
    mobileOverlay.addEventListener('click', function() {
      mobileMenuBtn.classList.remove('active');
      sidebar.classList.remove('open');
      this.classList.remove('active');
    });
    
    // Обновляем мобильный кошелек
    function updateMobileWallet(balance) {
      if (mobileWallet) {
        mobileWallet.textContent = balance.toFixed(4) + ' ETH';
      }
    }
    
    // Адаптация для мобильных
    function checkMobile() {
      if (window.innerWidth <= 768) {
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        sidebar.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileOverlay.classList.remove('active');
      }
    }
    
    window.addEventListener('resize', checkMobile);
    checkMobile();
    
    // Обновляем баланс для мобильных
    if (typeof updateBalanceDisplay === 'function') {
      const originalUpdate = updateBalanceDisplay;
      updateBalanceDisplay = function(balance) {
        originalUpdate(balance);
        updateMobileWallet(balance);
      };
    }
  </script>
  </body>`
);

// Записываем обновленный файл
fs.writeFileSync('index.html', html);
console.log('✅ HTML обновлен для мобильной версии');
