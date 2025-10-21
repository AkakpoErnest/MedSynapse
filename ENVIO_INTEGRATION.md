# 🚀 Envio HyperSync Integration

## Overview

MedSynapse now integrates with **Envio HyperSync** for real-time blockchain data streaming. This enables live updates of consent records, research requests, and data access events directly from the blockchain.

## How It Works

### 1. **Real-Time Data Streaming**
- **GraphQL Queries**: Fetch consent records, research requests, and analytics
- **Live Subscriptions**: Get real-time updates when new data is added to the blockchain
- **Automatic Refresh**: UI updates automatically when blockchain state changes

### 2. **Data Flow**
```
Blockchain Events → Envio HyperSync → GraphQL API → React Hooks → UI Components
```

### 3. **Key Features**
- ✅ **Real-time consent tracking**
- ✅ **Live research request updates**
- ✅ **Automatic data synchronization**
- ✅ **Connection status monitoring**
- ✅ **Error handling and retry logic**

## Integration Details

### **Configuration** (`src/config/envio.ts`)
```typescript
export const ENVIO_CONFIG = {
  endpoint: 'https://api.envio.dev/v1/graphql',
  apiKey: process.env.REACT_APP_ENVIO_API_KEY,
  networks: {
    ethereum: { chainId: 1 },
    polygon: { chainId: 137 },
    mumbai: { chainId: 80001 }
  },
  contracts: {
    medSynapseConsent: '0x...',
    dataValidator: '0x...'
  }
}
```

### **Service Layer** (`src/services/envioService.ts`)
- **GraphQL Client**: Handles all API communication
- **Query Methods**: Fetch data from blockchain
- **Subscription Methods**: Real-time updates via polling
- **Error Handling**: Automatic retries and fallbacks

### **React Hooks** (`src/hooks/useEnvio.ts`)
- `useContributorConsents()`: Real-time consent data
- `useResearchRequests()`: Live research requests
- `useAnalytics()`: Platform statistics
- `useEnvioConnection()`: Connection status

## GraphQL Schema

### **Queries**
```graphql
# Get contributor consents
query GetContributorConsents($contributor: String!) {
  consentRecords(where: { contributor: $contributor }) {
    id
    contributor
    dataType
    description
    timestamp
    isActive
    accessCount
  }
}

# Get research requests
query GetResearchRequests {
  researchRequests {
    id
    datasetId
    researcher
    purpose
    timestamp
    status
    price
  }
}
```

### **Subscriptions** (via polling)
```typescript
// Subscribe to new consents
envioService.subscribeToNewConsents(contributor, callback)

// Subscribe to new requests
envioService.subscribeToNewRequests(callback)
```

## Environment Setup

### **Required Environment Variables**
```bash
# .env
REACT_APP_ENVIO_ENDPOINT=https://api.envio.dev/v1/graphql
REACT_APP_ENVIO_API_KEY=your_envio_api_key_here
REACT_APP_MEDSYNAPSE_CONTRACT=0x1234567890123456789012345678901234567890
REACT_APP_DATA_VALIDATOR_CONTRACT=0x0987654321098765432109876543210987654321
```

### **Installation**
```bash
npm install graphql graphql-request
```

## Usage Examples

### **Contributor Dashboard**
```typescript
import { useContributorConsents } from '../hooks/useEnvio'

const ContributorDashboard = () => {
  const { consents, loading, error } = useContributorConsents()
  
  return (
    <div>
      {loading && <div>Loading from blockchain...</div>}
      {consents.map(consent => (
        <ConsentCard key={consent.id} consent={consent} />
      ))}
    </div>
  )
}
```

### **Researcher Dashboard**
```typescript
import { useResearchRequests, useAnalytics } from '../hooks/useEnvio'

const ResearcherDashboard = () => {
  const { requests, loading } = useResearchRequests()
  const { analytics } = useAnalytics()
  
  return (
    <div>
      <StatsCards analytics={analytics} />
      <DatasetGrid requests={requests} />
    </div>
  )
}
```

## Connection Status

### **EnvioStatus Component**
```typescript
import EnvioStatus from '../components/EnvioStatus'

// Shows connection status
<EnvioStatus showText={true} />
```

### **Status Indicators**
- 🟢 **Connected**: Real-time data streaming active
- 🔴 **Disconnected**: Using fallback data
- 🟡 **Checking**: Testing connection

## Error Handling

### **Automatic Retries**
- Failed requests retry 3 times
- Exponential backoff between retries
- Graceful fallback to cached data

### **Connection Monitoring**
- Health checks every 30 seconds
- Automatic reconnection attempts
- User-friendly error messages

## Performance Optimizations

### **Caching Strategy**
- React Query for client-side caching
- 5-minute stale time for queries
- Background refetching

### **Real-time Updates**
- Polling-based subscriptions (5-second intervals)
- Efficient data diffing
- Minimal re-renders

## Security

### **API Key Management**
- Environment variable storage
- No hardcoded credentials
- Secure header transmission

### **Data Validation**
- TypeScript interfaces for all data
- Runtime validation
- Error boundary protection

## Monitoring & Debugging

### **Console Logging**
```typescript
// Enable debug mode
console.log('Envio connection test:', await envioService.testConnection())
console.log('Current analytics:', analytics)
```

### **Network Information**
```typescript
const { networkInfo, contractAddresses } = useEnvioConfig()
console.log('Active network:', networkInfo.mumbai)
console.log('Contract addresses:', contractAddresses)
```

## Next Steps

1. **WebSocket Integration**: Upgrade from polling to WebSocket subscriptions
2. **Multi-chain Support**: Add support for multiple blockchain networks
3. **Advanced Filtering**: Implement complex query filters
4. **Data Pagination**: Handle large datasets efficiently
5. **Offline Support**: Cache data for offline usage

## Troubleshooting

### **Common Issues**

**Connection Failed**
```bash
# Check API key
echo $REACT_APP_ENVIO_API_KEY

# Test endpoint
curl -H "Authorization: Bearer $API_KEY" $ENDPOINT
```

**No Data Loading**
- Verify contract addresses
- Check network configuration
- Ensure smart contracts are deployed

**Real-time Updates Not Working**
- Check polling intervals
- Verify subscription callbacks
- Monitor console for errors

---

## 🎯 **ENVIO INTEGRATION COMPLETE!**

MedSynapse now has **real-time blockchain data streaming** powered by Envio HyperSync! 

**What's Working:**
- ✅ Real-time consent tracking
- ✅ Live research request updates  
- ✅ Connection status monitoring
- ✅ Error handling and retries
- ✅ Dark theme integration
- ✅ Performance optimizations

**Ready for the next integration!** 🚀
