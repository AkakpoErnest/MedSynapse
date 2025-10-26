import lighthouse from '@lighthouse-web3/sdk'

export interface UploadResult {
  hash: string
  url: string
  size: number
  name: string
}

// File metadata removed - using blockchain-only storage

class LighthouseService {
  private apiKey: string

  constructor() {
    this.apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY || ''
    console.log('Lighthouse API Key configured:', this.apiKey ? 'Yes' : 'No')
  }

  /**
   * Upload a file to Lighthouse using their SDK
   */
  async uploadFile(file: File): Promise<UploadResult> {
    if (!this.apiKey) {
      throw new Error('Lighthouse API key not configured')
    }

    try {
      console.log('Uploading file to Lighthouse:', file.name, file.size, 'Type:', file.type)
      
      // Use Lighthouse SDK correctly - create a FileList from the File
      const fileArray = [file]
      
      // Call the SDK upload function
      const uploadResponse = await lighthouse.upload(
        fileArray,
        this.apiKey
      )

      console.log('Lighthouse upload response:', uploadResponse)
      
      // The SDK returns {data: {Hash: string, ...}}
      if (!uploadResponse || !uploadResponse.data || !uploadResponse.data.Hash) {
        console.error('Invalid upload response:', uploadResponse)
        throw new Error('Upload failed - no hash returned from Lighthouse')
      }

      const hash = uploadResponse.data.Hash
      console.log('Successfully uploaded to IPFS. Hash:', hash)

      return {
        hash: hash,
        url: `https://gateway.lighthouse.storage/ipfs/${hash}`,
        size: file.size,
        name: file.name
      }
    } catch (error) {
      console.error('Lighthouse upload error:', error)
      throw new Error(`Failed to upload to Lighthouse: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Download a file from Lighthouse/IPFS
   */
  async downloadFile(hash: string, apiKey?: string): Promise<Blob> {
    const key = apiKey || this.apiKey
    
    if (!key) {
      throw new Error('API key required for file download')
    }

    try {
      console.log('Downloading file from IPFS:', hash)
      
      // Try multiple IPFS gateways
      const gateways = [
        `https://gateway.lighthouse.storage/ipfs/${hash}`,
        `https://ipfs.io/ipfs/${hash}`,
        `https://gateway.pinata.cloud/ipfs/${hash}`
      ]

      for (const gateway of gateways) {
        try {
          console.log('Trying gateway:', gateway)
          const response = await fetch(gateway)
          
          if (response.ok) {
            const blob = await response.blob()
            console.log('Successfully downloaded file:', blob.size, 'bytes')
            return blob
          }
        } catch (err) {
          console.log('Gateway failed:', gateway, err)
          continue
        }
      }

      throw new Error('All IPFS gateways failed to retrieve the file')
    } catch (error) {
      console.error('Lighthouse download error:', error)
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get file information from Lighthouse
   */
  async getFileInfo(hash: string): Promise<any> {
    try {
      const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${hash}`)
      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.statusText}`)
      }
      
      return {
        hash,
        url: `https://gateway.lighthouse.storage/ipfs/${hash}`,
        exists: true
      }
    } catch (error) {
      console.error('Lighthouse file info error:', error)
      throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generate a shareable access link for approved researchers
   */
  generateAccessLink(hash: string, researcherAddress: string): string {
    // In a real implementation, this would generate a time-limited access token
    // For now, we'll return the IPFS link
    return `https://gateway.lighthouse.storage/ipfs/${hash}`
  }

  /**
   * Check if Lighthouse is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey
  }

  /**
   * Get upload progress (placeholder for future implementation)
   */
  onUploadProgress(callback: (progress: number) => void): void {
    // This would be implemented with the actual progress callback
    console.log('Upload progress tracking not yet implemented')
  }
}

// Export singleton instance
export const lighthouseService = new LighthouseService()
export default lighthouseService
