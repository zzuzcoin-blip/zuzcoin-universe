const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Начинаю деплой ZUZIMDEX на Sepolia...");
  
  // Получаем signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("👛 Deployer address:", deployer.address);
  
  // Проверяем баланс
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
    console.error("❌ Недостаточно ETH для деплоя");
    console.log("💡 Получите Sepolia ETH на: https://sepoliafaucet.com");
    return;
  }
  
  // Адреса для конструктора
  const ZUZ_TOKEN_ADDRESS = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31"; // Существующий ZUZ токен
  const CHARITY_WALLET = "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0"; // Из .env
  
  console.log("📊 Конфигурация:");
  console.log("  • ZUZ Token:", ZUZ_TOKEN_ADDRESS);
  console.log("  • Charity Wallet:", CHARITY_WALLET);
  
  try {
    // Деплоим контракт
    console.log("📦 Деплою ZUZIMDEX...");
    const ZUZIMDEX = await hre.ethers.getContractFactory("ZUZIMDEX");
    const dex = await ZUZIMDEX.deploy(ZUZ_TOKEN_ADDRESS, CHARITY_WALLET);
    
    await dex.deployed();
    
    console.log("✅ ZUZIMDEX успешно деплоен!");
    console.log("📝 Адрес контракта:", dex.address);
    console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${dex.address}`);
    console.log("📜 Transaction hash:", dex.deployTransaction.hash);
    
    // Сохраняем адрес
    const fs = require("fs");
    const deploymentInfo = {
      network: "sepolia",
      contract: "ZUZIMDEX",
      address: dex.address,
      deployer: deployer.address,
      zuzToken: ZUZ_TOKEN_ADDRESS,
      charityWallet: CHARITY_WALLET,
      timestamp: new Date().toISOString(),
      txHash: dex.deployTransaction.hash
    };
    
    fs.writeFileSync("dex-deployment.json", JSON.stringify(deploymentInfo, null, 2));
    console.log("📁 Информация о деплое сохранена в dex-deployment.json");
    
  } catch (error) {
    console.error("❌ Ошибка деплоя:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
