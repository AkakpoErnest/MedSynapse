import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Brain, Heart, ArrowRight, Sparkles, Lock, Globe, Zap, Database, Users, TrendingUp } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-lg border border-purple-100 animate-bounce-slow">
              <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-semibold text-gray-700">Revolutionizing Healthcare Data</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-extrabold">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                MedSynapse
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              The world's first <span className="text-purple-600 font-bold">decentralized, AI-powered platform</span> for secure health data sharing
            </p>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bridge siloed healthcare data across blockchains while maintaining complete privacy and patient control
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Link
                to="/contributor"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                I'm a Contributor
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/researcher"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                I'm a Researcher
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-sm font-medium text-gray-600">Active Contributors</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">50M+</div>
                <div className="text-sm font-medium text-gray-600">Data Points</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-sm font-medium text-gray-600">Researchers</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-sm font-medium text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">MedSynapse</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge blockchain technology with AI to create the most secure and efficient health data platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Military-Grade Security
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is encrypted with AES-256 and stored securely on Lighthouse with blockchain-verified consent
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning algorithms analyze anonymized data to discover breakthrough medical insights
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Global Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Researchers worldwide can access diverse, real-time medical data from our global contributor network
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Complete Control
              </h3>
              <p className="text-gray-600 leading-relaxed">
                You own your data. Control who accesses it, when, and for what purpose with transparent audit trails
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">MedSynapse</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our three-step process makes secure health data sharing simple and transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Upload & Encrypt
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Contributors securely upload their health data, which gets automatically encrypted and stored on Lighthouse's decentralized network
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <Lock className="w-12 h-12 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Grant Consent
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart contracts manage consent, giving you granular control over who can access your data and for what research purposes
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                <Brain className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Research & Analyze
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Researchers discover breakthrough insights using our AI tools while maintaining complete privacy and data ownership
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto">
            Join thousands of contributors and researchers already using MedSynapse to advance medical research and improve global health outcomes
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/contributor"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-600 bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Contributing
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/researcher"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-purple-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore Datasets
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
