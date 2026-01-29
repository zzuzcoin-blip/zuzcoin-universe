#!/bin/bash

# Проверяем текущий порт
if [ -f "current_port.txt" ]; then
  PORT=$(cat current_port.txt)
  echo "📊 ТЕКУЩИЙ ПОРТ СЕРВЕРА: $PORT"
  echo ""
  
  # Проверяем API
  echo "🔧 ПРОВЕРКА API СЕРВЕРА:"
  curl -s "http://localhost:$PORT/api/status"
  echo ""
  echo ""
  
  # Проверяем процессы
  echo "⚙️  ПРОЦЕССЫ NODE.JS:"
  ps aux | grep "node server" | grep -v grep
  echo ""
  
  # Проверяем порты
  echo "🔌 ОТКРЫТЫЕ ПОРТЫ (3000-3010):"
  for port in {3000..3010}; do
    if lsof -ti:$port > /dev/null 2>&1; then
      echo "  ✅ Порт $port занят"
    fi
  done
else
  echo "❌ Сервер не запущен или current_port.txt не найден"
  echo ""
  echo "🚀 Запустите сервер: ./start_zuzcoin.sh"
fi
