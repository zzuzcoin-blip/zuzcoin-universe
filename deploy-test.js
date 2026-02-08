const hre = require("hardhat");

async function main() {
  console.log("🚀 Деплой ZUZIMDEX на Sepolia...");
  
  const [deployer] = await hre.ethers.getSigners();
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  // Используем адрес deployer как charity wallet временно
  const CHARITY_WALLET = deployer.address;
  
  console.log("Deployer:", deployer.address);
  console.log("ZUZ Token:", ZUZ_TOKEN);
  console.log("Charity Wallet:", CHARITY_WALLET);
  
  const ZUZIMDEX = await hre.ethers.getContractFactory("ZUZIMDEX");
  const dex = await ZUZIMDEX.deploy(ZUZ_TOKEN, CHARITY_WALLET);
  
  console.log("⏳ Ожидаю деплой...");
  await dex.deployed();
  
  console.log("✅ ZUZIMDEX деплоен по адресу:", dex.address);
  console.log("🔗 https://sepolia.etherscan.io/address/" + dex.address);
  
  require("fs").writeFileSync(
    "dex-address.txt",
    `Адрес DEX: ${dex.address}\n` +
    `Etherscan: https://sepolia.etherscan.io/address/${dex.address}\n` +
    `ZUZ Token: ${ZUZ_TOKEN}\n` +
    `Charity Wallet: ${CHARITY_WALLET}`
  );
  
  console.log("\n📋 Для верификации:");
  console.log(`npx hardhat verify --network sepolia ${dex.address} "${ZUZ_TOKEN}" "${CHARITY_WALLET}"`);
}

main().catch(console.error);
