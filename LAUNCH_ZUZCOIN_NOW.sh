#!/bin/bash
clear
echo "========================================="
echo "🚀 ZUZCOIN - ОДНА КНОПКА ДЛЯ ЗАПУСКА"
echo "========================================="
echo ""
echo "⚡ 1. Останавливаем старые процессы..."
pkill -f node 2>/dev/null || true
sleep 2

echo "⚡ 2. Освобождаем порты..."
for port in {3000..3010}; do
  timeout 0.1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null && {
    fuser -k $port/tcp 2>/dev/null 2>&1 || true
  } || true
done

echo "⚡ 3. Запускаем сервер..."
node server.js > server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > CURRENT_PID.txt
sleep 2

echo "⚡ 4. Проверяем запуск..."
if [ -f "PORT.txt" ]; then
  PORT=$(cat PORT.txt)
  echo ""
  echo "🎉 ✅ ZUZCOIN ЗАПУЩЕН!"
  echo "========================"
  echo "🌐 ПОРТ: $PORT"
  echo "📡 ЛОКАЛЬНО: http://localhost:$PORT"
  echo "🌍 ВНЕШНЯЯ ССЫЛКА:"
  echo "   https://66d92a2c29d7.repl.co"
  echo "📱 МОБИЛЬНАЯ ВЕРСИЯ:"
  echo "   https://66d92a2c29d7.repl.co/welcome"
  echo "========================"
else
  echo ""
  echo "⚠️  Сервер запускается..."
  echo "📋 Логи: tail -f server.log"
  echo "🌐 Ссылка: https://66d92a2c29d7.repl.co"
fi
