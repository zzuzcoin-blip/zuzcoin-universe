const crypto = require("crypto");

class ProofChainMainnet {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3; // Увеличили сложность для Mainnet
        this.pendingTransactions = [];
        this.miningReward = 10; // PCC
        this.networkName = "ProofChain Mainnet";
        this.chainId = 7777;
        this.blockTime = 5; // секунд
        this.totalTransactions = 0;

        console.log(
            `🏗️  ProofChain Mainnet инициализирована (ChainID: ${this.chainId})`,
        );
    }

    createGenesisBlock() {
        const genesisBlock = {
            index: 0,
            timestamp: "2024-01-01T00:00:00.000Z",
            transactions: [
                {
                    type: "genesis",
                    message: "ProofChain Mainnet Genesis Block",
                    creator: "network",
                    timestamp: "2024-01-01T00:00:00.000Z",
                },
            ],
            previousHash: "0",
            nonce: 0,
            hash: this.calculateBlockHash(
                0,
                "2024-01-01T00:00:00.000Z",
                [
                    {
                        type: "genesis",
                        message: "ProofChain Mainnet Genesis Block",
                    },
                ],
                "0",
                0,
            ),
            validator: "genesis",
            network: "ProofChain Mainnet",
            chainId: 7777,
        };
        return genesisBlock;
    }

    calculateBlockHash(index, timestamp, transactions, previousHash, nonce) {
        return crypto
            .createHash("sha256")
            .update(
                index +
                    timestamp +
                    JSON.stringify(transactions) +
                    previousHash +
                    nonce,
            )
            .digest("hex");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions) {
        const previousBlock = this.getLatestBlock();
        const newBlock = {
            index: previousBlock.index + 1,
            timestamp: new Date().toISOString(),
            transactions: transactions,
            previousHash: previousBlock.hash,
            nonce: 0,
            validator: "auto_validator",
            network: this.networkName,
            chainId: this.chainId,
        };

        // Майнинг блока
        newBlock.hash = this.calculateBlockHash(
            newBlock.index,
            newBlock.timestamp,
            newBlock.transactions,
            newBlock.previousHash,
            newBlock.nonce,
        );

        this.mineBlock(newBlock);
        this.chain.push(newBlock);
        this.totalTransactions += transactions.length;

        console.log(`✅ Блок #${newBlock.index} добавлен в ProofChain Mainnet`);
        console.log(`   📦 Транзакций: ${transactions.length}`);
        console.log(`   🔗 Хеш: ${newBlock.hash.substr(0, 16)}...`);

        return newBlock;
    }

    mineBlock(block) {
        const target = "0".repeat(this.difficulty);
        let attempts = 0;
        const startTime = Date.now();

        while (block.hash.substring(0, this.difficulty) !== target) {
            block.nonce++;
            block.hash = this.calculateBlockHash(
                block.index,
                block.timestamp,
                block.transactions,
                block.previousHash,
                block.nonce,
            );
            attempts++;

            // Защита от бесконечного цикла
            if (attempts > 1000000) {
                console.log("❌ Майнинг прерван: слишком много попыток");
                break;
            }
        }

        const miningTime = Date.now() - startTime;
        console.log(
            `⛏️  Блок #${block.index} замайнен за ${miningTime}ms (${attempts} попыток)`,
        );
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Проверка хеша блока
            const calculatedHash = this.calculateBlockHash(
                currentBlock.index,
                currentBlock.timestamp,
                currentBlock.transactions,
                currentBlock.previousHash,
                currentBlock.nonce,
            );

            if (currentBlock.hash !== calculatedHash) {
                console.log(`❌ Невалидный хеш блока #${currentBlock.index}`);
                return false;
            }

            // Проверка связи с предыдущим блоком
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(
                    `❌ Нарушена цепочка блоков #${currentBlock.index}`,
                );
                return false;
            }

            // Проверка Proof of Work
            if (
                currentBlock.hash.substring(0, this.difficulty) !==
                "0".repeat(this.difficulty)
            ) {
                console.log(
                    `❌ Невалидный Proof of Work блока #${currentBlock.index}`,
                );
                return false;
            }
        }

        // console.log("✅ Цепочка блоков валидна"); // Отключено: слишком много спама в консоли
        return true;
    }

    getBlockchainInfo() {
        const latestBlock = this.getLatestBlock();
        return {
            network: this.networkName,
            chainId: this.chainId,
            blocks: this.chain.length,
            difficulty: this.difficulty,
            totalTransactions: this.totalTransactions,
            latestBlock: {
                index: latestBlock.index,
                hash: latestBlock.hash,
                timestamp: latestBlock.timestamp,
                transactionCount: latestBlock.transactions.length,
            },
            blockTime: this.blockTime,
            miningReward: this.miningReward,
            isValid: this.isChainValid(),
        };
    }

    getBlockByIndex(index) {
        return this.chain[index] || null;
    }

    getTransactionHistory(userId) {
        const userTransactions = [];

        this.chain.forEach((block) => {
            block.transactions.forEach((tx) => {
                if (
                    tx.from === userId ||
                    tx.to === userId ||
                    tx.creator === userId ||
                    tx.userId === userId
                ) {
                    userTransactions.push({
                        block: block.index,
                        timestamp: block.timestamp,
                        ...tx,
                    });
                }
            });
        });

        return userTransactions;
    }

    // Поиск транзакций по хешу
    findTransaction(transactionHash) {
        for (const block of this.chain) {
            for (const tx of block.transactions) {
                const txHash = crypto
                    .createHash("sha256")
                    .update(JSON.stringify(tx))
                    .digest("hex");
                if (txHash === transactionHash) {
                    return {
                        block: block.index,
                        transaction: tx,
                        blockHash: block.hash,
                        timestamp: block.timestamp,
                    };
                }
            }
        }
        return null;
    }
}

module.exports = ProofChainMainnet;
