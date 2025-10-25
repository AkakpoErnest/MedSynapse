import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, Stethoscope, LogOut, Shield } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const { disconnect } = useDisconnect()
  const { user, logout: authLogout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    authLogout()
    disconnect()
    setMobileMenuOpen(false)
  }

         // Base navigation items
         const baseNavItems = [
           { path: '/', label: 'Home' },
           { path: '/ai-dashboard', label: 'AI Dashboard' }
         ]

  // Contributor-specific navigation
  const contributorNavItems = [
    ...baseNavItems,
    { path: '/contributor', label: 'Dashboard' },
    { path: '/upload', label: 'Upload Data' },
    { path: '/datacoin', label: 'Data Coin' }
  ]

  // Researcher-specific navigation
  const researcherNavItems = [
    ...baseNavItems,
    { path: '/researcher', label: 'Dashboard' },
    { path: '/analysis', label: 'Analysis' }
  ]

  // Get navigation items based on user role
  const getNavItems = () => {
    if (user?.role === 'contributor') {
      return contributorNavItems
    } else if (user?.role === 'researcher') {
      return researcherNavItems
    }
    return baseNavItems
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110 border border-emerald-400/30">
                    <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  MedSynapse
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    location.pathname === item.path
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30'
                      : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-emerald-400 transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              ))}
            </div>

            {/* Wallet Connection & User Info */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* User Role Badge */}
                  {user && (
                    <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/20 px-3 py-2 rounded-lg border border-emerald-500/30">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium capitalize">{user.role}</span>
                    </div>
                  )}
                  
                  {/* Wallet Address */}
                  <div className="bg-emerald-500/20 px-2 sm:px-3 py-2 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-xs sm:text-sm text-emerald-400 font-medium font-mono">
                        {address?.slice(0, 4)}...{address?.slice(-4)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 font-medium px-2 sm:px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => connect()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-teal-700 border border-emerald-400/30 text-sm sm:text-base"
                >
                  Connect Wallet
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-blue-500/20">
            <div className="px-4 py-4 space-y-2">
              {getNavItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:text-blue-400 hover:bg-black/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile User Info */}
              {user && (
                <div className="px-4 py-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout