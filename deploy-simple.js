const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deploy() {
    console.log("=".repeat(70));
    console.log("🚀 SIMPLE DEX DEPLOYMENT - NO DEPENDENCIES");
    console.log("=".repeat(70));
    
    // Конфигурация
    const RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia.publicnode.com";
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    
    if (!PRIVATE_KEY) {
        console.error("❌ ERROR: PRIVATE_KEY not found in .env");
        console.log("Add to .env: PRIVATE_KEY=0xYourPrivateKey");
        return;
    }
    
    console.log("📡 Connecting to Sepolia...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log("👤 Deployer:", wallet.address);
    console.log("💰 Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");
    
    // Проверяем что есть артефакты
    if (!fs.existsSync("artifacts/contracts/SimpleDEX.sol/SimpleDEX.json")) {
        console.error("❌ Contract not compiled!");
        console.log("Run: npx hardhat compile");
        return;
    }
    
    // Загружаем артефакт
    const artifact = JSON.parse(fs.readFileSync("artifacts/contracts/SimpleDEX.sol/SimpleDEX.json", "utf8"));
    
    console.log("\n📦 Deploying SimpleDEX contract...");
    console.log("   Bytecode length:", artifact.bytecode.length, "characters");
    
    try {
        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
        const contract = await factory.deploy();
        await contract.waitForDeployment();
        
        const address = await contract.getAddress();
        console.log("✅ SimpleDEX deployed to:", address);
        console.log("   TX:", contract.deploymentTransaction().hash);
        
        // Сохраняем конфигурацию
        const dexConfig = {
            network: "sepolia",
            dexAddress: address,
            zuzToken: "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31",
            philanthropyWallet: "0x742d35Cc6634C0532925a3b844Bc9e768C4E33A0",
            deployer: wallet.address,
            deploymentTime: new Date().toISOString(),
            contract: "SimpleDEX",
            abi: artifact.abi
        };
        
        fs.writeFileSync("dex-config.json", JSON.stringify(dexConfig, null, 2));
        console.log("📁 Config saved to dex-config.json");
        
        // Сохраняем ABI отдельно
        fs.writeFileSync("dex-abi.json", JSON.stringify(artifact.abi, null, 2));
        console.log("📄 ABI saved to dex-abi.json");
        
        console.log("\n" + "=".repeat(70));
        console.log("🎉 DEPLOYMENT SUCCESSFUL!");
        console.log("=".repeat(70));
        
        console.log("\n📊 Contract Info:");
        console.log("   Address:", address);
        console.log("   Deployer:", wallet.address);
        console.log("   Network: Sepolia");
        console.log("   Functions: addLiquidity, removeLiquidity, buyZUZ, sellZUZ");
        
        console.log("\n🌐 Etherscan:");
        console.log("   https://sepolia.etherscan.io/address/" + address);
        
        console.log("\n🚀 Next Steps:");
        console.log("   1. DEX interface will auto-update");
        console.log("   2. Open: http://localhost:3000/dex");
        console.log("   3. Add initial liquidity");
        
    } catch (error) {
        console.error("\n❌ DEPLOYMENT FAILED:");
        console.error("   Error:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Get ETH from: https://sepoliafaucet.com");
            console.log("   Send to:", wallet.address);
        }
    }
}

deploy();
