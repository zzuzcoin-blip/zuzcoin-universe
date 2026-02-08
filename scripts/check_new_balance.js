const hre = require("hardhat");

async function main() {
  console.log("💰 ПРОВЕРКА БАЛАНСА НОВОГО ZUZCOIN КОНТРАКТА");
  console.log("==========================================");
  
  const newAddress = "0x21b66A1160714119FC1f222EEcAb7e4C9cD15874";
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📍 Адрес контракта:", newAddress);
  console.log("👤 Ваш кошелек:", deployer.address);
  console.log("🔗 Etherscan: https://sepolia.etherscan.io/address/" + newAddress);
  
  try {
    // Получаем контракт
    const ZUZCOIN = await hre.ethers.getContractFactory("ZUZCOIN");
    const contract = ZUZCOIN.attach(newAddress);
    
    // Проверяем информацию
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    const balance = await contract.balanceOf(deployer.address);
    
    console.log("\n📊 ИНФОРМАЦИЯ О КОНТРАКТЕ:");
    console.log("Название:", name);
    console.log("Символ:", symbol);
    console.log("Total Supply:", (totalSupply.toString() / 1e18).toLocaleString(), symbol);
    console.log("Ваш баланс:", (balance.toString() / 1e18).toLocaleString(), symbol);
    
    // Проверяем charity wallet
    const charityWallet = await contract.THE_GIVING_PLEDGE_WALLET();
    console.log("🎗️  Charity Wallet:", charityWallet);
    
    // Проверяем баланс ETH
    const ethBalance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("\n💰 Баланс ETH:", (ethBalance.toString() / 1e18).toFixed(4), "ETH");
    
    if (ethBalance < hre.ethers.parseEther("0.01")) {
      console.log("⚠️  Мало ETH для транзакций!");
    } else {
      console.log("✅ Достаточно ETH для тестовых транзакций");
    }
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
