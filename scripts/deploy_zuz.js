const hre = require("hardhat");

async function main() {
  console.log("🚀 Начинаем деплой ZUZToken...");
  
  // Получаем аккаунт деплойера
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Деплойер:", deployer.address);
  
  // Баланс до деплоя
  const balanceBefore = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Баланс до деплоя:", 
    (balanceBefore.toString() / 1e18).toFixed(4), "ETH");
  
  // Деплоим контракт
  console.log("📦 Деплоим ZUZToken...");
  const ZUZToken = await hre.ethers.getContractFactory("ZUZToken");
  const zuzToken = await ZUZToken.deploy();
  
  console.log("⏳ Ждем подтверждения деплоя...");
  // В новых версиях ethers используем waitForDeployment()
  await zuzToken.waitForDeployment();
  
  console.log("✅ ZUZToken успешно задеплоен!");
  const address = await zuzToken.getAddress();
  console.log("📍 Адрес контракта:", address);
  console.log("🔗 Etherscan: https://sepolia.etherscan.io/address/" + address);
  
  // Баланс после деплоя
  const balanceAfter = await hre.ethers.provider.getBalance(deployer.address);
  const gasUsed = balanceBefore.sub(balanceAfter);
  console.log("⛽ Использовано газа:", 
    (gasUsed.toString() / 1e18).toFixed(6), "ETH");
  
  // Проверяем баланс токенов
  const tokenBalance = await zuzToken.balanceOf(deployer.address);
  console.log("🪙 Баланс ZUZ токенов:", 
    (tokenBalance.toString() / 1e18).toFixed(0), "ZUZ");
  
  // Сохраняем адрес в файл
  const fs = require('fs');
  fs.writeFileSync('ZUZ_TOKEN_ADDRESS.txt', address);
  console.log("📝 Адрес сохранен в ZUZ_TOKEN_ADDRESS.txt");
  
  console.log("\n🎉 Деплой завершен! Теперь можно верифицировать на Etherscan:");
  console.log("1. Compiler: Solidity (Single file)");
  console.log("2. Version: 0.8.19");
  console.log("3. License: MIT");
  console.log("4. Paste source from contracts/ZUZToken.sol");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Ошибка при деплое:", error);
    process.exit(1);
  });
