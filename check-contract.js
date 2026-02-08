const { ethers } = require("ethers");

async function checkContract() {
  try {
    // Адрес контракта
    const contractAddress = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
    
    // Provider для Sepolia
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/");
    
    console.log("🔍 Проверяем контракт на Sepolia...");
    
    // Проверим код контракта
    const code = await provider.getCode(contractAddress);
    
    if (code === "0x") {
      console.log("❌ Контракт не существует на этом адресе");
    } else {
      console.log("✅ Контракт существует!");
      console.log("Код контракта (первые 100 символов):", code.substring(0, 100) + "...");
      console.log("Длина кода:", code.length, "символов");
      
      // Проверим баланс
      const balance = await provider.getBalance(contractAddress);
      console.log("Баланс контракта:", ethers.formatEther(balance), "ETH");
    }
    
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

checkContract();
