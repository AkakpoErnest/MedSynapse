const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying MINIMAL MedSynapse Token...");
  
  const MedSynapseTokenMinimal = await ethers.getContractFactory("MedSynapseTokenMinimal");
  
  console.log("⛽ Estimating gas...");
  const estimatedGas = await MedSynapseTokenMinimal.getDeployTransaction().then(tx => 
    ethers.provider.estimateGas(tx)
  );
  
  const gasPrice = ethers.parseUnits("25", "gwei");
  const estimatedCost = estimatedGas * gasPrice;
  
  console.log(`📊 Gas: ${estimatedGas.toString()}`);
  console.log(`💰 Cost: ${ethers.formatEther(estimatedCost)} MATIC`);
  
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`💳 Balance: ${ethers.formatEther(balance)} MATIC`);
  
  if (balance < estimatedCost) {
    console.log("❌ Not enough MATIC");
    return;
  }
  
  console.log("🚀 Deploying...");
  const token = await MedSynapseTokenMinimal.deploy({
    gasLimit: estimatedGas + 50000,
    gasPrice: gasPrice
  });
  
  await token.waitForDeployment();
  const address = await token.getAddress();
  
  console.log("✅ DEPLOYED!");
  console.log(`📍 Address: ${address}`);
  console.log(`🏷️  Name: ${await token.name()}`);
  console.log(`🔤 Symbol: ${await token.symbol()}`);
  console.log(`📊 Supply: ${ethers.formatEther(await token.totalSupply())} MED`);
  
  return address;
}

main().then(addr => {
  if (addr) console.log(`\n🎉 SUCCESS! Token: ${addr}`);
  process.exit(0);
}).catch(err => {
  console.error("❌ FAILED:", err.message);
  process.exit(1);
});
