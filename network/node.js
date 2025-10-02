const EventEmitter = require("events");

class ProofChainNetwork extends EventEmitter {
    constructor(config = {}) {
        super();

        this.nodeId =
            config.nodeId || `node_${Math.random().toString(36).substr(2, 9)}`;
        this.isValidator = config.isValidator || false;
        this.port = config.port || 5000;
        this.peers = new Map();
        this.status = "stopped";
        this.blocksMined = 0;
        this.transactionsProcessed = 0;

        // Статистика сети
        this.networkStats = {
            uptime: 0,
            lastBlockTime: null,
            averageBlockTime: 0,
            connectedPeers: 0,
            networkHashrate: 0,
        };

        this.startTime = Date.now();

        console.log(`🌐 ProofChain Node создана: ${this.nodeId}`);
    }

    startNode() {
        this.status = "running";
        this.startTime = Date.now();

        console.log(`🟢 Нода ${this.nodeId} запущена`);
        console.log(
            `📍 Тип: ${this.isValidator ? "Валидатор" : "Полная нода"}`,
        );
        console.log(`🔗 Port: ${this.port}`);

        // Имитация сетевой активности (отключено для уменьшения спама в консоли)
        // this.networkInterval = setInterval(() => {
        //     this.updateNetworkStats();
        //     this.emit("networkUpdate", this.getNetworkInfo());
        // }, 5000);

        this.emit("nodeStarted", this.nodeId);
    }

    stopNode() {
        this.status = "stopped";
        if (this.networkInterval) {
            clearInterval(this.networkInterval);
        }

        console.log(`🔴 Нода ${this.nodeId} остановлена`);
        this.emit("nodeStopped", this.nodeId);
    }

    addPeer(peerNode) {
        this.peers.set(peerNode.nodeId, peerNode);
        console.log(`🔗 Подключен пир: ${peerNode.nodeId}`);
        this.emit("peerConnected", peerNode.nodeId);
    }

    removePeer(peerId) {
        this.peers.delete(peerId);
        console.log(`🔴 Отключен пир: ${peerId}`);
        this.emit("peerDisconnected", peerId);
    }

    broadcastTransaction(transaction) {
        console.log(`📨 Транзакция broadcast: ${transaction.type}`);
        this.transactionsProcessed++;

        // Рассылаем транзакцию всем пирам
        this.peers.forEach((peer) => {
            this.emit("transactionBroadcast", transaction, peer.nodeId);
        });
    }

    broadcastBlock(block) {
        console.log(`📦 Блок broadcast: #${block.index}`);
        this.blocksMined++;

        // Рассылаем блок всем пирам
        this.peers.forEach((peer) => {
            this.emit("blockBroadcast", block, peer.nodeId);
        });
    }

    updateNetworkStats() {
        this.networkStats.uptime = Date.now() - this.startTime;
        this.networkStats.connectedPeers = this.peers.size;
        this.networkStats.lastBlockTime = new Date().toISOString();
        this.networkStats.networkHashrate = Math.random() * 1000; // Имитация hashrate
    }

    getNetworkInfo() {
        return {
            nodeId: this.nodeId,
            status: this.status,
            isValidator: this.isValidator,
            port: this.port,
            peersCount: this.peers.size,
            blocksMined: this.blocksMined,
            transactionsProcessed: this.transactionsProcessed,
            stats: this.networkStats,
            chainId: 7777,
            networkName: "ProofChain Mainnet",
            version: "1.0.0",
        };
    }

    getNodeStatus() {
        return {
            nodeId: this.nodeId,
            status: this.status,
            uptime: this.networkStats.uptime,
            peers: Array.from(this.peers.keys()),
            isValidator: this.isValidator,
            performance: {
                blocksPerHour:
                    Math.round(
                        this.blocksMined / (this.networkStats.uptime / 3600000),
                    ) || 0,
                txPerSecond:
                    Math.round(
                        this.transactionsProcessed /
                            (this.networkStats.uptime / 1000),
                    ) || 0,
            },
        };
    }

    // Валидация транзакций (для валидаторных нод)
    validateTransaction(transaction) {
        if (!transaction.type) return false;
        if (!transaction.timestamp) return false;

        const validTypes = [
            "pcc_transfer",
            "mining_reward",
            "coin_creation",
            "copyright_proof",
        ];
        if (!validTypes.includes(transaction.type)) return false;

        console.log(`✅ Транзакция валидирована: ${transaction.type}`);
        return true;
    }

    // Синхронизация с сетью
    syncWithNetwork() {
        console.log(`🔄 Синхронизация с сетью...`);
        this.emit("syncStarted");

        // Имитация синхронизации
        setTimeout(() => {
            console.log(`✅ Синхронизация завершена`);
            this.emit("syncCompleted");
        }, 2000);
    }
}

module.exports = ProofChainNetwork;
