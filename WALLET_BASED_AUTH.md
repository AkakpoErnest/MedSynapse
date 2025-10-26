# Wallet-Based Authentication & Data Isolation in MedSynapse

## Overview
MedSynapse uses wallet addresses as the primary identity and data isolation mechanism. Every user is uniquely identified by their Ethereum wallet address, and all data is scoped to that address.

## How It Works

### 1. **Authentication via Wallet**
- Users connect their MetaMask wallet
- The wallet address becomes their unique identity
- No traditional username/password needed
- Blockchain signature verification ensures authenticity

### 2. **Data Storage Per Address**

#### Local Storage
```typescript
// User data stored per wallet
`medsynapse_user_${address}` → { address, role, isVerified }

// Upload data stored per wallet
`medsynapse_uploads_${address}` → [{ dataHash, dataType, description, ... }]
```

#### Blockchain Storage
- Each consent record includes the `contributor` (wallet address)
- Envio GraphQL queries filter by address:
  ```graphql
  query GetContributorConsents($contributor: String!) {
    MedSynapseConsent_ConsentCreated(
      where: { contributor: { _eq: $contributor } }
    )
  }
  ```

### 3. **User Session Management**
```typescript
// Load user data based on current wallet
useEffect(() => {
  if (isConnected && address) {
    const savedUser = localStorage.getItem(`medsynapse_user_${address}`)
    // Restore user session
  }
}, [address, isConnected])
```

### 4. **Data Isolation**

#### Contributors See:
- Only their own uploaded data
- Only their own consent records
- Only their own research requests

#### Researchers See:
- All available datasets (to browse and request access)
- Their own research requests they submitted

### 5. **Role Selection Per Wallet**
Each wallet address maintains its own role (contributor or researcher):
```typescript
const userData: User = {
  address,  // Primary identifier
  role,     // Stored per address
  isVerified: true
}
```

## Key Benefits

1. **No Account Setup** - Just connect wallet
2. **Cryptographically Secure** - Private key signatures prove identity
3. **Privacy** - Each address has isolated data
4. **Transparent** - All data tied to on-chain wallet address
5. **Multiple Wallets** - Users can use different wallets for different purposes

## Implementation Details

### Authorization Checks
All data queries include address filtering:
- `envioService.getContributorConsents(address)` - Only fetches consents for that address
- `envioService.getAvailableConsents()` - Shows all (for researchers to browse)
- `envioService.getResearchRequests()` - Shows requests filtered by researcher address

### Security
- All on-chain transactions signed by the wallet
- No server-side authentication needed
- Wallet signature proves ownership
- Each transaction includes `msg.sender` address

## Example Flow

1. **User connects wallet** → `0x1234...abcd`
2. **User selects role** → Stored as `medsynapse_user_0x1234...abcd`
3. **User uploads data** → Saved with address in localStorage
4. **Consent created on-chain** → Includes `contributor: 0x1234...abcd`
5. **Query consents** → Only returns consents where contributor = `0x1234...abcd`

## Notes
- Switching wallets = different user identity
- Data from wallet A is invisible to wallet B
- Each wallet maintains its own role selection
- Logout clears data for the current wallet only

