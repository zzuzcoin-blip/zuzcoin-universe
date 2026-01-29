const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function deploy() {
    console.log("=".repeat(70));
    console.log("🚀 QUICK DEPLOY - MINIMAL CONTRACT");
    console.log("=".repeat(70));
    
    const RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia.publicnode.com";
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    
    if (!PRIVATE_KEY) {
        console.error("❌ No private key in .env");
        return;
    }
    
    console.log("📡 Connecting...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log("👤 Deployer:", wallet.address);
    console.log("💰 Balance:", ethers.formatEther(await provider.getBalance(wallet.address)), "ETH");
    
    // Проверяем какие контракты скомпилированы
    let artifactPath, contractName;
    
    if (fs.existsSync("artifacts/contracts/SimpleDEX.sol/SimpleDEX.json")) {
        artifactPath = "artifacts/contracts/SimpleDEX.sol/SimpleDEX.json";
        contractName = "SimpleDEX";
    } else if (fs.existsSync("artifacts/contracts/MiniDEX.sol/MiniDEX.json")) {
        artifactPath = "artifacts/contracts/MiniDEX.sol/MiniDEX.json";
        contractName = "MiniDEX";
    } else {
        console.error("❌ No compiled contracts found!");
        console.log("Run: npx hardhat compile");
        return;
    }
    
    console.log(`\n📦 Deploying ${contractName}...`);
    
    try {
        const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
        const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
        const contract = await factory.deploy();
        await contract.waitForDeployment();
        
        const address = await contract.getAddress();
        console.log("✅ Contract deployed to:", address);
        console.log("   TX:", contract.deploymentTransaction().hash);
        
        // Сохраняем конфигурацию
        const config = {
            network: "sepolia",
            contractAddress: address,
            contractName: contractName,
            deployer: wallet.address,
            deploymentTime: new Date().toISOString(),
            abi: artifact.abi
        };
        
        fs.writeFileSync("deployment.json", JSON.stringify(config, null, 2));
        fs.writeFileSync("dex-config.json", JSON.stringify({
            network: "sepolia",
            dexAddress: address,
            zuzToken: "0x5B9d42EcAf7498771cC4edF728d3Dc3cc1f87C31",
            deployer: wallet.address,
            timestamp: new Date().toISOString()
        }, null, 2));
        
        console.log("\n" + "=".repeat(70));
        console.log("🎉 SUCCESS! Contract deployed to Sepolia");
        console.log("=".repeat(70));
        
        console.log("\n📊 Details:");
        console.log("   Contract:", address);
        console.log("   Name:", contractName);
        console.log("   Network: Sepolia");
        console.log("   Explorer: https://sepolia.etherscan.io/address/" + address);
        
        console.log("\n🚀 Next:");
        console.log("   1. DEX interface will auto-update");
        console.log("   2. Open: http://localhost:3000");
        console.log("   3. Test the DEX!");
        
    } catch (error) {
        console.error("\n❌ Deployment failed:", error.message);
        
        if (error.message.includes("insufficient funds")) {
            console.log("\n💡 Get more ETH from: https://sepoliafaucet.com");
        }
    }
}

deploy();
