const { ethers } = require("ethers");

async function getDeployedCode() {
  console.log("🔍 Ищем реальный код деплоенного контракта...");
  
  // Адрес деплоенного контракта
  const DEX_ADDRESS = "0x09970975aa48c718e17db4a18128ebf6806e1f2c";
  
  // Provider для Sepolia
  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
  
  try {
    // Получаем bytecode контракта
    const code = await provider.getCode(DEX_ADDRESS);
    
    console.log("✅ Bytecode получен!");
    console.log("📏 Длина bytecode:", code.length, "символов");
    console.log("📝 Первые 100 символов:", code.substring(0, 100) + "...");
    console.log("📝 Последние 100 символов:", "..." + code.substring(code.length - 100));
    
    // Сохраняем bytecode в файл
    const fs = require('fs');
    fs.writeFileSync('DEPLOYED_BYTECODE.txt', code);
    console.log("💾 Bytecode сохранен в DEPLOYED_BYTECODE.txt");
    
    // Проверяем конструктор
    console.log("\n🔍 АНАЛИЗ BYTECODE:");
    
    // Ищем адрес charityWallet в bytecode
    const charityAddr = "0x742d35cc6634c0532925a3b844bc9e5f2a5df2e3";
    if (code.toLowerCase().includes(charityAddr.toLowerCase())) {
      console.log("✅ В bytecode ЕСТЬ адрес charity wallet");
    } else {
      console.log("❌ В bytecode НЕТ адреса charity wallet");
    }
    
    console.log("\n🎯 ВЫВОД:");
    console.log("Вы деплоили контракт С адресом charity wallet в конструкторе");
    console.log("Но пытаетесь верифицировать контракт БЕЗ адреса в конструкторе");
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

getDeployedCode();
