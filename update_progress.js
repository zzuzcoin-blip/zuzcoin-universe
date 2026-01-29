const fs = require('fs');
let progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));

// Добавляем мобильную версию в достижения
progress.achievements.push("Мобильная версия создана");
progress.interface_features.push("Адаптивный дизайн для телефонов");
progress.interface_features.push("Бургер-меню для навигации");
progress.interface_features.push("Оптимизация для мобильных экранов");

// Обновляем файлы
progress.files_for_next_chat.push("mobile.css");
progress.files_for_next_chat.push("update_html.js");

// Добавляем примечание
progress.notes = "Система теперь имеет полностью адаптивную мобильную версию. На телефоне появится бургер-меню для навигации, все элементы адаптированы под маленькие экраны.";

fs.writeFileSync('progress.json', JSON.stringify(progress, null, 2));
console.log('✅ Progress обновлен с мобильной версией');
