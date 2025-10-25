const { ethers } = require("hardhat");

async function main() {
  console.log("💰 Checking wallet balance...");
  
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);
  
  console.log("📊 Wallet Info:");
  console.log(`  - Address: ${deployer.address}`);
  console.log(`  - Balance: ${ethers.formatEther(balance)} MATIC`);
  console.log(`  - Balance (Wei): ${balance.toString()}`);
  
  // Check if we have enough for deployment
  const estimatedGasCost = ethers.parseEther("0.1"); // Rough estimate
  const hasEnoughFunds = balance >= estimatedGasCost;
  
  console.log(`\n🔍 Deployment Check:`);
  console.log(`  - Estimated gas cost: ${ethers.formatEther(estimatedGasCost)} MATIC`);
  console.log(`  - Has enough funds: ${hasEnoughFunds ? '✅ Yes' : '❌ No'}`);
  
  if (!hasEnoughFunds) {
    console.log(`\n💡 Get testnet MATIC from:`);
    console.log(`  - Polygon Faucet: https://faucet.polygon.technology/`);
    console.log(`  - Alchemy Faucet: https://www.alchemy.com/faucets/polygon-amoy`);
    console.log(`  - Chainlink Faucet: https://faucets.chain.link/amoy`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
