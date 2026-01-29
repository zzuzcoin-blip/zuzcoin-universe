#!/bin/bash

echo "🚀 LAUNCHING ZUZCOIN UNIVERSE"
echo "============================="

# Останавливаем старые процессы
echo "Stopping previous servers..."
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Освобождаем порты
echo "Freeing ports 3000-3010..."
for port in {3000..3010}; do
    timeout 0.1 bash -c "echo >/dev/tcp/localhost/$port" 2>/dev/null && {
        fuser -k $port/tcp 2>/dev/null || true
    } || true
done

sleep 1

# Запускаем сервер
echo "Starting server..."
node server.js > server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > SERVER_PID.txt

echo "Server PID: $SERVER_PID"
echo "Logs: server.log"

# Ждем запуска
echo "Waiting for server to start..."
for i in {1..10}; do
    echo -n "."
    sleep 1
    
    if [ -f "PORT.txt" ]; then
        PORT=$(cat PORT.txt 2>/dev/null)
        if [ ! -z "$PORT" ]; then
            if timeout 1 curl -s "http://localhost:$PORT/api/status" > /dev/null 2>&1; then
                echo ""
                echo ""
                echo "✅ SERVER STARTED SUCCESSFULLY!"
                echo "=============================="
                echo "🌐 PORT: $PORT"
                echo "📡 LOCAL: http://localhost:$PORT"
                echo "🌍 EXTERNAL: https://$(cat /etc/hostname).repl.co"
                echo ""
                echo "📱 OPEN ON MOBILE:"
                echo "   https://$(cat /etc/hostname).repl.co"
                echo ""
                echo "🔧 CHECK STATUS:"
                curl -s "http://localhost:$PORT/api/status" | grep -o '"status":"[^"]*"'
                echo ""
                exit 0
            fi
        fi
    fi
done

echo ""
echo "⚠️  Server is starting..."
echo "Check logs: tail -f server.log"
echo "Or open: https://$(cat /etc/hostname).repl.co"
