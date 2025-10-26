const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking Sepolia balance...");

  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.blockpi.network/v1/rpc/public");
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.log("❌ No private key found in environment");
    return;
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);
  
  console.log("📍 Wallet Address:", wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("⚠️  No funds. Get Sepolia ETH from: https://sepoliafaucet.com/");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

