const fs = require('fs');
const solc = require('solc');

const source = fs.readFileSync('DigitalNotary.sol', 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'DigitalNotary.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach(err => console.error(err.formattedMessage));
} else {
  const contract = output.contracts['DigitalNotary.sol']['DigitalNotary'];
  
  fs.writeFileSync('DigitalNotaryABI.json', JSON.stringify(contract.abi, null, 2));
  fs.writeFileSync('DigitalNotaryBytecode.txt', contract.evm.bytecode.object);
  
  console.log('✅ Контракт скомпилирован!');
  console.log('ABI сохранен в DigitalNotaryABI.json');
  console.log('Bytecode сохранен в DigitalNotaryBytecode.txt');
}
