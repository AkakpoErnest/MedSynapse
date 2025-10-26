# Lighthouse Integration in MedSynapse

## Overview

Lighthouse provides decentralized IPFS storage with client-side encryption for health data. When patients upload their health data, it's encrypted on their device using AES-256 encryption before being uploaded to IPFS.

## Usage in MedSynapse

Lighthouse handles the complete encrypted file upload process - from file selection to IPFS storage. Files are encrypted client-side using AES-256 before upload, then stored on IPFS with the hash returned for blockchain recording.

### Implementation Locations

**Service Layer:**
- `frontend/src/services/lighthouseService.ts` - Lighthouse SDK integration and upload logic

**Hook Integration:**
- `frontend/src/hooks/useMedSynapse.ts` - Uses lighthouse service for data upload (lines 30-50)

**UI Components:**
- `frontend/src/pages/DataUpload.tsx` - Upload form that triggers Lighthouse upload
- `frontend/src/pages/ResearcherDashboard.tsx` - Downloads encrypted data from IPFS using Lighthouse hash

**Package Configuration:**
- `frontend/package.json` - `@lighthouse-web3/sdk` dependency (line 15)

### Key Features Used

- **Encrypted Upload** - Client-side AES-256 encryption before IPFS upload
- **File Progress** - Real-time upload progress tracking
- **IPFS Gateways** - Multiple fallback gateways for reliable access
- **Decentralized Storage** - Files stored on IPFS, not centralized servers

## Integration Benefits

**Why Lighthouse works well for MedSynapse:**
- Zero-knowledge encryption - Files encrypted on user's device before upload
- No single point of failure - Decentralized IPFS storage
- Cost-effective - Pay only for storage, not bandwidth
- GDPR compliant - Medical data stays private and encrypted
- Simple integration - SDK is straightforward to implement

**Feedback:**
Lighthouse was the perfect choice for storing sensitive health data. The client-side encryption means even Lighthouse can't see the file contents, which is crucial for medical data privacy. The SDK is well-documented and the upload process is straightforward. The only challenge we faced was handling the array parameter requirement (`[file]` instead of `file`), but once resolved it worked flawlessly.

