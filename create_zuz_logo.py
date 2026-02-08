#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Создаем изображение 400x200
img = Image.new('RGBA', (400, 200), (14, 26, 45, 255))
draw = ImageDraw.Draw(img)

# Основной круг/монета
draw.ellipse([50, 50, 150, 150], fill=(0, 195, 255, 255), outline=(255, 255, 255, 255), width=3)

# Буква Z в центре
try:
    font = ImageFont.truetype("arial.ttf", 60)
except:
    font = ImageFont.load_default()

draw.text((85, 70), "Z", fill=(255, 255, 255, 255), font=font)

# Текст справа
draw.text((180, 70), "ZUZCOIN", fill=(255, 255, 255, 255), font=font)
draw.text((180, 130), "CREATING FUTURE", fill=(0, 209, 140, 255), font=font)

# Сохраняем
img.save("ZUZCOIN_created.png")
print("✅ Логотип создан: ZUZCOIN_created.png")
