const { ethers } = require("ethers");

async function getExactBytecode() {
  try {
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
    const contractAddress = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
    
    console.log("🔍 Получаем ТОЧНЫЙ байткод контракта...");
    
    // Получаем полный байткод
    const fullBytecode = await provider.getCode(contractAddress);
    
    // Разделяем байткод на части для анализа
    console.log("\n📊 АНАЛИЗ БАЙТКОДА:");
    console.log("Длина полного байткода:", fullBytecode.length, "символов");
    console.log("Длина в байтах:", (fullBytecode.length - 2) / 2, "bytes"); // -2 для "0x"
    
    // Первые 20 символов (первые 10 байт)
    console.log("\nПервые 20 символов:", fullBytecode.substring(0, 20));
    
    // Последние 20 символов
    console.log("Последние 20 символов:", fullBytecode.substring(fullBytecode.length - 20));
    
    // Сохраняем байткод в файл для сравнения
    const fs = require('fs');
    fs.writeFileSync('REAL_CONTRACT_BYTECODE.txt', fullBytecode);
    
    console.log("\n✅ Байткод сохранен в REAL_CONTRACT_BYTECODE.txt");
    console.log("Теперь можем сравнивать с нашими версиями!");
    
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

getExactBytecode();
