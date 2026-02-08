const hre = require("hardhat");

async function main() {
  console.log("🧪 ТЕСТ TRANSFER() НА НОВОМ КОНТРАКТЕ");
  console.log("===================================");
  
  const contractAddress = "0x21b66A1160714119FC1f222EEcAb7e4C9cD15874";
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📍 Контракт:", contractAddress);
  console.log("👤 Отправитель:", deployer.address);
  
  try {
    const ZUZCOIN = await hre.ethers.getContractFactory("ZUZCOIN");
    const contract = ZUZCOIN.attach(contractAddress);
    
    // Проверяем начальный баланс
    const initialBalance = await contract.balanceOf(deployer.address);
    console.log("💰 Начальный баланс:", (initialBalance.toString() / 1e18).toLocaleString(), "ZUZ");
    
    // Тестируем transfer на себя (чтобы проверить 1% charity)
    const testAmount = hre.ethers.parseUnits("100", 18); // 100 ZUZ
    console.log("\n🧪 Тестируем transfer 100 ZUZ...");
    console.log("Ожидаемый charity (1%): 1 ZUZ");
    
    const tx = await contract.transfer(deployer.address, testAmount);
    console.log("📝 TX Hash:", tx.hash);
    console.log("🔗 Etherscan: https://sepolia.etherscan.io/tx/" + tx.hash);
    
    console.log("⏳ Ждем подтверждения...");
    const receipt = await tx.wait();
    
    console.log("\n✅ ТРАНЗАКЦИЯ УСПЕШНА!");
    console.log("Блок:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Проверяем итоговый баланс
    const finalBalance = await contract.balanceOf(deployer.address);
    console.log("💰 Итоговый баланс:", (finalBalance.toString() / 1e18).toLocaleString(), "ZUZ");
    
    // Проверяем charity wallet
    const charityWallet = await contract.THE_GIVING_PLEDGE_WALLET();
    const charityBalance = await contract.balanceOf(charityWallet);
    console.log("🎗️  Баланс charity wallet:", (charityBalance.toString() / 1e18), "ZUZ");
    
    // Рассчитываем изменение
    const balanceChange = initialBalance - finalBalance;
    const expectedChange = testAmount; // 100 ZUZ отправлено
    const expectedCharity = testAmount / 100n; // 1 ZUZ charity
    
    console.log("\n📊 РЕЗУЛЬТАТЫ:");
    console.log("Изменение баланса:", (balanceChange.toString() / 1e18), "ZUZ");
    console.log("Ожидалось изменение:", (expectedChange.toString() / 1e18), "ZUZ");
    console.log("Ожидался charity:", (expectedCharity.toString() / 1e18), "ZUZ");
    
    if (balanceChange.toString() === expectedChange.toString()) {
      console.log("✅ Баланс изменился правильно!");
    } else {
      console.log("⚠️  Изменение баланса не соответствует ожиданиям");
    }
    
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
    if (error.message.includes("insufficient funds")) {
      console.log("💡 Недостаточно ETH для газа!");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
