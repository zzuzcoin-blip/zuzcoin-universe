#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Создаем логотип 200x200 пикселей
size = 200
img = Image.new('RGB', (size, size), color='black')
draw = ImageDraw.Draw(img)

# Рисуем желтый ободок (монета)
border_width = 15
draw.ellipse([border_width, border_width, size-border_width, size-border_width], 
             outline='yellow', width=border_width)

# Рисуем большую желтую букву Z
try:
    font = ImageFont.truetype("arial.ttf", 120)
except:
    font = ImageFont.load_default()

# Позиционируем букву Z
text = "Z"
text_width, text_height = draw.textsize(text, font=font)
x = (size - text_width) // 2
y = (size - text_height) // 2 - 10
draw.text((x, y), text, fill='yellow', font=font)

# Сохраняем логотип
img.save('ZUZCOIN.png')
print("✅ Логотип ZUZCOIN.png создан!")
print("   - Желтая буква Z на черном фоне")
print("   - Желтый ободок в виде монеты")
print("   - Размер: 200x200 пикселей")
