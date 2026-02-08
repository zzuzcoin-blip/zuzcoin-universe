// Простейшая проверка сети и баланса
const hre = require("hardhat");

async function main() {
  console.log("🔍 Проверка подключения к Sepolia...");
  
  try {
    // Получаем провайдер из конфига
    const provider = hre.ethers.provider;
    
    // Получаем первый аккаунт (deployer)
    const [deployer] = await hre.ethers.getSigners();
    const address = deployer.address;
    console.log("👤 Адрес:", address);
    
    // Проверяем баланс (самый простой способ)
    const balance = await provider.getBalance(address);
    console.log("💰 Баланс (wei):", balance.toString());
    
    // Конвертируем в ETH (без formatEther)
    const ethBalance = balance.toString() / 1000000000000000000;
    console.log("💰 Баланс ETH:", ethBalance);
    
    // Проверяем сеть
    const network = await provider.getNetwork();
    console.log("🔗 Сеть ID:", network.chainId);
    
    if (ethBalance < 0.01) {
      console.log("⚠️  Нужно больше ETH!");
      console.log("   Faucet: https://sepoliafaucet.com/");
    } else {
      console.log("✅ Готов к деплою!");
    }
    
  } catch (error) {
    console.log("❌ Ошибка подключения:", error.message);
    console.log("💡 Проверьте:");
    console.log("   1. PRIVATE_KEY в .env");
    console.log("   2. Подключение к интернету");
    console.log("   3. RPC URL в hardhat.config.js");
  }
}

main().then(() => {
  console.log("✅ Проверка завершена");
  process.exit(0);
}).catch(error => {
  console.error("❌ Критическая ошибка:", error);
  process.exit(1);
});
