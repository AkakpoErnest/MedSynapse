import React, { useState, useRef } from 'react'
import { useAccount } from 'wagmi'
import { Upload, FileText, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useDataUpload } from '../hooks/useMedSynapse'
import { validateFileType, formatFileSize, validateDataDescription } from '../utils/helpers'
import lighthouseService from '../services/lighthouseService'

const DataUpload: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { uploadData, uploading, uploadProgress, error } = useDataUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dataType, setDataType] = useState('lab_results')
  const [description, setDescription] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const allowedFileTypes = ['csv', 'json', 'txt', 'pdf', 'xlsx']
  const dataTypes = [
    { value: 'lab_results', label: 'Lab Results', icon: '🧪' },
    { value: 'wearable_data', label: 'Wearable Data', icon: '⌚' },
    { value: 'survey_data', label: 'Survey Data', icon: '📋' },
    { value: 'imaging_data', label: 'Imaging Data', icon: '📷' },
    { value: 'genetic_data', label: 'Genetic Data', icon: '🧬' }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!validateFileType(file, allowedFileTypes)) {
        setValidationErrors(['Please select a valid file type (CSV, JSON, TXT, PDF, XLSX)'])
        return
      }
      setSelectedFile(file)
      setValidationErrors([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      setValidationErrors(['Please connect your wallet first'])
      return
    }

    if (!selectedFile) {
      setValidationErrors(['Please select a file to upload'])
      return
    }

    if (!validateDataDescription(description)) {
      setValidationErrors(['Description must be between 10 and 500 characters'])
      return
    }

    if (!lighthouseService.isConfigured()) {
      setValidationErrors(['Lighthouse storage not configured. Please add VITE_LIGHTHOUSE_API_KEY to your environment variables.'])
      return
    }

    try {
      // Upload file to Lighthouse first
      const lighthouseResult = await lighthouseService.uploadFile(selectedFile, {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        description,
        dataType: dataType as any
      })

      // Then create blockchain consent record
      const result = await uploadData(selectedFile, dataType, description, lighthouseResult.hash)
      setUploadSuccess(true)
      
      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFile(null)
        setDescription('')
        setUploadSuccess(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }, 3000)
      
    } catch (err) {
      setValidationErrors([err instanceof Error ? err.message : 'Upload failed'])
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Health Data</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Wallet Not Connected</h3>
              <p className="text-yellow-700">Please connect your wallet to upload health data.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Health Data</h1>
      
      {uploadSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-green-800">Upload Successful!</h3>
              <p className="text-green-700">Your health data has been encrypted and stored securely on Lighthouse, with consent recorded on the blockchain.</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Health Data File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".csv,.json,.txt,.pdf,.xlsx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to select file'}
                  </span>
                </button>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-500">
                    Size: {formatFileSize(selectedFile.size)}
                  </div>
                )}
              </div>
            </div>

            {/* Data Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {dataTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      dataType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dataType"
                      value={type.value}
                      checked={dataType === type.value}
                      onChange={(e) => setDataType(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your health data (e.g., 'Blood glucose measurements from the past 3 months')"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-1 text-sm text-gray-500">
                {description.length}/500 characters
              </div>
            </div>

            {/* Lighthouse Status */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Encrypted Storage</h4>
                  <p className="text-sm text-blue-700">
                    {lighthouseService.isConfigured() 
                      ? 'Files will be encrypted and stored securely on Lighthouse'
                      : 'Lighthouse not configured - add VITE_LIGHTHOUSE_API_KEY to enable encrypted storage'
                    }
                  </p>
                </div>
              </div>
            </div>
            {validationErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    {validationErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !selectedFile || !description.trim()}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload & Create Consent'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default DataUpload
