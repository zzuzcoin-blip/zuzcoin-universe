const express = require("express");
const app = express();
const PORT = 5000;

class Block {
    constructor(timestamp, data, previousHash = "") {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return require("crypto")
            .createHash("sha256")
            .update(
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
            )
            .digest("hex");
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block("01/01/2024", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

let users = {
    "demo-user": { balance: 1000 }
};

let proofs = [];

const myBlockchain = new Blockchain();

app.use(express.json());
app.use(express.static("."));

app.get("/api/chain", (req, res) => {
    res.json({
        chain: myBlockchain.chain,
        length: myBlockchain.chain.length
    });
});

app.post("/api/register-proof", (req, res) => {
    const { userId, creativeWork, description } = req.body;

    if (!userId || !creativeWork) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    if (!users[userId] || users[userId].balance < 100) {
        return res.status(402).json({ error: "Недостаточно средств. Нужно 100 руб." });
    }

    users[userId].balance -= 100;

    const proofData = {
        type: "copyright_proof",
        userId: userId,
        creativeWork: creativeWork,
        description: description,
        timestamp: new Date().toISOString(),
        cost: 100
    };

    const newBlock = new Block(Date.now(), proofData);
    myBlockchain.addBlock(newBlock);

    proofs.push({
        ...proofData,
        blockHash: newBlock.hash
    });

    res.json({
        success: true,
        message: "✅ Авторство зафиксировано!",
        cost: 100,
        balance: users[userId].balance,
        blockHash: newBlock.hash
    });
});

app.post("/api/add-balance", (req, res) => {
    const { userId, amount } = req.body;

    if (!users[userId]) {
        users[userId] = { balance: 0 };
    }

    users[userId].balance += parseInt(amount);

    res.json({
        success: true,
        message: `✅ Баланс пополнен на ${amount} руб`,
        newBalance: users[userId].balance
    });
});

app.get("/api/proofs/:userId", (req, res) => {
    const userProofs = proofs.filter(p => p.userId === req.params.userId);
    res.json({ proofs: userProofs });
});

app.listen(PORT, () => {
    console.log(`🚀 ProofChain запущен: http://localhost:${PORT}`);
    console.log(`💰 Фиксация авторства: 100 руб`);
});
