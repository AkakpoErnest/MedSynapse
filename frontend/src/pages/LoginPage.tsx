import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { User, Shield, Building, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { login, isLoading } = useAuth()
  const [selectedRole, setSelectedRole] = useState<'contributor' | 'researcher' | null>(null)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    organization: '',
    credentials: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRoleSelect = (role: 'contributor' | 'researcher') => {
    setSelectedRole(role)
    setError(null)
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleCredentialAdd = () => {
    const credential = prompt('Enter credential (e.g., PhD, MD, Research License):')
    if (credential && credential.trim()) {
      setProfile(prev => ({
        ...prev,
        credentials: [...prev.credentials, credential.trim()]
      }))
    }
  }

  const handleCredentialRemove = (index: number) => {
    setProfile(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRole) {
      setError('Please select a role')
      return
    }

    if (selectedRole === 'researcher') {
      if (!profile.organization || profile.credentials.length === 0) {
        setError('Researchers must provide organization and credentials')
        return
      }
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await login(selectedRole, profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Wallet Not Connected</h3>
                <p className="text-yellow-700">Please connect your wallet to access MedSynapse.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Join MedSynapse</h1>
          <p className="text-gray-400 text-lg">
            Choose your role and verify your identity to access the platform
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-8">
          {/* Role Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Select Your Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('contributor')}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === 'contributor'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center mb-3">
                  <User className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Contributor</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Share your health data for research and earn rewards
                </p>
                <div className="mt-3 flex items-center text-sm text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Easy verification</span>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('researcher')}
                className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === 'researcher'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center mb-3">
                  <GraduationCap className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Researcher</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Access anonymized health data for medical research
                </p>
                <div className="mt-3 flex items-center text-sm text-yellow-400">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Requires verification</span>
                </div>
              </button>
            </div>
          </div>

          {/* Profile Form */}
          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {selectedRole === 'researcher' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => handleProfileChange('organization', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="University, Hospital, Research Institute"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Professional Credentials
                    </label>
                    <div className="space-y-2">
                      {profile.credentials.map((credential, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                          <span className="text-white">{credential}</span>
                          <button
                            type="button"
                            onClick={() => handleCredentialRemove(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleCredentialAdd}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-blue-400 transition-colors"
                      >
                        + Add Credential
                      </button>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  `Join as ${selectedRole === 'contributor' ? 'Contributor' : 'Researcher'}`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
