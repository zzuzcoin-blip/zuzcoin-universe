#!/bin/bash

echo "=== ZUZCOIN Interface Fix ==="

# 1. Проверяем сервер
echo "1. Checking server..."
curl -s http://localhost:3001/api/status > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Server is running"
else
    echo "   ❌ Server is not responding"
    echo "   Starting server..."
    pkill -f "node server" 2>/dev/null
    sleep 2
    node server-sepolia.js > server.log 2>&1 &
    sleep 3
fi

# 2. Проверяем index.html
echo "2. Checking index.html..."
if [ -f "index.html" ]; then
    SIZE=$(wc -l < index.html)
    if [ $SIZE -gt 100 ]; then
        echo "   ✅ index.html exists ($SIZE lines)"
    else
        echo "   ⚠️  index.html is too small ($SIZE lines), fixing..."
        ./create-minimal-interface.sh
    fi
else
    echo "   ❌ index.html missing, creating..."
    ./create-minimal-interface.sh
fi

# 3. Проверяем стили
echo "3. Checking CSS..."
if grep -q "<style>" index.html; then
    echo "   ✅ CSS is embedded in index.html"
else
    echo "   ❌ CSS missing, adding..."
    # Добавляем минимальные стили
    sed -i '/<head>/a\    <style>\n        body { background: #0a0b0d; color: white; }\n    </style>' index.html
fi

# 4. Проверяем JavaScript
echo "4. Checking JavaScript..."
if grep -q "<script>" index.html; then
    echo "   ✅ JavaScript is embedded"
else
    echo "   ❌ JavaScript missing, adding..."
    # Добавляем минимальный JS
    echo '    <script>console.log("ZUZCOIN loaded");</script>' >> index.html
fi

# 5. Проверяем структуру
echo "5. Checking HTML structure..."
if grep -q "</html>" index.html && grep -q "</body>" index.html; then
    echo "   ✅ HTML structure is complete"
else
    echo "   ❌ HTML structure incomplete, fixing..."
    echo "</body></html>" >> index.html
fi

echo ""
echo "=== Fix Complete ==="
echo "Open: https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev"
echo "If still having issues, clear browser cache (Ctrl+Shift+R)"
