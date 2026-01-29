#!/bin/bash

# Останавливаем все предыдущие серверы Node.js
echo "🛑 Останавливаем предыдущие процессы..."
pkill -f "node server" 2>/dev/null
sleep 2

# Проверяем, есть ли еще процессы на порту 3000
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  Порт 3000 все еще занят, принудительно освобождаем..."
  fuser -k 3000/tcp
  sleep 2
fi

# Запускаем новый сервер с авто-портом
echo "🚀 Запускаем ZUZCOIN Universe..."
node server-auto-port.js &

# Ждем запуска
sleep 3

# Получаем актуальный порт
if [ -f "current_port.txt" ]; then
  PORT=$(cat current_port.txt)
  echo ""
  echo "✅ СЕРВЕР ЗАПУЩЕН НА ПОРТУ: $PORT"
  echo ""
  echo "🌐 ОТКРОЙТЕ:"
  echo "   Локально: http://localhost:$PORT"
  echo "   В Replit: https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
  echo ""
  echo "📱 МОБИЛЬНЫЙ ТЕСТ:"
  echo "   https://${REPL_SLUG}.${REPL_OWNER}.repl.co/mobile-width-test?port=$PORT"
  echo ""
  
  # Проверяем API
  echo "🔧 ПРОВЕРКА API:"
  curl -s "http://localhost:$PORT/api/status" | grep -o '"status":"[^"]*"' | head -1
  echo ""
else
  echo "⏳ Сервер запускается... Подождите 5 секунд"
  sleep 5
  if [ -f "current_port.txt" ]; then
    PORT=$(cat current_port.txt)
    echo "✅ Сервер запущен на порту: $PORT"
  else
    echo "⚠️  Не удалось определить порт. Проверьте вручную:"
    echo "    lsof -ti:3000-3010"
  fi
fi

# Сохраняем PID
echo $! > server.pid
echo "📁 PID сервера сохранен в server.pid"
