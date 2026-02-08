#!/bin/bash

echo "=================================================="
echo "🚀 ZUZIM UNIVERSE - CONTRACTS DEPLOYMENT LAUNCHER"
echo "=================================================="
echo ""
echo "📊 PROJECT STATUS:"
echo "   Phase: 6.1 COMPLETE (Contracts ready)"
echo "   Next: Contract verification & deployment"
echo "   ZUZ Token: 0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31"
echo "   Network: Sepolia Testnet"
echo ""
echo "⚡ STARTING SERVER..."
echo ""

# Stop existing processes
pkill -f "node server" 2>/dev/null || true
sleep 2

# Start server
node server.js > deployment.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ZUZIM_PID.txt

sleep 5

echo ""
echo "✅ ZUZIM UNIVERSE STARTED!"
echo "========================================"
echo "🌍 YOUR URL:"
echo "https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev"
echo ""
echo "🎯 NEXT ACTIONS:"
echo "1. Verify ZUZ token on Etherscan"
echo "2. Deploy DEX, TokenFactory, DigitalNotary"
echo "3. Integrate real contracts with interface"
echo ""
echo "📁 CONTRACTS READY FOR DEPLOYMENT:"
echo "   • contracts/ZUZIMDEX.sol"
echo "   • contracts/TokenFactory.sol"
echo "   • contracts/DigitalNotary.sol"
echo "========================================"
