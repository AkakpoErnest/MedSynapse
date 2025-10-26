const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Linking MedSynapseToken to MedSynapseConsent contract...");

  const TOKEN_ADDRESS = "0xb6F34abCfF466A26691161c867c9c82936F05f11"; // Deployed token
  const CONSENT_ADDRESS = "0xeaDEaAFE440283aEaC909CD58ec367735BfE712f"; // Deployed consent contract

  const signers = await ethers.getSigners();
  const [deployer] = signers;

  // Load contracts
  const MedSynapseToken = await ethers.getContractAt("MedSynapseToken", TOKEN_ADDRESS);
  const MedSynapseConsent = await ethers.getContractAt("MedSynapseConsent", CONSENT_ADDRESS);

  console.log("📝 Linking token to consent contract...");
  
  // Set consent contract address in token
  const tx1 = await MedSynapseToken.setConsentContract(CONSENT_ADDRESS);
  await tx1.wait();
  console.log("✅ Set consent contract in token:", tx1.hash);

  // Set token address in consent contract
  const tx2 = await MedSynapseConsent.setMedSynapseToken(TOKEN_ADDRESS);
  await tx2.wait();
  console.log("✅ Set token address in consent contract:", tx2.hash);

  console.log("\n✅ Token and consent contract are now linked!");
  console.log("📍 Token:", TOKEN_ADDRESS);
  console.log("📍 Consent:", CONSENT_ADDRESS);
  console.log("🔗 Transaction 1:", `https://sepolia.etherscan.io/tx/${tx1.hash}`);
  console.log("🔗 Transaction 2:", `https://sepolia.etherscan.io/tx/${tx2.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Linking failed:", error);
    process.exit(1);
  });

