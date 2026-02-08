#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Создаем логотип 200x200 пикселей
size = 200
img = Image.new('RGB', (size, size), color='#000000')  # Черный фон
draw = ImageDraw.Draw(img)

# Желтый цвет
yellow = '#FFD700'  # Золотой желтый

# Рисуем желтый ободок (толстый, как монета)
border_width = 20
draw.ellipse([border_width, border_width, size-border_width, size-border_width], 
             outline=yellow, width=border_width)

# Рисуем большую желтую букву Z по центру
try:
    # Пробуем разные шрифты
    font = ImageFont.truetype("arial.ttf", 120)
except:
    try:
        font = ImageFont.truetype("DejaVuSans.ttf", 120)
    except:
        # Если шрифты не найдены, создаем простую Z
        font = ImageFont.load_default()
        # Рисуем Z вручную
        points = [
            (60, 60),    # Верхний левый
            (140, 60),   # Верхний правый  
            (60, 140),   # Нижний левый
            (140, 140)   # Нижний правый
        ]
        draw.line([points[0], points[1]], fill=yellow, width=20)  # Верхняя горизонтальная
        draw.line([points[1], points[2]], fill=yellow, width=20)  # Диагональ
        draw.line([points[2], points[3]], fill=yellow, width=20)  # Нижняя горизонтальная
        font = None

if font:
    text = "Z"
    # Получаем размер текста
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Центрируем букву Z
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - 15
    
    # Рисуем букву Z
    draw.text((x, y), text, fill=yellow, font=font)

# Сохраняем логотип
img.save('ZUZCOIN.png')
print("✅ Логотип ZUZCOIN.png создан!")
print("   ✓ Черный фон")
print("   ✓ Толстый желтый ободок (как монета)")
print("   ✓ Большая желтая буква Z по центру")
print("   ✓ Размер: 200x200 пикселей")
print("")
print("🎨 Цвета:")
print("   - Фон: #000000 (черный)")
print("   - Буква Z и ободок: #FFD700 (золотой желтый)")
print("   - Форма: круглая монета")
