// Main deployment script for ZUZIM DEX
async function main() {
  console.log("=".repeat(60));
  console.log("🚀 ZUZIM DEX - MAIN DEPLOYMENT SCRIPT");
  console.log("=".repeat(60));
  
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);
  console.log("💰 Balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");
  
  // 1. Deploy ZUZIM DEX
  console.log("\n📦 Deploying ZUZIM DEX contract...");
  const ZUZIMDEX = await ethers.getContractFactory("ZUZIMDEX");
  const dex = await ZUZIMDEX.deploy();
  await dex.waitForDeployment();
  
  const dexAddress = await dex.getAddress();
  console.log("✅ ZUZIM DEX deployed to:", dexAddress);
  
  // 2. Contract addresses
  const ZUZ_TOKEN = "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31";
  const WETH_SEPOLIA = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  
  // 3. Create ZUZ/ETH pool
  console.log("\n🏊 Creating ZUZ/ETH liquidity pool...");
  try {
    const createPoolTx = await dex.createPool(ZUZ_TOKEN, WETH_SEPOLIA);
    await createPoolTx.wait();
    console.log("✅ ZUZ/ETH pool created!");
    console.log("   Transaction hash:", createPoolTx.hash);
  } catch (error) {
    console.log("⚠️  Note: Pool might already exist or check addresses");
    console.log("   Error:", error.message);
  }
  
  // 4. Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contract: "ZUZIMDEX",
    address: dexAddress,
    deployer: deployer.address,
    zuzToken: ZUZ_TOKEN,
    weth: WETH_SEPOLIA,
    deploymentTime: new Date().toISOString(),
    steps: [
      "1. DEX contract deployed successfully",
      "2. ZUZ/ETH pool created (if addresses are valid)",
      "3. Update frontend with contract address"
    ]
  };
  
  const fs = require("fs");
  fs.writeFileSync(
    "deployment-final.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // 5. Update dex-config.json for frontend
  const dexConfig = {
    network: "sepolia",
    dexAddress: dexAddress,
    zuzToken: ZUZ_TOKEN,
    wethAddress: WETH_SEPOLIA,
    philanthropyWallet: "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0",
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    note: "Real deployment - update frontend to use this address"
  };
  
  fs.writeFileSync("dex-config.json", JSON.stringify(dexConfig, null, 2));
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  
  console.log("\n📊 Deployment Summary:");
  console.log("   Contract: ZUZIMDEX");
  console.log("   Address:", dexAddress);
  console.log("   Network:", hre.network.name);
  console.log("   Deployer:", deployer.address);
  
  console.log("\n📁 Generated files:");
  console.log("   • deployment-final.json");
  console.log("   • dex-config.json");
  
  console.log("\n🌐 Next steps:");
  console.log("   1. Update DEX frontend with contract address");
  console.log("   2. Test the DEX: http://localhost:3000/dex");
  console.log("   3. Add initial liquidity to the pool");
  
  console.log("\n💡 Verify on Sepolia Etherscan:");
  console.log("   https://sepolia.etherscan.io/address/" + dexAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
