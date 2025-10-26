# 🏥 MedSynapse

> **A decentralized platform where patients can securely share their health data with medical researchers while maintaining complete control and earning rewards.**

Hey! I'm building **MedSynapse** and I'm really excited about what this could become. Let me explain what problem I'm trying to solve and what we've built so far.

## The Real Problem

Here's what I kept noticing: medical data is everywhere, but it's completely disconnected. When you go to different doctors or hospitals, none of them talk to each other. Your lab results from one place don't show up at another. Patient health apps collect tons of data that just sits there doing nothing.

Meanwhile, researchers who are trying to solve real health problems can't get good datasets to work with. They're stuck with small sample sizes or old data that isn't representative of diverse populations.

And the worst part? Patients have zero control over who uses their data and how. You might consent to something once, and then that data gets passed around to dozens of other companies without you ever knowing.

## What MedSynapse Actually Does

MedSynapse fixes this by giving patients complete control over their health data while making it easy for researchers to access it.

**For Patients:**
- Upload your health data (lab results, wearable device data, surveys, etc.)
- Keep everything encrypted and secure
- Approve each research request individually
- Get rewarded with tokens for contributing your data
- See exactly who accessed your data and when
- Revoke access instantly if you change your mind

**For Researchers:**
- Browse available health datasets in one place
- Request access with clear research purposes
- Wait for patient approval (transparent process)
- Analyze approved data with built-in AI tools
- Know you're working with validated, authentic data

Everything runs on blockchain smart contracts, so there's complete transparency and auditing. No hidden data sharing. No sketchy permission changes.

## Recent Updates I Just Made

I've been working on a bunch of improvements lately:

### Fixed the Build System
The app wasn't deploying to Vercel because of TypeScript errors and Wagmi version conflicts. I spent time fixing all of that - updated to Wagmi v2, fixed TypeScript definitions, and got everything compiling properly.

### Token Rewards System
Implemented a proper token rewards system. Now when someone uploads health data and gets approval, they automatically earn 10 MEDS tokens. The contract tracks everything on-chain so it's transparent.

### Authentication & Roles
Added a proper login system where you connect your wallet, choose your role (contributor or researcher), and the interface adapts based on what you are. Contributors see upload tools and consent management. Researchers see data browsing and analysis tools.

### AI Dashboard
Created a dedicated AI insights dashboard that shows predictive analytics, data patterns, and security status. It's integrated with the real-time Envio indexer so the data stays current.

### Medical Theme Redesign
Changed the whole color scheme to blue and white with medical icons (stethoscope, etc.) instead of generic cryptocurrency colors. Made everything look more professional and healthcare-focused.

### Responsive Design
Made the entire interface work properly on both mobile and desktop. The navigation, dashboards, and upload forms all adapt to different screen sizes.

### Lighthouse Integration
Integrated Lighthouse for encrypted decentralized file storage. When you upload health data, it gets encrypted and stored on IPFS, then we create a consent record on the blockchain.

### Envio Real-Time Indexing
Set up Envio HyperSync to index all the on-chain events in real-time. This means the dashboard updates immediately when new consents are created or when researchers request access. No more waiting for confirmations.

## The Technology Stack

**Frontend:**
- React 18 + TypeScript - for building the UI
- Vite - super fast builds and hot reload
- Tailwind CSS - modern, responsive styling
- Wagmi v2 - for Ethereum wallet connections
- Lucide React - clean icons
- React Router - for navigation
- Envio hooks - for real-time blockchain data

**Smart Contracts:**
- Solidity for the logic
- OpenZeppelin for security
- Deployed on Polygon Amoy testnet (migrated from Mumbai when it was deprecated)
- Hardhat for development and deployment

**Backend & Storage:**
- Node.js + Express API
- Lighthouse for IPFS storage with encryption
- Envio for blockchain indexing and GraphQL queries
- AES-256 encryption for data

**AI & Analytics:**
- Python-based health data analyzer
- Pattern recognition and trend analysis
- Correlation studies
- Predictive insights

## Project Structure

```
MedSynapse/
├── contracts/              # Solidity smart contracts
│   ├── contracts/
│   │   ├── MedSynapseConsent.sol    # Main consent management
│   │   ├── MedSynapseToken.sol      # MEDS token contract
│   │   └── DataValidator.sol        # Data validation
│   ├── scripts/
│   │   ├── deploy.js                # Deployment
│   │   └── deploy-fixed.js          # Fixed deployment script
│   └── hardhat.config.js
│
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx              # Main navigation
│   │   │   ├── AIInsightsDashboard.tsx # AI analytics
│   │   │   └── EnvioStatus.tsx         # Connection status
│   │   ├── pages/
│   │   │   ├── Home.tsx                # Landing page
│   │   │   ├── ContributorDashboard.tsx
│   │   │   ├── ResearcherDashboard.tsx
│   │   │   ├── DataUpload.tsx
│   │   │   └── DataAnalysis.tsx
│   │   ├── services/
│   │   │   ├── envioService.ts         # Envio GraphQL client
│   │   │   ├── lighthouseService.ts    # IPFS storage
│   │   │   └── dataCoinService.ts      # Token rewards
│   │   ├── hooks/
│   │   │   ├── useEnvio.ts            # Blockchain data hooks
│   │   │   └── useMedSynapse.ts       # Upload hooks
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # User authentication
│   │   └── config/
│   │       └── envio.ts               # Envio configuration
│   └── public/
│
├── backend/                # Node.js API
│   ├── src/
│   │   └── index.ts
│   └── package.json
│
├── generated/              # Envio indexer
│   └── schema.graphql
│
└── src/                    # Envio handlers
    └── EventHandlers.ts
```

## Deployed Contracts

**MedSynapseConsent Contract**
- **Network**: Polygon Amoy Testnet
- **Address**: `0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44`
- **Explorer**: [View on Polygonscan](https://amoy.polygonscan.com/address/0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44)

I deployed this contract to handle all the consent management. It tracks who owns data, who's requesting it, and who has approved access. Everything is transparent and auditable.

## How to Run It Locally

### Prerequisites
- Node.js v20 (not higher or lower)
- pnpm package manager
- Docker installed
- MetaMask wallet

### Setup

```bash
# Clone the repo
git clone https://github.com/AkakpoErnest/MedSynapse.git
cd MedSynapse

# Install dependencies
cd frontend
pnpm install

# Set up environment variables
cp env.example .env
# Edit .env with your:
# - VITE_LIGHTHOUSE_API_KEY
# - VITE_ENVIO_API_KEY
# - VITE_ENVIO_ENDPOINT
# - VITE_MEDSYNAPSE_CONTRACT

# Start the dev server
pnpm dev
```

### Running the Envio Indexer

```bash
# From the root directory
pnpm codegen          # Generate types after schema changes
pnpm tsc --noEmit     # Check TypeScript compilation
TUI_OFF=true pnpm dev # Run indexer
```

## What's Working Right Now

✅ **Smart Contracts** - Deployed and functional on Amoy  
✅ **Wallet Connection** - MetaMask integration works  
✅ **Role-Based Access** - Contributors vs Researchers have different views  
✅ **Data Upload** - File upload with Lighthouse encryption  
✅ **Consent Management** - Approve/deny/revoke all working  
✅ **Token Rewards** - Automatic rewards for contributions  
✅ **Real-Time Updates** - Envio indexing shows live blockchain data  
✅ **AI Dashboard** - Analytics and insights  
✅ **Responsive Design** - Works on mobile and desktop  

## What I'm Still Working On

- Making the upload process smoother with better error handling
- Adding more AI analysis capabilities
- Implementing the data coin system (1MB.io integration)
- Improving the UI/UX based on user feedback
- Adding multi-file upload support
- Creating better visualization for the consent data

## Contributing

I'd love help with this project! Whether you're interested in:
- Smart contract security audits
- Frontend UI improvements
- Mobile app development
- AI/ML algorithms
- Documentation
- Testing

Feel free to fork, create a branch, and submit a PR.

## License

MIT License - use this however you want!

---

<div align="center">
  <strong>Making health data accessible, secure, and patient-controlled ❤️</strong>
</div>
# Force redeploy
# Removed .vercel cache
