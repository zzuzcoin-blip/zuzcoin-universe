#!/bin/bash
echo "🔄 Updating all frontend files to use Polygon Mumbai..."

# Ваш API URL
API_URL="https://workspace.alekseev2508.repl.co/api"

# Список файлов для обновления
FILES=(
  "index.html"
  "landing.html" 
  "coin-creator.html"
  "coin-guide.html"
  "frontend/network-status.html"
  "frontend/zuzcoin-wallet.html"
  "dex-interface.js"
  "blockchain/token.js"
  "blockchain/mainnet.js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Updating: $file"
    
    # Заменяем все варианты localhost:8547
    sed -i.bak \
      -e "s|http://localhost:8547|${API_URL}|g" \
      -e "s|http://127.0.0.1:8547|${API_URL}|g" \
      -e "s|localhost:8547|${API_URL}|g" \
      -e "s|127.0.0.1:8547|${API_URL}|g" \
      -e "s|http://localhost:3000|https://workspace.alekseev2508.repl.co|g" \
      "$file"
      
    # Также заменяем тексты о сети
    sed -i.bak \
      -e "s|ZUZCOIN ProofChain (Local)|Polygon Mumbai Testnet|g" \
      -e "s|Chain ID: 7777|Chain ID: 80001|g" \
      -e "s|🔧 DEVELOPMENT MODE|🌐 POLYGON MUMBAI TESTNET|g" \
      -e "s|Ganache Blockchain|Polygon Mumbai Blockchain|g" \
      "$file"
  fi
done

echo "✅ Frontend updated to use Polygon Mumbai!"
echo "🌐 API URL: $API_URL"
echo "🔗 Open: https://workspace.alekseev2508.repl.co"
