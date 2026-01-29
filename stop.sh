#!/bin/bash

echo "🛑 ОСТАНОВКА ZUZCOIN SERVER"
echo "=========================="

# 1. Останавливаем все Node процессы
echo "Остановка всех Node.js процессов..."
pkill -9 node 2>/dev/null || true
pkill -9 nodejs 2>/dev/null || true

# 2. Освобождаем порты
echo "Освобождение портов 3000-3020..."
for port in {3000..3020}; do
  timeout 0.1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null && {
    fuser -k $port/tcp 2>/dev/null 2>&1 || true
  } || true
done

# 3. Удаляем файлы
echo "Очистка файлов..."
rm -f PORT.txt SERVER_INFO.txt SERVER_PID.txt current_port.txt server.pid 2>/dev/null || true

sleep 2
echo ""
echo "✅ ВСЕ ПРОЦЕССЫ ОСТАНОВЛЕНЫ"
echo "✅ ПОРТЫ ОСВОБОЖДЕНЫ"
echo "✅ ФАЙЛЫ ОЧИЩЕНЫ"
echo ""
echo "🚀 Для запуска: ./start.sh"
