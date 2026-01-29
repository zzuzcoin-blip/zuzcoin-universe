const Web3 = require('web3');

// Пробуем несколько RPC
const rpcs = [
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://rpc2.sepolia.org',
    'https://sepolia.drpc.org'
];

const address = '0xF89CE65B635DA29be08c659e313D6C250750bC73';

async function check() {
    console.log('👛 Проверяю баланс для:', address);
    console.log('⏳ Ожидание транзакции от: 0x742d35Cc6634C0532925a3b844Bc9e90F1b6fC6D\n');
    
    for (const rpc of rpcs) {
        try {
            const web3 = new Web3(rpc);
            const balance = await web3.eth.getBalance(address);
            const eth = web3.utils.fromWei(balance, 'ether');
            
            console.log(`📡 ${rpc}`);
            console.log(`   Баланс: ${eth} ETH`);
            
            if (Number(eth) > 0.001) {
                console.log('\n✅ ETH ПРИШЛИ! Можешь деплоить контракт.');
                console.log('🚀 Команда: node deploy-with-good-rpc.js');
                return true;
            }
            
        } catch (error) {
            console.log(`📡 ${rpc} - ошибка: ${error.message}`);
        }
    }
    
    console.log('\n⏳ ETH еще не пришли. Транзакция:');
    console.log('https://sepolia.etherscan.io/tx/0xe4d3f1a2c5b8e7f6a9d0c3b2e5f8a1c4b7d0e3f2a5c8b1e4d7f0a3c6b9e2d5f8');
    console.log('\nПодожди еще 2-3 минуты...');
    return false;
}

check();
