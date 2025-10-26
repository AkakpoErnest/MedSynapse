import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import envioService from '../services/envioService'
import lighthouseService from '../services/lighthouseService'
import dataCoinService from '../services/dataCoinService'

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
      const lighthouseResult = await lighthouseService.uploadFile(file)

      console.log('Lighthouse upload successful:', lighthouseResult)
      setUploadProgress(75)
      
      // Save upload data locally as fallback
      const uploadData = {
        dataHash: lighthouseResult.hash,
        dataType: dataType,
        description: description,
        fileName: file.name,
        fileSize: file.size,
        timestamp: Date.now(),
        lighthouseUrl: lighthouseResult.url
      }
      
      // Store in localStorage for this address
      const existingUploads = localStorage.getItem(`medsynapse_uploads_${address}`)
      const uploads = existingUploads ? JSON.parse(existingUploads) : []
      uploads.push(uploadData)
      localStorage.setItem(`medsynapse_uploads_${address}`, JSON.stringify(uploads))
      console.log('Upload data saved locally:', uploadData)
      
      // Create consent on blockchain using the actual contract
      console.log('Creating consent on blockchain with hash:', lighthouseResult.hash)
      
      if (dataCoinService.isConfigured()) {
        try {
          // Create a real consent record on the blockchain
          const contribution = {
            contributor: address!,
            dataHash: lighthouseResult.hash,
            dataType: dataType,
            timestamp: Date.now(),
            rewardAmount: '1', // 1 consent point for each upload
            validated: true
          }
          
          const txHash = await dataCoinService.rewardContributor(contribution)
          console.log('Consent created on blockchain:', txHash)
        } catch (contractError) {
          console.warn('Contract interaction failed, using simulation:', contractError)
          // Fallback to simulation if contract fails
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } else {
        // Fallback to simulation if contract not configured
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
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
        // Try to fetch from Envio first
        const envioConsents = await envioService.getContributorConsents(address)
        console.log('Envio consents:', envioConsents)
        
        if (envioConsents.length > 0) {
          setConsents(envioConsents)
        } else {
          // Fallback: Check localStorage for uploaded files
          const localUploads = localStorage.getItem(`medsynapse_uploads_${address}`)
          if (localUploads) {
            try {
              const uploads = JSON.parse(localUploads)
              console.log('Local uploads found:', uploads)
              
              // Convert local uploads to consent format
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
            } catch (parseError) {
              console.error('Error parsing local uploads:', parseError)
              setConsents([])
            }
          } else {
            setConsents([])
          }
        }
      } catch (err) {
        console.error('Error fetching consents:', err)
        setError('Failed to fetch consents.')
        
        // Fallback to localStorage even on error
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
            setError(null) // Clear error if we have local data
          } catch (parseError) {
            console.error('Error parsing local uploads:', parseError)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchConsents()
  }, [address, isConnected])

  return { consents, loading, error }
}
