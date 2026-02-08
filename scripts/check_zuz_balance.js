const hre = require("hardhat");

async function main() {
  const address = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
  console.log("🔍 Проверяем ZUZToken:", address);
  
  const ZUZToken = await hre.ethers.getContractFactory("ZUZToken");
  const zuzToken = ZUZToken.attach(address);
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Владелец:", deployer.address);
  
  // Проверяем баланс
  const balance = await zuzToken.balanceOf(deployer.address);
  const decimals = await zuzToken.decimals();
  const decimalsNumber = parseInt(decimals.toString());
  const formattedBalance = parseFloat(balance.toString()) / (10 ** decimalsNumber);
  
  console.log("💰 Баланс ZUZ:", formattedBalance.toLocaleString(), "ZUZ");
  console.log("🎯 Имя токена:", await zuzToken.name());
  console.log("🏷️  Символ:", await zuzToken.symbol());
  console.log("🔢 Decimals:", decimals.toString());
  
  // Проверяем общий supply
  const totalSupply = await zuzToken.totalSupply();
  const formattedSupply = parseFloat(totalSupply.toString()) / (10 ** decimalsNumber);
  console.log("📊 Total Supply:", formattedSupply.toLocaleString(), "ZUZ");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ошибка:", error.message);
    process.exit(1);
  });
