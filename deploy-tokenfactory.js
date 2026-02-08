const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("🚀 Деплой TokenFactory на Sepolia...");
  
  // Подключаемся к Sepolia
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("👛 Deployer:", wallet.address);
  console.log("💰 Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");
  
  // Загружаем артефакты (нужно сначала скомпилировать)
  console.log("📦 Загружаю артефакты TokenFactory...");
  const artifactPath = "./artifacts/contracts/TokenFactory.sol/TokenFactory.json";
  
  try {
    const artifact = require(artifactPath);
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
    
    console.log("🚀 Деплою TokenFactory...");
    const contract = await factory.deploy();
    
    console.log("⏳ Ожидаю подтверждение...");
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("✅ TokenFactory деплоен!");
    console.log("📝 Адрес:", address);
    console.log("🔗 https://sepolia.etherscan.io/address/" + address);
    
    // Сохраняем адрес
    require("fs").writeFileSync(
      "tokenfactory-address.txt",
      `Адрес TokenFactory: ${address}\n` +
      `Etherscan: https://sepolia.etherscan.io/address/${address}\n` +
      `Deployer: ${wallet.address}\n` +
      `Timestamp: ${new Date().toISOString()}`
    );
    
  } catch (error) {
    console.log("❌ Ошибка:", error.message);
    console.log("💡 Сначала нужно скомпилировать контракт: npx hardhat compile");
  }
}

main().catch(console.error);
