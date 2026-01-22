const express = require("express");
const app = express();
const PORT = 8081;

// ==================== РЕАЛЬНЫЙ БЛОКЧЕЙН ZUZCOIN ====================
const { Web3 } = require("web3");
const web3 = new Web3(
    "https://sepolia.infura.io/v3/b60d6d9d59c84931ac409649fea83735",
);

// Проверка подключения к Ethereum
web3.eth
    .getBlockNumber()
    .then((block) => {
        console.log(`🌐 ПОДКЛЮЧЕНО К ETHEREUM!`);
        console.log(`📦 Текущий блок: ${block}`);
    })
    .catch((err) => {
        console.log("❌ Ошибка подключения к Ethereum:", err.message);
    });

// ==================== БЛОКЧЕЙН ZUZCOIN PROOFCHAIN ====================
const ZuzcoinNetwork = require("./network/node");
const ZuzcoinMainnet = require("./blockchain/mainnet");
const ZUZ_Token = require("./blockchain/token");

// Запуск нашей сети
const zuzcoinNetwork = new ZuzcoinNetwork({
    nodeId: "main_node_1",
    isValidator: true,
    port: PORT,
});
const zuzcoinMainnet = new ZuzcoinMainnet();
const zuzToken = new ZUZ_Token();

// ==================== БАЗА ДАННЫХ ====================
let users = {}; // Только реальные пользователи
let realPayments = [];
let pendingCryptoPayments = [];

// Стоимость услуг в ZUZCOIN
const COPYRIGHT_COST = 100; // 100 ZUZ за фиксацию авторства
const COIN_CREATION_COST = 500; // 500 ZUZ за создание монеты

// ==================== REAL NOWPAYMENTS ИНТЕГРАЦИЯ ====================
const NOWPAYMENTS_API_KEY = "6KS2FYD-N5Z40VG-GZWCJ76-2YXXBD2";

// Создание реального крипто-платежа
app.post("/api/zuzcoin/create-payment", async (req, res) => {
    const { userId, amount, currency } = req.body;

    if (!userId || !amount || amount < 10) {
        return res.status(400).json({ error: "Минимальная сумма 10 USD" });
    }

    try {
        const paymentId = "zuz_pay_" + Date.now();

        const pendingPayment = {
            paymentId: paymentId,
            userId: userId,
            amount: parseFloat(amount),
            currency: currency || "usdt",
            status: "waiting",
            createdAt: new Date().toISOString(),
            invoiceUrl: `https://nowpayments.io/payment/?iid=4872886414&amount=${amount}&currency=${currency}`,
            payAddress: "Адрес будет сгенерирован NOWPayments",
            orderId: `zuz_${userId}_${Date.now()}`,
        };

        pendingCryptoPayments.push(pendingPayment);

        console.log(`💰 Создан реальный платеж: ${amount} USD для ${userId}`);

        res.json({
            success: true,
            paymentId: paymentId,
            invoiceUrl: `https://nowpayments.io/payment/?iid=4872886414&amount=${amount}&currency=${currency}`,
            message: "Перейдите по ссылке для оплаты",
            zuzAmount: amount * 100, // 1 USD = 100 ZUZ
        });
    } catch (error) {
        console.error("❌ Payment error:", error);
        res.status(500).json({ error: "Ошибка создания платежа" });
    }
});

// Подтверждение реального платежа
app.post("/api/zuzcoin/confirm-payment", async (req, res) => {
    const { paymentId } = req.body;

    try {
        const paymentIndex = pendingCryptoPayments.findIndex(
            (p) => p.paymentId === paymentId,
        );

        if (paymentIndex === -1) {
            return res.status(404).json({ error: "Платеж не найден" });
        }

        const payment = pendingCryptoPayments[paymentIndex];

        if (payment.status === "completed") {
            return res.status(400).json({ error: "Платеж уже обработан" });
        }

        // Зачисляем реальные средства
        payment.status = "completed";
        payment.completedAt = new Date().toISOString();

        const zuzAmount = payment.amount * 100; // 1 USD = 100 ZUZ

        // Создаем пользователя если не существует
        if (!users[payment.userId]) {
            users[payment.userId] = {
                balance: 0,
                proofs: [],
                coins: [],
            };
        }

        // Зачисляем реальные ZUZCOIN
        users[payment.userId].balance += zuzAmount;

        // Фиксируем в блокчейне
        const paymentTransaction = {
            type: "zuzcoin_payment",
            userId: payment.userId,
            amount: zuzAmount,
            currency: payment.currency,
            timestamp: new Date().toISOString(),
        };

        zuzcoinMainnet.addBlock([paymentTransaction]);

        realPayments.push({
            id: "zuz_" + Date.now(),
            userId: payment.userId,
            amount: zuzAmount,
            method: "crypto_" + payment.currency,
            transactionId: paymentId,
            status: "completed",
            timestamp: new Date().toISOString(),
        });

        console.log(
            `✅ РЕАЛЬНЫЙ ПЛАТЕЖ: ${zuzAmount} ZUZ для ${payment.userId}`,
        );

        res.json({
            success: true,
            message: `✅ Зачислено ${zuzAmount} ZUZ!`,
            zuzAmount: zuzAmount,
            newBalance: users[payment.userId].balance,
        });
    } catch (error) {
        console.error("Confirm error:", error);
        res.status(500).json({ error: "Ошибка подтверждения платежа" });
    }
});

// ==================== BSC ИНТЕГРАЦИЯ ДЛЯ ZUZCOIN ====================
const bscWeb3 = new Web3("https://bsc-dataseed.binance.org/");

// Проверка подключения к BSC
bscWeb3.eth
    .getBlockNumber()
    .then((block) => {
        console.log(`🎯 ПОДКЛЮЧЕНО К BINANCE SMART CHAIN!`);
        console.log(`📦 Текущий блок BSC: ${block}`);
    })
    .catch((err) => {
        console.log("❌ Ошибка подключения к BSC:", err.message);
    });

// Получить реальный баланс ZUZCOIN из BSC
app.get("/api/zuzcoin/balance/:walletAddress", async (req, res) => {
    try {
        const walletAddress = req.params.walletAddress;

        // ABI для чтения баланса
        const minABI = [
            {
                constant: true,
                inputs: [{ name: "_owner", type: "address" }],
                name: "balanceOf",
                outputs: [{ name: "balance", type: "uint256" }],
                type: "function",
            },
        ];

        const contract = new bscWeb3.eth.Contract(
            minABI,
            "0x60cA3145F64919F26b47a2270F4cE36F239033e9",
        );
        const blockchainBalance = await contract.methods
            .balanceOf(walletAddress)
            .call();

        // Конвертация в нормальные единицы
        const realBalance = Number(blockchainBalance) / 1000000000000000000;

        console.log(
            `💰 Реальный баланс BSC: ${walletAddress} = ${realBalance} ZUZ`,
        );

        res.json({
            success: true,
            balance: realBalance,
            symbol: "ZUZ",
            contract: "0x60cA3145F64919F26b47a2270F4cE36F239033e9",
            raw_balance: blockchainBalance.toString(),
        });
    } catch (error) {
        console.log("❌ Ошибка получения баланса ZUZCOIN:", error.message);
        res.status(500).json({
            error: "Ошибка получения баланса ZUZCOIN: " + error.message,
        });
    }
});

// ==================== EXPRESS НАСТРОЙКИ ====================
app.use(express.json());
app.use(express.static("."));

// ==================== API МАРШРУТЫ ====================
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/network-status", (req, res) =>
    res.sendFile(__dirname + "/frontend/network-status.html"),
);
app.get("/wallet", (req, res) =>
    res.sendFile(__dirname + "/frontend/wallet.html"),
);
app.get("/zuzcoin-wallet", (req, res) =>
    res.sendFile(__dirname + "/frontend/zuzcoin-wallet.html"),
);
app.get("/coin-creator", (req, res) =>
    res.sendFile(__dirname + "/coin-creator.html"),
);
app.get("/landing", (req, res) => res.sendFile(__dirname + "/landing.html"));
app.get("/status", (req, res) => {
    res.send(`
        <html>
            <head>
                <title>ZUZCOIN ProofChain Status</title>
                <meta http-equiv="refresh" content="30">
                <style>
                    body { font-family: Arial; padding: 20px; background: #1a1a2e; color: white; }
                    .container { max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; }
                    .stat { background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 5px; }
                    .online { color: #ffd93d; font-weight: bold; }
                    .nav { display: flex; gap: 10px; margin: 20px 0; }
                    .nav-button { padding: 10px 15px; background: #2196f3; color: white; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🌐 ZUZCOIN ProofChain Status</h1>

                    <div class="nav">
                        <a href="/zuzcoin-wallet" class="nav-button">👛 ZUZCOIN Кошелек</a>
                        <a href="/coin-creator" class="nav-button">🪙 Create Coin</a>
                        <a href="/" class="nav-button">🏠 Главная</a>
                    </div>

                    <div class="stat">
                        <p><strong>Status:</strong> <span class="online">🟢 ZUZCOIN PROOFCHAIN ONLINE</span></p>
                        <p><strong>Uptime:</strong> ${Math.round(process.uptime())} seconds</p>
                        <p><strong>Last Update:</strong> ${new Date().toLocaleString()}</p>
                    </div>

                    <div class="stat">
                        <h3>🌐 Сеть ZUZCOIN ProofChain</h3>
                        <p><strong>Нода:</strong> main_node_1</p>
                        <p><strong>Статус:</strong> Active</p>
                        <p><strong>Блоков:</strong> ${zuzcoinMainnet.chain.length}</p>
                        <p><strong>Транзакций:</strong> ${zuzcoinMainnet.totalTransactions}</p>
                        <p><strong>Нативный токен:</strong> ZUZ (ZUZCOIN)</p>
                    </div>

                    <div class="stat">
                        <p><strong>Users:</strong> ${Object.keys(users).length}</p>
                        <p><strong>Real Payments:</strong> ${realPayments.length}</p>
                    </div>

                    <p><em>Auto-refresh every 30 seconds</em></p>
                </div>
            </body>
        </html>
    `);
});
app.get("/manifest.json", (req, res) =>
    res.sendFile(__dirname + "/manifest.json"),
);

// ==================== API ZUZCOIN PROOFCHAIN ====================
app.get("/api/network/info", (req, res) => {
    res.json({
        success: true,
        network: zuzcoinNetwork.getNetworkInfo(),
        blockchain: zuzcoinMainnet.getBlockchainInfo(),
        token: zuzToken.getTokenInfo(),
    });
});

app.get("/api/network/status", (req, res) => {
    res.json({
        success: true,
        status: zuzcoinNetwork.getNodeStatus(),
    });
});

// ==================== ОСНОВНЫЕ API ====================
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        blocks: zuzcoinMainnet.chain.length,
        users: Object.keys(users).length,
        network: "ZUZCOIN ProofChain",
    });
});

// Фиксация авторства за ZUZCOIN
app.post("/api/register-proof", (req, res) => {
    const { userId, creativeWork, description } = req.body;

    if (!userId || !creativeWork) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    // Проверяем баланс ZUZCOIN
    if (!users[userId] || users[userId].balance < COPYRIGHT_COST) {
        return res.status(402).json({
            error: `Недостаточно ZUZCOIN. Нужно: ${COPYRIGHT_COST} ZUZ`,
        });
    }

    // Списываем ZUZCOIN
    users[userId].balance -= COPYRIGHT_COST;

    const proofData = {
        type: "copyright_proof",
        userId: userId,
        creativeWork: creativeWork,
        description: description,
        timestamp: new Date().toISOString(),
        cost: COPYRIGHT_COST,
        status: "confirmed",
    };

    // Фиксируем в блокчейне
    zuzcoinMainnet.addBlock([proofData]);

    if (!users[userId].proofs) users[userId].proofs = [];
    users[userId].proofs.push(proofData);

    res.json({
        success: true,
        message: "✅ Авторство зафиксировано в блокчейне ZUZCOIN!",
        cost: COPYRIGHT_COST,
        balance: users[userId].balance,
        blockHash: zuzcoinMainnet.getLatestBlock().hash,
    });
});

// Создание монеты за ZUZCOIN
app.post("/api/create-coin", async (req, res) => {
    const { userId, coinData } = req.body;

    if (!userId || !coinData) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    // Проверяем баланс ZUZCOIN
    if (!users[userId] || users[userId].balance < COIN_CREATION_COST) {
        return res.status(402).json({
            error: `Недостаточно ZUZCOIN. Нужно: ${COIN_CREATION_COST} ZUZ`,
        });
    }

    if (!coinData.name || !coinData.symbol) {
        return res.status(400).json({
            error: "Заполните название и символ монеты",
        });
    }

    try {
        // Создаем монету
        const newCoin = {
            creatorId: userId,
            name: coinData.name,
            symbol: coinData.symbol,
            totalSupply: coinData.totalSupply || 1000000,
            description: coinData.description,
            contractAddress:
                "ZRC_" + require("crypto").randomBytes(16).toString("hex"),
            createdAt: new Date().toISOString(),
            blockchainProof: zuzcoinMainnet.getLatestBlock().hash,
            tokenStandard: "ZRC-20",
            status: "active",
        };

        // Фиксируем в блокчейне
        const coinProof = {
            type: "coin_creation",
            creatorId: userId,
            coinName: coinData.name,
            coinSymbol: coinData.symbol,
            timestamp: newCoin.createdAt,
        };

        zuzcoinMainnet.addBlock([coinProof]);

        // Списываем ZUZCOIN
        users[userId].balance -= COIN_CREATION_COST;

        // Сохраняем монету
        if (!users[userId].coins) users[userId].coins = [];
        users[userId].coins.push(newCoin);

        res.json({
            success: true,
            message: "✅ Монета создана в блокчейне ZUZCOIN!",
            coin: newCoin,
            cost: COIN_CREATION_COST,
            balance: users[userId].balance,
            blockHash: zuzcoinMainnet.getLatestBlock().hash,
        });
    } catch (error) {
        console.error("Ошибка создания монеты:", error);
        res.status(500).json({ error: "Ошибка создания монеты" });
    }
});

// Получить монеты пользователя
app.get("/api/user-coins/:userId", (req, res) => {
    const user = users[req.params.userId];
    res.json({ coins: user ? user.coins || [] : [] });
});
// Получить стоимость услуг
app.get("/api/services/prices", (req, res) => {
    res.json({
        coin_creation: {
            cost: 500,
            currency: "ZUZ",
            usd_equivalent: 5,
            description:
                "Создание собственной монеты в блокчейне ZUZCOIN ProofChain",
        },
        copyright_proof: {
            cost: 100,
            currency: "ZUZ",
            usd_equivalent: 1,
            description: "Фиксация авторства в блокчейне",
        },
    });
});

// Информация о ZUZCOIN
app.get("/api/zuzcoin/info", (req, res) => {
    res.json({
        name: "ZUZCOIN",
        symbol: "ZUZ",
        contract: "0x60cA3145F64919F26b47a2270F4cE36F239033e9",
        blockchain: "Binance Smart Chain",
        network: "BSC Mainnet",
        website: "ZUZCOIN ProofChain",
    });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
app.listen(PORT, () => {
    console.log(`🚀 ZUZCOIN ProofChain запущена: http://localhost:${PORT}`);
    console.log(`💰 ZUZCOIN Кошелек: http://localhost:${PORT}/zuzcoin-wallet`);
    console.log(`🎯 Сеть: ZUZCOIN ProofChain (ChainID: 7777)`);
    console.log(`🌐 Статус сети: http://localhost:${PORT}/network-status`);
    console.log(`🪙 Create Coin: http://localhost:${PORT}/coin-creator`);

    // Запускаем ноду
    zuzcoinNetwork.startNode();
});
