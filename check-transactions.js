require("dotenv").config();
const { ethers } = require("ethers");

async function checkTransactions() {
  try {
    if (!process.env.PRIVATE_KEY) {
      console.log("❌ PRIVATE_KEY не найден в .env");
      return;
    }
    
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("👛 Адрес кошелька:", wallet.address);
    
    // Получим историю транзакций с Etherscan API
    const address = wallet.address;
    const apiKey = process.env.ETHERSCAN_KEY || "YourApiKeyToken";
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
    
    console.log("📡 Запрашиваем историю транзакций...");
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === "1") {
      console.log(`📊 Найдено транзакций: ${data.result.length}`);
      
      // Ищем деплой контракта
      const contractCreations = data.result.filter(tx => tx.contractAddress);
      
      if (contractCreations.length > 0) {
        console.log("🎯 Найденные контракты:");
        contractCreations.forEach(tx => {
          console.log(`- Контракт: ${tx.contractAddress}`);
          console.log(`  Транзакция: ${tx.hash}`);
          console.log(`  Блок: ${tx.blockNumber}`);
          console.log(`  Время: ${new Date(tx.timeStamp * 1000).toLocaleString()}`);
          console.log("");
        });
      } else {
        console.log("❌ Не найдено созданий контрактов");
      }
    } else {
      console.log("❌ Ошибка при запросе:", data.message);
    }
    
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

checkTransactions();
