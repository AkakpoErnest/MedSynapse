# MedSynapse Development Environment

## Quick Start
```bash
npm install
npm run dev
```

## Project Structure
- `contracts/` - Solidity smart contracts for consent management
- `frontend/` - React app for contributors and researchers
- `backend/` - Node.js API server
- `ai/` - Python AI analysis tools

## Environment Setup
1. Install Node.js 18+
2. Install Python 3.9+
3. Set up environment variables (see .env.example files)

## Development Notes
- Smart contracts deployed on Polygon Mumbai testnet
- Frontend uses Vite + React + TypeScript
- Backend uses Express + TypeScript
- AI tools use Python with scikit-learn and pandas

## TODO
- [ ] Add proper error handling
- [ ] Implement rate limiting
- [ ] Add more comprehensive tests
- [ ] Optimize database queries
