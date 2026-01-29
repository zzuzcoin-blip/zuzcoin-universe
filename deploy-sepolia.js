const Web3 = require('web3');
const fs = require('fs');

console.log('🚀 ZUZCOIN Contract Deployment - Sepolia Testnet');

// Sepolia RPC
const web3 = new Web3('https://rpc.sepolia.org');

async function deploy() {
    try {
        console.log('=== ПОДГОТОВКА К ДЕПЛОЮ ===');
        
        // === ЗАМЕНИ ЭТОТ КЛЮЧ НА СВОЙ ===
        const privateKey = 'ТВОЙ_ПРИВАТНЫЙ_КЛЮЧ_ДЛЯ_SEPOLIA';
        // ==================================
        
        if (!privateKey || privateKey === 'ТВОЙ_ПРИВАТНЫЙ_КЛЮЧ_ДЛЯ_SEPOLIA') {
            console.error('❌ ОШИБКА: Замени приватный ключ в коде!');
            console.log('📝 Как получить тестовые ETH и ключ:');
            console.log('1. Добавь сеть Sepolia в MetaMask');
            console.log('2. Получи ETH на https://sepoliafaucet.com');
            console.log('3. Экспортируй приватный ключ из MetaMask');
            return;
        }
        
        // Создаем аккаунт
        const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        web3.eth.accounts.wallet.add(account);
        
        console.log('👛 Кошелек для деплоя:', account.address);
        
        // Проверяем баланс
        const balance = await web3.eth.getBalance(account.address);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        console.log('💰 Баланс:', ethBalance, 'ETH');
        
        if (Number(ethBalance) < 0.01) {
            console.log('⚠️  Нужно больше ETH. Получи на: https://sepoliafaucet.com');
            return;
        }
        
        // Загружаем контракт
        console.log('📄 Загружаю контракт ZUZCOIN...');
        const contractData = JSON.parse(fs.readFileSync('ZUZCOIN.json', 'utf8'));
        
        console.log('🔧 ABI элементов:', contractData.abi.length);
        console.log('📦 Байткод:', contractData.bytecode.length, 'байт');
        
        // Создаем инстанс контракта
        const contract = new web3.eth.Contract(contractData.abi);
        
        // Параметры конструктора: [initialOwner, charityWallet]
        // Используем один адрес для простоты
        const initialOwner = account.address;
        const charityWallet = account.address;
        
        console.log('🎯 Владелец контракта:', initialOwner);
        console.log('❤️  Благотворительный кошелек:', charityWallet);
        
        // Деплоим
        const deployment = contract.deploy({
            data: contractData.bytecode,
            arguments: [initialOwner, charityWallet]
        });
        
        // Оцениваем газ
        console.log('⛽ Оцениваю газ...');
        const gasEstimate = await deployment.estimateGas({
            from: account.address
        });
        console.log('   Оценка газа:', gasEstimate);
        
        // Получаем цену газа
        const gasPrice = await web3.eth.getGasPrice();
        console.log('   Цена газа:', web3.utils.fromWei(gasPrice, 'gwei'), 'Gwei');
        
        // Отправляем транзакцию
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
        fs.writeFileSync('zuzcoin-address-sepolia.txt', tx.options.address);
        console.log('\n💾 Адрес сохранен в zuzcoin-address-sepolia.txt');
        
        // Обновляем progress.json
        const progress = JSON.parse(fs.readFileSync('progress.json', 'utf8'));
        progress.contract_deployed = true;
        progress.contract_address = tx.options.address;
        progress.contract_network = 'Sepolia';
        progress.contract_tx = tx.transactionHash;
        progress.phase = 3;
        progress.step = 'contract_deployed';
        fs.writeFileSync('progress.json', JSON.stringify(progress, null, 2));
        
        console.log('\n✅ Готово! Теперь добавь токен в MetaMask:');
        console.log('1. Открой MetaMask (сеть Sepolia)');
        console.log('2. Нажми "Import tokens"');
        console.log('3. Вставь адрес:', tx.options.address);
        console.log('4. Символ: ZUZ, Decimals: 18');
        console.log('5. У тебя будет 1,000,000 ZUZ!');
        
    } catch (error) {
        console.error('\n❌ ОШИБКА ДЕПЛОЯ:', error.message);
        if (error.message.includes('insufficient funds')) {
            console.log('💡 Нужно больше ETH. Получи на https://sepoliafaucet.com');
        }
    }
}

deploy();
