#!/bin/bash

# УНИВЕРСАЛЬНЫЙ ЗАПУСК ZUZCOIN
echo "🚀 ЗАПУСК ZUZCOIN UNIVERSE"
echo "=========================="

# 1. Останавливаем все предыдущие серверы
echo "1. Останавливаем старые процессы..."
pkill -f "node server" 2>/dev/null
sleep 2

# 2. Освобождаем порты
echo "2. Освобождаем порты 3000-3010..."
for port in {3000..3010}; do
  timeout 0.3 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null && fuser -k $port/tcp 2>/dev/null || true
done
sleep 1

# 3. Запускаем новый сервер
echo "3. Запускаем сервер..."
nohup node server-auto-port.js > server.log 2>&1 &
SERVER_PID=$!

echo "✅ Сервер запущен с PID: $SERVER_PID"
echo $SERVER_PID > server.pid

# 4. Ждем и проверяем
echo "4. Ожидаем запуска..."
for i in {1..10}; do
  echo -n "."
  sleep 1
  
  if [ -f "current_port.txt" ]; then
    PORT=$(cat current_port.txt)
    if curl -s "http://localhost:$PORT/api/status" > /dev/null 2>&1; then
      echo ""
      echo "✅ Сервер успешно запущен на порту: $PORT"
      echo ""
      echo "🌐 ОТКРОЙТЕ САЙТ:"
      echo "   https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
      echo ""
      echo "📊 API СТАТУС:"
      curl -s "http://localhost:$PORT/api/status" | grep -o '"status":"[^"]*"' | head -1
      echo ""
      echo "📁 Логи сервера: server.log"
      echo "PID сервера: $SERVER_PID (сохранен в server.pid)"
      exit 0
    fi
  fi
done

echo ""
echo "⚠️  Сервер запускается дольше обычного..."
echo "Проверьте логи: tail -f server.log"
echo "Или попробуйте через 30 секунд: curl http://localhost:$(cat current_port.txt 2>/dev/null || echo 3000)/api/status"
exit 0
