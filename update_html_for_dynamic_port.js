const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Добавляем скрипт для автоматического определения порта
const portScript = `
<script>
// Автоматическое определение порта сервера
(function() {
  // Пробуем получить порт из URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlPort = urlParams.get('port');
  
  if (urlPort) {
    console.log('🎯 Используем порт из URL:', urlPort);
    window.API_PORT = urlPort;
    return;
  }
  
  // Пробуем прочитать из файла (для Replit)
  fetch('/current_port.txt')
    .then(response => {
      if (response.ok) return response.text();
      throw new Error('File not found');
    })
    .then(port => {
      const cleanPort = port.trim();
      if (cleanPort && cleanPort !== '3000') {
        console.log('📁 Порт из current_port.txt:', cleanPort);
        window.API_PORT = cleanPort;
        
        // Обновляем API вызовы
        updateApiEndpoints(cleanPort);
      }
    })
    .catch(err => {
      console.log('ℹ️  Используем порт по умолчанию: 3000');
      window.API_PORT = '3000';
    });
  
  function updateApiEndpoints(port) {
    // Эта функция может обновлять базовые URL API
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string' && url.startsWith('/api/')) {
        url = \`/api-proxy?port=\${port}&path=\${url}\`;
      }
      return originalFetch.call(this, url, options);
    };
  }
  
  // Также обновляем все fetch вызовы в нашем коде
  setTimeout(() => {
    if (window.updateBalanceDisplay) {
      const originalUpdate = window.updateBalanceDisplay;
      window.updateBalanceDisplay = function(balance) {
        originalUpdate(balance);
        // Дополнительная логика если нужно
      };
    }
  }, 1000);
})();
</script>
`;

// Вставляем скрипт в head
if (!html.includes('Автоматическое определение порта')) {
  html = html.replace('</head>', portScript + '\n</head>');
}

// Также добавляем fallback для API
const apiProxyScript = `
<script>
// Прокси для API на случай разных портов
if (window.API_PORT && window.API_PORT !== '3000') {
  const apiBaseUrl = 'http://localhost:' + window.API_PORT;
  
  // Перехватываем fetch запросы к API
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
      // Для разработки - используем полный URL
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        resource = apiBaseUrl + resource;
      }
    }
    return originalFetch.call(this, resource, init);
  };
  
  console.log('🔧 API перенаправлено на порт:', window.API_PORT);
}
</script>
`;

if (!html.includes('Прокси для API')) {
  html = html.replace('</body>', apiProxyScript + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log('✅ HTML обновлен для работы с динамическим портом');
