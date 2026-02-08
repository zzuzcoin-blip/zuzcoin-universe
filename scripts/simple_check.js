const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
  
  // Адрес из .env (нужно его прочитать)
  require("dotenv").config();
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ PRIVATE_KEY не найден в .env");
    return;
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("👤 Адрес кошелька:", wallet.address);
  
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Баланс ETH:", ethers.utils.formatEther(balance), "ETH");
  
  if (parseFloat(ethers.utils.formatEther(balance)) < 0.01) {
    console.log("⚠️  Мало ETH! Получите на faucet:");
    console.log("   https://sepoliafaucet.com/");
    console.log("   https://faucet.quicknode.com/ethereum/sepolia");
  } else {
    console.log("✅ Достаточно ETH для деплоя");
  }
}

main().catch(console.error);
