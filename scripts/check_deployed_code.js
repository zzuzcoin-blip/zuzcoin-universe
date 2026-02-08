const hre = require("hardhat");

async function main() {
  const address = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  console.log("🔍 Проверяем задеплоенный контракт:", address);
  
  const provider = hre.ethers.provider;
  
  // Получаем байткод
  const code = await provider.getCode(address);
  console.log("📊 Длина байткода:", code.length, "символов");
  console.log("Первые 100 символов байткода:", code.substring(0, 100));
  
  if (code === '0x') {
    console.log("❌ Контракт не существует по этому адресу!");
  } else {
    console.log("✅ Контракт существует, байткод получен");
    
    // Проверяем компиляцию нашего текущего файла
    try {
      const ZUZToken = await hre.ethers.getContractFactory("ZUZToken");
      console.log("✅ Контракт успешно компилируется из contracts/ZUZToken.sol");
      
      // Получаем deployed байткод для сравнения
      const compiledBytecode = await ZUZToken.getDeployedTransaction().data;
      console.log("📋 Длина скомпилированного байткода:", compiledBytecode.length, "символов");
      
      // Сравниваем первые символы
      const deployedStart = code.substring(0, 50);
      const compiledStart = compiledBytecode.substring(0, 50);
      
      console.log("Первые 50 символов задеплоенного:", deployedStart);
      console.log("Первые 50 символов скомпилированного:", compiledStart);
      
      if (deployedStart === compiledStart) {
        console.log("🎉 Байткоды совпадают! Можно верифицировать с contracts/ZUZToken.sol");
      } else {
        console.log("⚠️  Байткоды не совпадают! Нужен оригинальный файл из деплоя");
      }
      
    } catch (error) {
      console.log("❌ Ошибка компиляции:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
