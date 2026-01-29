// Real deployment script for Hardhat
// Run with: npx hardhat run scripts/deploy-with-hardhat.js --network sepolia

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting ZUZIM DEX deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy ZUZIM DEX contract
  console.log("📦 Deploying ZUZIMDEX contract...");
  const ZUZIMDEX = await hre.ethers.getContractFactory("ZUZIMDEX");
  const dex = await ZUZIMDEX.deploy();
  
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  
  console.log("✅ ZUZIM DEX deployed to:", dexAddress);
  
  // Contract configuration
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  const WETH_SEPOLIA = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  
  console.log("🏊 Creating ZUZ/ETH liquidity pool...");
  const createPoolTx = await dex.createPool(ZUZ_TOKEN, WETH_SEPOLIA);
  await createPoolTx.wait();
  
  console.log("✅ ZUZ/ETH pool created!");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "ZUZIMDEX",
    address: dexAddress,
    deployer: deployer.address,
    zuzToken: ZUZ_TOKEN,
    weth: WETH_SEPOLIA,
    transactionHash: createPoolTx.hash,
    timestamp: new Date().toISOString()
  };
  
  const fs = require("fs");
  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Update dex-config.json for frontend
  const dexConfig = {
    network: "sepolia",
    dexAddress: dexAddress,
    zuzToken: ZUZ_TOKEN,
    wethAddress: WETH_SEPOLIA,
    philanthropyWallet: "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0",
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    note: "Real deployment on Sepolia"
  };
  
  fs.writeFileSync("dex-config.json", JSON.stringify(dexConfig, null, 2));
  
  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(50));
  console.log("Contract:", dexAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("=".repeat(50));
  
  console.log("\n📁 Generated files:");
  console.log("• deployment-info.json");
  console.log("• dex-config.json");
  
  console.log("\n🌐 Frontend will use contract at:", dexAddress);
  console.log("   Update your DEX interface to use this address!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
