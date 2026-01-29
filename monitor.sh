#!/bin/bash
echo "=== ZUZCOIN MONITOR ==="
date

echo -e "\n1. PROCESS:"
ps aux | grep "node server" | grep -v grep || echo "No server process"

echo -e "\n2. PORT 3000:"
netstat -tuln | grep :3000 || echo "Port 3000 not listening"

echo -e "\n3. API RESPONSE:"
timeout 5 curl -s http://localhost:3000/api/status | grep -o '"status":"[^"]*"' || echo "API timeout"

echo -e "\n4. LOGS (last 3 lines):"
tail -3 server.log 2>/dev/null || echo "No server.log"

echo -e "\n5. FILES:"
ls -lh index.html server-sepolia.js 2>/dev/null || echo "Files missing"

echo -e "\n6. MEMORY USAGE:"
free -h | grep Mem
