// Envio HyperSync Configuration
export const ENVIO_CONFIG = {
  // Envio GraphQL endpoint for MedSynapse
  endpoint: import.meta.env.VITE_ENVIO_ENDPOINT || 'https://api.envio.dev/v1/graphql',
  
  // API Key for authentication
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
  
  // MedSynapse contract addresses
  contracts: {
    medSynapseConsent: import.meta.env.VITE_MEDSYNAPSE_CONTRACT || '0x43CdcbE93FBd8e9E6fAc33bFD6c1a48B22742e44',
    dataValidator: import.meta.env.VITE_DATA_VALIDATOR_CONTRACT || '0x...'
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
    query GetContributorConsents($contributor: String!, $first: Int, $skip: Int) {
      medSynapseConsent_ConsentCreateds(
        where: { contributor: $contributor }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: desc
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
    query GetResearchRequests($first: Int, $skip: Int) {
      medSynapseConsent_ResearchRequesteds(
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: desc
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
    query GetDataAccessRecords($consentId: String!, $first: Int, $skip: Int) {
      medSynapseConsent_ResearchApproveds(
        where: { consentId: $consentId }
        first: $first
        skip: $skip
        orderBy: id
        orderDirection: desc
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
      medSynapseConsent_ConsentCreateds(first: 1000) {
        id
        consentId
        contributor
        dataHash
      }
      medSynapseConsent_ResearchRequesteds(first: 1000) {
        id
        consentId
        researcher
        purpose
      }
      medSynapseConsent_ResearchApproveds(first: 1000) {
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
