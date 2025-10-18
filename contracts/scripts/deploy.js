const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MedSynapseConsent contract...");
  
  const MedSynapseConsent = await ethers.getContractFactory("MedSynapseConsent");
  const medSynapseConsent = await MedSynapseConsent.deploy();
  
  await medSynapseConsent.deployed();
  
  console.log("MedSynapseConsent deployed to:", medSynapseConsent.address);
  
  // Verify contract on Polygon Mumbai
  if (network.name === "mumbai") {
    console.log("Waiting for block confirmations...");
    await medSynapseConsent.deployTransaction.wait(6);
    
    console.log("Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: medSynapseConsent.address,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
