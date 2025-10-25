const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying MedSynapseConsent contract...");
  
  // Get the contract factory
  const MedSynapseConsent = await ethers.getContractFactory("MedSynapseConsent");
  
  // Deploy the contract
  const medSynapseConsent = await MedSynapseConsent.deploy();
  
  // Wait for deployment to complete
  await medSynapseConsent.waitForDeployment();
  
  const consentAddress = await medSynapseConsent.getAddress();
  
  console.log("✅ MedSynapseConsent deployed to:", consentAddress);
  console.log("📊 Contract Details:");
  console.log("  - Token Rewards: Enabled");
  console.log("  - Fee Percentage: 5%");
  console.log("  - Token Integration: Ready");
  
  // Verify deployment
  const feePercentage = await medSynapseConsent.feePercentage();
  const tokenRewardsEnabled = await medSynapseConsent.tokenRewardsEnabled();
  
  console.log("🔍 Verification:");
  console.log(`  - Fee Percentage: ${feePercentage}%`);
  console.log(`  - Token Rewards Enabled: ${tokenRewardsEnabled}`);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Deploy MedSynapse Token contract");
  console.log("2. Set token address in this contract");
  console.log("3. Update frontend configuration");
  
  return consentAddress;
}

main()
  .then((consentAddress) => {
    console.log(`\n🎉 Consent contract deployment completed! Address: ${consentAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
