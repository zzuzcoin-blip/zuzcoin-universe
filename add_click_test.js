const fs = require('fs');
let server = fs.readFileSync('server-auto-port.js', 'utf8');

if (!server.includes('/click-test')) {
  server = server.replace(
    "app.get('/final-burger-test', (req, res) => {",
    `// Тест кликабельности
app.get('/click-test', (req, res) => {
  res.sendFile(__dirname + '/test_clickability.html');
});

app.get('/final-burger-test', (req, res) => {`
  );
}

fs.writeFileSync('server-auto-port.js', server);
console.log('✅ Тест кликабельности добавлен');
