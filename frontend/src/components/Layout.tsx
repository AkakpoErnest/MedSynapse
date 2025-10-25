import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import EnvioStatus from './EnvioStatus'
import LighthouseStatus from './LighthouseStatus'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const { disconnect } = useDisconnect()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/contributor', label: 'Contributor' },
    { path: '/researcher', label: 'Researcher' },
    { path: '/datacoin', label: 'Data Coin' },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md shadow-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  {/* Logo container with animations */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 border border-blue-400/30">
                    <img src="/logo.png" alt="MedSynapse Logo" className="w-8 h-8 object-contain" />
                  </div>
                  {/* Glowing effect */}
                  <div className="absolute inset-0 rounded-xl bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  MedSynapse
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    location.pathname === item.path
                      ? 'bg-blue-500/20 text-blue-400 shadow-sm border border-blue-500/30'
                      : 'text-gray-300 hover:text-blue-400 hover:bg-black/50'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Animated underline */}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                </Link>
              ))}
            </div>

              {/* Wallet Connection */}
              <div className="flex items-center space-x-4">
                {/* Service Status */}
                <div className="flex items-center space-x-3">
                  <EnvioStatus className="text-sm" />
                  <LighthouseStatus />
                </div>
                
                {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg border border-green-500/30">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm text-green-400 font-medium">Connected</span>
                  </div>
                  <div className="bg-black/50 px-3 py-2 rounded-lg border border-gray-700">
                    <span className="text-sm text-gray-300 font-mono">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="text-sm text-red-400 hover:text-red-300 font-medium px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors duration-200"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => connect()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 border border-blue-400/30"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout