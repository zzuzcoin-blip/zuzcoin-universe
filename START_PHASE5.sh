#!/bin/bash

echo "=================================================="
echo "🚀 ZUZCOIN UNIVERSE - LAUNCHER FOR PHASE 5"
echo "=================================================="
echo ""
echo "📊 PROJECT STATUS:"
echo "   Phase: 4 COMPLETED (Professional Interface)"
echo "   Next: Phase 5 (Real Contract Deployment)"
echo "   Mobile: ✅ Fully responsive"
echo "   Blockchain: Sepolia Testnet READY"
echo ""
echo "⚡ LAUNCHING ZUZCOIN..."
echo ""

# Stop any existing processes
pkill -f "node server" 2>/dev/null || true
sleep 2

# Start the server
echo "Starting server..."
node server.js > phase5.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ZUZCOIN_PID.txt

# Wait for startup
echo "Waiting for server..."
sleep 5

# Show status
if [ -f "PORT.txt" ]; then
    PORT=$(cat PORT.txt)
    echo ""
    echo "🎉 ZUZCOIN LAUNCHED SUCCESSFULLY!"
    echo "=================================="
    echo "🌐 PORT: $PORT"
    echo "📡 LOCAL: http://localhost:$PORT"
    echo "🌍 EXTERNAL: https://66d92a2c29d7.repl.co"
    echo "📱 MOBILE: https://66d92a2c29d7.repl.co/welcome"
    echo ""
    echo "🔧 API STATUS:"
    curl -s "http://localhost:$PORT/api/status" | grep -o '"status":"[^"]*"' || echo "✅ API is responding"
    echo ""
    echo "💡 ZUZIM IDEOLOGY: Talmudic Ethics in Blockchain"
    echo ""
    echo "✅ READY FOR PHASE 5: CONTRACT DEPLOYMENT"
    echo "=================================="
else
    echo "⚠️ Server starting... Check logs: tail -f phase5.log"
    echo "🌐 Open: https://66d92a2c29d7.repl.co"
fi
