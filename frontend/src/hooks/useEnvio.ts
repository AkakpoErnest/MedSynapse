import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import envioService, { ConsentRecord, ResearchRequest, DataAccessRecord, Analytics } from '../services/envioService'

// Hook for contributor consents
export const useContributorConsents = () => {
  const { address, isConnected } = useAccount()
  const [consents, setConsents] = useState<ConsentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConsents = useCallback(async () => {
    if (!isConnected || !address) {
      setConsents([])
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching consents for address:', address)
      const data = await envioService.getContributorConsents(address)
      console.log('Fetched consents from Envio:', data)
      
      // Merge with localStorage data to add dataType and description
      const localUploads = localStorage.getItem(`medsynapse_uploads_${address}`)
      const uploadsMap = localUploads ? JSON.parse(localUploads) : []
      
      // Create a map of dataHash -> upload data
      const uploadsDataMap = new Map()
      uploadsMap.forEach((upload: any) => {
        uploadsDataMap.set(upload.dataHash, upload)
      })
      
      // Enrich consents with local storage data
      const enrichedConsents = data.map(consent => {
        const localData = uploadsDataMap.get(consent.dataHash)
        if (localData) {
          return {
            ...consent,
            dataType: localData.dataType || 'unknown',
            description: localData.description || 'No description',
            timestamp: localData.timestamp || Date.now(),
            isActive: true,
            accessCount: 0
          }
        }
        return {
          ...consent,
          dataType: 'unknown',
          description: 'No description available',
          timestamp: Date.now(),
          isActive: true,
          accessCount: 0
        }
      })
      
      console.log('Enriched consents:', enrichedConsents)
      setConsents(enrichedConsents)
    } catch (err) {
      console.error('Error fetching consents:', err)
      
      // Fallback to localStorage only
      const localUploads = localStorage.getItem(`medsynapse_uploads_${address}`)
      if (localUploads) {
        try {
          const uploads = JSON.parse(localUploads)
          const mockConsents = uploads.map((upload: any, index: number) => ({
            id: `local_${index}`,
            consentId: upload.dataHash,
            contributor: address,
            dataHash: upload.dataHash,
            dataType: upload.dataType,
            description: upload.description,
            timestamp: upload.timestamp,
            isActive: true,
            accessCount: 0
          }))
          setConsents(mockConsents)
          setError(null)
        } catch (parseError) {
          console.error('Error parsing local uploads:', parseError)
          setError('Failed to fetch consents and local data.')
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch consents')
      }
    } finally {
      setLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    fetchConsents()
  }, [fetchConsents])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isConnected || !address) return

    const unsubscribe = envioService.subscribeToNewConsents(
      address,
      (newConsent) => {
        setConsents(prev => [newConsent, ...prev])
      }
    )

    return unsubscribe
  }, [address, isConnected])

  return { consents, loading, error, refetch: fetchConsents }
}

// Hook for research requests
export const useResearchRequests = () => {
  const [requests, setRequests] = useState<ResearchRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioService.getResearchRequests()
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests')
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = envioService.subscribeToNewRequests(
      (newRequest) => {
        setRequests(prev => [newRequest, ...prev])
      }
    )

    return unsubscribe
  }, [])

  return { requests, loading, error, refetch: fetchRequests }
}

// Hook for data access records
export const useDataAccessRecords = (consentId: string) => {
  const [records, setRecords] = useState<DataAccessRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async () => {
    if (!consentId) {
      setRecords([])
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await envioService.getDataAccessRecords(consentId)
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch access records')
      console.error('Error fetching access records:', err)
    } finally {
      setLoading(false)
    }
  }, [consentId])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  return { records, loading, error, refetch: fetchRecords }
}

// Hook for analytics
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioService.getAnalytics()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { analytics, loading, error, refetch: fetchAnalytics }
}

// Hook for Envio connection status
export const useEnvioConnection = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true)
      try {
        const connected = await envioService.testConnection()
        setIsConnected(connected)
      } catch (error) {
        console.error('Envio connection check failed:', error)
        setIsConnected(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { isConnected, isChecking }
}

// Hook for network and contract info
export const useEnvioConfig = () => {
  const [networkInfo, setNetworkInfo] = useState(envioService.getNetworkInfo())
  const [contractAddresses, setContractAddresses] = useState(envioService.getContractAddresses())

  return {
    networkInfo,
    contractAddresses,
    currentNetwork: networkInfo.sepolia, // Default to Sepolia testnet
  }
}
