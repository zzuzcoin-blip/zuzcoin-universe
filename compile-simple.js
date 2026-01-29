const fs = require('fs');
const solc = require('solc');

console.log('🔧 Компиляция упрощенного ZUZCOIN...');

const sourceCode = fs.readFileSync('ZUZCOIN_simple.sol', 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'ZUZCOIN_simple.sol': {
            content: sourceCode
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};

try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
        const filteredErrors = output.errors.filter(err => err.severity !== 'warning');
        if (filteredErrors.length > 0) {
            filteredErrors.forEach(err => console.error('❌', err.formattedMessage));
            process.exit(1);
        }
    }
    
    const contract = output.contracts['ZUZCOIN_simple.sol']['ZUZCOIN'];
    
    if (!contract) {
        console.error('❌ Контракт ZUZCOIN не найден!');
        process.exit(1);
    }
    
    const artifact = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
    
    fs.writeFileSync('ZUZCOIN.json', JSON.stringify(artifact, null, 2));
    console.log('✅ Компиляция успешна!');
    console.log('📄 ABI и байткод сохранены в ZUZCOIN.json');
    console.log('📊 ABI имеет', contract.abi.length, 'элементов');
    
} catch (error) {
    console.error('❌ Ошибка компиляции:', error);
}
