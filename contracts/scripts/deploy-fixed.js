const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting MedSynapse contract deployment...");

  // Use Hardhat's network configuration
  const signers = await ethers.getSigners();
  console.log("🔍 Found signers:", signers.length);
  
  if (signers.length === 0) {
    console.log("❌ No signers found. Check your private key configuration.");
    return;
  }
  
  const [deployer] = signers;
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Wallet balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    console.log("❌ Insufficient balance. Please add MATIC to your wallet.");
    console.log("🔗 Get test MATIC from: https://faucet.polygon.technology/");
    return;
  }

  // Get the contract factory
  const MedSynapseConsent = await ethers.getContractFactory("MedSynapseConsent");
  
  console.log("📝 Deploying MedSynapseConsent contract...");
  
  // Deploy the contract
  const medSynapseConsent = await MedSynapseConsent.deploy();
  
  // Wait for deployment to complete
  await medSynapseConsent.waitForDeployment();
  
  // Get the deployed contract address
  const contractAddress = await medSynapseConsent.getAddress();
  
  console.log("✅ MedSynapseConsent deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Amoy Explorer:", `https://amoy.polygonscan.com/address/${contractAddress}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "amoy",
    timestamp: new Date().toISOString(),
    deployer: deployer.address
  };
  
  console.log("📋 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
  
  // Verify contract (optional)
  console.log("🔍 To verify contract, run:");
  console.log(`npx hardhat verify --network amoy ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
