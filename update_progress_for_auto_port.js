const fs = require('fs');
let progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));

// Добавляем авто-порт в достижения
progress.achievements.push("Автоматический поиск свободного порта реализован");
progress.interface_features.push("Динамическая адаптация под любой порт");
progress.interface_features.push("Умный прокси для Replit");

// Обновляем файлы
progress.files_for_next_chat.push("server-auto-port.js");
progress.files_for_next_chat.push("start_zuzcoin.sh");
progress.files_for_next_chat.push("check_status.sh");
progress.files_for_next_chat.push("stop_server.sh");
progress.files_for_next_chat.push("proxy_server.js");

// Обновляем next_chat_commands
progress.next_chat_commands = [
  "./stop_server.sh",
  "./start_zuzcoin.sh",
  "./check_status.sh"
];

// Добавляем примечание
progress.notes = "Система теперь автоматически находит свободный порт. Запускайте ./start_zuzcoin.sh - он сам найдет свободный порт и запустит сервер. Мобильная версия полностью адаптирована.";

fs.writeFileSync('progress.json', JSON.stringify(progress, null, 2));
console.log('✅ Progress обновлен с системой авто-порта');
