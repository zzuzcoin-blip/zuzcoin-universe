#!/bin/bash

# ===== ZUZCOIN UNIVERSAL LAUNCH SCRIPT =====
# Этот скрипт гарантированно запустит сервер

echo "🚀 ЗАПУСК ZUZCOIN UNIVERSE"
echo "=========================="

# 1. Останавливаем ВСЕ предыдущие процессы
echo "1. Очистка предыдущих процессов..."
pkill -9 node 2>/dev/null || true
pkill -9 nodejs 2>/dev/null || true
pkill -f "server" 2>/dev/null || true

# 2. Освобождаем порты
echo "2. Освобождение портов..."
for port in {3000..3020}; do
  timeout 0.1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null && {
    fuser -k $port/tcp 2>/dev/null 2>&1 || true
  } || true
done

sleep 2

# 3. Удаляем старые файлы портов
echo "3. Очистка старых файлов..."
rm -f PORT.txt SERVER_INFO.txt current_port.txt server.pid 2>/dev/null || true

# 4. Запускаем сервер в фоне с выводом логов
echo "4. Запуск сервера..."
node server.js > server.log 2>&1 &
SERVER_PID=$!

echo "   PID сервера: $SERVER_PID"
echo $SERVER_PID > SERVER_PID.txt

# 5. Ждем запуска
echo "5. Ожидание запуска..."
for i in {1..15}; do
  echo -n "."
  
  # Проверяем создался ли файл с портом
  if [ -f "PORT.txt" ]; then
    PORT=$(cat PORT.txt)
    
    # Проверяем доступность сервера
    if timeout 1 curl -s "http://localhost:$PORT/api/status" > /dev/null 2>&1; then
      echo ""
      echo ""
      echo "✅ СЕРВЕР УСПЕШНО ЗАПУЩЕН!"
      echo "=========================="
      echo "🌐 ПОРТ: $PORT"
      echo "📡 ЛОКАЛЬНО: http://localhost:$PORT"
      echo "🌍 ВНЕШНЯЯ ССЫЛКА: https://$(cat /etc/hostname).repl.co"
      echo ""
      echo "📱 ОТКРОЙТЕ НА ТЕЛЕФОНЕ:"
      echo "   https://$(cat /etc/hostname).repl.co"
      echo ""
      echo "🔧 ПРОВЕРКА API:"
      curl -s "http://localhost:$PORT/api/status" | grep -o '"status":"[^"]*"'
      echo ""
      echo "📁 ЛОГИ СЕРВЕРА: server.log"
      echo "📁 ИНФОРМАЦИЯ: SERVER_INFO.txt"
      echo ""
      exit 0
    fi
  fi
  
  sleep 1
done

echo ""
echo "⚠️  Сервер запускается дольше обычного..."
echo ""
echo "📊 ТЕКУЩИЙ СТАТУС:"
if [ -f "PORT.txt" ]; then
  PORT=$(cat PORT.txt)
  echo "   Порт: $PORT"
  echo "   Проверка: curl http://localhost:$PORT/api/status"
else
  echo "   Порт еще не назначен"
fi

echo ""
echo "📋 ЛОГИ СЕРВЕРА (последние 10 строк):"
tail -10 server.log 2>/dev/null || echo "   Логи еще не созданы"

echo ""
echo "🔄 Сервер запущен в фоне. Проверьте через 30 секунд."
exit 0
