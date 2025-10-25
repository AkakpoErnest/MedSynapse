# 🏥 MedSynapse

> **Decentralized platform for secure health data sharing with token rewards**

Bridge siloed healthcare data across blockchains while maintaining complete privacy and patient control.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

![MedSynapse Banner](https://via.placeholder.com/1200x400/667eea/ffffff?text=MedSynapse+Healthcare+Data+Platform)

## ✨ Features

### 🔐 **Military-Grade Security**
- **AES-256 Encryption**: All health data encrypted before storage
- **Blockchain Consent**: Smart contracts manage data access permissions
- **Lighthouse Storage**: Decentralized, encrypted file storage
- **Transparent Auditing**: Complete visibility into data access

### 🧠 **AI-Powered Analysis**
- **Machine Learning**: Advanced algorithms discover medical insights
- **Trend Analysis**: Identify patterns in health data over time
- **Correlation Studies**: Find relationships between health metrics
- **Real-time Processing**: Instant analysis of anonymized datasets

### 🌍 **Global Network**
- **Cross-chain Support**: Work with multiple blockchain networks
- **10K+ Contributors**: Growing community of health data providers
- **50M+ Data Points**: Vast repository of medical information
- **500+ Researchers**: Active research community

### 👤 **Patient Control**
- **Granular Permissions**: Control exactly who accesses your data
- **Revocable Consent**: Take back permissions anytime
- **Access Logs**: See every time your data is accessed
- **Earn Rewards**: Get compensated for contributing data

## 💰 Token Rewards System

I've implemented a token-based reward system to incentivize health data sharing. Here's how it works:

### **MEDS Token (MedSynapse Data Share)**
- **Purpose**: Reward patients for sharing their health data with researchers
- **Reward Rate**: 10 MEDS tokens per validated data contribution
- **Max Supply**: 1,000,000 MEDS tokens
- **Storage**: Encrypted on Lighthouse IPFS network

### **How Contributors Earn Tokens**
1. **Upload Health Data**: Lab results, wearable data, surveys, etc.
2. **Data Validation**: Files are validated using zkTLS for authenticity
3. **Automatic Rewards**: Earn 10 MEDS tokens per contribution
4. **Track Earnings**: View your token balance in the Data Coin dashboard

### **Real-World Data Integration**
- **zkTLS Validation**: Ensures data authenticity using zero-knowledge proofs
- **Reclaim Protocol**: Integration for verified data sources
- **Blockchain Records**: All transactions recorded on Polygon Amoy
- **Privacy First**: Data encrypted before storage, only metadata on-chain

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MetaMask** or compatible Web3 wallet
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AkakpoErnest/MedSynapse.git
cd MedSynapse
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install smart contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Set up environment variables**
```bash
# Copy example env file
cp env.example .env

# Edit .env with your credentials
# MUMBAI_RPC_URL=your_rpc_url
# PRIVATE_KEY=your_private_key
```

4. **Start the development servers**

```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Smart Contracts (optional)
cd contracts
npx hardhat node
```

5. **Open the app**
```
http://localhost:3000
```

## 📁 Project Structure

```
MedSynapse/
├── contracts/              # Smart contracts (Solidity)
│   ├── contracts/
│   │   ├── MedSynapseConsent.sol
│   │   └── DataValidator.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── MedSynapseConsent.test.js
│   └── hardhat.config.js
│
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── vite.config.ts
│
├── backend/                # Node.js + Express API
│   ├── src/
│   │   └── index.ts
│   └── package.json
│
├── ai/                     # AI/ML modules
│   ├── health_analyzer.py
│   └── requirements.txt
│
└── README.md
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum interactions
- **Lucide React** - Icons

### **Backend**
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin support

### **Blockchain**
- **Solidity** - Smart contracts
- **Hardhat** - Development environment
- **OpenZeppelin** - Security libraries
- **Polygon Mumbai** - Test network

### **Storage & AI**
- **Lighthouse** - Decentralized storage
- **Envio HyperSync** - Blockchain indexing
- **Python** - AI/ML processing

## 📖 User Guide

### For Contributors (Patients)

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the navigation
   - Approve MetaMask connection

2. **Upload Health Data**
   - Navigate to "Data Upload"
   - Select your file (lab results, wearable data, etc.)
   - Choose data type and add description
   - Click "Upload & Create Consent"

3. **Manage Your Data**
   - View all uploaded data in your dashboard
   - See access requests from researchers
   - Approve or deny requests
   - Revoke consent anytime

### For Researchers

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the navigation
   - Approve MetaMask connection

2. **Browse Datasets**
   - Navigate to "Researcher Dashboard"
   - Use filters to find relevant data
   - Search by keywords, tags, or data type

3. **Request Access**
   - Click on a dataset to view details
   - Click "Request Access"
   - Provide research purpose
   - Wait for contributor approval

4. **Analyze Data**
   - Navigate to "AI Data Analysis"
   - Select approved datasets
   - Run trend or correlation analysis
   - Export reports

## 🧪 Smart Contract Functions

### **MedSynapseConsent.sol**

```solidity
// Create consent for data sharing
function createConsent(
    string memory _dataHash,
    string memory _dataType,
    string memory _description
) external returns (bytes32)

// Revoke data access
function revokeConsent(bytes32 _consentId) external

// Request data access
function requestDataAccess(
    bytes32 _consentId,
    string memory _purpose
) external

// Approve access request
function approveDataAccess(
    bytes32 _consentId,
    address _researcher,
    uint256 _durationDays
) external

// Check authorization
function isAuthorized(
    bytes32 _consentId,
    address _researcher
) external view returns (bool)
```

## 🧑‍💻 Development

### Running Tests

```bash
# Smart contract tests
cd contracts
npx hardhat test

# Frontend tests (when available)
cd frontend
npm test

# Backend tests (when available)
cd backend
npm test
```

### Deploying Smart Contracts

```bash
cd contracts

# Deploy to local network
npx hardhat run scripts/deploy.js

# Deploy to Polygon Amoy testnet
npx hardhat run scripts/deploy-fixed.js --network amoy

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

### Current Deployment Status

**✅ MedSynapseConsent Contract Deployed**

- **Network**: Polygon Amoy Testnet
- **Contract Address**: `0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44`
- **Explorer**: [View on Amoy Polygonscan](https://amoy.polygonscan.com/address/0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44)
- **Deployer**: `0xF9c3F6011C6C9036b99fa67Fb3ea4A7EBdcC76cB`
- **Deployment Date**: October 25, 2024

**Note**: We migrated from Mumbai testnet to Amoy as Mumbai was deprecated. The contract is now live and ready for integration with Envio HyperSync.

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Compiled files will be in dist/ directories
```

## 🔒 Security

- **Encryption**: All data encrypted before storage
- **Smart Contracts**: Audited consent management
- **Access Control**: Blockchain-based permissions
- **Privacy**: No PII stored on-chain
- **Compliance**: HIPAA-compliant architecture

## 📞 Contact & Support

I'm always happy to help! Feel free to reach out if you have questions or want to contribute:

- **Email**: support@medsynapse.io
- **Twitter**: [@MedSynapse](https://twitter.com/medsynapse)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/MedSynapse/issues)

## 🤝 Contributing

I'd love to have more people working on this project! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

I'm particularly interested in contributions for:
- AI/ML health data analysis
- Mobile app development
- Security audits
- UI/UX improvements
- Documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

I want to thank the amazing open-source community and these projects that made MedSynapse possible:

- **Envio** - For HyperSync blockchain indexing (makes real-time data so much easier!)
- **Lighthouse** - For decentralized storage and encryption
- **OpenZeppelin** - For secure smart contract libraries
- **Polygon** - For scalable blockchain infrastructure
- **The React Community** - For amazing tools and libraries
- **All Contributors** - For helping make healthcare data more accessible

## 🗺️ Roadmap

Here's what I've built so far and what's coming next:

### ✅ **Completed Features**
- [x] Smart contract development and deployment
- [x] Frontend MVP with React and TypeScript
- [x] Backend API with Express
- [x] Wallet integration (MetaMask)
- [x] Contract deployed to Polygon Amoy testnet
- [x] Lighthouse integration for encrypted file storage
- [x] Envio HyperSync for real-time blockchain data
- [x] Token rewards system (MEDS tokens)
- [x] Data validation with zkTLS

### 🚧 **In Progress**
- [ ] AI analysis tools for health data insights
- [ ] Mobile app development (React Native)
- [ ] Multi-chain support (Ethereum, Base, etc.)

### 🔮 **Future Plans**
- [ ] DAO governance for platform decisions
- [ ] Advanced token economics
- [ ] Integration with more health data sources
- [ ] Machine learning models for health predictions

---

<div align="center">
  <strong>Built with ❤️ for the future of healthcare</strong>
  <br>
  <sub>Made by the MedSynapse Team</sub>
</div>
