const express = require("express");
const app = express();
const PORT = 5000;
// ==================== РЕАЛЬНЫЙ БЛОКЧЕЙН ====================
// Web3 integration disabled - uncomment and install web3 package if needed
// const Web3 = require("web3");
// const web3 = new Web3(
//     "https://sepolia.infura.io/v3/b60d6d9d59c84931ac409649fea83735",
// );

// Проверка подключения
// web3.eth
//     .getBlockNumber()
//     .then((block) => {
//         console.log(`🌐 ПОДКЛЮЧЕНО К РЕАЛЬНОЙ СЕТИ ETHEREUM!`);
//         console.log(`📦 Текущий блок: ${block}`);
//         console.log(`🔗 Сеть: Sepolia Testnet`);
//     })
//     .catch((err) => {
//         console.log("❌ Ошибка подключения к Ethereum:", err.message);
//     });

// ==================== ИМПОРТ НАШЕЙ СЕТИ ====================
const ProofChainNetwork = require("./network/node");
const ProofChainMainnet = require("./blockchain/mainnet");
const PCC_Token = require("./blockchain/token");

// ==================== ЗАПУСК НАШЕЙ СЕТИ ====================

// Создаем экземпляр нашей сети
const proofChainNetwork = new ProofChainNetwork({
    nodeId: "main_node_1",
    isValidator: true,
    port: PORT,
});

// Создаем экземпляры блокчейна и токена
const proofChainMainnet = new ProofChainMainnet();
const pccToken = new PCC_Token();

// ==================== НАСТРОЙКИ БЕСПЕРЕБОЙНОЙ РАБОТЫ ====================

const PING_INTERVAL = 5 * 60 * 1000;
const BACKUP_INTERVAL = 10 * 60 * 1000;

// ==================== БАЗА ДАННЫХ ====================

let users = {
    "demo-user": {
        balance: 1000,
        pcc_balance: 100, // Баланс в PCC
        currency: "RUB",
        proofs: [],
        coins: [],
        node_status: "active",
    },
};

let paymentHistory = [];
const SERVICE_COST = 100;
const COIN_CREATION_COST = 500;

const myBlockchain = proofChainMainnet; // Используем нашу сеть
let realPayments = [];
let pendingPayments = [];

// ==================== СИСТЕМА ВОССТАНОВЛЕНИЯ ====================

function backupData() {
    try {
        const backup = {
            users: users,
            payments: realPayments,
            blockchain: {
                length: myBlockchain.chain.length,
                lastBlock: myBlockchain.chain[myBlockchain.chain.length - 1],
            },
            network: proofChainNetwork.getNetworkInfo(),
            timestamp: new Date().toISOString(),
            version: "2.0",
        };

        const fs = require("fs");
        fs.writeFileSync("backup.json", JSON.stringify(backup, null, 2));
        console.log("💾 Backup created at:", new Date().toLocaleString());
    } catch (error) {
        console.error("❌ Backup failed:", error.message);
    }
}

function restoreBackup() {
    try {
        const fs = require("fs");
        if (fs.existsSync("backup.json")) {
            const backup = JSON.parse(fs.readFileSync("backup.json", "utf8"));
            users = backup.users || users;
            realPayments = backup.payments || realPayments;
            console.log(
                "✅ Backup restored. Users:",
                Object.keys(users).length,
            );
        }
    } catch (error) {
        console.error("❌ Restore failed:", error.message);
    }
}

function keepAlive() {
    setInterval(() => {
        const now = new Date().toLocaleString();
        console.log("🔄 Keep-alive:", now);
    }, PING_INTERVAL);
}

function scheduleBackups() {
    setInterval(() => {
        backupData();
    }, BACKUP_INTERVAL);
}

// ==================== EXPRESS НАСТРОЙКИ ====================

app.use(express.json());
app.use(express.static("."));

// ==================== API МАРШРУТЫ ====================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/landing", (req, res) => {
    res.sendFile(__dirname + "/landing.html");
});

app.get("/coin-creator", (req, res) => {
    res.sendFile(__dirname + "/coin-creator.html");
});

// НОВЫЕ СТРАНИЦЫ НАШЕЙ СЕТИ
app.get("/network-status", (req, res) => {
    res.sendFile(__dirname + "/frontend/network-status.html");
});

app.get("/wallet", (req, res) => {
    res.sendFile(__dirname + "/frontend/wallet.html");
});

// ==================== API НАШЕЙ СЕТИ ====================

// Получить информацию о сети
app.get("/api/network/info", (req, res) => {
    res.json({
        success: true,
        network: proofChainNetwork.getNetworkInfo(),
        blockchain: proofChainMainnet.getBlockchainInfo(),
        token: pccToken.getTokenInfo(),
    });
});

// Получить статус ноды
app.get("/api/network/status", (req, res) => {
    res.json({
        success: true,
        status: proofChainNetwork.getNodeStatus(),
    });
});

// Запустить/остановить ноду
app.post("/api/network/control", (req, res) => {
    const { action, nodeId } = req.body;

    if (action === "start") {
        proofChainNetwork.startNode();
        res.json({ success: true, message: "✅ Нода запущена" });
    } else if (action === "stop") {
        proofChainNetwork.stopNode();
        res.json({ success: true, message: "⏹️ Нода остановлена" });
    } else {
        res.status(400).json({ error: "Неизвестное действие" });
    }
});

// Получить баланс PCC
app.get("/api/wallet/pcc-balance/:userId", (req, res) => {
    const user = users[req.params.userId];
    if (!user) {
        return res.json({ pcc_balance: 0 });
    }
    res.json({ pcc_balance: user.pcc_balance || 0 });
});

// Перевод PCC между пользователями
app.post("/api/wallet/transfer-pcc", (req, res) => {
    const { fromUserId, toUserId, amount } = req.body;

    if (!users[fromUserId] || users[fromUserId].pcc_balance < amount) {
        return res.status(400).json({ error: "Недостаточно PCC" });
    }

    if (!users[toUserId]) {
        users[toUserId] = { balance: 0, pcc_balance: 0, proofs: [], coins: [] };
    }

    // Списание
    users[fromUserId].pcc_balance -= amount;
    // Зачисление
    users[toUserId].pcc_balance += amount;

    // Фиксируем в блокчейне
    const transaction = {
        type: "pcc_transfer",
        from: fromUserId,
        to: toUserId,
        amount: amount,
        timestamp: new Date().toISOString(),
    };

    myBlockchain.addBlock([transaction]);

    res.json({
        success: true,
        message: `✅ Перевод ${amount} PCC выполнен`,
        transaction: transaction,
        blockHash: myBlockchain.getLatestBlock().hash,
    });
});

// Майнинг PCC (вознаграждение)
app.post("/api/wallet/mine-pcc", (req, res) => {
    const { userId } = req.body;

    if (!users[userId]) {
        users[userId] = { balance: 0, pcc_balance: 0, proofs: [], coins: [] };
    }

    const reward = 10; // PCC за майнинг
    users[userId].pcc_balance += reward;

    const miningTransaction = {
        type: "mining_reward",
        to: userId,
        amount: reward,
        timestamp: new Date().toISOString(),
    };

    myBlockchain.addBlock([miningTransaction]);

    res.json({
        success: true,
        message: `✅ Начислено ${reward} PCC за майнинг`,
        reward: reward,
        new_balance: users[userId].pcc_balance,
    });
});

// ==================== СТАРЫЕ API (АДАПТИРОВАННЫЕ) ====================

app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        blocks: myBlockchain.chain.length,
        users: Object.keys(users).length,
        coins: Object.values(users).reduce(
            (acc, user) => acc + (user.coins ? user.coins.length : 0),
            0,
        ),
        payments: realPayments.length,
        network: "ProofChain Mainnet",
    });
});

app.get("/status", (req, res) => {
    const networkInfo = proofChainNetwork.getNetworkInfo();
    const blockchainInfo = proofChainMainnet.getBlockchainInfo();

    res.send(`
        <html>
            <head>
                <title>ProofChain Status</title>
                <meta http-equiv="refresh" content="30">
                <style>
                    body { font-family: Arial; padding: 20px; background: #f5f5f5; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
                    .stat { background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 5px; }
                    .network { background: #e8f4ff; padding: 15px; margin: 10px 0; border-radius: 5px; }
                    .online { color: green; font-weight: bold; }
                    .nav { display: flex; gap: 10px; margin: 20px 0; }
                    .nav-button { padding: 10px 15px; background: #2196f3; color: white; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🌐 ProofChain Network Status</h1>

                    <div class="nav">
                        <a href="/network-status" class="nav-button">📊 Статус сети</a>
                        <a href="/wallet" class="nav-button">👛 PCC Кошелек</a>
                        <a href="/coin-creator" class="nav-button">🪙 Создать монету</a>
                    </div>

                    <div class="stat">
                        <p><strong>Status:</strong> <span class="online">🟢 PROOFCHAIN MAINNET</span></p>
                        <p><strong>Uptime:</strong> ${Math.round(process.uptime())} seconds</p>
                        <p><strong>Last Update:</strong> ${new Date().toLocaleString()}</p>
                    </div>

                    <div class="network">
                        <h3>🌐 Сеть ProofChain</h3>
                        <p><strong>Нода:</strong> ${networkInfo.nodeId}</p>
                        <p><strong>Статус:</strong> ${networkInfo.status}</p>
                        <p><strong>Блоков:</strong> ${blockchainInfo.blocks}</p>
                        <p><strong>Транзакций:</strong> ${blockchainInfo.totalTransactions}</p>
                        <p><strong>Нативный токен:</strong> ${pccToken.symbol} (${pccToken.name})</p>
                    </div>

                    <div class="stat">
                        <p><strong>Users:</strong> ${Object.keys(users).length}</p>
                        <p><strong>Coins Created:</strong> ${Object.values(users).reduce((acc, user) => acc + (user.coins ? user.coins.length : 0), 0)}</p>
                        <p><strong>Payments:</strong> ${realPayments.length}</p>
                    </div>

                    <p><em>Auto-refresh every 30 seconds</em></p>
                </div>
            </body>
        </html>
    `);
});

// Фиксация авторства
app.post("/api/register-proof", (req, res) => {
    const { userId, creativeWork, description, files } = req.body;

    if (!userId || !creativeWork) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    if (!users[userId] || users[userId].balance < SERVICE_COST) {
        return res
            .status(402)
            .json({ error: "Недостаточно средств. Нужно 100 руб." });
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
        status: "confirmed",
        files: files || [],
    };

    myBlockchain.addBlock([proofData]);

    if (!users[userId].proofs) users[userId].proofs = [];
    users[userId].proofs.push({
        ...proofData,
        blockHash: myBlockchain.getLatestBlock().hash,
    });

    res.json({
        success: true,
        message: "✅ Авторство зафиксировано в блокчейне!",
        cost: SERVICE_COST,
        balance: users[userId].balance,
        blockHash: myBlockchain.getLatestBlock().hash,
        proof: proofData,
    });
});

// Создание новой монеты
app.post("/api/create-coin", async (req, res) => {
    const { userId, coinData } = req.body;

    if (!userId || !coinData) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    // Проверяем баланс
    if (!users[userId] || users[userId].balance < COIN_CREATION_COST) {
        return res.status(402).json({
            error: `Недостаточно средств. Нужно ${COIN_CREATION_COST} руб.`,
        });
    }

    // Проверяем обязательные поля монеты
    if (!coinData.name || !coinData.symbol || !coinData.totalSupply) {
        return res.status(400).json({
            error: "Заполните название, символ и общее предложение монеты",
        });
    }

    try {
        // Создаем монету
        const newCoin = {
            creatorId: userId,
            name: coinData.name,
            symbol: coinData.symbol,
            totalSupply: coinData.totalSupply,
            description: coinData.description,
            contractAddress:
                "PRC_" + require("crypto").randomBytes(16).toString("hex"),
            createdAt: new Date().toISOString(),
            blockchainProof: myBlockchain.getLatestBlock().hash,
            tokenStandard: "PRC-20",
            utilities: coinData.utilities || [],
            roadmap: coinData.roadmap || [],
            website: coinData.website || "",
            category: coinData.category || "utility",
            status: "created",
        };

        // Фиксируем в блокчейне
        const coinProof = {
            type: "coin_creation",
            creatorId: userId,
            coinName: coinData.name,
            coinSymbol: coinData.symbol,
            totalSupply: coinData.totalSupply,
            contractAddress: newCoin.contractAddress,
            description: coinData.description,
            timestamp: newCoin.createdAt,
            utilities: coinData.utilities,
            roadmap: coinData.roadmap,
            category: coinData.category,
            tokenStandard: "PRC-20",
        };

        myBlockchain.addBlock([coinProof]);

        // Списываем стоимость
        users[userId].balance -= COIN_CREATION_COST;

        // Сохраняем монету
        if (!users[userId].coins) users[userId].coins = [];
        users[userId].coins.push(newCoin);

        res.json({
            success: true,
            message: "✅ Монета создана и запатентована в блокчейне!",
            coin: newCoin,
            cost: COIN_CREATION_COST,
            balance: users[userId].balance,
            blockHash: myBlockchain.getLatestBlock().hash,
        });
    } catch (error) {
        console.error("Ошибка создания монеты:", error);
        res.status(500).json({ error: "Ошибка создания монеты" });
    }
});

// Получить все монеты пользователя
app.get("/api/user-coins/:userId", (req, res) => {
    const user = users[req.params.userId];
    if (!user) {
        return res.json({ coins: [] });
    }
    res.json({ coins: user.coins || [] });
});

// Маркетплейс монет
app.get("/api/coin-marketplace", (req, res) => {
    const allCoins = [];
    Object.keys(users).forEach((userId) => {
        const user = users[userId];
        if (user.coins && user.coins.length > 0) {
            user.coins.forEach((coin) => {
                allCoins.push({
                    ...coin,
                    creator: userId,
                    userBalance: undefined,
                });
            });
        }
    });
    res.json({ coins: allCoins });
});

// Получить детали монеты
app.get("/api/coin-details/:contractAddress", (req, res) => {
    const contractAddress = req.params.contractAddress;
    let foundCoin = null;
    let creatorId = null;

    Object.keys(users).forEach((userId) => {
        const user = users[userId];
        if (user.coins) {
            const coin = user.coins.find(
                (c) => c.contractAddress === contractAddress,
            );
            if (coin) {
                foundCoin = coin;
                creatorId = userId;
            }
        }
    });

    if (!foundCoin) {
        return res.status(404).json({ error: "Монета не найдена" });
    }

    res.json({
        coin: {
            ...foundCoin,
            creator: creatorId,
        },
        blockchainProof: foundCoin.blockchainProof,
    });
});

// ==================== СИСТЕМА ПЛАТЕЖЕЙ ====================

app.get("/api/payment-details", (req, res) => {
    res.json({
        success: true,
        details: {
            sberbank: "2202 2069 2815 5311",
            tinkoff: "2200 7006 2408 6293",
            usdt: "TS8muvDerT8D1TWpDmjM9rSFDYYJKbuhgr(TRC20)",
            bitcoin: "bc1qd503jre3t3lpfwq6lnjpdvd27xuaf86ztcjh2s",
            ethereum: "0xF89CE65B635DA29be08c659e313D6C250750bC73",
        },
        instructions:
            "После оплаты введите ID транзакции. Средства будут зачислены после проверки",
        prices: {
            proof: SERVICE_COST + " руб",
            coin_creation: COIN_CREATION_COST + " руб",
        },
    });
});

app.post("/api/confirm-payment", (req, res) => {
    const { userId, amount, paymentMethod, transactionId } = req.body;

    if (!userId || !amount || !transactionId) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    const payment = {
        id: "pay_" + Date.now(),
        userId,
        amount: parseInt(amount),
        method: paymentMethod,
        transactionId: transactionId,
        status: "completed",
        timestamp: new Date().toISOString(),
        previousBalance: users[userId] ? users[userId].balance : 0,
        newBalance: users[userId]
            ? users[userId].balance + parseInt(amount)
            : parseInt(amount),
    };

    if (!users[userId]) {
        users[userId] = { balance: 0, pcc_balance: 0, proofs: [], coins: [] };
    }
    users[userId].balance += parseInt(amount);

    realPayments.push(payment);

    res.json({
        success: true,
        message: "✅ Платеж зачислен",
        payment: payment,
        status: "completed",
    });
});

// ==================== ДОПОЛНИТЕЛЬНЫЕ API ====================

app.get("/api/payment-status/:transactionId", (req, res) => {
    const payment = realPayments.find(
        (p) => p.transactionId === req.params.transactionId,
    );
    if (!payment) {
        return res.status(404).json({ error: "Платеж не найден" });
    }
    res.json({
        payment,
        userBalance: users[payment.userId] ? users[payment.userId].balance : 0,
    });
});

app.get("/api/payments/:userId", (req, res) => {
    const userPayments = realPayments.filter(
        (p) => p.userId === req.params.userId,
    );
    res.json({ payments: userPayments });
});

app.get("/api/blockchain-stats", (req, res) => {
    const totalCoins = Object.values(users).reduce(
        (acc, user) => acc + (user.coins ? user.coins.length : 0),
        0,
    );

    res.json({
        blocks: myBlockchain.chain.length,
        difficulty: myBlockchain.difficulty,
        totalTransactions: myBlockchain.totalTransactions,
        totalCoins: totalCoins,
        isValid: myBlockchain.isChainValid(),
    });
});

app.get("/api/chain", (req, res) => {
    res.json({
        chain: myBlockchain.chain,
        length: myBlockchain.chain.length,
    });
});

app.post("/api/add-balance", (req, res) => {
    const { userId, amount } = req.body;
    if (!users[userId])
        users[userId] = { balance: 0, pcc_balance: 0, proofs: [], coins: [] };
    users[userId].balance += parseInt(amount);
    res.json({
        success: true,
        message: `✅ Баланс пополнен на ${amount} руб`,
        newBalance: users[userId].balance,
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

// ==================== ОБРАБОТКА ОШИБОК ====================

process.on("uncaughtException", (error) => {
    console.error("❌ UNCAUGHT EXCEPTION:", error);
    backupData();
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ UNHANDLED REJECTION at:", promise, "reason:", reason);
});

// ==================== ЗАПУСК СЕРВЕРА ====================

app.listen(PORT, () => {
    console.log(`🚀 ProofChain Mainnet запущена: http://localhost:${PORT}`);
    console.log(`🌐 Сеть: ProofChain Mainnet (ChainID: 7777)`);
    console.log(`💰 Нативный токен: PCC - ProofChain Coin`);
    console.log(`📊 Статус сети: http://localhost:${PORT}/network-status`);
    console.log(`👛 PCC Кошелек: http://localhost:${PORT}/wallet`);

    // Запускаем ноду
    proofChainNetwork.startNode();

    // Восстанавливаем данные
    restoreBackup();

    // Запускаем системы мониторинга (отключены для уменьшения спама в консоли)
    // keepAlive();
    // scheduleBackups();
});
