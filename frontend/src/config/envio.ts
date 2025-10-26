// Envio HyperSync Configuration
export const ENVIO_CONFIG = {
  // Envio GraphQL endpoint - use local Envio when running, fallback to hosted
  endpoint: import.meta.env.VITE_ENVIO_ENDPOINT || 'http://localhost:8080/v1/graphql',
  
  // API Key for authentication (optional for public endpoints)
  apiKey: import.meta.env.VITE_ENVIO_API_KEY || '',
  
  // Network configurations
  networks: {
    ethereum: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo'
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com'
    },
    amoy: {
      chainId: 80002,
      name: 'Polygon Amoy Testnet',
      rpcUrl: 'https://rpc-amoy.polygon.technology'
    }
  },
  
  // MedSynapse contract addresses (Sepolia)
  contracts: {
    medSynapseConsent: import.meta.env.VITE_MEDSYNAPSE_CONTRACT || '0xeaDEaAFE440283aEaC909CD58ec367735BfE712f',
    dataValidator: import.meta.env.VITE_DATA_VALIDATOR_CONTRACT || '0x...',
    oneMBDataCoin: '0xC7Bc3432B0CcfeFb4237172340Cd8935f95f2990', // 1MB.io pre-deployed on Sepolia
    usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    weth: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'  // Sepolia WETH
  },
  
  // Query configurations
  queryConfig: {
    // Real-time subscription settings
    subscriptionTimeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    
    // Pagination settings
    pageSize: 20,
    maxPageSize: 100
  }
}

// GraphQL Queries for MedSynapse
export const MEDSYNAPSE_QUERIES = {
  // Get all consent created events for a contributor
  getContributorConsents: `
    query GetContributorConsents($contributor: String!, $limit: Int, $offset: Int) {
      MedSynapseConsent_ConsentCreated(
        where: { contributor: { _eq: $contributor } }
        limit: $limit
        offset: $offset
        order_by: { id: desc }
      ) {
        id
        consentId
        contributor
        dataHash
      }
    }
  `,
  
  // Get research requests
  getResearchRequests: `
    query GetResearchRequests($limit: Int, $offset: Int) {
      MedSynapseConsent_ResearchRequested(
        limit: $limit
        offset: $offset
        order_by: { id: desc }
      ) {
        id
        consentId
        researcher
        purpose
      }
    }
  `,
  
  // Get data access records
  getDataAccessRecords: `
    query GetDataAccessRecords($consentId: String!, $limit: Int, $offset: Int) {
      MedSynapseConsent_ResearchApproved(
        where: { consentId: { _eq: $consentId } }
        limit: $limit
        offset: $offset
        order_by: { id: desc }
      ) {
        id
        consentId
        researcher
      }
    }
  `,
  
  // Get analytics data
  getAnalytics: `
    query GetAnalytics {
      MedSynapseConsent_ConsentCreated(limit: 1000) {
        id
        consentId
        contributor
        dataHash
      }
      MedSynapseConsent_ResearchRequested(limit: 1000) {
        id
        consentId
        researcher
        purpose
      }
      MedSynapseConsent_ResearchApproved(limit: 1000) {
        id
        consentId
        researcher
      }
    }
  `
}

// GraphQL Subscriptions for real-time updates
export const MEDSYNAPSE_SUBSCRIPTIONS = {
  // Subscribe to new consent records
  newConsentRecord: `
    subscription NewConsentRecord($contributor: String!) {
      consentRecords(
        where: { contributor: $contributor }
        orderBy: timestamp
        orderDirection: desc
        first: 1
      ) {
        id
        contributor
        dataType
        description
        timestamp
        isActive
      }
    }
  `,
  
  // Subscribe to new research requests
  newResearchRequest: `
    subscription NewResearchRequest {
      researchRequests(
        orderBy: timestamp
        orderDirection: desc
        first: 1
      ) {
        id
        datasetId
        researcher
        purpose
        timestamp
        status
        price
      }
    }
  `,
  
  // Subscribe to data access events
  dataAccessEvent: `
    subscription DataAccessEvent($consentId: String!) {
      dataAccessRecords(
        where: { consentId: $consentId }
        orderBy: timestamp
        orderDirection: desc
        first: 1
      ) {
        id
        consentId
        researcher
        timestamp
        dataHash
        purpose
      }
    }
  `
}
