# MedSynapse Environment Variables for Vercel Deployment
# Copy these to your Vercel dashboard under Settings > Environment Variables

# ===========================================
# REQUIRED ENVIRONMENT VARIABLES
# ===========================================

# Lighthouse Storage API Key (REQUIRED)
VITE_LIGHTHOUSE_API_KEY=894ec5dd.bd8480d5b8004515bc7f82d31e5b600f

# Envio HyperSync Configuration (REQUIRED)
VITE_ENVIO_API_KEY=your_envio_api_key_here
VITE_ENVIO_ENDPOINT=https://api.envio.dev/v1/graphql

# Smart Contract Addresses (REQUIRED)
VITE_MEDSYNAPSE_CONTRACT=0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44
VITE_DATA_VALIDATOR_CONTRACT=0x0000000000000000000000000000000000000000

# 1MB.io Data Coin Integration (OPTIONAL)
VITE_1MB_CONTRACT_ADDRESS=your_1mb_contract_address_here

# Private Key for Contract Interactions (REQUIRED for full functionality)
VITE_PRIVATE_KEY=your_private_key_here

# ===========================================
# OPTIONAL CONFIGURATION
# ===========================================

# Network Configuration
VITE_NETWORK_ID=80002
VITE_NETWORK_NAME=Polygon Amoy Testnet
VITE_RPC_URL=https://rpc-amoy.polygon.technology

# Feature Flags
VITE_ENABLE_AI_DASHBOARD=true
VITE_ENABLE_REAL_DATASETS=true
VITE_ENABLE_1MB_INTEGRATION=false

# Analytics and Monitoring (OPTIONAL)
VITE_ANALYTICS_ID=your_analytics_id_here
VITE_SENTRY_DSN=your_sentry_dsn_here

# ===========================================
# DEPLOYMENT NOTES
# ===========================================

# 1. Go to your Vercel dashboard
# 2. Select your MedSynapse project
# 3. Go to Settings > Environment Variables
# 4. Add each variable above with its value
# 5. Make sure to set the environment (Production, Preview, Development)
# 6. Redeploy your project after adding variables

# ===========================================
# SECURITY NOTES
# ===========================================

# - Never commit private keys to git
# - Use Vercel's environment variables for sensitive data
# - Rotate API keys regularly
# - Use different keys for different environments
# - Monitor usage and set up alerts for unusual activity

