// Блокчейн конфигурация для production
const BLOCKCHAIN_CONFIG = {
  // Polygon Mumbai Testnet (бесплатно)
  polygon: {
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001,
    networkName: "Polygon Mumbai Testnet",
    explorer: "https://mumbai.polygonscan.com",
    faucet: "https://faucet.polygon.technology"
  },
  
  // Ganache (только для localhost)
  ganache: {
    rpcUrl: "http://localhost:8547",
    chainId: 7777,
    networkName: "ZUZCOIN ProofChain"
  }
};

// Определяем какое окружение
const getBlockchainConfig = () => {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return BLOCKCHAIN_CONFIG.polygon;
  } else {
    return BLOCKCHAIN_CONFIG.ganache;
  }
};

module.exports = { getBlockchainConfig };
