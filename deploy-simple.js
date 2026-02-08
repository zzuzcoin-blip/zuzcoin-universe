const hre = require("hardhat");

async function main() {
  console.log("🚀 Деплой ZUZIMDEX на Sepolia...");
  
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  const CHARITY_WALLET = "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0";
  
  console.log("ZUZ Token:", ZUZ_TOKEN);
  console.log("Charity Wallet:", CHARITY_WALLET);
  
  const ZUZIMDEX = await hre.ethers.getContractFactory("ZUZIMDEX");
  const dex = await ZUZIMDEX.deploy(ZUZ_TOKEN, CHARITY_WALLET);
  
  console.log("⏳ Ожидаю деплой...");
  await dex.deployed();
  
  console.log("✅ ZUZIMDEX деплоен по адресу:", dex.address);
  console.log("🔗 https://sepolia.etherscan.io/address/" + dex.address);
  
  // Сохраняем адрес
  require("fs").writeFileSync(
    "dex-address.txt",
    dex.address + "\n" +
    "https://sepolia.etherscan.io/address/" + dex.address
  );
}

main().catch(console.error);
