cat > deploy.js << "EOF";
const Web3 = require("web3");
const fs = require("fs");
const path = require("path");

// Подключение к Polygon Mumbai
const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/demo");

// Чтение ABI и байткода (после компиляции)
const contractPath = path.join(__dirname, "ZUZCOIN.json");
let contractData = {};

if (fs.existsSync(contractPath)) {
    contractData = JSON.parse(fs.readFileSync(contractPath, "utf8"));
} else {
    console.error("Файл ZUZCOIN.json не найден! Сначала скомпилируй контракт.");
    process.exit(1);
}

async function deploy() {
    try {
        console.log("🚀 Начинаю деплой контракта ZUZCOIN...");

        // ЗАМЕНИ ЭТУ СТРОКУ НА СВОЙ ПРИВАТНЫЙ КЛЮЧ
        const privateKey = "ВСТАВЬ_СЮДА_СВОЙ_ПРИВАТНЫЙ_КЛЮЧ";
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log("👛 Кошелек для деплоя:", account.address);

        // Параметры конструктора
        const initialOwner = account.address;
        const charityWallet = account.address; // Можно пока использовать тот же адрес

        const contract = new web3.eth.Contract(contractData.abi);

        const deployment = contract.deploy({
            data: contractData.bytecode,
            arguments: [initialOwner, charityWallet],
        });

        const gas = await deployment.estimateGas();
        console.log("⛽ Примерный газ:", gas);

        const tx = await deployment.send({
            from: account.address,
            gas: gas,
            gasPrice: await web3.eth.getGasPrice(),
        });

        console.log("✅ Контракт успешно деплоен!");
        console.log("📄 Адрес контракта:", tx.options.address);
        console.log(
            "🔗 Explorer:",
            `https://mumbai.polygonscan.com/address/${tx.options.address}`,
        );
        console.log("📝 TX Hash:", tx.transactionHash);

        fs.writeFileSync("contract-address.txt", tx.options.address);
        console.log("💾 Адрес контракта сохранен в contract-address.txt");
    } catch (error) {
        console.error("❌ Ошибка деплоя:", error);
    }
}

deploy();
EOF;
