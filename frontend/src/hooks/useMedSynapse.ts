import { useState, useEffect } from 'react'
import { useAccount, useContract, useContractRead, useContractWrite } from 'wagmi'
import { ethers } from 'ethers'

// Contract ABI - simplified version for now
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_dataHash", "type": "string"},
      {"internalType": "string", "name": "_dataType", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"}
    ],
    "name": "createConsent",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "_consentId", "type": "bytes32"}],
    "name": "revokeConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_contributor", "type": "address"}],
    "name": "getContributorConsents",
    "outputs": [{"internalType": "bytes32[]", "name": "", "type": "bytes32[]"}],
    "stateMutability": "view",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'

export const useMedSynapseContract = () => {
  const { address } = useAccount()
  
  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  })

  return { contract, address }
}

export const useContributorData = () => {
  const { address } = useAccount()
  const [consents, setConsents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { data: consentIds } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getContributorConsents',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  useEffect(() => {
    if (consentIds && consentIds.length > 0) {
      // In a real app, we'd fetch consent details here
      // For now, we'll use mock data
      const mockConsents = consentIds.map((id, index) => ({
        id: id,
        type: ['lab_results', 'wearable_data', 'survey_data'][index % 3],
        date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
        status: 'Active',
        requests: Math.floor(Math.random() * 5),
        description: `Health data upload ${index + 1}`
      }))
      setConsents(mockConsents)
    }
  }, [consentIds])

  return { consents, loading, error, setConsents }
}

export const useDataUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadData = async (file, dataType, description) => {
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate file upload to Lighthouse
      // In real implementation, this would upload to Lighthouse and get hash
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(i)
      }

      // Return mock data
      return {
        hash: mockHash,
        type: dataType,
        description: description,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { uploadData, uploading, uploadProgress, error }
}
