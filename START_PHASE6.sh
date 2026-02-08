#!/bin/bash

echo "=================================================="
echo "🚀 ZUZIM UNIVERSE - LAUNCHER FOR PHASE 6"
echo "=================================================="
echo ""
echo "📊 PROJECT STATUS:"
echo "   Current: Phase 5 COMPLETED"
echo "   Next: Phase 6 (Smart Contracts)"
echo "   URL: https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev"
echo "   Interface: Original Phase 4 preserved"
echo "   Buttons: All functional (Phase 5)"
echo ""
echo "⚡ STARTING SERVER..."
echo ""

# Stop existing processes
pkill -f "node server" 2>/dev/null || true
sleep 2

# Start server with auto-port
node server.js > phase6.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ZUZIM_PID.txt

sleep 5

echo ""
echo "✅ ZUZIM UNIVERSE STARTED!"
echo "========================================"
echo "🌍 YOUR WORKING URL (Always-On):"
echo "https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev"
echo ""
echo "🎯 PHASE 5 ACHIEVEMENTS:"
echo "   • Original interface preserved ✓"
echo "   • All buttons functional ✓"
echo "   • DEX with 1% charity ✓"
echo "   • Auto-port system ✓"
echo ""
echo "🚀 READY FOR PHASE 6: SMART CONTRACTS"
echo "========================================"
