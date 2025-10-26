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
   * Upload a file to Lighthouse using their API
   */
  async uploadFile(file: File): Promise<UploadResult> {
    if (!this.apiKey) {
      throw new Error('Lighthouse API key not configured')
    }

    try {
      console.log('Uploading file to Lighthouse:', file.name, file.size)
      
      // Use the Lighthouse API to upload file
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload to Lighthouse using their upload endpoint
      const uploadResponse = await fetch('https://node.lighthouse.storage/api/v0/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('Lighthouse upload failed:', uploadResponse.status, errorText)
        throw new Error(`Lighthouse upload failed: ${uploadResponse.status} - ${errorText}`)
      }

      const result = await uploadResponse.json()
      console.log('Lighthouse upload response:', result)
      
      if (!result.Hash) {
        throw new Error('Upload failed - no hash returned from Lighthouse')
      }

      const hash = result.Hash
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
   * Download and decrypt a file from Lighthouse
   */
  async downloadFile(hash: string, apiKey?: string): Promise<Blob> {
    const key = apiKey || this.apiKey
    
    if (!key) {
      throw new Error('API key required for file download')
    }

    try {
      // Note: Implement Lighthouse download if needed
      console.log('Downloading file:', hash)
      // Return an empty blob as a placeholder
      return new Blob([], { type: 'application/octet-stream' })
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
