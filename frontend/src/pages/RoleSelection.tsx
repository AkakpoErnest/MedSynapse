import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { User, GraduationCap, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const RoleSelection: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { setRole } = useAuth()
  const [isSelecting, setIsSelecting] = useState(false)

  const handleRoleSelect = async (role: 'contributor' | 'researcher') => {
    setIsSelecting(true)
    try {
      setRole(role)
    } catch (error) {
      console.error('Error setting role:', error)
    } finally {
      setIsSelecting(false)
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Welcome to MedSynapse</h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Choose your role to access the platform
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Select Your Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <button
                onClick={() => handleRoleSelect('contributor')}
                disabled={isSelecting}
                className="p-6 sm:p-8 rounded-lg border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center text-center">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Contributor</h3>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                    Share your health data for research and earn MedSynapse points
                  </p>
                  <div className="text-xs sm:text-sm text-blue-400">
                    ✓ Upload health data<br/>
                    ✓ Earn rewards<br/>
                    ✓ Control your privacy
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('researcher')}
                disabled={isSelecting}
                className="p-6 sm:p-8 rounded-lg border-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center text-center">
                  <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">Researcher</h3>
                  <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                    Access anonymized health data for medical research
                  </p>
                  <div className="text-xs sm:text-sm text-purple-400">
                    ✓ Request data access<br/>
                    ✓ Analyze health trends<br/>
                    ✓ Advance medical research
                  </div>
                </div>
              </button>
            </div>
          </div>

          {isSelecting && (
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400">Setting up your account...</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Connected as: <span className="text-blue-400 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
