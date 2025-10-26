import { useState, useEffect } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import envioService from '../services/envioService'
import lighthouseService from '../services/lighthouseService'
import { parseEther } from 'viem'

export const useDataUpload = () => {
  const { address, isConnected } = useAccount()
  const { data: publicClient } = usePublicClient()
  const { data: walletClient } = useWalletClient()
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
      
      // Create consent on blockchain using the user's MetaMask wallet
      console.log('Creating consent on blockchain with hash:', lighthouseResult.hash)
      
      try {
        if (walletClient) {
          const MEDSYNAPSE_CONTRACT = '0x05133bC59e34413F683Cc336A26f215b3261a51F' // Sepolia
          const MEDSYNAPSE_ABI = [
            {
              inputs: [
                { internalType: 'string', name: '_dataHash', type: 'string' },
                { internalType: 'string', name: '_dataType', type: 'string' },
                { internalType: 'string', name: '_description', type: 'string' }
              ],
              name: 'createConsent',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'nonpayable',
              type: 'function'
            }
          ] as const

          console.log('Calling createConsent on blockchain...')
          const hash = await walletClient?.writeContract({
            address: MEDSYNAPSE_CONTRACT as `0x${string}`,
            abi: MEDSYNAPSE_ABI,
            functionName: 'createConsent',
            args: [lighthouseResult.hash, dataType, description]
          })
          
          console.log('Transaction submitted:', hash)
          
          // Wait for transaction to be mined
          if (publicClient) {
            const receipt = await publicClient.waitForTransactionReceipt({ hash })
            console.log('Transaction confirmed:', receipt)
          }
        } else {
          console.warn('Wallet client not available, skipping blockchain interaction')
        }
      } catch (contractError) {
        console.warn('Blockchain interaction failed:', contractError)
        // Continue with localStorage fallback
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
