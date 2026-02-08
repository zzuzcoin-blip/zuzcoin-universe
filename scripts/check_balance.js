async function main() {
  // Получаем экземпляр ethers из hardhat
  const [deployer] = await ethers.getSigners();
  console.log("👤 Проверяем аккаунт:", deployer.address);
  
  // Правильный метод для получения баланса
  const balance = await deployer.getBalance();
  console.log("💰 Баланс ETH:", ethers.utils.formatEther(balance), "ETH");
  
  // Проверим подключение к сети
  const provider = ethers.provider;
  const network = await provider.getNetwork();
  console.log("🔗 Сеть ID:", network.chainId);
  console.log("🌐 Имя сети:", network.name);
  
  // Проверим наличие ETH для деплоя
  const minRequired = ethers.utils.parseEther("0.01");
  if (balance.lt(minRequired)) {
    console.warn("⚠️  ВНИМАНИЕ: Мало ETH для деплоя!");
    console.warn("   Минимум рекомендуется: 0.01 ETH");
    console.warn("   Получите тестовый ETH на Sepolia Faucet");
  } else {
    console.log("✅ Достаточно ETH для деплоя");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
