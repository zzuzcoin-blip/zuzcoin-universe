# ИНСТРУКЦИЯ ДЛЯ СЛЕДУЮЩЕГО ЧАТА

## 🚀 КАК ЗАПУСТИТЬ ZUZCOIN UNIVERSE:

### 1. ПРОСТОЙ СПОСОБ (рекомендуется):
```bash
./launch_zuzcoin.sh
# 1. УБИВАЕМ ВСЕ процессы Node.js ПРИНУДИТЕЛЬНО
echo "⚡ ПРИНУДИТЕЛЬНО ОСТАНАВЛИВАЕМ ВСЕ NODE ПРОЦЕССЫ ⚡"
pkill -9 node 2>/dev/null || true
pkill -9 nodejs 2>/dev/null || true
pkill -f "server-" 2>/dev/null || true

# 2. ОСВОБОЖДАЕМ ВСЕ ПОРТЫ 3000-3020
echo "🔓 ОСВОБОЖДАЕМ ПОРТЫ 3000-3020..."
for port in {3000..3020}; do
  timeout 0.1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null && {
    echo "  Останавливаем порт $port..."
    fuser -k $port/tcp 2>/dev/null || sudo lsof -ti:$port | xargs kill -9 2>/dev/null || true
  } || true
done

# 3. ЖДЕМ чтобы все точно остановилось
sleep 3

# 4. УДАЛЯЕМ старый server-sepolia-fixed.js чтобы он не запускался случайно
echo "🗑️  УДАЛЯЕМ старый server-sepolia-fixed.js..."
rm -f server-sepolia-fixed.js 2>/dev/null || true

# 5. СОЗДАЕМ УНИВЕРСАЛЬНЫЙ сервер который ВСЕГДА найдет свободный порт
cat > server.js << 'EOF'
const express = require('express');
const net = require('net');
const app = express();
const path = require('path');

// ===== ГАРАНТИРОВАННЫЙ ПОИСК СВОБОДНОГО ПОРТА =====
function findFreePort(startPort = 3000, maxAttempts = 20) {
  return new Promise((resolve, reject) => {
    let port = startPort;
    let attempts = 0;
    
    function tryPort(currentPort) {
      if (attempts >= maxAttempts) {
        reject(new Error(`Не найден свободный порт после ${maxAttempts} попыток`));
        return;
      }
      
      const server = net.createServer();
      
      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          console.log(`⚠️  Порт ${currentPort} занят, пробуем ${currentPort + 1}...`);
          tryPort(currentPort + 1);
        } else {
          reject(err);
        }
      });
      
      server.once('listening', () => {
        const foundPort = server.address().port;
        server.close(() => {
          console.log(`✅ Найден свободный порт: ${foundPort}`);
          resolve(foundPort);
        });
      });
      
      server.listen(currentPort);
    }
    
    tryPort(port);
  });
}

// ===== КОНФИГУРАЦИЯ СЕРВЕРА =====
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

// ===== API ЭНДПОИНТЫ =====
app.get('/api/status', (req, res) => {
  res.json({
    status: 'active',
    project: 'ZUZCOIN Universe',
    phase: 4,
    ideology: ZUZIM_IDEOLOGY.core,
    mobile_support: true,
    timestamp: new Date().toISOString(),
    port: server.address().port
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

// ===== ТЕСТОВЫЕ СТРАНИЦЫ =====
app.get('/click-test', (req, res) => {
  res.sendFile(__dirname + '/test_clickability.html');
});

app.get('/burger-test', (req, res) => {
  res.sendFile(__dirname + '/test_final_burger.html');
});

app.get('/mobile-test', (req, res) => {
  res.sendFile(__dirname + '/test_mobile_width.html');
});

// ===== ГЛАВНАЯ СТРАНИЦА =====
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ===== ЗАПУСК СЕРВЕРА =====
async function startServer() {
  try {
    // Ищем свободный порт
    const PORT = await findFreePort(3000);
    
    // Запускаем сервер
    const server = app.listen(PORT, '0.0.0.0', () => {
      const actualPort = server.address().port;
      console.log('\n' + '='.repeat(60));
      console.log('🚀 ZUZCOIN UNIVERSE ЗАПУЩЕН!');
      console.log('='.repeat(60));
      console.log('');
      console.log('🌐 ПОРТ СЕРВЕРА:', actualPort);
      console.log('📡 ЛОКАЛЬНЫЙ ДОСТУП: http://localhost:' + actualPort);
      console.log('🌍 ВНЕШНИЙ ДОСТУП: https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co');
      console.log('');
      console.log('📱 МОБИЛЬНАЯ ВЕРСИЯ: АКТИВНА');
      console.log('🍔 БУРГЕР-МЕНЮ: КЛИКАБЕЛЬНО');
      console.log('💡 ИДЕОЛОГИЯ:', ZUZIM_IDEOLOGY.core);
      console.log('');
      console.log('🔧 API ДОСТУПНО:');
      console.log('   • /api/status');
      console.log('   • /api/philanthropy');
      console.log('   • /api/dex/pairs');
      console.log('');
      console.log('🎯 ТЕСТОВЫЕ СТРАНИЦЫ:');
      console.log('   • /click-test - тест кликабельности');
      console.log('   • /burger-test - тест бургер-меню');
      console.log('   • /mobile-test - тест мобильной версии');
      console.log('');
      console.log('='.repeat(60));
      
      // Сохраняем информацию о порте
      const fs = require('fs');
      fs.writeFileSync('PORT.txt', actualPort.toString());
      fs.writeFileSync('SERVER_INFO.txt', 
`ZUZCOIN Universe Server Info
==========================
Port: ${actualPort}
Local: http://localhost:${actualPort}
External: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co
Started: ${new Date().toISOString()}

Commands:
curl http://localhost:${actualPort}/api/status
curl http://localhost:${actualPort}/api/dex/pairs

Test pages:
http://localhost:${actualPort}/click-test
http://localhost:${actualPort}/burger-test
`);
    });
    
    // Обработка ошибок сервера
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log('⚠️  Порт занят, перезапускаем сервер...');
        setTimeout(() => {
          server.close();
          startServer();
        }, 1000);
      } else {
        console.error('❌ Ошибка сервера:', error);
      }
    });
    
    // Обработка остановки
    process.on('SIGTERM', () => {
      console.log('🛑 Остановка сервера...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🛑 Получен SIGINT, остановка...');
      server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
      });
    });
    
    return server;
  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error);
    console.log('🔄 Перезапуск через 5 секунд...');
    setTimeout(startServer, 5000);
  }
}

// ЗАПУСКАЕМ!
startServer();
