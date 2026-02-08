const ethers = require('ethers');

const CONTRACT_ADDRESS = "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3";
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/demo";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
// ABI для получения общего количества держателей и информации о токене
const abi = [
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function findTokens() {
    console.log("🔍 Ищу информацию о токене ZUZCOIN...");
    
    try {
        // Получаем базовую информацию о токене
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        
        console.log("=".repeat(50));
        console.log("📊 ИНФОРМАЦИЯ О ТОКЕНЕ:");
        console.log(`🏷️  Название: ${name}`);
        console.log(`💰 Символ: ${symbol}`);
        console.log(`🔢 Десятичных знаков: ${decimals}`);
        console.log(`📈 Общая эмиссия: ${ethers.utils.formatUnits(totalSupply, decimals)} ${symbol}`);
        console.log("=".repeat(50));
        console.log("💡 Чтобы найти держателей токенов, нужно:");
        console.log("1. Проверить ваш MetaMask — какой адрес там активен?");
        console.log("2. Проверить историю транзакций на https://sepolia.etherscan.io");
        console.log("3. Токены могут быть на адресе, с которого вы развертывали контракт");
        console.log("=".repeat(50));
        
    } catch (err) {
        console.log("❌ Ошибка:", err.message);
    }
}

findTokens();
