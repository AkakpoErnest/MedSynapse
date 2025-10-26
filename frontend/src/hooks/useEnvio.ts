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
      
      console.log('Local uploads from storage:', uploadsMap)
      
      // If no Envio data, use only local storage
      if (data.length === 0 && uploadsMap.length > 0) {
        const mockConsents = uploadsMap.map((upload: any, index: number) => ({
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
        console.log('Using local uploads as consents:', mockConsents)
        setConsents(mockConsents)
        return
      }
      
      // Create a map of dataHash -> upload data
      const uploadsDataMap = new Map()
      uploadsMap.forEach((upload: any) => {
        uploadsDataMap.set(upload.dataHash, upload)
      })
      
      // Create a map of on-chain consentIds
      const onChainDataHashes = new Set(data.map(consent => consent.dataHash))
      
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
      
      // Add local uploads that are NOT on-chain yet (pending uploads)
      const localOnlyUploads = uploadsMap.filter((upload: any) => !onChainDataHashes.has(upload.dataHash))
      const pendingConsents = localOnlyUploads.map((upload: any, index: number) => ({
        id: `local_${index}`,
        consentId: upload.dataHash, // Use dataHash as temporary ID
        contributor: address,
        dataHash: upload.dataHash,
        dataType: upload.dataType || 'unknown',
        description: upload.description || 'No description',
        timestamp: upload.timestamp || Date.now(),
        isActive: false, // Pending because not yet on-chain
        accessCount: 0
      }))
      
      const allConsents = [...enrichedConsents, ...pendingConsents]
      
      console.log('Enriched consents:', enrichedConsents.length, 'Pending:', pendingConsents.length)
      console.log('All consents:', allConsents)
      setConsents(allConsents)
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

// Hook for available datasets (all consents for researchers to browse)
export const useAvailableDatasets = () => {
  const [datasets, setDatasets] = useState<ConsentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  const fetchDatasets = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioService.getAvailableConsents()
      
      // Create a map of all uploads from all contributors' local storage
      const allUploadsMap = new Map<string, any>()
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('medsynapse_uploads_')) {
          try {
            const uploads = JSON.parse(localStorage.getItem(key) || '[]')
            uploads.forEach((upload: any) => {
              if (upload.dataHash) {
                allUploadsMap.set(upload.dataHash, upload)
              }
            })
          } catch (e) {
            console.error('Error parsing localStorage:', e)
          }
        }
      }
      
      // Enrich datasets with local storage metadata
      const enrichedData = data.map(dataset => {
        // Try to match by dataHash from Envio
        const localData = allUploadsMap.get(dataset.dataHash)
        
        // If not found, try matching by any local storage hash that might match
        let matchedData = localData
        if (!matchedData) {
          // Try to find any matching data hash
          for (const [hash, upload] of allUploadsMap.entries()) {
            if (dataset.dataHash.includes(hash.substring(0, 10)) || hash.includes(dataset.dataHash.substring(0, 10))) {
              matchedData = upload
              break
            }
          }
        }
        
        console.log('Dataset from Envio:', {
          consentId: dataset.consentId,
          dataHash: dataset.dataHash,
          foundInLocalStorage: !!matchedData,
          availableKeys: Array.from(allUploadsMap.keys()).slice(0, 3)
        })
        
        return {
          ...dataset,
          dataType: matchedData?.dataType || 'unknown',
          description: matchedData?.description || 'No description available',
          fileName: matchedData?.fileName,
          fileSize: matchedData?.fileSize,
          timestamp: matchedData?.timestamp || Date.now(),
          isApproved: false
        }
      })
      
      // If researcher is connected, fetch their approvals and merge
      if (isConnected && address) {
        const approvals = await envioService.getResearchApprovals(address)
        const approvalConsentIds = new Set(approvals.map(a => a.consentId))
        
        // Mark datasets as approved if researcher has access
        const finalData = enrichedData.map(dataset => ({
          ...dataset,
          isApproved: approvalConsentIds.has(dataset.consentId)
        }))
        
        setDatasets(finalData)
      } else {
        setDatasets(enrichedData)
      }
    } catch (err) {
      console.error('Error fetching datasets:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch datasets')
    } finally {
      setLoading(false)
    }
  }, [isConnected, address])

  useEffect(() => {
    fetchDatasets()
    
    // Refresh every 60 seconds to get new datasets
    const interval = setInterval(fetchDatasets, 60000)
    return () => clearInterval(interval)
  }, [fetchDatasets])

  return { datasets, loading, error, refetch: fetchDatasets }
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

// Hook for research requests for a specific contributor
export const useContributorResearchRequests = (contributorAddress: string) => {
  const [requests, setRequests] = useState<ResearchRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [approvedRequests, setApprovedRequests] = useState<Set<string>>(new Set())

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch all research requests
      const allRequests = await envioService.getResearchRequests()
      console.log('All research requests:', allRequests)
      
      // Filter requests for consents owned by this contributor
      // We need to match request consentId with contributor's consents
      const contributorConsents = await envioService.getContributorConsents(contributorAddress)
      console.log('Contributor consents:', contributorConsents)
      const consentIds = new Set(contributorConsents.map(c => c.consentId))
      console.log('Contributor consent IDs:', Array.from(consentIds))
      console.log('Request consent IDs:', allRequests.map(r => r.consentId))
      
      const filteredRequests = allRequests.filter(req => consentIds.has(req.consentId))
      console.log('Filtered requests for contributor:', filteredRequests, 'Count:', filteredRequests.length)
      
      // Also fetch approved requests to mark status
      try {
        // Fetch approvals for all consents owned by this contributor
        const approvals = await envioService.getApprovalsByConsentIds(Array.from(consentIds))
        const approvedConsentIds = new Set(approvals.map(a => a.consentId))
        setApprovedRequests(approvedConsentIds)
      } catch (err) {
        console.error('Error fetching approvals:', err)
      }
      
      setRequests(filteredRequests)
    } catch (err) {
      console.error('Error fetching contributor research requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch research requests')
    } finally {
      setLoading(false)
    }
  }, [contributorAddress])

  useEffect(() => {
    if (contributorAddress) {
      fetchRequests()
      // Refresh every 60 seconds to get approval updates
      const interval = setInterval(fetchRequests, 60000)
      return () => clearInterval(interval)
    }
  }, [contributorAddress, fetchRequests])

  return { requests, loading, error, approvedRequests, refetch: fetchRequests }
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
