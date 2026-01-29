const Web3 = require('web3');
const fs = require('fs');

// Используем альтернативный RPC
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');

async function deploy() {
    try {
        console.log('🚀 Starting ZUZCOIN contract deployment...');
        
        const privateKey = '4e27f91168286572c9e0d64c090ce163adc70bf3340367bfad3bde14f3c53f3a';
        const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        web3.eth.accounts.wallet.add(account);
        
        console.log('👛 Address:', account.address);
        
        const balance = await web3.eth.getBalance(account.address);
        console.log('💰 Balance:', web3.utils.fromWei(balance, 'ether'), 'MATIC');
        
        const contractData = JSON.parse(fs.readFileSync('ZUZCOIN.json', 'utf8'));
        const contract = new web3.eth.Contract(contractData.abi);
        
        const deployment = contract.deploy({
            data: contractData.bytecode,
            arguments: [account.address]
        });
        
        const gas = await deployment.estimateGas({ from: account.address });
        console.log('⛽ Gas:', gas);
        
        console.log('⏳ Deploying...');
        const tx = await deployment.send({
            from: account.address,
            gas: gas,
            gasPrice: await web3.eth.getGasPrice()
        });
        
        console.log('\n✅ DEPLOYED!');
        console.log('📄 Contract:', tx.options.address);
        console.log('🔗 https://mumbai.polygonscan.com/address/' + tx.options.address);
        
        fs.writeFileSync('contract-address.txt', tx.options.address);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

deploy();
