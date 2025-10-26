# Data Coin Launch Guide for MedSynapse

Based on your current setup, here's how to launch your data coin on the testnet:

## Current Status

✅ **MedSynapseConsent Contract**: Already deployed on Polygon Amoy
- Address: `0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44`
- Explorer: https://amoy.polygonscan.com/address/0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44

## Launch Options

You have two paths for the data coin:

### Option 1: Use Existing Consent-Based System (Recommended for Quick Start)

Your current setup already tracks contributions through the `MedSynapseConsent` contract. Each data upload creates a consent record, which acts as a "data coin" of sorts.

**What you need to do:**
1. Test uploading data through your frontend
2. The contract will create consent records
3. Each consent = 1 data coin contribution
4. Users can see their balance in the contributor dashboard

**To test it:**
```bash
# Make sure your environment variables are set in frontend/.env
cd frontend
npm run dev
# Then go to http://localhost:3000 and connect your wallet
```

### Option 2: Launch on 1MB.io (Requires Mainnet - Use Later)

**Note:** 1MB.io works on Polygon **mainnet**, not testnet. For development, stick with Option 1.

If you want to launch on 1MB.io for production:
1. Switch MetaMask to Polygon Mainnet
2. Visit https://1MB.io/
3. Create your data coin
4. Copy the contract address
5. Add to `frontend/.env` as `VITE_1MB_CONTRACT_ADDRESS`

**For now, stick with the testnet setup!**

### Option 3: Deploy a Custom ERC-20 Token (More Complex)

If you want your own token contract:

1. **Set up environment:**
   ```bash
   cd contracts
   # Create .env file
   echo "PRIVATE_KEY=your_testnet_private_key" > .env
   echo "AMOY_RPC_URL=https://rpc-amoy.polygon.technology" >> .env
   ```

2. **Deploy the token:**
   ```bash
   npm install
   npx hardhat run scripts/deploy-token.js --network amoy
   ```

3. **Save the contract address** and add it to your frontend environment

## Recommended Next Steps

Since you already have the consent system working, I recommend:

1. **Test the current setup first:**
   - Start your frontend locally
   - Connect a wallet
   - Upload some test data
   - Verify consents are created on-chain
   - Check your contributor dashboard to see the balance

2. **If you need the 1MB.io integration:**
   - Follow Option 2 above
   - It will give you a real data coin on their platform

3. **Optional: Add token transfers:**
   - If you want users to be able to transfer tokens
   - You'll need to deploy the `MedSynapseToken` contract
   - Then update the frontend to use it

## Testing Checklist

Once launched, verify:

- [ ] Data uploads create consent records on-chain
- [ ] Contributor dashboard shows correct balance
- [ ] Contributors can see their consent history
- [ ] Researchers can request access to data
- [ ] Lighthouse integration stores encrypted files
- [ ] Envio indexer shows real-time updates

## Need Help?

If you encounter issues:
1. Check the deployment guide in the docs
2. Verify your environment variables are set correctly
3. Make sure you have testnet MATIC for gas fees
4. Check the browser console for errors

