const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('🔍 ДИАГНОСТИКА КЛИКАБЕЛЬНОСТИ БУРГЕР-МЕНЮ');
console.log('========================================');

// Ищем все JavaScript код для бургер-меню
const burgerJS = html.match(/mobileMenuBtn[\s\S]*?addEventListener[\s\S]*?}/g) || 
                 html.match(/burgerBtn[\s\S]*?addEventListener[\s\S]*?}/g) ||
                 html.match(/toggleMenu[\s\S]*?}/g);

console.log('1. JavaScript для бургер-меню:');
if (burgerJS) {
  console.log('✅ Найден:', burgerJS[0].substring(0, 200) + '...');
} else {
  console.log('❌ Не найден');
}

// Проверяем наличие элемента
console.log('\n2. Элемент бургер-меню в HTML:');
const burgerBtnExists = html.includes('id="mobileMenuBtn"');
console.log(burgerBtnExists ? '✅ Элемент найден' : '❌ Элемент не найден');

// Проверяем inline обработчики
console.log('\n3. Inline обработчики:');
const hasOnclick = html.includes('onclick="');
console.log(hasOnclick ? '✅ Есть onclick обработчики' : '❌ Нет onclick обработчиков');

// Проверяем class для кликабельности
console.log('\n4. CSS стили для кликабельности:');
const hasCursorPointer = html.includes('cursor: pointer') || html.includes('cursor:pointer');
console.log(hasCursorPointer ? '✅ cursor: pointer найден' : '❌ cursor: pointer не найден');

// Проверяем z-index
console.log('\n5. Z-index для доступности:');
const zIndexMatch = html.match(/z-index:\s*(\d+)/);
console.log(zIndexMatch ? `✅ z-index: ${zIndexMatch[1]}` : '❌ z-index не установлен');

// Ищем возможные перекрывающие элементы
console.log('\n6. Возможные проблемы:');
const topBarHTML = html.match(/<div[^>]*top-bar[^>]*>([\s\S]*?)<\/div>/);
if (topBarHTML) {
  console.log('Top-bar найден, проверяем структуру...');
  // Проверяем есть ли элементы перекрывающие бургер
  const hasElementsBeforeBurger = topBarHTML[1].indexOf('mobile-menu-btn') > 0;
  console.log(hasElementsBeforeBurger ? '⚠️ Возможно есть элементы перед бургером' : '✅ Бургер первый в top-bar');
}
