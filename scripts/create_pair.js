// Скрипт для создания пары ZUZ/USDT в DEX
const { ethers } = require("ethers");

// Адреса
const DEX_ADDRESS = "0x09970975aa48c718e17db4a18128ebf6806e1f2c";
const ZUZ_TOKEN = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
// USDT на Sepolia (официальный тестовый)
const USDT_TOKEN = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";

// ABI для вызова функции createPair
const DEX_ABI = [
  "function createPair(address tokenA, address tokenB) external",
  "function owner() external view returns (address)"
];

async function createPair() {
  console.log("🔗 Создание пары ZUZ/USDT в DEX...");
  
  // Подключаемся к MetaMask
  if (typeof window.ethereum === 'undefined') {
    console.error("❌ MetaMask не найден");
    return;
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const dexContract = new ethers.Contract(DEX_ADDRESS, DEX_ABI, signer);
    
    // Проверяем что мы владелец
    const owner = await dexContract.owner();
    const userAddress = await signer.getAddress();
    
    console.log(`👤 Владелец DEX: ${owner}`);
    console.log(`👤 Ваш адрес: ${userAddress}`);
    
    if (owner.toLowerCase() !== userAddress.toLowerCase()) {
      console.error("❌ Вы не владелец DEX!");
      return;
    }
    
    console.log("✅ Вы владелец DEX");
    console.log(`📊 Создаю пару:`);
    console.log(`   Token A (ZUZ): ${ZUZ_TOKEN}`);
    console.log(`   Token B (USDT): ${USDT_TOKEN}`);
    
    // Вызываем createPair
    const tx = await dexContract.createPair(ZUZ_TOKEN, USDT_TOKEN);
    console.log(`⏳ Транзакция отправлена: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Пара создана! Блок: ${receipt.blockNumber}`);
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

// Экспортируем для использования в браузере
if (typeof window !== 'undefined') {
  window.createPair = createPair;
}

console.log("📋 Инструкция для создания пары:");
console.log("1. Откройте консоль браузера (F12 → Console)");
console.log("2. Вставьте этот скрипт");
console.log("3. Выполните: await createPair()");
console.log("4. Подтвердите в MetaMask");
