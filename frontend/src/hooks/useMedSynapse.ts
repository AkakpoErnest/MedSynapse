import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import envioService from '../services/envioService'
import lighthouseService from '../services/lighthouseService'

export const useDataUpload = () => {
  const { address, isConnected } = useAccount()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadData = async (file: File, dataType: string, description: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected.')
    }

    if (!lighthouseService.isConfigured()) {
      throw new Error('Lighthouse storage not configured.')
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Upload to Lighthouse
      setUploadProgress(25)
      console.log('Starting Lighthouse upload...')
      const lighthouseResult = await lighthouseService.uploadFile(file, {
        name: file.name,
        type: file.type,
        size: file.size,
        description,
        dataType: dataType as any
      })

      console.log('Lighthouse upload successful:', lighthouseResult)
      setUploadProgress(75)
      
      // Create consent on blockchain (simulated for now)
      console.log('Creating consent on blockchain with hash:', lighthouseResult.hash)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate transaction time
      
      setUploadProgress(100)
      setUploading(false)
      
      console.log('Upload process completed successfully')
      return { success: true, dataHash: lighthouseResult.hash }

    } catch (err) {
      console.error('Upload error:', err)
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
        // Fetch real data from Envio HyperSync
        const consents = await envioService.getContributorConsents(address)
        setConsents(consents)
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
