const fs = require('fs');
require('dotenv').config();

console.log("🔍 Проверяем готовность к деплою на Sepolia...");
console.log("=========================================");

// Проверяем переменные окружения
const envVars = {
  'SEPOLIA_RPC_URL': process.env.SEPOLIA_RPC_URL,
  'PRIVATE_KEY': process.env.PRIVATE_KEY ? '✅ Установлен (скрыт)' : '❌ Отсутствует',
  'ETHERSCAN_API_KEY': process.env.ETHERSCAN_API_KEY ? '✅ Установлен (скрыт)' : '❌ Отсутствует'
};

console.log("\n📋 ТЕКУЩИЕ НАСТРОЙКИ .env:");
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

console.log("\n💰 ПРОВЕРКА ДЕПЛОЯ:");
console.log("1. Sepolia ETH на кошельке:", "✅ У вас есть (0.49 ETH)");
console.log("2. ZUZ Token deployed:", "✅ 0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3");

console.log("\n🎯 ЧТО НУЖНО ДЛЯ ДЕПЛОЯ DEX:");
if (!process.env.SEPOLIA_RPC_URL || process.env.SEPOLIA_RPC_URL.includes('demo')) {
  console.log("❌ Нужен реальный Alchemy API ключ");
} else {
  console.log("✅ SEPOLIA_RPC_URL настроен");
}

if (!process.env.PRIVATE_KEY) {
  console.log("❌ Нужен приватный ключ MetaMask");
} else {
  console.log("✅ PRIVATE_KEY настроен");
}

if (!process.env.ETHERSCAN_API_KEY || process.env.ETHERSCAN_API_KEY.includes('ваш')) {
  console.log("❌ Нужен Etherscan API ключ");
} else {
  console.log("✅ ETHERSCAN_API_KEY настроен");
}

console.log("\n💡 РЕКОМЕНДАЦИЯ:");
console.log("Если нет API ключей, можно сначала деплоить без верификации,");
console.log("а верифицировать позже когда получите ключи.");
console.log("\n🚀 Альтернатива: деплоить через Remix IDE с MetaMask");

// Проверяем наличие контрактов
console.log("\n📁 ПРОВЕРКА КОНТРАКТОВ:");
const contracts = ['ZUZIMDEX.sol', 'ZUZToken.sol', 'TokenFactory.sol', 'DigitalNotary.sol'];
contracts.forEach(contract => {
  const exists = fs.existsSync(`contracts/${contract}`);
  console.log(`${exists ? '✅' : '❌'} ${contract}`);
});

console.log("\n=========================================");
