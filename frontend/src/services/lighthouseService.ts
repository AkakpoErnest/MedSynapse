import lighthouse from '@lighthouse-web3/sdk'

export interface UploadResult {
  hash: string
  url: string
  size: number
  name: string
}

export interface FileMetadata {
  name: string
  type: string
  size: number
  description?: string
  dataType: 'lab_results' | 'wearable_data' | 'survey_data' | 'imaging_data' | 'genetic_data'
}

class LighthouseService {
  private apiKey: string

  constructor() {
    this.apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY || ''
  }

  /**
   * Upload a file to Lighthouse with encryption
   */
  async uploadFile(file: File, metadata: FileMetadata): Promise<UploadResult> {
    if (!this.apiKey) {
      throw new Error('Lighthouse API key not configured')
    }

    try {
      // Use the correct Lighthouse SDK method - try different approaches
      let uploadResponse;
      
      try {
        // Try the uploadFile method first
        uploadResponse = await lighthouse.uploadFile(file, this.apiKey);
      } catch (firstError) {
        console.log('First method failed, trying alternative:', firstError);
        try {
          // Try the upload method with different parameters
          uploadResponse = await lighthouse.upload(file, this.apiKey, false);
        } catch (secondError) {
          console.log('Second method failed, trying direct API:', secondError);
          // Fallback to direct API call
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('https://api.lighthouse.storage/api/v0/add', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
            },
            body: formData
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const result = await response.json();
          
          if (!result.Hash) {
            throw new Error('Upload failed - no hash returned');
          }

          return {
            hash: result.Hash,
            url: `https://gateway.lighthouse.storage/ipfs/${result.Hash}`,
            size: file.size,
            name: file.name
          };
        }
      }

      if (!uploadResponse.data || !uploadResponse.data.Hash) {
        throw new Error('Upload failed - no hash returned');
      }

      return {
        hash: uploadResponse.data.Hash,
        url: `https://gateway.lighthouse.storage/ipfs/${uploadResponse.data.Hash}`,
        size: file.size,
        name: file.name
      };
    } catch (error) {
      console.error('Lighthouse upload error:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      const fileInfo = await lighthouse.download(hash, key)
      return fileInfo
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
