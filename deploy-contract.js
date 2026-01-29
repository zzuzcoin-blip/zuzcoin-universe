const Web3 = require("web3");
const fs = require("fs");

const web3 = new Web3("https://polygon-mumbai.g.alchemy.com/v2/demo");

async function deploy() {
    try {
        console.log("🚀 Starting ZUZCOIN contract deployment...");

        // === YOUR PRIVATE KEY ===
        const privateKey =
            "4e27f91168286572c9e0d64c090ce163adc70bf3340367bfad3bde14f3c53f3a";
        // ========================

        const account = web3.eth.accounts.privateKeyToAccount(
            "0x" + privateKey,
        );
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;

        console.log("👛 Deployer address:", account.address);

        const balance = await web3.eth.getBalance(account.address);
        console.log(
            "💰 MATIC Balance:",
            web3.utils.fromWei(balance, "ether"),
            "MATIC",
        );

        if (Number(web3.utils.fromWei(balance, "ether")) < 0.01) {
            console.log("⚠️  Low MATIC for gas. Get test MATIC:");
            console.log("🔗 https://faucet.polygon.technology/");
            process.exit(1);
        }

        const contractData = JSON.parse(
            fs.readFileSync("ZUZCOIN.json", "utf8"),
        );
        console.log("📄 Loaded ABI with", contractData.abi.length, "items");

        const contract = new web3.eth.Contract(contractData.abi);
        const charityWallet = account.address;

        const deployment = contract.deploy({
            data: contractData.bytecode,
            arguments: [charityWallet],
        });

        const gasEstimate = await deployment.estimateGas({
            from: account.address,
        });
        console.log("⛽ Gas estimate:", gasEstimate);

        const gasPrice = await web3.eth.getGasPrice();
        console.log(
            "⛽ Gas price:",
            web3.utils.fromWei(gasPrice, "gwei"),
            "Gwei",
        );

        console.log("⏳ Sending transaction...");
        const tx = await deployment.send({
            from: account.address,
            gas: Math.floor(gasEstimate * 1.2),
            gasPrice: gasPrice,
        });

        console.log("\n🎉🎉🎉 CONTRACT DEPLOYED SUCCESSFULLY! 🎉🎉🎉");
        console.log("============================================");
        console.log("📄 Contract address:", tx.options.address);
        console.log(
            "🔗 Explorer: https://mumbai.polygonscan.com/address/" +
                tx.options.address,
        );
        console.log("📝 TX Hash:", tx.transactionHash);
        console.log("💎 Block:", tx.blockNumber);

        fs.writeFileSync("contract-address.txt", tx.options.address);
        console.log("\n💾 Contract address saved to contract-address.txt");

        console.log("\n✅ Done! Add token to MetaMask:");
        console.log("1. Open MetaMask");
        console.log('2. Click "Import tokens"');
        console.log("3. Paste address:", tx.options.address);
        console.log("4. Symbol: ZUZ, Decimals: 18");
        console.log("5. You will have 1,000,000 ZUZ!");
    } catch (error) {
        console.error("\n❌ DEPLOY ERROR:", error.message);
        if (error.message.includes("insufficient funds")) {
            console.log(
                "💡 Get more MATIC: https://faucet.polygon.technology/",
            );
        }
    }
}

deploy();
