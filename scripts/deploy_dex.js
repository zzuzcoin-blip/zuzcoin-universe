const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Начинаем деплой ZUZIM DEX на Sepolia...");
  
  // Получаем аккаунт
  const [deployer] = await ethers.getSigners();
  console.log("👤 Аккаунт для деплоя:", deployer.address);
  console.log("💰 Баланс аккаунта:", ethers.formatEther(await deployer.getBalance()), "ETH");
  
  // Деплоим ZUZIM DEX
  console.log("📦 Деплоим контракт ZUZIMDEX...");
  const ZUZIMDEX = await ethers.getContractFactory("ZUZIMDEX");
  const zuzimDex = await ZUZIMDEX.deploy();
  
  await zuzimDex.waitForDeployment();
  const dexAddress = await zuzimDex.getAddress();
  
  console.log("✅ ZUZIM DEX деплоен по адресу:", dexAddress);
  console.log("🔗 Ссылка на Etherscan: https://sepolia.etherscan.io/address/" + dexAddress);
  
  // Сохраняем адреса в файл
  const fs = require('fs');
  const addresses = {
    ZUZToken: "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
    ZUZIMDEX: dexAddress,
    CharityWallet: "0x742d35CC6634c0532925A3b844bC9e5F2A5dF2E3",
    network: "Sepolia Testnet",
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('deployed_addresses.json', JSON.stringify(addresses, null, 2));
  console.log("📁 Адреса сохранены в deployed_addresses.json");
  
  // Проверяем контракт
  console.log("\n🔍 Проверяем контракт...");
  console.log("Владелец DEX:", await zuzimDex.owner());
  console.log("Charity wallet:", await zuzimDex.CHARITY_WALLET());
  console.log("Trading fee:", await zuzimDex.TRADING_FEE(), "(0.3%)");
  console.log("Charity fee:", await zuzimDex.CHARITY_FEE(), "(1%)");
  
  console.log("\n🎉 Деплой завершен успешно!");
  console.log("\n🎯 Следующие шаги:");
  console.log("1. Верифицировать контракт на Etherscan");
  console.log("2. Добавить ликвидность ZUZ/USDT");
  console.log("3. Обновить интерфейс для работы с DEX");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка деплоя:", error);
    process.exit(1);
  });
