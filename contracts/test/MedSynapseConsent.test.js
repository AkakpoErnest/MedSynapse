const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedSynapseConsent", function () {
  let medSynapseConsent;
  let owner;
  let contributor;
  let researcher;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    contributor = signers[1];
    researcher = signers[2];
    
    const MedSynapseConsent = await ethers.getContractFactory("MedSynapseConsent");
    medSynapseConsent = await MedSynapseConsent.deploy();
    await medSynapseConsent.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await medSynapseConsent.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero consents", async function () {
      expect(await medSynapseConsent.totalConsents()).to.equal(0);
    });
  });

  describe("Consent Management", function () {
    it("Should create a consent successfully", async function () {
      const dataHash = "QmTestHash123";
      const dataType = "lab_results";
      const description = "Blood test results";
      
      const tx = await medSynapseConsent.connect(contributor).createConsent(
        dataHash,
        dataType,
        description
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = medSynapseConsent.interface.parseLog(log);
          return parsed.name === "ConsentCreated";
        } catch (e) {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
      
      expect(await medSynapseConsent.totalConsents()).to.equal(1);
    });

    it("Should reject empty data hash", async function () {
      await expect(
        medSynapseConsent.connect(contributor).createConsent(
          "",
          "lab_results",
          "Test description"
        )
      ).to.be.revertedWith("Data hash cannot be empty");
    });

    it("Should allow research request", async function () {
      // First create a consent
      const dataHash = "QmTestHash123";
      const dataType = "lab_results";
      const description = "Blood test results";
      
      const tx = await medSynapseConsent.connect(contributor).createConsent(
        dataHash,
        dataType,
        description
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = medSynapseConsent.interface.parseLog(log);
          return parsed.name === "ConsentCreated";
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = medSynapseConsent.interface.parseLog(event);
      const consentId = parsedEvent.args.consentId;
      
      // Now request access
      await expect(
        medSynapseConsent.connect(researcher).requestDataAccess(
          consentId,
          "Medical research study"
        )
      ).to.emit(medSynapseConsent, "ResearchRequested");
    });
  });

  describe("Access Control", function () {
    it("Should only allow contributor to revoke consent", async function () {
      // Create consent
      const dataHash = "QmTestHash123";
      const dataType = "lab_results";
      const description = "Blood test results";
      
      const tx = await medSynapseConsent.connect(contributor).createConsent(
        dataHash,
        dataType,
        description
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          const parsed = medSynapseConsent.interface.parseLog(log);
          return parsed.name === "ConsentCreated";
        } catch (e) {
          return false;
        }
      });
      const parsedEvent = medSynapseConsent.interface.parseLog(event);
      const consentId = parsedEvent.args.consentId;
      
      // Try to revoke as researcher (should fail)
      await expect(
        medSynapseConsent.connect(researcher).revokeConsent(consentId)
      ).to.be.revertedWith("Only contributor can revoke");
      
      // Revoke as contributor (should succeed)
      await expect(
        medSynapseConsent.connect(contributor).revokeConsent(consentId)
      ).to.emit(medSynapseConsent, "ConsentRevoked");
    });
  });
});
