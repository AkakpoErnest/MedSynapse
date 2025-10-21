// Envio HyperSync Configuration
export const ENVIO_CONFIG = {
  // Envio GraphQL endpoint for MedSynapse
  endpoint: process.env.REACT_APP_ENVIO_ENDPOINT || 'https://api.envio.dev/v1/graphql',
  
  // API Key for authentication
  apiKey: process.env.REACT_APP_ENVIO_API_KEY || '',
  
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
    mumbai: {
      chainId: 80001,
      name: 'Mumbai Testnet',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com'
    }
  },
  
  // MedSynapse contract addresses
  contracts: {
    medSynapseConsent: process.env.REACT_APP_MEDSYNAPSE_CONTRACT || '0x...',
    dataValidator: process.env.REACT_APP_DATA_VALIDATOR_CONTRACT || '0x...'
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
  // Get all consent records for a contributor
  getContributorConsents: `
    query GetContributorConsents($contributor: String!, $first: Int, $skip: Int) {
      consentRecords(
        where: { contributor: $contributor }
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        contributor
        dataType
        description
        timestamp
        isActive
        accessCount
        authorizedResearchers {
          researcher
          approvedAt
        }
      }
    }
  `,
  
  // Get research requests
  getResearchRequests: `
    query GetResearchRequests($first: Int, $skip: Int) {
      researchRequests(
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        datasetId
        researcher
        purpose
        timestamp
        status
        price
        consentRecord {
          id
          dataType
          description
        }
      }
    }
  `,
  
  // Get data access records
  getDataAccessRecords: `
    query GetDataAccessRecords($consentId: String!, $first: Int, $skip: Int) {
      dataAccessRecords(
        where: { consentId: $consentId }
        first: $first
        skip: $skip
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        consentId
        researcher
        timestamp
        dataHash
        purpose
      }
    }
  `,
  
  // Get analytics data
  getAnalytics: `
    query GetAnalytics {
      consentRecords(first: 1000) {
        id
        dataType
        timestamp
        isActive
        accessCount
      }
      researchRequests(first: 1000) {
        id
        status
        timestamp
        price
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
