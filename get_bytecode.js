const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/" + process.env.INFURA_KEY);
  const contractAddress = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  
  console.log("📡 Получаем байткод контракта...");
  const bytecode = await provider.getCode(contractAddress);
  
  console.log("📍 Адрес:", contractAddress);
  console.log("📏 Длина байткода:", bytecode.length);
  console.log("🔢 Первые 100 символов:");
  console.log(bytecode.substring(0, 100));
  console.log("\n🎯 Для Etherscan сравните начало:");
  console.log("На Etherscan:", "0x" + bytecode.substring(2, 50));
  
  // Сохраняем для сравнения
  require("fs").writeFileSync("ACTUAL_BYTECODE.txt", bytecode);
  console.log("\n✅ Байткод сохранен в ACTUAL_BYTECODE.txt");
}

main().catch(console.error);
