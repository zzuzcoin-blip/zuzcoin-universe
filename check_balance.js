const ethers = require('ethers');

const CONTRACT_ADDRESS = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
const USER_ADDRESS = "0xf89ce65b789a3c7b1f8a5c8d3c4e9f2b1a0d8c7b"; // Ваш адрес
// Используем альтернативный RPC (Alchemy бесплатный для Sepolia)
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/demo"; 

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const abi = ["function balanceOf(address) view returns (uint256)"];
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function check() {
    console.log("🔍 Проверяю баланс...");
    console.log("👤 Адрес:", USER_ADDRESS.slice(0, 10) + "...");
    console.log("📝 Контракт:", CONTRACT_ADDRESS.slice(0, 10) + "...");
    console.log("⏳ Ожидаю ответа от сети (может занять 10-20 секунд)...");
    
    try {
        // Добавляем таймаут
        const balance = await Promise.race([
            contract.balanceOf(USER_ADDRESS),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Таймаут: RPC не ответил за 20 секунд")), 20000)
            )
        ]);
        
        const formatted = ethers.utils.formatUnits(balance, 18);
        console.log("=".repeat(50));
        console.log("✅ УСПЕХ! Баланс получен:");
        console.log("📊 Сырой баланс (в wei):", balance.toString());
        console.log("💰 Баланс в ZUZ:", formatted);
        console.log("🔢 Округлённо:", parseFloat(formatted).toFixed(4), "ZUZ");
        console.log("=".repeat(50));
    } catch (err) {
        console.log("=".repeat(50));
        console.log("❌ ОШИБКА:", err.message);
        console.log("💡 Попробуйте другие RPC:");
        console.log("1. https://sepolia.infura.io/v3/YOUR_KEY");
        console.log("2. https://ethereum-sepolia.publicnode.com");
        console.log("3. https://rpc2.sepolia.org");
        console.log("=".repeat(50));
    }
}
check();
