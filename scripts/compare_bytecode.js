const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const address = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  console.log("🔍 Сравниваем байткоды контракта:", address);
  
  const provider = hre.ethers.provider;
  
  // 1. Получаем байткод задеплоенного контракта
  const deployedCode = await provider.getCode(address);
  console.log("📊 Длина задеплоенного байткода:", deployedCode.length, "символов");
  console.log("Первые 64 символа:", deployedCode.substring(0, 64));
  
  if (deployedCode === '0x') {
    console.log("❌ Контракт не существует!");
    return;
  }
  
  // 2. Компилируем текущий contracts/ZUZToken.sol
  try {
    console.log("\n🔄 Компилируем contracts/ZUZToken.sol...");
    
    // Компилируем через hardhat
    await hre.run("compile");
    
    // Получаем артефакт
    const artifactPath = path.join(__dirname, "../artifacts/contracts/ZUZToken.sol/ZUZToken.json");
    if (!fs.existsSync(artifactPath)) {
      console.log("❌ Артефакт не найден:", artifactPath);
      return;
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const compiledBytecode = artifact.bytecode;
    
    console.log("📊 Длина скомпилированного байткода:", compiledBytecode.length, "символов");
    console.log("Первые 64 символа:", compiledBytecode.substring(0, 64));
    
    // 3. Сравниваем (игнорируем metadata в конце)
    const deployedWithoutMetadata = deployedCode.substring(0, deployedCode.length - 100);
    const compiledWithoutMetadata = compiledBytecode.substring(0, compiledBytecode.length - 100);
    
    console.log("\n🔍 Сравнение (без метаданных):");
    console.log("Длина задеплоенного:", deployedWithoutMetadata.length);
    console.log("Длина скомпилированного:", compiledWithoutMetadata.length);
    
    if (deployedWithoutMetadata === compiledWithoutMetadata) {
      console.log("✅✅✅ БАЙТКОДЫ СОВПАДАЮТ!");
      console.log("Можно верифицировать с contracts/ZUZToken.sol");
    } else {
      console.log("⚠️ ⚠️ ⚠️ БАЙТКОДЫ НЕ СОВПАДАЮТ!");
      
      // Проверим несколько других файлов
      console.log("\n🔎 Проверяем другие возможные исходники...");
      
      const candidateFiles = [
        "ZUZCOIN_correct.sol",
        "ZUZCOIN_FINAL_ATTEMPT.sol",
        "ZUZCOIN_SIMPLE_NO_CHARITY.sol"
      ];
      
      for (const file of candidateFiles) {
        if (fs.existsSync(file)) {
          console.log(`\n📄 Проверяем ${file}:`);
          const content = fs.readFileSync(file, "utf8");
          
          // Проверяем pragma версию
          const pragmaMatch = content.match(/pragma solidity\s+(.*);/);
          if (pragmaMatch) {
            console.log(`   Pragma: ${pragmaMatch[1]}`);
          }
          
          // Проверяем наличие конструктора
          if (content.includes("constructor()")) {
            console.log("   ✅ Есть конструктор");
          }
          
          // Проверяем total supply
          const supplyMatch = content.match(/totalSupply\s*=\s*(\d+)/);
          if (supplyMatch) {
            console.log(`   Total Supply: ${parseInt(supplyMatch[1]).toLocaleString()}`);
          }
        }
      }
      
      console.log("\n💡 Рекомендация: Попробуйте верифицировать с ZUZCOIN_correct.sol");
    }
    
  } catch (error) {
    console.log("❌ Ошибка:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
