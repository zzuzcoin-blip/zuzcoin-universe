const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

console.log('🔍 ДИАГНОСТИКА БУРГЕР-МЕНЮ');
console.log('==========================');

// Ищем бургер-меню в HTML
const burgerMatch = html.match(/<[^>]*mobile-menu-btn[^>]*>/);
console.log('1. HTML тег бургер-меню:', burgerMatch ? 'НАЙДЕН' : 'НЕ НАЙДЕН');
if (burgerMatch) console.log('   Тег:', burgerMatch[0]);

// Проверяем наличие всех необходимых атрибутов
const hasId = html.includes('id="mobileMenuBtn"');
const hasClass = html.includes('class="mobile-menu-btn"');
console.log('2. Атрибуты:');
console.log('   - id="mobileMenuBtn":', hasId ? '✅' : '❌');
console.log('   - class="mobile-menu-btn":', hasClass ? '✅' : '❌');

// Проверяем inline-стили
const inlineStyleMatch = html.match(/mobileMenuBtn[^>]*style="([^"]*)"/);
console.log('3. Inline-стили:', inlineStyleMatch ? inlineStyleMatch[1] : 'Нет');

// Проверяем медиа-запросы для мобильных
const mediaQueries = (html.match(/@media[^{]*{[^}]*mobile-menu-btn[^}]*}/g) || []).length;
console.log('4. Медиа-запросы с бургер-меню:', mediaQueries);

// Проверяем JavaScript для бургер-меню
const jsForBurger = html.includes('mobileMenuBtn.addEventListener') || html.includes('document.getElementById(\'mobileMenuBtn\')');
console.log('5. JavaScript для управления:', jsForBurger ? '✅' : '❌');

// Проверяем общую структуру top-bar
const topBarMatch = html.match(/<div[^>]*top-bar[^>]*>([\s\S]*?)<\/div>/);
console.log('6. Top-bar найден:', topBarMatch ? '✅' : '❌');
if (topBarMatch) {
  const topBarContent = topBarMatch[1];
  const burgerInTopBar = topBarContent.includes('mobile-menu-btn');
  console.log('   Бургер в top-bar:', burgerInTopBar ? '✅' : '❌');
}

console.log('==========================');
