const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3('http://localhost:8547');
const abi = JSON.parse(fs.readFileSync('DigitalNotaryABI.json', 'utf8'));
const bytecode = fs.readFileSync('DigitalNotaryBytecode.txt', 'utf8');

async function deploy() {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('📋 Аккаунты:', accounts.slice(0, 3), '...');
        
        const contract = new web3.eth.Contract(abi);
        
        const deployTx = contract.deploy({
            data: bytecode,
            arguments: []
        });
        
        const gas = await deployTx.estimateGas({ from: accounts[0] });
        console.log('⛽ Estimated gas:', gas);
        
        const result = await deployTx.send({
            from: accounts[0],
            gas: gas + 10000
        });
        
        console.log('✅ Контракт развернут!');
        console.log('Адрес контракта:', result.options.address);
        console.log('Транзакция:', result.transactionHash);
        
        fs.writeFileSync('contractAddress.txt', result.options.address);
        
        return result.options.address;
    } catch (error) {
        console.error('❌ Ошибка деплоя:', error.message);
        return null;
    }
}

deploy();
