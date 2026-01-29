const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing ZUZCOIN philanthropy...");
  
  const [owner, user1, user2] = await hre.ethers.getSigners();
  
  // Deploy token
  const ZUZCOIN = await hre.ethers.getContractFactory("ZUZCOIN");
  const token = await ZUZCOIN.deploy(
    hre.ethers.parseUnits("1000000", 18),
    user2.address
  );
  await token.waitForDeployment();
  
  console.log("Token deployed:", await token.getAddress());
  
  // Test transfer
  const amount = hre.ethers.parseUnits("1000", 18);
  
  console.log("\nTesting 1% philanthropy on transfer...");
  console.log("Transferring 1000 ZUZ from owner to user1");
  
  const tx = await token.transfer(user1.address, amount);
  await tx.wait();
  
  const user1Balance = await token.balanceOf(user1.address);
  const philanthropyBalance = await token.balanceOf(user2.address);
  const totalDonated = await token.totalDonated();
  
  console.log("\n📊 Results:");
  console.log("User1 received:", hre.ethers.formatUnits(user1Balance, 18), "ZUZ");
  console.log("Philanthropy wallet:", hre.ethers.formatUnits(philanthropyBalance, 18), "ZUZ");
  console.log("Total donated:", hre.ethers.formatUnits(totalDonated, 18), "ZUZ");
  
  // Expected: 990 ZUZ to user1 (99%), 10 ZUZ to philanthropy (1%)
  const expectedToUser = hre.ethers.parseUnits("990", 18);
  const expectedDonation = hre.ethers.parseUnits("10", 18);
  
  if (user1Balance == expectedToUser && philanthropyBalance == expectedDonation) {
    console.log("\n✅ TEST PASSED! Philanthropy works correctly.");
  } else {
    console.log("\n❌ TEST FAILED!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
