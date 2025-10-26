# Hardhat Integration in MedSynapse

## Overview

Hardhat is used as the smart contract development framework for compiling, testing, and deploying MedSynapse's Solidity contracts to the Ethereum Sepolia testnet.

## Usage in MedSynapse

Hardhat manages the complete smart contract development lifecycle - from writing Solidity code to deploying to blockchain. It compiles the MedSynapseConsent and MedSynapseToken contracts, runs tests, and handles deployment scripts.

### Implementation Locations

**Main Configuration:**
- `contracts/hardhat.config.js` - Hardhat configuration with Sepolia network settings

**Smart Contracts:**
- `contracts/contracts/MedSynapseConsent.sol` - Core consent management contract
- `contracts/contracts/MedSynapseToken.sol` - ERC20 reward token contract  
- `contracts/contracts/DataValidator.sol` - Data validation contract

**Deployment Scripts:**
- `contracts/scripts/deploy.js` - Main deployment script
- `contracts/scripts/deploy-fixed.js` - Fixed deployment script with corrections

**Package Configuration:**
- `contracts/package.json` - Dependencies including Hardhat v3.0.0 and OpenZeppelin contracts

### Key Hardhat Features Used

- **Compilation** - Compiles Solidity contracts to bytecode
- **Testing** - Runs contract tests before deployment
- **Deployment** - Deploys to Sepolia with configured RPC URL
- **Verification** - Verifies contracts on Etherscan for transparency

