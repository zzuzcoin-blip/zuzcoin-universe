#!/bin/bash

echo "🛑 Останавливаем все серверы Node.js..."
pkill -f "node server" 2>/dev/null

# Также убиваем процессы на портах 3000-3010
for port in {3000..3010}; do
  if lsof -ti:$port > /dev/null 2>&1; then
    fuser -k $port/tcp 2>/dev/null
  fi
done

sleep 2
echo "✅ Все серверы остановлены"

# Удаляем файлы портов
rm -f current_port.txt server.pid 2>/dev/null
echo "📁 Файлы портов удалены"
