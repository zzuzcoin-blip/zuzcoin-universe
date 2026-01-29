#!/bin/bash

echo "🔄 Обновление API URL во фронтенде..."

# Получаем Replit URL
REPLIT_URL=""
if [ -n "$REPL_SLUG" ] && [ -n "$REPL_OWNER" ]; then
  REPLIT_URL="https://${REPL_SLUG}.${REPL_OWNER}.repl.co"
else
  # Покажите мне ваш URL из браузера
  echo "Введите ваш Replit URL (например: https://project.username.repl.co):"
  read REPLIT_URL
fi

echo "📡 Используем API URL: ${REPLIT_URL}/api"

# Ищем и заменяем во всех JS/HTML файлах
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.html" \) \
  ! -path "./node_modules/*" ! -path "./.git/*" -exec grep -l "localhost:8547\|127.0.0.1:8547\|localhost:3000" {} \; | while read file; do
  echo "Обновляю: $file"
  
  # Заменяем старые URL на новые
  sed -i.bak \
    -e "s|http://localhost:8547|${REPLIT_URL}/api|g" \
    -e "s|http://127.0.0.1:8547|${REPLIT_URL}/api|g" \
    -e "s|localhost:8547|${REPLIT_URL}/api|g" \
    -e "s|127.0.0.1:8547|${REPLIT_URL}/api|g" \
    -e "s|http://localhost:3000|${REPLIT_URL}|g" \
    "$file"
done

echo "✅ Готово! Фронтенд обновлен для работы с Polygon Mumbai API"
