const Web3 = require('web3');
const fs = require('fs');

console.log('🚀 Деплой ZUZCOIN на Sepolia');
console.log('📡 RPC: https://ethereum-sepolia-rpc.publicnode.com');

const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

async function deploy() {
    try {
        const privateKey = '4e27f91168286572c9e0d64c090ce163adc70bf3340367bfad3bde14f3c53f3a';
        
        console.log('🔑 Адрес: 0xF89CE65B635DA29be08c659e313D6C250750bC73');
        
        const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        web3.eth.accounts.wallet.add(account);
        
        console.log('👛 Кошелек:', account.address);
        
        // Проверяем баланс
        const balance = await web3.eth.getBalance(account.address);
        const eth = web3.utils.fromWei(balance, 'ether');
        console.log('💰 Баланс:', eth, 'ETH');
        
        if (Number(eth) < 0.001) {
            console.log('❌ Недостаточно ETH. Ждем транзакцию...');
            return;
        }
        
        console.log('✅ Достаточно ETH! Продолжаем...');
        
        // Проверяем контракт
        if (!fs.existsSync('ZUZCOIN.json')) {
            console.log('❌ Файл ZUZCOIN.json не найден');
            return;
        }
        
        const contractData = JSON.parse(fs.readFileSync('ZUZCOIN.json', 'utf8'));
        console.log('📄 Контракт загружен');
        
        const contract = new web3.eth.Contract(contractData.abi);
        
        const deployment = contract.deploy({
            data: contractData.bytecode,
            arguments: [account.address, account.address]
        });
        
        console.log('⛽ Оцениваю газ...');
        const gas = await deployment.estimateGas({ from: account.address });
        console.log('   Газ:', gas);
        
        console.log('📤 Деплою...');
        const tx = await deployment.send({
            from: account.address,
            gas: gas,
            gasPrice: await web3.eth.getGasPrice()
        });
        
        console.log('\n🎉 УСПЕХ!');
        console.log('📄 Адрес контракта:', tx.options.address);
        console.log('🔗 Explorer: https://sepolia.etherscan.io/address/' + tx.options.address);
        
        fs.writeFileSync('zuzcoin-address.txt', tx.options.address);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
}

deploy();
