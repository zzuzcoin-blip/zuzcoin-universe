#!/bin/bash
echo "Добавляю маленькие желтые монеты в секции..."

# Создаем временный файл
temp_file="index_with_icons_$(date +%s).html"

# Добавляем маленькие иконки ZUZCOIN в секцию Token Factory
awk '
# Находим секцию Token Factory
/<h2 class="section-title" id="token-factory">/ {
    print $0
    getline
    print $0
    # Добавляем стиль для маленьких иконок
    print "        <style>"
    print "            .small-zuz-coin {"
    print "                width: 30px;"
    print "                height: 30px;"
    print "                background: #000000;"
    print "                border: 2px solid #FFD700;"
    print "                border-radius: 50%;"
    print "                display: flex;"
    print "                align-items: center;"
    print "                justify-content: center;"
    print "                color: #FFD700;"
    print "                font-size: 16px;"
    print "                font-weight: bold;"
    print "                margin: 0 auto 10px;"
    print "            }"
    print "        </style>"
    next
}

# В первом feature-card Token Factory заменяем иконку
/<div class="feature-card" onclick="showComingSoon(.Token Factory.)/"> {
    in_token_factory = 1
}
in_token_factory && /<div class="feature-icon"><i class="fas fa-coins"><\/i><\/div>/ {
    print "                <div class=\"small-zuz-coin\">Z</div>"
    in_token_factory = 0
    next
}

# Во втором feature-card (Charity Slider) оставляем как есть
/<div class="feature-card" onclick="showComingSoon(.Charity Slider.)/"> {
    in_charity = 1
}
in_charity && /<div class="feature-icon"><i class="fas fa-percentage"><\/i><\/div>/ {
    print $0
    in_charity = 0
    next
}

# Во всех остальных местах печатаем как есть
{ print }
' index.html > "$temp_file"

mv "$temp_file" index.html

echo "✅ Добавлены маленькие желтые монеты в секцию Token Factory"
echo "✅ Остальной интерфейс не изменен"
echo "✅ MetaMask продолжает работать"
