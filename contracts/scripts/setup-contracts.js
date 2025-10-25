const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Setting up MedSynapse contracts...");
  
  // Get deployed contracts
  const tokenAddress = process.env.MEDSYNAPSE_TOKEN_ADDRESS;
  const consentAddress = process.env.MEDSYNAPSE_CONSENT_ADDRESS;
  
  if (!tokenAddress || !consentAddress) {
    console.error("❌ Please set MEDSYNAPSE_TOKEN_ADDRESS and MEDSYNAPSE_CONSENT_ADDRESS environment variables");
    process.exit(1);
  }
  
  console.log("📋 Contract Addresses:");
  console.log(`  - Token: ${tokenAddress}`);
  console.log(`  - Consent: ${consentAddress}`);
  
  // Get contract instances
  const MedSynapseConsent = await ethers.getContractFactory("MedSynapseConsent");
  const consentContract = MedSynapseConsent.attach(consentAddress);
  
  const MedSynapseToken = await ethers.getContractFactory("MedSynapseToken");
  const tokenContract = MedSynapseToken.attach(tokenAddress);
  
  console.log("\n🔗 Connecting contracts...");
  
  // Set token address in consent contract
  console.log("Setting token address in consent contract...");
  const setTokenTx = await consentContract.setMedSynapseToken(tokenAddress);
  await setTokenTx.wait();
  console.log("✅ Token address set in consent contract");
  
  // Set consent contract address in token contract
  console.log("Setting consent contract address in token contract...");
  const setConsentTx = await tokenContract.setConsentContract(consentAddress);
  await setConsentTx.wait();
  console.log("✅ Consent contract address set in token contract");
  
  // Verify the connection
  console.log("\n🔍 Verifying connection...");
  const tokenInConsent = await consentContract.getTokenAddress();
  const consentInToken = await tokenContract.medSynapseConsentContract();
  
  console.log(`Token address in consent contract: ${tokenInConsent}`);
  console.log(`Consent address in token contract: ${consentInToken}`);
  
  if (tokenInConsent.toLowerCase() === tokenAddress.toLowerCase() && 
      consentInToken.toLowerCase() === consentAddress.toLowerCase()) {
    console.log("✅ Contracts successfully connected!");
  } else {
    console.log("❌ Contract connection verification failed");
    process.exit(1);
  }
  
  console.log("\n📊 Contract Status:");
  console.log("  - Token rewards: Enabled");
  console.log("  - Automatic minting: 10 MED per contribution");
  console.log("  - Contract integration: Complete");
  
  console.log("\n🎉 Setup completed successfully!");
  console.log("\n📝 Next Steps:");
  console.log("1. Update frontend .env with new contract addresses");
  console.log("2. Add AI dashboard to app routes");
  console.log("3. Test the complete system");
}

main()
  .then(() => {
    console.log("\n🚀 MedSynapse platform is ready!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
