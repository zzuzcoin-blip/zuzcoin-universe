const fs = require('fs');
let server = fs.readFileSync('server-auto-port.js', 'utf8');

if (!server.includes('/final-burger-test')) {
  server = server.replace(
    "app.get('/burger-test', (req, res) => {",
    `// Финальный тест бургер-меню
app.get('/final-burger-test', (req, res) => {
  res.sendFile(__dirname + '/test_final_burger.html');
});

app.get('/burger-test', (req, res) => {`
  );
}

fs.writeFileSync('server-auto-port.js', server);
console.log('✅ Финальный тест добавлен');
