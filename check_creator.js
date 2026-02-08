const ethers = require('ethers');

const CONTRACT_ADDRESS = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/demo";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

async function checkCreator() {
    console.log("🔍 Ищу создателя контракта...");
    
    try {
        // Получаем транзакцию создания контракта
        const txHash = "0x..."; // Нужен хэш транзакции развертывания
        
        // Альтернативно: проверим несколько вероятных адресов
        console.log("=".repeat(50));
        console.log("ПРОВЕРЬТЕ ВРУЧНУЮ НА ETHERSCAN:");
        console.log("1. Откройте: https://sepolia.etherscan.io/address/0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3");
        console.log("2. Нажмите вкладку 'Contract'");
        console.log("3. Нажмите 'Read Contract'");
        console.log("4. Найдите функцию 'balanceOf'");
        console.log("5. Введите свой адрес MetaMask и нажмите 'Query'");
        console.log("=".repeat(50));
        console.log("ВАШ АДРЕС META MASK (полный):");
        console.log("❓ Введите его здесь: ________________________");
        console.log("=".repeat(50));
        
    } catch (err) {
        console.log("❌ Ошибка:", err.message);
    }
}

checkCreator();
