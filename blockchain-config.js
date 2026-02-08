// ZUZIM Universe - Blockchain Configuration
const BLOCKCHAIN_CONFIG = {
  networks: {
    sepolia: {
      chainId: '0xaa36a7', // 11155111
      chainName: 'Sepolia Testnet',
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
      nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'ETH',
        decimals: 18
      }
    }
  },
  
  contracts: {
    zuzToken: {
      address: '0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3',
      abi: [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function transferFrom(address from, address to, uint256 amount) returns (bool)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
        "event Approval(address indexed owner, address indexed spender, uint256 value)"
      ]
    }
  }
};

// Функция для подключения к Sepolia
async function connectToSepolia() {
  if (window.ethereum) {
    try {
      // Запрашиваем подключение к аккаунту
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Переключаем на Sepolia если нужно
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BLOCKCHAIN_CONFIG.networks.sepolia.chainId }],
        });
      } catch (switchError) {
        // Если сеть не добавлена, добавляем
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BLOCKCHAIN_CONFIG.networks.sepolia],
          });
        }
      }
      
      return accounts[0];
    } catch (error) {
      console.error('Connection error:', error);
      return null;
    }
  }
  return null;
}

// Функция для получения баланса ZUZ
async function getZUZBalance(walletAddress) {
  if (!window.ethereum) return '0';
  
  // Здесь будет реальное взаимодействие с контрактом
  // Пока возвращаем mock данные
  return '1000000';
}

// Экспортируем конфигурацию
window.BLOCKCHAIN_CONFIG = BLOCKCHAIN_CONFIG;
window.connectToSepolia = connectToSepolia;
window.getZUZBalance = getZUZBalance;

console.log('✅ ZUZIM Blockchain config loaded');
