#!/bin/bash
echo "Создаю простой PNG логотип через canvas API..."
cat > simple_logo.html << 'HTMLEND'
<!DOCTYPE html>
<html>
<body>
<canvas id="logoCanvas" width="400" height="200"></canvas>
<script>
const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// Фон
ctx.fillStyle = '#0e1a2d';
ctx.fillRect(0, 0, 400, 200);

// Круг-монета
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
const gradient = ctx.createLinearGradient(50, 50, 150, 150);
gradient.addColorStop(0, '#00c3ff');
gradient.addColorStop(1, '#0099cc');
ctx.fillStyle = gradient;
ctx.fill();
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 3;
ctx.stroke();

// Буква Z
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Z', 100, 100);

// Текст ZUZCOIN
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 36px Arial';
ctx.textAlign = 'left';
ctx.fillText('ZUZCOIN', 180, 80);

// Подтекст
ctx.fillStyle = '#00d18c';
ctx.font = '24px Arial';
ctx.fillText('CREATING FUTURE', 180, 130);

// Сохраняем
const dataURL = canvas.toDataURL('image/png');
const link = document.createElement('a');
link.download = 'ZUZCOIN_logo.png';
link.href = dataURL;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

console.log('✅ Логотип создан и предложен для скачивания');
</script>
</body>
</html>
HTMLEND
echo "Откройте simple_logo.html чтобы скачать PNG логотип"
