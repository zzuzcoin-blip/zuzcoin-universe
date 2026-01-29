const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying ZUZIM DEX to Sepolia...");
  
  // Настройки
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  const PHILANTHROPY_WALLET = "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0"; // Пример адреса
  
  // Получаем signer
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  
  // Деплоим контракт DEX
  const ZUZIMDEX = await ethers.getContractFactory("ZUZIMDEX");
  const dex = await ZUZIMDEX.deploy();
  await dex.deployed();
  
  console.log(`✅ DEX deployed to: ${dex.address}`);
  
  // Создаем пул ZUZ/ETH
  // Для ETH используем WETH адрес на Sepolia
  const WETH_SEPOLIA = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  
  console.log("Creating ZUZ/WETH pool...");
  const tx = await dex.createPool(ZUZ_TOKEN, WETH_SEPOLIA);
  await tx.wait();
  
  console.log("✅ ZUZ/WETH pool created!");
  
  // Сохраняем адреса в файл
  const config = {
    network: "sepolia",
    dexAddress: dex.address,
    zuzToken: ZUZ_TOKEN,
    wethAddress: WETH_SEPOLIA,
    philanthropyWallet: PHILANTHROPY_WALLET,
    deploymentTime: new Date().toISOString()
  };
  
  fs.writeFileSync("dex-config.json", JSON.stringify(config, null, 2));
  
  console.log("📁 Config saved to dex-config.json");
  console.log("\n🎉 DEX Deployment Complete!");
  console.log("=================================");
  console.log(`DEX Address: ${dex.address}`);
  console.log(`ZUZ Token: ${ZUZ_TOKEN}`);
  console.log(`WETH Address: ${WETH_SEPOLIA}`);
  console.log("=================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
