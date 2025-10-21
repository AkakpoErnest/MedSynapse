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
      const data = await envioService.getContributorConsents(address)
      setConsents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consents')
      console.error('Error fetching consents:', err)
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
    currentNetwork: networkInfo.mumbai, // Default to Mumbai testnet
  }
}
