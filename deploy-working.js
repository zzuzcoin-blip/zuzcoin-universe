const hre = require("hardhat");

async function main() {
  console.log("🚀 Деплой ZUZIMDEX на Sepolia...");
  
  const [deployer] = await hre.ethers.getSigners();
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  const CHARITY_WALLET = deployer.address; // временно
  
  console.log("Deployer:", deployer.address);
  console.log("ZUZ Token:", ZUZ_TOKEN);
  console.log("Charity Wallet:", CHARITY_WALLET);
  
  console.log("📦 Получаю ContractFactory...");
  const ZUZIMDEX = await hre.ethers.getContractFactory("ZUZIMDEX");
  
  console.log("🚀 Деплою контракт...");
  const dex = await ZUZIMDEX.deploy(ZUZ_TOKEN, CHARITY_WALLET);
  
  console.log("⏳ Ожидаю подтверждение деплоя...");
  await dex.deployTransaction.wait(); // Ждем подтверждения
  
  const address = await dex.getAddress();
  console.log("✅ ZUZIMDEX деплоен по адресу:", address);
  console.log("🔗 https://sepolia.etherscan.io/address/" + address);
  console.log("📜 Transaction hash:", dex.deployTransaction.hash);
  
  require("fs").writeFileSync(
    "dex-address.txt",
    `Адрес DEX: ${address}\n` +
    `Etherscan: https://sepolia.etherscan.io/address/${address}\n` +
    `Транзакция: https://sepolia.etherscan.io/tx/${dex.deployTransaction.hash}\n` +
    `ZUZ Token: ${ZUZ_TOKEN}\n` +
    `Charity Wallet: ${CHARITY_WALLET}`
  );
  
  console.log("\n📋 Для верификации выполни:");
  console.log(`npx hardhat verify --network sepolia ${address} "${ZUZ_TOKEN}" "${CHARITY_WALLET}"`);
}

main().catch(console.error);
