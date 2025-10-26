import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Stethoscope, Microscope, Shield, Activity, Database, Users, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const RoleSelection: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { setRole } = useAuth()
  const navigate = useNavigate()
  const [isSelecting, setIsSelecting] = useState(false)

  const handleRoleSelect = async (role: 'contributor' | 'researcher') => {
    setIsSelecting(true)
    try {
      setRole(role)
      // Navigate to the appropriate dashboard
      if (role === 'contributor') {
        navigate('/contributor')
      } else {
        navigate('/researcher')
      }
    } catch (error) {
      console.error('Error setting role:', error)
    } finally {
      setIsSelecting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-amber-50/10 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-amber-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-amber-200">Wallet Not Connected</h3>
                <p className="text-amber-300/80">Please connect your wallet to access MedSynapse.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl border border-emerald-400/30">
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              MedSynapse
            </span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Choose your role to access our secure medical data platform
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contributor Card */}
          <button
            onClick={() => handleRoleSelect('contributor')}
            disabled={isSelecting}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-400 hover:shadow-emerald-500/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl p-8 sm:p-10 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-teal-400 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                Data Contributor
              </h3>
              
              <p className="text-slate-300 mb-6 text-base sm:text-lg leading-relaxed">
                Share your anonymized health data securely and earn rewards for contributing to medical research.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-emerald-400">
                  <Database className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Upload Health Records</span>
                </div>
                <div className="flex items-center text-emerald-400">
                  <Shield className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Control Data Privacy</span>
                </div>
                <div className="flex items-center text-emerald-400">
                  <Users className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Earn Contribution Rewards</span>
                </div>
              </div>
            </div>
          </button>

          {/* Researcher Card */}
          <button
            onClick={() => handleRoleSelect('researcher')}
            disabled={isSelecting}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 hover:border-blue-400 hover:shadow-blue-500/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl p-8 sm:p-10 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-indigo-400 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                  <Microscope className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                Medical Researcher
              </h3>
              
              <p className="text-slate-300 mb-6 text-base sm:text-lg leading-relaxed">
                Access anonymized health data for medical research and contribute to advancing healthcare.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-blue-400">
                  <Database className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Request Data Access</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <Microscope className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Analyze Health Trends</span>
                </div>
                <div className="flex items-center text-blue-400">
                  <Activity className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">Advance Medical Research</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Loading State */}
        {isSelecting && (
          <div className="text-center mt-8">
            <div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-300 text-lg">Setting up your account...</p>
            <p className="text-slate-400 text-sm mt-2">Please wait while we configure your access</p>
          </div>
        )}

        {/* Wallet Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl px-6 py-3">
            <Shield className="w-5 h-5 text-emerald-400 mr-3" />
            <p className="text-slate-300 text-sm">
              Connected as: <span className="text-emerald-400 font-mono font-medium">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
