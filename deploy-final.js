const hre = require("hardhat");

async function main() {
  console.log("🚀 Деплой ZUZIMDEX на Sepolia...");
  
  const ZUZ_TOKEN = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  // Используем правильный checksum
  const CHARITY_WALLET = "0x742d35CC6634c0532925A3b844bC9e768C4E33A0";
  
  console.log("ZUZ Token:", ZUZ_TOKEN);
  console.log("Charity Wallet:", CHARITY_WALLET);
  
  const ZUZIMDEX = await hre.ethers.getContractFactory("ZUZIMDEX");
  const dex = await ZUZIMDEX.deploy(ZUZ_TOKEN, CHARITY_WALLET);
  
  console.log("⏳ Ожидаю деплой...");
  await dex.deployed();
  
  console.log("✅ ZUZIMDEX деплоен по адресу:", dex.address);
  console.log("🔗 https://sepolia.etherscan.io/address/" + dex.address);
  
  // Сохраняем адрес
  require("fs").writeFileSync(
    "dex-address.txt",
    dex.address + "\n" +
    "https://sepolia.etherscan.io/address/" + dex.address
  );
  
  // Для верификации
  console.log("\n📋 Для верификации выполни:");
  console.log(`npx hardhat verify --network sepolia ${dex.address} "${ZUZ_TOKEN}" "${CHARITY_WALLET}"`);
}

main().catch(console.error);
