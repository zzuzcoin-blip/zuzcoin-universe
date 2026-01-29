// Блокчейн конфигурация для ZUZCOIN
const BLOCKCHAIN_CONFIG = {
  // Polygon Mumbai (основная сеть для production)
  polygonMumbai: {
    rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/demo",
    apiUrl: "https://workspace.alekseev2508.repl.co/api",
    chainId: 80001,
    networkName: "Polygon Mumbai Testnet",
    explorer: "https://mumbai.polygonscan.com",
    currency: "MATIC",
    testnet: true
  },
  
  // Production Polygon Mainnet (когда будет готово)
  polygonMainnet: {
    rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/demo",
    apiUrl: "https://workspace.alekseev2508.repl.co/api",
    chainId: 137,
    networkName: "Polygon Mainnet",
    explorer: "https://polygonscan.com",
    currency: "MATIC",
    testnet: false
  },
  
  // Локальная разработка (если нужно)
  local: {
    rpcUrl: "http://localhost:8547",
    apiUrl: "http://localhost:3001/api",
    chainId: 7777,
    networkName: "ZUZCOIN ProofChain (Local)",
    explorer: null,
    currency: "ETH",
    testnet: true
  }
};

// Получить конфигурацию по умолчанию
const getCurrentConfig = () => {
  // По умолчанию используем Polygon Mumbai
  return BLOCKCHAIN_CONFIG.polygonMumbai;
};

// Получить конфигурацию для web3
const getWeb3Config = () => {
  const config = getCurrentConfig();
  return {
    web3RpcUrl: config.rpcUrl,
    apiBaseUrl: config.apiUrl,
    networkName: config.networkName,
    chainId: config.chainId
  };
};

module.exports = { 
  BLOCKCHAIN_CONFIG, 
  getCurrentConfig, 
  getWeb3Config 
};
