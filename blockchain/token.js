class PCC_Token {
    constructor() {
        this.name = "ProofChain Coin";
        this.symbol = "PCC";
        this.totalSupply = 1000000000; // 1 млрд
        this.decimals = 18;
        this.chainId = 7777;
        this.contractAddress = "0xProofChain7777PCC";
        this.creator = "ProofChain Network";
        this.creationBlock = 0;

        // Распределение токенов
        this.distribution = {
            ecosystem: 400000000, // 40% - экосистема
            development: 200000000, // 20% - развитие
            team: 150000000, // 15% - команда
            marketing: 100000000, // 10% - маркетинг
            reserve: 150000000, // 15% - резерв
        };

        this.tokenomics = {
            inflation: 2, // 2% в год
            stakingReward: 8, // 8% годовых за стейкинг
            transactionFee: 0.1, // 0.1% комиссия
            burnRate: 0.05, // 0.05% сжигание
        };

        console.log(`💰 Нативный токен создан: ${this.symbol} - ${this.name}`);
    }

    getTokenInfo() {
        return {
            name: this.name,
            symbol: this.symbol,
            totalSupply: this.totalSupply,
            decimals: this.decimals,
            chainId: this.chainId,
            contractAddress: this.contractAddress,
            distribution: this.distribution,
            tokenomics: this.tokenomics,
            circulatingSupply: this.getCirculatingSupply(),
        };
    }

    getCirculatingSupply() {
        // Расчет circulating supply (общее предложение минус резервы)
        return (
            this.totalSupply -
            this.distribution.reserve -
            this.distribution.team
        );
    }

    calculateStakingRewards(amount, days) {
        const annualReward = amount * (this.tokenomics.stakingReward / 100);
        const dailyReward = annualReward / 365;
        return Math.round(dailyReward * days * 100) / 100;
    }

    calculateTransactionFee(amount) {
        return amount * (this.tokenomics.transactionFee / 100);
    }

    calculateBurnAmount(amount) {
        return amount * (this.tokenomics.burnRate / 100);
    }

    // Создание нового токена в сети ProofChain
    createNewToken(creator, tokenData) {
        const newToken = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            totalSupply: tokenData.totalSupply,
            decimals: tokenData.decimals || 18,
            creator: creator,
            contractAddress: this.generateContractAddress(),
            created: new Date().toISOString(),
            network: "ProofChain Mainnet",
            chainId: this.chainId,
            standard: "PRC-20",
            pccCost: this.calculateTokenCreationCost(tokenData),
        };

        return newToken;
    }

    generateContractAddress() {
        return `0xPCC${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
    }

    calculateTokenCreationCost(tokenData) {
        // Стоимость создания токена в PCC
        const baseCost = 500; // Базовая стоимость
        const supplyFactor = Math.log10(tokenData.totalSupply) / 10;
        return Math.round(baseCost * (1 + supplyFactor));
    }

    // Валидация параметров токена
    validateTokenParameters(tokenData) {
        const errors = [];

        if (!tokenData.name || tokenData.name.length < 2) {
            errors.push("Название токена должно быть не менее 2 символов");
        }

        if (!tokenData.symbol || tokenData.symbol.length > 10) {
            errors.push("Символ токена должен быть не более 10 символов");
        }

        if (!tokenData.totalSupply || tokenData.totalSupply <= 0) {
            errors.push("Общее предложение должно быть положительным числом");
        }

        if (
            tokenData.decimals &&
            (tokenData.decimals < 0 || tokenData.decimals > 18)
        ) {
            errors.push("Количество decimal должно быть от 0 до 18");
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
        };
    }

    // Получить текущую стоимость PCC в USD (для демо)
    getCurrentPrice() {
        // В реальности здесь будет API запрос к биржам
        return {
            usd: 0.15,
            rub: 13.5,
            eur: 0.14,
            btc: 0.0000033,
            eth: 0.000052,
        };
    }

    // Конвертация PCC в другие валюты
    convertPCC(amount, toCurrency = "usd") {
        const prices = this.getCurrentPrice();
        const rate = prices[toCurrency.toLowerCase()];

        if (!rate) {
            throw new Error(`Неизвестная валюта: ${toCurrency}`);
        }

        return amount * rate;
    }
}

module.exports = PCC_Token;
