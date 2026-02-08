const fs = require('fs');

// Проверяем index.html
const html = fs.readFileSync('index.html', 'utf8');

console.log("📋 ПРОВЕРКА МОБИЛЬНЫХ СТИЛЕЙ В INDEX.HTML");
console.log("=" .repeat(50));

// Проверяем viewport
const hasViewport = html.includes('viewport');
console.log(`✅ Viewport meta tag: ${hasViewport ? 'YES' : 'NO'}`);

// Проверяем медиазапросы
const hasMedia768 = html.includes('@media (max-width: 768px)');
const hasMedia480 = html.includes('@media (max-width: 480px)');
const hasMedia360 = html.includes('@media (max-width: 360px)');

console.log(`✅ Media query 768px: ${hasMedia768 ? 'YES' : 'NO'}`);
console.log(`✅ Media query 480px: ${hasMedia480 ? 'YES' : 'NO'}`);
console.log(`✅ Media query 360px: ${hasMedia360 ? 'YES' : 'NO'}`);

// Проверяем стили для мобильных
const hasMobileStyles = html.includes('overflow-x: hidden');
console.log(`✅ overflow-x: hidden: ${hasMobileStyles ? 'YES' : 'NO'}`);

console.log("");
console.log("🎯 РЕКОМЕНДАЦИИ:");
if (!hasMedia768) {
  console.log("❌ Добавить медиазапросы для мобильных!");
} else {
  console.log("✅ Медиазапросы на месте");
}

console.log("");
console.log("📱 Создаю простой тест для проверки на мобильном...");
