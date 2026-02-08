const hre = require("hardhat");

async function main() {
  console.log("🔍 ПОЛУЧЕНИЕ РЕАЛЬНОГО БАЙТКОДА");
  console.log("===============================");
  
  const contractAddress = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  const provider = hre.ethers.provider;
  
  console.log("📍 Контракт:", contractAddress);
  
  // Получаем байткод
  const bytecode = await provider.getCode(contractAddress);
  console.log("📏 Длина байткода:", bytecode.length);
  console.log("🔢 Начинается с:", bytecode.substring(2, 70));
  
  // Сохраняем
  const fs = require('fs');
  fs.writeFileSync('REAL_BYTECODE.txt', bytecode);
  console.log("✅ Байткод сохранен в REAL_BYTECODE.txt");
  
  // Сравниваем с Etherscan
  console.log("\n🎯 СРАВНЕНИЕ ДЛЯ ETHERSCAN:");
  console.log("1. Открой https://sepolia.etherscan.io/address/" + contractAddress);
  console.log("2. Нажми 'Verify and Publish'");
  console.log("3. В форме Bytecode должно начинаться с:");
  console.log("   " + bytecode.substring(2, 50));
}

main().catch(console.error);
