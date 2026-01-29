const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Идеология ZUZIM
const ZUZIM_IDEOLOGY = {
  core: "Talmudic Ethics in Blockchain",
  principles: [
    "ZUZ = Ancient silver coin of fair trade",
    "1% Auto-Philanthropy = Tzedakah (charity)",
    "Talmudic debate = Smart contract consensus",
    "Chessed (kindness) = Automated giving",
    "Beth Din courts = DAO governance"
  ]
};

// Эндпоинты
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    project: 'ZUZCOIN Universe',
    phase: 4,
    ideology: ZUZIM_IDEOLOGY.core,
    mobile_support: true,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/philanthropy', (req, res) => {
  res.json({
    total_donated: "0.00 ETH",
    charities: [
      { name: "Talmudic Scholarship Fund", amount: "0.00 ETH" },
      { name: "Community Development", amount: "0.00 ETH" },
      { name: "Environmental Projects", amount: "0.00 ETH" }
    ],
    principle: "1% of all transactions auto-donated"
  });
});

app.get('/api/dex/pairs', (req, res) => {
  res.json({
    pairs: [
      { pair: "ZUZ/ETH", price: "0.0015", change: "+2.3%" },
      { pair: "ZUZ/USDC", price: "1.85", change: "+1.7%" },
      { pair: "ETH/USDC", price: "3200", change: "-0.5%" }
    ]
  });
});

app.get('/api/wallet/balance/:address', (req, res) => {
  // Симуляция баланса для демо
  const demoBalances = {
    '0x742d35Cc6634C0532925a3b844Bc9e90F1aD04b5': "1.5423",
    'demo': "2.1845"
  };
  
  const address = req.params.address;
  const balance = demoBalances[address] || "0.0000";
  
  res.json({
    address: address,
    balance: balance,
    currency: "ETH",
    network: "Sepolia"
  });
});

// Маршруты для мобильной версии
app.get('/mobile-test', (req, res) => {
  res.sendFile(__dirname + '/test_mobile_width.html');
});

// Тест бургер-меню
// Финальный тест бургер-меню
// Тест кликабельности
app.get('/click-test', (req, res) => {
  res.sendFile(__dirname + '/test_clickability.html');
});

app.get('/final-burger-test', (req, res) => {
  res.sendFile(__dirname + '/test_final_burger.html');
});

app.get('/burger-test', (req, res) => {
  res.sendFile(__dirname + '/test_burger.html');
});

app.get('/mobile-width-test', (req, res) => {
  res.sendFile(__dirname + '/test_mobile_width.html');
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Функция поиска свободного порта
function findFreePort(startPort) {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Порт занят, пробуем следующий
        resolve(findFreePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.listen(startPort);
  });
}

// Запуск сервера на свободном порту
async function startServer() {
  try {
    const PORT = await findFreePort(3000);
    
    const server = app.listen(PORT, () => {
      console.log('=============================================');
      console.log(`🚀 ZUZCOIN Universe запущен на порту: ${PORT}`);
      console.log('=============================================');
      console.log('');
      console.log('📱 МОБИЛЬНАЯ ВЕРСИЯ АКТИВНА');
      console.log('✅ Автоматический поиск порта работает');
      console.log('');
      console.log('🌐 ОТКРОЙТЕ:');
      console.log(`   Основной сайт: http://localhost:${PORT}`);
      console.log(`   Мобильный тест: http://localhost:${PORT}/mobile-width-test`);
      console.log('');
      console.log('🔧 API доступно:');
      console.log(`   • http://localhost:${PORT}/api/status`);
      console.log(`   • http://localhost:${PORT}/api/philanthropy`);
      console.log(`   • http://localhost:${PORT}/api/dex/pairs`);
      console.log('');
      console.log('💡 ИДЕОЛОГИЯ:');
      console.log(`   ${ZUZIM_IDEOLOGY.core}`);
      console.log('');
      
      // Сохраняем информацию о порте в файл
      const fs = require('fs');
      fs.writeFileSync('current_port.txt', PORT.toString());
      fs.writeFileSync('replit_info.txt', 
`Активный порт: ${PORT}
Основной URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co
Прямая ссылка: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/?port=${PORT}

Команды для проверки:
curl http://localhost:${PORT}/api/status
curl http://localhost:${PORT}/api/dex/pairs
`);
      
      console.log('📁 Информация сохранена в current_port.txt и replit_info.txt');
      console.log('=============================================');
    });
    
    // Обработка остановки
    process.on('SIGTERM', () => {
      console.log('🛑 Остановка сервера...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });
    
    return server;
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
}

// Автоматический редирект для Replit
app.get('/replit-redirect', (req, res) => {
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=/" />
        <title>ZUZCOIN - Redirecting...</title>
      </head>
      <body>
        <h2>Redirecting to ZUZCOIN Universe...</h2>
        <script>
          window.location.href = "/";
        </script>
      </body>
    </html>
  `);
});

// Запускаем сервер
startServer();
