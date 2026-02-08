require("dotenv").config();
const { ethers } = require("ethers");

async function checkWallet() {
  try {
    console.log("🔍 Проверяем кошелек...");
    
    // Используем публичный RPC из hardhat.config.js
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("👛 Адрес кошелька:", wallet.address);
    
    // Проверяем баланс ETH
    const ethBalance = await provider.getBalance(wallet.address);
    console.log("💰 ETH баланс:", ethers.formatEther(ethBalance), "ETH");
    
    // Проверяем историю транзакций
    console.log("\n📡 Проверяем последние транзакции...");
    const blockNumber = await provider.getBlockNumber();
    console.log("Текущий блок Sepolia:", blockNumber);
    
    // Проверим создавал ли кошелек контракты
    console.log("\n🎯 Проверяем создание контрактов...");
    
    // Попробуем найти контракт вручную - проверим несколько адресов
    const possibleContracts = [
      "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31",  // Из progress.json
      wallet.address  // Может быть сам кошелек деплоил
    ];
    
    for (const address of possibleContracts) {
      const code = await provider.getCode(address);
      if (code !== "0x") {
        console.log(`✅ Контракт найден по адресу: ${address}`);
        console.log(`   Длина кода: ${code.length} символов`);
      } else {
        console.log(`❌ Нет контракта по адресу: ${address}`);
      }
    }
    
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

checkWallet();
