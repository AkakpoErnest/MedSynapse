const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting MedSynapseToken deployment to Sepolia...");

  const signers = await ethers.getSigners();
  console.log("🔍 Found signers:", signers.length);
  
  if (signers.length === 0) {
    console.log("❌ No signers found. Check your private key configuration.");
    return;
  }
  
  const [deployer] = signers;
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Wallet balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ Insufficient balance. Please add Sepolia ETH to your wallet.");
    console.log("🔗 Get test Sepolia ETH from: https://sepoliafaucet.com/");
    return;
  }

  // Deploy MedSynapseToken
  console.log("📝 Deploying MedSynapseToken contract to Sepolia...");
  const MedSynapseToken = await ethers.getContractFactory("MedSynapseToken");
  const medSynapseToken = await MedSynapseToken.deploy();
  await medSynapseToken.waitForDeployment();
  
  const tokenAddress = await medSynapseToken.getAddress();
  console.log("✅ MedSynapseToken deployed successfully!");
  console.log("📍 Token Address:", tokenAddress);
  console.log("🔗 Sepolia Explorer:", `https://sepolia.etherscan.io/address/${tokenAddress}`);
  
  // Get token info
  const name = await medSynapseToken.name();
  const symbol = await medSynapseToken.symbol();
  const totalSupply = await medSynapseToken.totalSupply();
  
  console.log("📊 Token Info:");
  console.log("  Name:", name);
  console.log("  Symbol:", symbol);
  console.log("  Total Supply:", ethers.formatEther(totalSupply), "MED");
  
  const deploymentInfo = {
    tokenAddress: tokenAddress,
    network: "sepolia",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    tokenName: name,
    tokenSymbol: symbol,
    totalSupply: totalSupply.toString()
  };
  
  console.log("📋 Deployment Info:", JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🔗 Next steps:");
  console.log("1. Link token to consent contract using setConsentContract()");
  console.log("2. Update MedSynapseConsent contract with setMedSynapseToken()");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

