const Web3 = require('web3');
const fs = require('fs');

console.log('🚀 FINAL: Деплой ZUZCOIN на Sepolia');
console.log('📡 RPC: https://ethereum-sepolia-rpc.publicnode.com');

const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

async function deploy() {
    try {
        const privateKey = '4e27f91168286572c9e0d64c090ce163adc70bf3340367bfad3bde14f3c53f3a';
        
        const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        web3.eth.accounts.wallet.add(account);
        
        console.log('👛 Кошелек:', account.address);
        
        // Проверяем баланс
        const balance = await web3.eth.getBalance(account.address);
        const eth = web3.utils.fromWei(balance, 'ether');
        console.log('💰 Баланс:', eth, 'ETH');
        
        // Загружаем контракт
        console.log('📄 Загружаю ZUZCOIN.json...');
        const contractData = JSON.parse(fs.readFileSync('ZUZCOIN.json', 'utf8'));
        console.log('✅ Контракт загружен');
        
        // Создаем инстанс
        const contract = new web3.eth.Contract(contractData.abi);
        
        // Параметры деплоя
        const deployment = contract.deploy({
            data: contractData.bytecode,
            arguments: [account.address, account.address] // owner, charityWallet
        });
        
        // Оцениваем газ
        console.log('⛽ Оцениваю газ...');
        const gasEstimate = await deployment.estimateGas({ from: account.address });
        console.log('   Газ:', gasEstimate);
        
        // Получаем цену газа
        const gasPrice = await web3.eth.getGasPrice();
        console.log('   Цена газа:', web3.utils.fromWei(gasPrice, 'gwei'), 'Gwei');
        
        // Деплоим
        console.log('📤 Отправляю транзакцию...');
        const tx = await deployment.send({
            from: account.address,
            gas: gasEstimate,
            gasPrice: gasPrice
        });
        
        console.log('\n🎉🎉🎉 КОНТРАКТ УСПЕШНО РАЗВЕРНУТ! 🎉🎉🎉');
        console.log('==========================================');
        console.log('📄 Адрес контракта:', tx.options.address);
        console.log('🔗 Explorer: https://sepolia.etherscan.io/address/' + tx.options.address);
        console.log('📝 TX Hash:', tx.transactionHash);
        console.log('💎 Блок:', tx.blockNumber);
        
        // Сохраняем адрес
        fs.writeFileSync('ZUZCOIN_ADDRESS.txt', tx.options.address);
        console.log('\n💾 Адрес сохранен в ZUZCOIN_ADDRESS.txt');
        
        // Обновляем progress.json
        const progress = {
            project: 'ZUZCOIN Universe',
            phase: 3,
            step: 'contract_deployed',
            status: 'active',
            network: 'Sepolia Testnet',
            contract_address: tx.options.address,
            contract_tx: tx.transactionHash,
            contract_block: tx.blockNumber,
            owner_address: account.address,
            charity_wallet: account.address,
            total_supply: '1000000 ZUZ',
            auto_donate: '1% per transaction',
            timestamp: new Date().toISOString(),
            next_steps: [
                'Add contract to MetaMask',
                'Update interface with real contract',
                'Test ZUZ transfers',
                'Implement ZUZIM DEX'
            ]
        };
        
        fs.writeFileSync('progress.json', JSON.stringify(progress, null, 2));
        console.log('📁 progress.json обновлен');
        
        console.log('\n✅ ВСЕ ГОТОВО!');
        console.log('📱 Добавь токен в MetaMask:');
        console.log('1. Import tokens');
        console.log('2. Вставь адрес контракта');
        console.log('3. Symbol: ZUZ, Decimals: 18');
        console.log('4. У тебя 1,000,000 ZUZ!');
        
    } catch (error) {
        console.error('\n❌ ОШИБКА:', error.message);
        console.log('Стек ошибки:', error.stack);
    }
}

deploy();
