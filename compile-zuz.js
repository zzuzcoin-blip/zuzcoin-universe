const fs = require('fs');
const solc = require('solc');
const path = require('path');

console.log('🔧 Компиляция ТОЛЬКО контракта ZUZCOIN...');

// Читаем только ZUZCOIN.sol
const sourceCode = fs.readFileSync(path.join(__dirname, 'ZUZCOIN.sol'), 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'ZUZCOIN.sol': {
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
    
    // Проверяем ошибки
    if (output.errors) {
        const filteredErrors = output.errors.filter(err => err.severity !== 'warning');
        if (filteredErrors.length > 0) {
            filteredErrors.forEach(err => console.error('❌', err.formattedMessage));
            process.exit(1);
        }
    }
    
    // Получаем наш контракт
    const contract = output.contracts['ZUZCOIN.sol']['ZUZCOIN'];
    
    if (!contract) {
        console.error('❌ Контракт ZUZCOIN не найден в скомпилированных файлах!');
        process.exit(1);
    }
    
    // Сохраняем ABI и байткод
    const artifact = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
    };
    
    fs.writeFileSync('ZUZCOIN.json', JSON.stringify(artifact, null, 2));
    console.log('✅ Компиляция ZUZCOIN успешна!');
    console.log('📄 ABI и байткод сохранены в ZUZCOIN.json');
    console.log('📊 ABI размер:', contract.abi.length, 'элементов');
    
} catch (error) {
    console.error('❌ Ошибка компиляции:', error);
}
