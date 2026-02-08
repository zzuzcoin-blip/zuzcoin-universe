// Простой скрипт для проверки баланса
const { ethers } = require("hardhat");

async function main() {
  try {
    // Подключаемся к сети через hardhat конфиг
    const [signer] = await ethers.getSigners();
    console.log("👤 Адрес кошелька:", signer.address);
    
    // Получаем баланс
    const balance = await ethers.provider.getBalance(signer.address);
    const ethBalance = ethers.utils.formatEther(balance);
    console.log("💰 Баланс ETH:", ethBalance, "ETH");
    
    // Проверяем достаточно ли ETH
    if (parseFloat(ethBalance) < 0.01) {
      console.log("⚠️  Мало ETH! Нужно получить:");
      console.log("   https://sepoliafaucet.com/");
      console.log("   Или: https://faucet.quicknode.com/ethereum/sepolia");
    } else {
      console.log("✅ Достаточно ETH для деплоя контрактов!");
    }
    
    // Информация о сети
    const network = await ethers.provider.getNetwork();
    console.log("🔗 Сеть:", network.name, "(ID:", network.chainId + ")");
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Получите тестовый ETH на Sepolia faucet");
    }
  }
}

// Запускаем через hardhat
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
