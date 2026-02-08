const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("🚀 Минимальный деплой ZUZIMDEX...");
  
  // Настройки
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  const CHARITY_WALLET = "0xF89CE65B635DA29be08c659e313D6C250750bC73"; // Адрес deployer
  
  // Подключаемся к Sepolia
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("👛 Deployer:", wallet.address);
  console.log("💰 Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");
  
  // ABI и bytecode контракта
  const contractData = require("./artifacts/contracts/ZUZIMDEX.sol/ZUZIMDEX.json");
  
  console.log("📦 Создаю фабрику контракта...");
  const factory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, wallet);
  
  console.log("🚀 Деплою...");
  const contract = await factory.deploy(ZUZ_TOKEN, CHARITY_WALLET);
  
  console.log("⏳ Ожидаю подтверждение...");
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log("✅ ZUZIMDEX деплоен!");
  console.log("📝 Адрес:", address);
  console.log("🔗 https://sepolia.etherscan.io/address/" + address);
  
  require("fs").writeFileSync("dex-address-final.txt", address);
  console.log("📁 Адрес сохранен в dex-address-final.txt");
}

main().catch(console.error);
