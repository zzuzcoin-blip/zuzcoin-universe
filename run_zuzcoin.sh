#!/bin/bash
clear
echo "========================================="
echo "🚀 ZUZCOIN UNIVERSE - AUTO LAUNCHER"
echo "========================================="
echo ""
echo "1. Stopping old processes..."
pkill -f "node server" 2>/dev/null || true
sleep 2

echo "2. Starting ZUZCOIN server..."
node server.js > zuzcoin.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ZUZCOIN_PID.txt
echo "   Server PID: $SERVER_PID"

echo "3. Waiting for startup..."
for i in {1..10}; do
  echo -n "."
  sleep 1
done

echo ""
echo ""
echo "✅ ZUZCOIN LAUNCHED!"
echo "🌐 Open: https://$(hostname).repl.co"
echo "📋 Logs: tail -f zuzcoin.log"
echo "========================================="
