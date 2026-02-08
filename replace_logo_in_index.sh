#!/bin/bash
echo "=== ЗАМЕНА ЛОГОТИПА В index.html ==="
echo ""

# Проверяем наличие index.html
if [ ! -f "index.html" ]; then
    echo "❌ Файл index.html не найден!"
    echo "Создаю новый файл..."
    
    cat > index.html << 'NEWINDEX'
<!DOCTYPE html>
<html>
<head>
    <title>ZUZCOIN Universe</title>
    <style>
        body { background: #0e1a2d; color: white; padding: 20px; }
        .logo { display: flex; align-items: center; gap: 15px; margin: 20px; }
    </style>
</head>
<body>
    <div class="logo">
        <div style="width:50px;height:50px;background:#000;border:2px solid #FFD700;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#FFD700;font-size:26px;font-weight:bold;">Z</div>
        <div>
            <div style="font-size:22px;font-weight:bold;">ZUZCOIN</div>
            <div style="font-size:14px;color:#8a9bb2;">Universe</div>
        </div>
    </div>
    <p>Это новый файл index.html с логотипом ZUZCOIN Universe</p>
</body>
</html>
NEWINDEX
    
    echo "✅ Создан новый index.html"
    exit 0
fi

echo "✅ Найден index.html"
echo "Создаю резервную копию..."

# Создаем резервную копию
backup_file="index_backup_before_logo_$(date +%s).html"
cp index.html "$backup_file"
echo "✅ Резервная копия создана: $backup_file"

echo ""
echo "Заменяю логотип в index.html..."

# Создаем временный файл с заменой
temp_file="index_temp_$(date +%s).html"

# Ищем и заменяем блок логотипа
# Вариант 1: Ищем существующий логотип с иконкой монеты
if grep -q '<div class="logo">' index.html; then
    echo "Найден существующий логотип, заменяю..."
    
    # Читаем файл и заменяем блок логотипа
    awk '
    /<div class="logo">/ {
        print "        <!-- Логотип ZUZCOIN Universe -->"
        print "        <div class=\"logo\" style=\"display: flex; align-items: center; gap: 15px;\">"
        print "            <!-- Желтая монета с буквой Z -->"
        print "            <div style=\""
        print "                width: 50px;"
        print "                height: 50px;"
        print "                background: #000000;"
        print "                border: 2px solid #FFD700;"
        print "                border-radius: 50%;"
        print "                display: flex;"
        print "                align-items: center;"
        print "                justify-content: center;"
        print "                color: #FFD700;"
        print "                font-size: 26px;"
        print "                font-weight: bold;"
        print "                box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);"
        print "            \">"
        print "                Z"
        print "            </div>"
        print "            "
        print "            <!-- Текст ZUZCOIN Universe -->"
        print "            <div style=\"display: flex; flex-direction: column; line-height: 1.2;\">"
        print "                <span style=\""
        print "                    font-size: 22px;"
        print "                    font-weight: 700;"
        print "                    color: white;"
        print "                    letter-spacing: 0.5px;"
        print "                \">"
        print "                    ZUZCOIN"
        print "                </span>"
        print "                <span style=\""
        print "                    font-size: 14px;"
        print "                    color: #8a9bb2;"
        print "                    font-weight: 400;"
        print "                \">"
        print "                    Universe"
        print "                </span>"
        print "            </div>"
        print "        </div>"
        # Пропускаем старые строки логотипа
        while (getline && !/<\/div>/) {}
        next
    }
    { print }
    ' index.html > "$temp_file"
    
    mv "$temp_file" index.html
    echo "✅ Логотип заменен!"
    
else
    echo "❌ Логотип не найден в стандартном формате"
    echo "Добавляю логотип в начало файла..."
    
    # Добавляем логотип в начало body
    awk '
    /<body>/ {
        print $0
        print "    <div class=\"container\">"
        print "        <!-- Header -->"
        print "        <header class=\"header\">"
        print "            <!-- Логотип ZUZCOIN Universe -->"
        print "            <div class=\"logo\" style=\"display: flex; align-items: center; gap: 15px;\">"
        print "                <!-- Желтая монета с буквой Z -->"
        print "                <div style=\""
        print "                    width: 50px;"
        print "                    height: 50px;"
        print "                    background: #000000;"
        print "                    border: 2px solid #FFD700;"
        print "                    border-radius: 50%;"
        print "                    display: flex;"
        print "                    align-items: center;"
        print "                    justify-content: center;"
        print "                    color: #FFD700;"
        print "                    font-size: 26px;"
        print "                    font-weight: bold;"
        print "                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);"
        print "                \">"
        print "                    Z"
        print "                </div>"
        print "                "
        print "                <!-- Текст ZUZCOIN Universe -->"
        print "                <div style=\"display: flex; flex-direction: column; line-height: 1.2;\">"
        print "                    <span style=\""
        print "                        font-size: 22px;"
        print "                        font-weight: 700;"
        print "                        color: white;"
        print "                        letter-spacing: 0.5px;"
        print "                    \">"
        print "                        ZUZCOIN"
        print "                    </span>"
        print "                    <span style=\""
        print "                        font-size: 14px;"
        print "                        color: #8a9bb2;"
        print "                        font-weight: 400;"
        print "                    \">"
        print "                        Universe"
        print "                    </span>"
        print "                </div>"
        print "            </div>"
        next
    }
    { print }
    ' index.html > "$temp_file"
    
    mv "$temp_file" index.html
    echo "✅ Логотип добавлен!"
fi

echo ""
echo "=== ПРОВЕРКА ==="
echo "✅ Резервная копия: $backup_file"
echo "✅ Новый index.html создан"
echo ""
echo "Откройте index.html чтобы увидеть новый логотип!"
echo "Логотип: Желтая буква Z на черной монете + текст 'ZUZCOIN Universe'"
