const express = require('express');
const httpProxy = require('http-proxy');
const app = express();

const proxy = httpProxy.createProxyServer({});

// Основной маршрут - пытаемся найти работающий порт
app.use(async (req, res, next) => {
  try {
    // Пробуем порты от 3000 до 3010
    const ports = Array.from({length: 11}, (_, i) => 3000 + i);
    
    for (const port of ports) {
      try {
        // Быстрая проверка порта
        const net = require('net');
        const socket = new net.Socket();
        
        await new Promise((resolve, reject) => {
          socket.setTimeout(100);
          socket.on('connect', () => {
            socket.destroy();
            resolve(port);
          });
          socket.on('timeout', () => {
            socket.destroy();
            reject();
          });
          socket.on('error', () => {
            reject();
          });
          socket.connect(port, 'localhost');
        });
        
        // Если порт доступен, проксируем запрос
        console.log(`🔀 Проксирование на порт ${port}: ${req.url}`);
        proxy.web(req, res, { target: `http://localhost:${port}` });
        return;
      } catch (err) {
        // Порт не доступен, пробуем следующий
        continue;
      }
    }
    
    // Если ни один порт не доступен
    res.status(503).send(`
      <html>
        <head><title>ZUZCOIN - Сервер не запущен</title></head>
        <body style="background: #0a0b0d; color: white; padding: 40px; text-align: center;">
          <h1>🚫 Сервер ZUZCOIN не запущен</h1>
          <p>Запустите сервер командой:</p>
          <pre style="background: #1e1f2e; padding: 20px; border-radius: 5px; display: inline-block;">
./start_zuzcoin.sh</pre>
          <p>Или:</p>
          <pre style="background: #1e1f2e; padding: 20px; border-radius: 5px; display: inline-block;">
node server-auto-port.js</pre>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Запускаем прокси на порту 8080 (стандартный для Replit)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('=============================================');
  console.log(`🔀 Прокси-сервер запущен на порту: ${PORT}`);
  console.log('=============================================');
  console.log('');
  console.log('🌐 ВАША ССЫЛКА ДЛЯ ДОСТУПА:');
  console.log(`   https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log('');
  console.log('🔄 Прокси автоматически найдет работающий сервер');
  console.log('=============================================');
});
