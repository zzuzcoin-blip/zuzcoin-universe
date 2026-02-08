const hre = require("hardhat");

async function main() {
  console.log("🔍 ПРОВЕРКА ДЛЯ METAMASK");
  console.log("========================");
  
  const tokenAddress = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  const walletAddress = "0xF89CE65B635DA29be08c659e313D6C250750bC73";
  
  console.log("📍 Адрес токена:", tokenAddress);
  console.log("👤 Ваш кошелек:", walletAddress);
  console.log("");
  console.log("📋 ДАННЫЕ ДЛЯ METAMASK:");
  console.log("Token Address:", tokenAddress);
  console.log("Symbol: ZUZ");
  console.log("Decimals: 18");
  console.log("");
  
  try {
    const ZUZToken = await hre.ethers.getContractFactory("ZUZToken");
    const token = ZUZToken.attach(tokenAddress);
    
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const balance = await token.balanceOf(walletAddress);
    
    console.log("✅ ДАННЫЕ КОНТРАКТА:");
    console.log("Название:", name);
    console.log("Символ:", symbol);
    console.log("Decimals:", decimals.toString());
    console.log("Ваш баланс:", (parseFloat(balance.toString()) / 1e18).toLocaleString(), "ZUZ");
    console.log("");
    console.log("🌐 Etherscan ссылка:");
    console.log("https://sepolia.etherscan.io/token/" + tokenAddress + "?a=" + walletAddress);
    
  } catch (error) {
    console.log("❌ Ошибка:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
