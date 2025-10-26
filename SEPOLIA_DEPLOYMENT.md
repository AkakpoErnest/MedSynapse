# MedSynapse Sepolia Deployment

## Why We're Redeploying to Sepolia

We're moving from Polygon Amoy to Ethereum Sepolia for **1MB.io data coin integration** support.

### Reason for Migration:
- **1MB.io Platform** - Supports Ethereum Sepolia testnet for data coin launch
- **Better Integration** - Can now launch data coins without using mainnet funds
- **Wider Compatibility** - More testnet resources and faucets available
- **Bounty Qualification** - Enables 1MB.io data coin integration requirements

### Networks Being Used:
1. **Ethereum Sepolia** (New) - For MedSynapseConsent contract + 1MB.io integration
2. **Polygon Amoy** (Old) - Previous deployment (kept for compatibility)

## Deployment Instructions

### 1. Get Sepolia ETH
```bash
# Visit: https://sepoliafaucet.com/
# Or use: https://www.alchemy.com/faucets/ethereum-sepolia
# Send ETH to your deployment wallet address
```

### 2. Set Environment Variables
Create `contracts/.env` file:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
# Or use: https://rpc.sepolia.org
PRIVATE_KEY=your_deployment_wallet_private_key
```

### 3. Deploy to Sepolia
```bash
cd contracts
npm install  # Install Hardhat 3.0.0
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

### 4. Update Frontend
After deployment, update `frontend/.env`:
```bash
VITE_MEDSYNAPSE_CONTRACT=NEW_SEPOLIA_ADDRESS_HERE
```

### 5. Update Envio Configuration
The Envio indexer will automatically index the new contract on Sepolia.

## What's Changing

### Smart Contracts:
- ✅ MedSynapseConsent - Deployed on Sepolia
- ✅ Same private key (reusing deployment wallet)
- ✅ Same contract code (no changes to logic)

### Configuration Updates:
- ✅ Hardhat config - Added Sepolia network
- ✅ Envio config - Now indexing Sepolia
- ✅ 1MB.io service - Configured for Sepolia
- ✅ Frontend - Updated to use Sepolia contract

### Integration Points:
- **Envio HyperIndex** - Will index Sepolia events
- **Envio HyperSync** - GraphQL queries for Sepolia data
- **1MB.io** - Data coin launch on Sepolia
- **Lighthouse** - Still using IPFS (no change)

## Deployment Timeline

1. Deploy contract to Sepolia (you need Sepolia ETH)
2. Update environment variables
3. Restart frontend and backend
4. Launch data coin on 1MB.io
5. Test full integration

## After Deployment

Your app will work on **Ethereum Sepolia** instead of Polygon Amoy, enabling:
- ✅ 1MB.io data coin integration
- ✅ Better testnet availability
- ✅ More faucet options
- ✅ Same functionality, different network

