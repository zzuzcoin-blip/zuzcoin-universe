const express = require("express");
const app = express();
const PORT = 5000;

class Block {
    constructor(timestamp, transactions, previousHash = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
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
                JSON.stringify(this.transactions) +
                this.nonce
            )
            .digest("hex");
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`✅ Блок замайнен: ${this.hash}`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2024", ["Genesis Block"], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(transactions) {
        const newBlock = new Block(Date.now(), transactions, this.getLatestBlock().hash);
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
    "demo-user": { 
        balance: 1000,
        currency: "RUB",
        proofs: []
    }
};

let paymentHistory = [];
const SERVICE_COST = 100;

const exchangeRates = {
    USD: 90,
    EUR: 98,
    USDT: 90,
    BTC: 4500000,
    ETH: 250000
};

const myBlockchain = new Blockchain();

app.use(express.json());
app.use(express.static("."));

app.get("/api/pricing", (req, res) => {
    const pricing = {
        RUB: SERVICE_COST,
        USD: (SERVICE_COST / exchangeRates.USD).toFixed(2),
        EUR: (SERVICE_COST / exchangeRates.EUR).toFixed(2),
        USDT: (SERVICE_COST / exchangeRates.USDT).toFixed(2),
        BTC: (SERVICE_COST / exchangeRates.BTC).toFixed(6),
        ETH: (SERVICE_COST / exchangeRates.ETH).toFixed(6)
    };
    res.json({ success: true, pricing });
});

app.post("/api/process-payment", (req, res) => {
    const { userId, amount, currency, method } = req.body;
    
    const paymentMethods = {
        'rub': { name: 'Банковская карта', feeType: 'percentage', fee: 0 },
        'usd': { name: 'Stripe', feeType: 'percentage', fee: 0.03 },
        'eur': { name: 'Stripe', feeType: 'percentage', fee: 0.03 },
        'usdt': { name: 'USDT (TRC20)', feeType: 'flat', fee: 1 },
        'btc': { name: 'Bitcoin', feeType: 'crypto', fee: 0.0001 },
        'eth': { name: 'Ethereum', feeType: 'crypto', fee: 0.001 }
    };

    const methodInfo = paymentMethods[method];
    if (!methodInfo) {
        return res.status(400).json({ error: "Метод оплаты не поддерживается" });
    }

    let amountInRub = amount;
    if (currency !== 'RUB') {
        amountInRub = Math.round(amount * exchangeRates[currency]);
    }

    let fee = 0;
    if (methodInfo.feeType === 'percentage') {
        fee = Math.round(amountInRub * methodInfo.fee);
    } else if (methodInfo.feeType === 'flat') {
        fee = methodInfo.fee;
    } else if (methodInfo.feeType === 'crypto') {
        fee = Math.round(methodInfo.fee * exchangeRates[currency]);
    }
    
    const finalAmount = amountInRub - fee;

    const payment = {
        id: 'pay_' + Date.now(),
        userId,
        amount: finalAmount,
        currency,
        method: methodInfo.name,
        fee: fee,
        status: 'completed',
        timestamp: new Date().toISOString()
    };

    paymentHistory.push(payment);

    if (!users[userId]) {
        users[userId] = { balance: 0, currency: "RUB", proofs: [] };
    }
    users[userId].balance += finalAmount;

    res.json({
        success: true,
        payment,
        message: `✅ Оплата прошла успешно! Зачислено: ${finalAmount} RUB`
    });
});

app.post("/api/register-proof", (req, res) => {
    const { userId, creativeWork, description } = req.body;

    if (!userId || !creativeWork) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    if (!users[userId] || users[userId].balance < SERVICE_COST) {
        return res.status(402).json({ error: "Недостаточно средств. Нужно 100 руб." });
    }

    users[userId].balance -= SERVICE_COST;

    const proofData = {
        type: "copyright_proof",
        userId: userId,
        creativeWork: creativeWork,
        description: description,
        timestamp: new Date().toISOString(),
        cost: SERVICE_COST,
        currency: users[userId].currency || "RUB",
        status: "confirmed"
    };

    myBlockchain.addBlock([proofData]);

    users[userId].proofs.push({
        ...proofData,
        blockHash: myBlockchain.getLatestBlock().hash
    });

    res.json({
        success: true,
        message: "✅ Авторство зафиксировано в блокчейне!",
        cost: SERVICE_COST,
        balance: users[userId].balance,
        blockHash: myBlockchain.getLatestBlock().hash,
        proof: proofData
    });
});

app.get("/api/payments/:userId", (req, res) => {
    const userPayments = paymentHistory.filter(p => p.userId === req.params.userId);
    res.json({ payments: userPayments });
});

app.get("/api/blockchain-stats", (req, res) => {
    res.json({
        blocks: myBlockchain.chain.length,
        difficulty: myBlockchain.difficulty,
        totalTransactions: myBlockchain.chain.reduce((acc, block) => acc + block.transactions.length, 0),
        isValid: myBlockchain.isChainValid()
    });
});

app.get("/api/chain", (req, res) => {
    res.json({
        chain: myBlockchain.chain,
        length: myBlockchain.chain.length
    });
});

app.post("/api/add-balance", (req, res) => {
    const { userId, amount } = req.body;
    if (!users[userId]) users[userId] = { balance: 0, currency: "RUB", proofs: [] };
    users[userId].balance += parseInt(amount);
    res.json({
        success: true,
        message: `✅ Баланс пополнен на ${amount} руб`,
        newBalance: users[userId].balance
    });
});

app.get("/api/proofs/:userId", (req, res) => {
    const user = users[req.params.userId];
    res.json({ proofs: user ? user.proofs : [] });
});

app.get("/api/user/:userId", (req, res) => {
    const user = users[req.params.userId];
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    res.json({ user });
});

app.listen(PORT, () => {
    console.log(`🚀 ProofChain PRO запущен: http://localhost:${PORT}`);
    console.log(`💰 Принимаем: RUB, USD, EUR, USDT, BTC, ETH`);
    console.log(`📊 Статистика: /api/blockchain-stats`);
});
