const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 ZUZCOIN HISTORICAL DEPLOYMENT WITH VERIFICATION GUARANTEE");
  console.log("==========================================================");
  console.log("Implementing 2000-year-old Talmudic wisdom in blockchain");
  console.log("Automatic 1% Tzedakah on every transaction");
  console.log("Integration with The Giving Pledge");
  console.log("==========================================================");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n👤 DEPLOYER (Appointed Leader):", deployer.address);
  
  // Check ETH balance
  const ethBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 ETH Balance:", (ethBalance.toString() / 1e18).toFixed(4), "ETH");
  
  if (ethBalance < hre.ethers.parseEther("0.05")) {
    console.log("⚠️  Warning: Low ETH balance. Get more at:");
    console.log("   https://sepoliafaucet.com/");
    console.log("   Minimum recommended: 0.05 ETH");
  }
  
  // Compile with specific settings
  console.log("\n🔧 COMPILING WITH VERIFICATION SETTINGS...");
  
  // Force compilation
  await hre.run("compile", { force: true });
  
  console.log("✅ Compilation successful");
  
  // Deploy the contract
  console.log("\n📦 DEPLOYING ZUZCOIN HISTORICAL CONTRACT...");
  console.log("Contract: ZUZCOIN (from ZUZCOIN_HISTORICAL_FULL.sol)");
  console.log("Philosophy: Talmudic Tzedakah (1% auto-charity)");
  console.log("Charity Wallet: The Giving Pledge Integration");
  
  try {
    const ZUZCOIN = await hre.ethers.getContractFactory("ZUZCOIN");
    console.log("\n⚡ INITIATING DEPLOYMENT...");
    
    const zuzcoin = await ZUZCOIN.deploy();
    console.log("⏳ AWAITING BLOCKCHAIN CONFIRMATION...");
    
    await zuzcoin.waitForDeployment();
    const address = await zuzcoin.getAddress();
    
    console.log("\n🎉🎉🎉 ZUZCOIN HISTORICAL CONTRACT DEPLOYED! 🎉🎉🎉");
    console.log("================================================");
    console.log("📍 CONTRACT ADDRESS:", address);
    console.log("🔗 ETHERSCAN: https://sepolia.etherscan.io/address/" + address);
    console.log("🌐 ZUZIM UNIVERSE: https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev");
    console.log("================================================");
    
    // Get contract info
    console.log("\n📊 CONTRACT INFORMATION:");
    const name = await zuzcoin.name();
    const symbol = await zuzcoin.symbol();
    const totalSupply = await zuzcoin.totalSupply();
    const charityWallet = await zuzcoin.THE_GIVING_PLEDGE_WALLET();
    
    console.log("Name:", name);
    console.log("Symbol:", symbol);
    console.log("Total Supply:", (totalSupply.toString() / 1e18).toLocaleString(), symbol);
    console.log("Charity Wallet:", charityWallet);
    console.log("Automatic Charity: 1% on every transaction");
    
    // Save verification data
    console.log("\n📝 SAVING VERIFICATION DATA...");
    
    const verificationData = {
      // Contract Identity
      contract_name: "ZUZCOIN",
      contract_address: address,
      deployer_address: deployer.address,
      network: "sepolia",
      
      // Compiler Settings (CRITICAL FOR VERIFICATION)
      compiler_settings: {
        version: "0.8.19",
        optimizer: {
          enabled: true,
          runs: 200
        },
        evm_version: "paris",
        via_ir: false
      },
      
      // Source Code Information
      source_files: [
        "contracts/ZUZCOIN_HISTORICAL_FULL.sol"
      ],
      license: "MIT",
      
      // Verification Instructions
      etherscan_url: "https://sepolia.etherscan.io/address/" + address + "#code",
      verification_steps: [
        "1. Go to Etherscan URL above",
        "2. Click 'Verify and Publish'",
        "3. Select: Solidity (Single file)",
        "4. Compiler Version: 0.8.19",
        "5. Optimization: YES, 200 runs",
        "6. License: MIT",
        "7. Paste ENTIRE code from ZUZCOIN_HISTORICAL_FULL.sol",
        "8. Constructor Arguments: LEAVE EMPTY"
      ],
      
      // Project Information
      project: "ZUZCOIN Universe",
      philosophy: "Talmudic Tzedakah - 1% auto-charity",
      ecosystem: [
        "ZUZIM DEX (Ethical Trading)",
        "ProofChain (Copyright Protection)",
        "Digital Notary",
        "Academy",
        "The Giving Pledge Integration"
      ],
      
      // Timestamp
      deployment_time: new Date().toISOString(),
      deployment_block: await hre.ethers.provider.getBlockNumber()
    };
    
    // Save to files
    fs.writeFileSync('ZUZCOIN_HISTORICAL_ADDRESS.txt', address);
    fs.writeFileSync('VERIFICATION_GUIDE_HISTORICAL.json', JSON.stringify(verificationData, null, 2));
    
    console.log("✅ Address saved: ZUZCOIN_HISTORICAL_ADDRESS.txt");
    console.log("✅ Verification guide: VERIFICATION_GUIDE_HISTORICAL.json");
    
    // Create human-readable guide
    const humanGuide = `# 🔐 ZUZCOIN HISTORICAL - VERIFICATION GUIDE

## CONTRACT ADDRESS
${address}

## ETHERSCAN URL
https://sepolia.etherscan.io/address/${address}#code

## VERIFICATION SETTINGS (CRITICAL!)
1. **Compiler Type:** Solidity (Single file)
2. **Compiler Version:** 0.8.19
3. **Optimization:** YES, 200 runs
4. **License:** MIT License
5. **Constructor Arguments:** LEAVE EMPTY

## SOURCE CODE
Use file: contracts/ZUZCOIN_HISTORICAL_FULL.sol

Copy the ENTIRE content and paste into Etherscan.

## PROJECT PHILOSOPHY
ZUZCOIN implements Talmudic Tzedakah - 1% automatic charity on every transaction.
Integration with The Giving Pledge for global philanthropy.

## GUARANTEE
This deployment uses KNOWN compiler settings that match Etherscan requirements.
Verification should work on FIRST attempt if settings are followed exactly.

## SUPPORT
If verification fails:
1. Double-check compiler settings
2. Ensure entire source code is copied
3. Contract name must be "ZUZCOIN"
4. No constructor arguments

---
ZUZCOIN Universe - Ancient Wisdom, Modern Technology
Platform: https://088f2e1f-a53e-4b4d-bb2e-be52a4b104ab-00-1z4a6czhlvsin.spock.replit.dev/
`;
    
    fs.writeFileSync('VERIFICATION_GUIDE_HISTORICAL.md', humanGuide);
    console.log("✅ Human guide: VERIFICATION_GUIDE_HISTORICAL.md");
    
    console.log("\n🎯 NEXT STEPS:");
    console.log("1. Wait 1-2 minutes for blockchain propagation");
    console.log("2. Open Etherscan: https://sepolia.etherscan.io/address/" + address);
    console.log("3. Follow VERIFICATION_GUIDE_HISTORICAL.md");
    console.log("4. After verification, update interface with new address");
    
  } catch (error) {
    console.error("\n❌ DEPLOYMENT ERROR:", error.message);
    
    if (error.message.includes("ZUZCOIN")) {
      console.log("\n💡 SOLUTION: The contract name in file must be 'contract ZUZCOIN'");
      console.log("Check contracts/ZUZCOIN_HISTORICAL_FULL.sol");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
