const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying ZUZIM DEX to Sepolia...");
  
  // Конфигурация
  const config = {
    ZUZ_TOKEN: "0x4284ecC7E6E560cAfc0bA65CbDFc9c19bd2C0bD3",
    WETH_SEPOLIA: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    PHILANTHROPY_WALLET: "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0",
    RPC_URL: process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia.publicnode.com",
    PRIVATE_KEY: process.env.PRIVATE_KEY
  };
  
  if (!config.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not found in .env file");
    console.log("Please create .env file with:");
    console.log("PRIVATE_KEY=your_private_key_here");
    console.log("SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com");
    return;
  }
  
  try {
    // Подключаемся к сети
    const provider = new ethers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
    
    console.log(`Deployer: ${wallet.address}`);
    console.log(`Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} ETH`);
    
    // Читаем контракт
    const contractSource = fs.readFileSync("contracts/ZUZIMDEX.sol", "utf8");
    console.log("📜 Contract source loaded");
    
    // Для демо - используем заранее скомпилированный байткод
    // В реальности нужно было бы компилировать через solc
    console.log("⚠️  For demo: Using mock deployment");
    
    // Создаем мок адрес для демо
    const mockDexAddress = "0x" + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    console.log(`✅ Mock DEX deployed to: ${mockDexAddress}`);
    
    // Создаем конфигурационный файл
    const deploymentConfig = {
      network: "sepolia",
      dexAddress: mockDexAddress,
      zuzToken: config.ZUZ_TOKEN,
      wethAddress: config.WETH_SEPOLIA,
      philanthropyWallet: config.PHILANTHROPY_WALLET,
      deployer: wallet.address,
      deploymentTime: new Date().toISOString(),
      note: "Mock deployment for demo. Use Hardhat for real deployment."
    };
    
    fs.writeFileSync("dex-config.json", JSON.stringify(deploymentConfig, null, 2));
    
    // Создаем простой ABI для фронтенда
    const simpleABI = [
      "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired) external returns (uint256 liquidity)",
      "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity) external returns (uint256 amountA, uint256 amountB)",
      "function swap(address tokenIn, address tokenOut, uint256 amountIn) external returns (uint256 amountOut)",
      "function getPrice(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256 amountOut)",
      "function getPoolInfo(address tokenA, address tokenB) external view returns (uint256 reserveA, uint256 reserveB, uint256 totalLiquidity)",
      "function getUserLiquidity(address tokenA, address tokenB, address user) external view returns (uint256)",
      "event PoolCreated(address indexed tokenA, address indexed tokenB, bytes32 poolId)",
      "event LiquidityAdded(address indexed user, bytes32 indexed poolId, uint256 amountA, uint256 amountB, uint256 liquidity)",
      "event Swap(address indexed user, bytes32 indexed poolId, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut)"
    ];
    
    fs.writeFileSync("dex-abi.json", JSON.stringify(simpleABI, null, 2));
    
    console.log("\n🎉 Mock Deployment Complete!");
    console.log("=================================");
    console.log(`DEX Address: ${mockDexAddress}`);
    console.log(`ZUZ Token: ${config.ZUZ_TOKEN}`);
    console.log(`WETH Address: ${config.WETH_SEPOLIA}`);
    console.log("=================================");
    console.log("\n📁 Files created:");
    console.log("• dex-config.json - Deployment configuration");
    console.log("• dex-abi.json - Contract ABI for frontend");
    console.log("\n⚠️  Note: This is a mock deployment.");
    console.log("For real deployment, use Hardhat with:");
    console.log("1. npx hardhat compile");
    console.log("2. npx hardhat run scripts/deployDEX.js --network sepolia");
    
  } catch (error) {
    console.error("❌ Deployment error:", error.message);
  }
}

main();
