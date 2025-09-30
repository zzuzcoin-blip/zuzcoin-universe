const crypto = require('crypto');

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(Date.now(), 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

console.log('Creating blockchain...');
const myBlockchain = new Blockchain();

console.log('\nMining block 1...');
myBlockchain.addBlock(new Block(Date.now(), { amount: 10 }));

console.log('\nMining block 2...');
myBlockchain.addBlock(new Block(Date.now(), { amount: 25 }));

console.log('\nBlockchain is valid:', myBlockchain.isChainValid());

console.log('\nFull blockchain:');
console.log(JSON.stringify(myBlockchain, null, 2));

console.log('\nAttempting to tamper with the blockchain...');
myBlockchain.chain[1].data = { amount: 100 };

console.log('Blockchain is valid after tampering:', myBlockchain.isChainValid());
