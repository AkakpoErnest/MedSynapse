const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying MedSynapse Token with optimized gas...");
  
  // Get the contract factory
  const MedSynapseToken = await ethers.getContractFactory("MedSynapseToken");
  
  // Estimate gas first
  console.log("⛽ Estimating gas...");
  const estimatedGas = await MedSynapseToken.getDeployTransaction().then(tx => 
    ethers.provider.estimateGas(tx)
  );
  
  console.log(`📊 Estimated gas: ${estimatedGas.toString()}`);
  
  // Calculate estimated cost
  const gasPrice = ethers.parseUnits("25", "gwei"); // 25 gwei
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`💰 Estimated cost: ${ethers.formatEther(estimatedCost)} MATIC`);
  
  // Check balance
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💳 Current balance: ${ethers.formatEther(balance)} MATIC`);
  
  if (balance < estimatedCost) {
    console.log("❌ Insufficient funds for deployment");
    console.log(`   Need: ${ethers.formatEther(estimatedCost)} MATIC`);
    console.log(`   Have: ${ethers.formatEther(balance)} MATIC`);
    console.log(`   Shortfall: ${ethers.formatEther(estimatedCost - balance)} MATIC`);
    return;
  }
  
  // Deploy with optimized gas
  console.log("🚀 Deploying contract...");
  const medSynapseToken = await MedSynapseToken.deploy({
    gasLimit: estimatedGas + ethers.parseUnits("100000", "wei"), // Add small buffer
    gasPrice: gasPrice
  });
  
  // Wait for deployment to complete
  await medSynapseToken.waitForDeployment();
  
  const tokenAddress = await medSynapseToken.getAddress();
  
  console.log("✅ MedSynapse Token deployed to:", tokenAddress);
  console.log("📊 Token Details:");
  console.log("  - Name: MedSynapse Token");
  console.log("  - Symbol: MED");
  console.log("  - Initial Supply: 1,000,000 MED");
  console.log("  - Reward per Contribution: 10 MED");
  
  // Verify deployment
  const name = await medSynapseToken.name();
  const symbol = await medSynapseToken.symbol();
  const totalSupply = await medSynapseToken.totalSupply();
  
  console.log("🔍 Verification:");
  console.log(`  - Name: ${name}`);
  console.log(`  - Symbol: ${symbol}`);
  console.log(`  - Total Supply: ${ethers.formatEther(totalSupply)} MED`);
  
  return tokenAddress;
}

main()
  .then((tokenAddress) => {
    if (tokenAddress) {
      console.log(`\n🎉 Token deployment completed! Address: ${tokenAddress}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
