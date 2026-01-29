const Web3 = require('web3');
const web3 = new Web3('https://rpc.sepolia.org');

const YOUR_ADDRESS = '0xF89CE65B635DA29be08c659e313D6C250750bC73';

async function check() {
    console.log('👛 Проверяю баланс для:', YOUR_ADDRESS);
    
    try {
        const balance = await web3.eth.getBalance(YOUR_ADDRESS);
        const eth = web3.utils.fromWei(balance, 'ether');
        console.log('💰 Баланс:', eth, 'ETH');
        
        if (Number(eth) >= 0.001) {
            console.log('✅ Готово! Можешь деплоить контракт.');
            console.log('🚀 Запусти: node deploy-sepolia.js');
        } else {
            console.log('⏳ Транзакция еще подтверждается...');
            console.log('   Подожди 1-2 минуты и проверь снова.');
        }
        
    } catch (error) {
        console.log('❌ Ошибка:', error.message);
    }
}

check();
