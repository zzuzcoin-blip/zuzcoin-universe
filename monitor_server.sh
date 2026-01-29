#!/bin/bash

echo "📊 МОНИТОР СЕРВЕРА ZUZCOIN"
echo "=========================="

# Проверяем PID
if [ -f "server.pid" ]; then
  PID=$(cat server.pid)
  if ps -p $PID > /dev/null; then
    echo "✅ Сервер работает (PID: $PID)"
  else
    echo "❌ Сервер не работает (PID: $PID не найден)"
  fi
else
  echo "ℹ️ Файл server.pid не найден"
fi

# Проверяем порт
if [ -f "current_port.txt" ]; then
  PORT=$(cat current_port.txt)
  echo "📡 Порт сервера: $PORT"
  
  # Проверяем доступность
  if timeout 2 curl -s "http://localhost:$PORT/api/status" > /dev/null; then
    echo "✅ API доступно"
    echo ""
    echo "📈 СТАТУС СЕРВЕРА:"
    curl -s "http://localhost:$PORT/api/status" | python3 -m json.tool 2>/dev/null || curl -s "http://localhost:$PORT/api/status"
  else
    echo "❌ API не отвечает"
  fi
else
  echo "⚠️ Файл current_port.txt не найден"
  
  # Ищем сервер в процессах
  echo ""
  echo "🔍 Поиск сервера в процессах:"
  ps aux | grep -E "node (server-|app.js)" | grep -v grep || echo "Сервер не найден"
fi

echo ""
echo "🌐 ВНЕШНЯЯ ССЫЛКА:"
echo "   https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
echo ""
echo "🔧 КОМАНДЫ:"
echo "   ./launch_zuzcoin.sh  - перезапустить сервер"
echo "   tail -f server.log   - посмотреть логи"
echo "   ./monitor_server.sh  - проверить статус"
