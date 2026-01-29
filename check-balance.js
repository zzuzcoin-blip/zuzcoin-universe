const { ethers } = require("ethers");
require("dotenv").config();

async function checkBalance() {
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("🔍 Checking balance for:", wallet.address);
    
    try {
        const balance = await provider.getBalance(wallet.address);
        const balanceEth = ethers.formatEther(balance);
        
        console.log("💰 Balance:", balanceEth, "ETH");
        
        if (parseFloat(balanceEth) < 0.01) {
            console.log("\n❌ INSUFFICIENT BALANCE FOR DEPLOYMENT");
            console.log("💡 Get test ETH from: https://sepoliafaucet.com");
            console.log("   Send to:", wallet.address);
        } else {
            console.log("\n✅ READY FOR DEPLOYMENT!");
            console.log("   Run: npm run deploy-real");
        }
        
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkBalance();
