import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import envioService from '../services/envioService'

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
