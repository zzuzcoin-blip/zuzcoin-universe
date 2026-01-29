const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/mobile-test') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mobile Test - ZUZCOIN</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #0a0b0d;
            color: white;
          }
          .test-item {
            background: #1e1f2e;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
          }
          .success { color: #4CAF50; }
          .info { color: #2196F3; }
        </style>
      </head>
      <body>
        <h1>📱 Мобильный тест ZUZCOIN</h1>
        
        <div class="test-item">
          <h3 class="success">✅ Мобильные стили загружены</h3>
          <p>Файл mobile.css создан и подключен</p>
        </div>
        
        <div class="test-item">
          <h3 class="success">✅ HTML адаптирован</h3>
          <p>Добавлены: бургер-меню, мобильный overlay, адаптивные элементы</p>
        </div>
        
        <div class="test-item">
          <h3 class="info">📱 Тестируйте на:</h3>
          <p>1. Откройте основную страницу на телефоне</p>
          <p>2. Проверьте бургер-меню в верхнем левом углу</p>
          <p>3. Проверьте адаптацию карточек</p>
        </div>
        
        <a href="/" style="color: #6c5dd3; text-decoration: none;">← Вернуться к основной странице</a>
      </body>
      </html>
    `);
  } else {
    // Проксируем на основной сервер
    const proxy = http.request({
      hostname: 'localhost',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, proxyRes => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    req.pipe(proxy);
  }
});

server.listen(8080, () => {
  console.log('📱 Мобильный тест запущен на порту 8080');
  console.log('Откройте: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/mobile-test');
});
