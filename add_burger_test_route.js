const fs = require('fs');
let server = fs.readFileSync('server-auto-port.js', 'utf8');

// Добавляем маршрут для теста бургер-меню
if (!server.includes('/burger-test')) {
  server = server.replace(
    "app.get('/mobile-width-test', (req, res) => {",
    `// Тест бургер-меню
app.get('/burger-test', (req, res) => {
  res.sendFile(__dirname + '/test_burger.html');
});

app.get('/mobile-width-test', (req, res) => {`
  );
}

fs.writeFileSync('server-auto-port.js', server);
console.log('✅ Маршрут для теста бургер-меню добавлен');
