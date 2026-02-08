#!/bin/bash
echo "🛠️ Исправляем отображение логотипа ZUZCOIN..."

# Проверяем ImageMagick
if ! command -v convert &> /dev/null; then
    echo "Устанавливаем ImageMagick..."
    apt-get update && apt-get install -y imagemagick
fi

# 1. Создаем квадратную версию с белым фоном
convert ZUZCOIN.png -background white -gravity center -extent 512x512 logos/zuzcoin_square_white.png

# 2. Создаем квадратную версию с прозрачным фоном (обрезаем)
convert ZUZCOIN.png -gravity center -crop 1:1 -resize 512x512 logos/zuzcoin_square_crop.png

# 3. Создаем версии разных размеров
sizes=(16 24 32 40 256)
for size in "${sizes[@]}"; do
    convert logos/zuzcoin_square_white.png -resize ${size}x${size} logos/zuzcoin_${size}x${size}.png
    echo "✅ Создан: zuzcoin_${size}x${size}.png"
done

# 4. Создаем фавиконку
convert logos/zuzcoin_16x16.png logos/favicon.ico

echo "🎯 Готовые логотипы:"
ls -la logos/
echo ""
echo "Теперь обновим index.html чтобы использовать квадратные логотипы"
