const hre = require("hardhat");

async function main() {
  console.log("🔧 Проверяем настройки компилятора...");
  
  // Компилируем контракт
  await hre.run("compile");
  
  // Читаем артефакт
  const fs = require('fs');
  const artifact = JSON.parse(fs.readFileSync('artifacts/contracts/ZUZToken.sol/ZUZToken.json', 'utf8'));
  
  console.log("📊 ИНФОРМАЦИЯ О КОМПИЛЯЦИИ:");
  console.log("Metadata:", artifact.metadata ? "Есть" : "Нет");
  
  if (artifact.metadata) {
    const metadata = JSON.parse(artifact.metadata);
    console.log("Compiler version:", metadata.compiler.version);
    console.log("Settings:", JSON.stringify(metadata.settings, null, 2));
    
    if (metadata.settings.optimizer) {
      console.log("Optimizer enabled:", metadata.settings.optimizer.enabled);
      console.log("Optimizer runs:", metadata.settings.optimizer.runs);
    }
  }
  
  console.log("\n🎯 ДЕЙСТВИЯ:");
  console.log("1. В Etherscan выберите НАСТРОЙКИ КОМПИЛЯЦИИ как выше");
  console.log("2. ИЛИ измените hardhat.config.js чтобы соответствовать");
}

main().catch(console.error);
