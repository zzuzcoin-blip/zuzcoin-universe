#!/bin/bash

echo "📊 СТАТУС ZUZCOIN SERVER"
echo "========================"

# Проверяем PID
if [ -f "SERVER_PID.txt" ]; then
  PID=$(cat SERVER_PID.txt)
  if ps -p $PID > /dev/null 2>&1; then
    echo "✅ Сервер работает (PID: $PID)"
  else
    echo "❌ Сервер не работает (PID $PID не найден)"
  fi
else
  echo "ℹ️ Файл PID не найден"
fi

# Проверяем порт
if [ -f "PORT.txt" ]; then
  PORT=$(cat PORT.txt)
  echo "🌐 Порт сервера: $PORT"
  
  # Проверяем доступность
  if timeout 2 curl -s "http://localhost:$PORT/api/status" > /dev/null 2>&1; then
    echo "✅ API доступно на порту $PORT"
    echo ""
    echo "📡 СТАТУС СЕРВЕРА:"
    curl -s "http://localhost:$PORT/api/status" | python3 -m json.tool 2>/dev/null || \
    curl -s "http://localhost:$PORT/api/status"
  else
    echo "❌ API не отвечает на порту $PORT"
  fi
else
  echo "⚠️ Файл порта не найден"
fi

echo ""
echo "🌍 ВНЕШНЯЯ ССЫЛКА:"
echo "   https://$(cat /etc/hostname).repl.co"
echo ""
echo "🔧 КОМАНДЫ:"
echo "   ./start.sh  - запустить сервер"
echo "   ./stop.sh   - остановить сервер"
echo "   ./status.sh - проверить статус"
echo "   tail -f server.log - посмотреть логи"
