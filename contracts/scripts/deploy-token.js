const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying MedSynapse Token...");
  
  // Get the contract factory
  const MedSynapseToken = await ethers.getContractFactory("MedSynapseToken");
  
  // Deploy the contract
  const medSynapseToken = await MedSynapseToken.deploy();
  
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
  
  console.log("\n📝 Next Steps:");
  console.log("1. Deploy MedSynapseConsent contract");
  console.log("2. Set token address in consent contract");
  console.log("3. Update frontend configuration");
  
  return tokenAddress;
}

main()
  .then((tokenAddress) => {
    console.log(`\n🎉 Token deployment completed! Address: ${tokenAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
