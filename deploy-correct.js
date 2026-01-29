const Web3 = require('web3');
const fs = require('fs');

console.log('🚀 CORRECT: Деплой ZUZCOIN (simple version)');
console.log('📡 RPC: https://ethereum-sepolia-rpc.publicnode.com');

const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');

async function deploy() {
    try {
        const privateKey = '4e27f91168286572c9e0d64c090ce163adc70bf3340367bfad3bde14f3c53f3a';
        const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        web3.eth.accounts.wallet.add(account);
        
        console.log('👛 Кошелек:', account.address);
        console.log('💰 Баланс:', web3.utils.fromWei(await web3.eth.getBalance(account.address), 'ether'), 'ETH');
        
        // Загружаем ABI и байткод
        const contractData = JSON.parse(fs.readFileSync('ZUZCOIN.json', 'utf8'));
        console.log('✅ ABI элементов:', contractData.abi.length);
        
        // Смотрим конструктор
        const constructorAbi = contractData.abi.find(item => item.type === 'constructor');
        if (constructorAbi) {
            console.log('🔧 Конструктор ожидает параметров:', constructorAbi.inputs ? constructorAbi.inputs.length : 0);
            if (constructorAbi.inputs) {
                constructorAbi.inputs.forEach((input, i) => {
                    console.log(`   ${i + 1}. ${input.name || 'param' + i}: ${input.type}`);
                });
            }
        } else {
            console.log('🔧 Конструктор без параметров');
        }
        
        // Создаем контракт
        const contract = new web3.eth.Contract(contractData.abi);
        
        // Пробуем разные варианты конструктора
        let deployment;
        
        // Вариант 1: Без параметров (для простого контракта)
        try {
            console.log('\n🔧 Пробую деплой без параметров...');
            deployment = contract.deploy({
                data: contractData.bytecode
            });
        } catch (e) {
            // Вариант 2: С одним параметром (charityWallet)
            console.log('🔧 Пробую деплой с charityWallet параметром...');
            deployment = contract.deploy({
                data: contractData.bytecode,
                arguments: [account.address] // charityWallet
            });
        }
        
        // Оцениваем газ
        console.log('⛽ Оцениваю газ...');
        const gas = await deployment.estimateGas({ from: account.address });
        console.log('   Газ:', gas);
        
        // Деплоим
        console.log('📤 Отправляю транзакцию...');
        const tx = await deployment.send({
            from: account.address,
            gas: gas,
            gasPrice: await web3.eth.getGasPrice()
        });
        
        console.log('\n🎉🎉🎉 УСПЕХ! 🎉🎉🎉');
        console.log('📄 Адрес контракта:', tx.options.address);
        console.log('🔗 Explorer: https://sepolia.etherscan.io/address/' + tx.options.address);
        console.log('📝 TX Hash:', tx.transactionHash);
        
        // Сохраняем
        fs.writeFileSync('ZUZCOIN_ADDRESS.txt', tx.options.address);
        
        // Обновляем progress
        const progress = {
            project: 'ZUZCOIN Universe',
            status: 'CONTRACT_DEPLOYED',
            contract: tx.options.address,
            tx: tx.transactionHash,
            network: 'Sepolia',
            timestamp: new Date().toISOString()
        };
        fs.writeFileSync('progress.json', JSON.stringify(progress, null, 2));
        
        console.log('\n✅ Готово! Добавь токен в MetaMask.');
        
    } catch (error) {
        console.error('\n❌ ОШИБКА:', error.message);
        if (error.message.includes('exceeds block gas limit')) {
            console.log('💡 Слишком большой газ. Уменьшаем...');
        }
    }
}

deploy();
