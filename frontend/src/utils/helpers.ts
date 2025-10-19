// Utility functions for MedSynapse frontend

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  return allowedTypes.includes(fileExtension || '')
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const truncateAddress = (address: string): string => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const generateDataHash = async (file: File): Promise<string> => {
  // In a real implementation, this would generate actual hash
  // For now, we'll create a mock hash
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return `Qm${hashHex.substring(0, 44)}` // Simulate IPFS hash format
}

export const validateDataDescription = (description: string): boolean => {
  return description.length >= 10 && description.length <= 500
}

export const getDataTypeIcon = (dataType: string): string => {
  const icons: { [key: string]: string } = {
    'lab_results': '🧪',
    'wearable_data': '⌚',
    'survey_data': '📋',
    'imaging_data': '📷',
    'genetic_data': '🧬'
  }
  return icons[dataType] || '📄'
}

export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'Active': 'green',
    'Pending': 'yellow',
    'Revoked': 'red',
    'Expired': 'gray'
  }
  return colors[status] || 'gray'
}

// Mock data for development
export const mockDatasets = [
  {
    id: '1',
    title: 'Blood Glucose Levels',
    type: 'lab_results',
    contributorCount: 150,
    dataPoints: 2500,
    lastUpdated: '2024-01-15',
    description: 'Daily blood glucose measurements from diabetic patients'
  },
  {
    id: '2',
    title: 'Heart Rate Variability',
    type: 'wearable_data',
    contributorCount: 89,
    dataPoints: 12000,
    lastUpdated: '2024-01-14',
    description: 'Continuous heart rate monitoring from fitness trackers'
  }
]

export const mockConsents = [
  {
    id: '0x1234567890abcdef',
    type: 'lab_results',
    date: '2024-01-15',
    status: 'Active',
    requests: 3,
    description: 'Complete blood count results'
  },
  {
    id: '0xabcdef1234567890',
    type: 'wearable_data',
    date: '2024-01-10',
    status: 'Active',
    requests: 1,
    description: 'Sleep pattern data from smartwatch'
  }
]
