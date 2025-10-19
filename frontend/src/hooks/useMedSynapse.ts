import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

// Mock data for demonstration
const MOCK_CONSENTS = [
  {
    id: '0x123abc',
    type: 'lab_results',
    description: 'Comprehensive blood panel from 2023',
    date: '2023-01-15T10:00:00Z',
    status: 'Active',
    requests: 3,
    accessCount: 1,
    researchers: ['0xResearcher1', '0xResearcher2']
  },
  {
    id: '0x456def',
    type: 'wearable_data',
    description: 'Heart rate and sleep data from Q2 2023',
    date: '2023-04-20T14:30:00Z',
    status: 'Active',
    requests: 5,
    accessCount: 2,
    researchers: ['0xResearcher3']
  },
  {
    id: '0x789ghi',
    type: 'genetic_data',
    description: 'Anonymized genetic markers for disease research',
    date: '2023-07-01T09:10:00Z',
    status: 'Inactive',
    requests: 0,
    accessCount: 0,
    researchers: []
  },
]

export const useDataUpload = () => {
  const { address, isConnected } = useAccount()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Placeholder for Lighthouse upload
  const uploadToLighthouse = async (file: File) => {
    return new Promise<string>((resolve) => {
      setUploadProgress(0)
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          // Simulate Lighthouse hash
          resolve(`Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`)
        }
      }, 100)
    })
  }

  const uploadData = async (file: File, dataType: string, description: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected.')
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // 1. Upload to Lighthouse (simulated)
      const dataHash = await uploadToLighthouse(file)
      console.log('Uploaded to Lighthouse, hash:', dataHash)

      // 2. Create consent on-chain (simulated)
      console.log('Simulating on-chain consent creation...')
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction time
      console.log('Consent created on-chain (simulated)')

      setUploading(false)
      setUploadProgress(100)
      return { success: true, dataHash }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during upload.')
      setUploading(false)
      setUploadProgress(0)
      throw err
    }
  }

  return { uploadData, uploading, uploadProgress, error }
}

export const useContributorData = () => {
  const { address, isConnected } = useAccount()
  const [consents, setConsents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConsents = async () => {
      if (!isConnected || !address) {
        setConsents([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        // In a real application, this would fetch data from:
        // 1. Smart contract (e.g., MedSynapseConsent.getContributorConsents(address))
        // 2. Envio HyperSync (for real-time indexed data)
        // 3. Potentially a backend API that aggregates this data

        // For now, return mock data
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        setConsents(MOCK_CONSENTS)
      } catch (err) {
        setError('Failed to fetch consents.')
        console.error('Error fetching consents:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsents()
  }, [address, isConnected])

  return { consents, loading, error }
}
