const fs = require('fs');
let server = fs.readFileSync('server-sepolia-fixed.js', 'utf8');

// Добавляем маршрут для теста ширины
if (!server.includes('/mobile-width-test')) {
  server = server.replace(
    "app.get('/api/status', (req, res) => {",
    `// Тест мобильной ширины
app.get('/mobile-width-test', (req, res) => {
  res.sendFile(__dirname + '/test_mobile_width.html');
});

app.get('/api/status', (req, res) => {`
  );
}

fs.writeFileSync('server-sepolia-fixed.js', server);
console.log('✅ Сервер обновлен с тестом ширины');
