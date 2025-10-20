import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Brain, Heart, ArrowRight, Lock, Globe, Zap, Users, Database, TrendingUp } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  MedSynapse
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The world's first decentralized, AI-powered platform for secure health data sharing
                </p>
                <p className="text-lg text-gray-500">
                  Bridge siloed healthcare data across blockchains while maintaining complete privacy and patient control
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contributor"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  I'm a Contributor
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/researcher"
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  I'm a Researcher
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Right Illustration */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Health Data</h3>
                    <p className="text-gray-600">Encrypted and decentralized storage</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">10K+</div>
                      <div className="text-sm text-gray-600">Contributors</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">50M+</div>
                      <div className="text-sm text-gray-600">Data Points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose MedSynapse?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge blockchain technology with AI to create the most secure and efficient health data platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Military-Grade Security
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is encrypted with AES-256 and stored securely on Lighthouse with blockchain-verified consent
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning algorithms analyze anonymized data to discover breakthrough medical insights
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Global Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Researchers worldwide can access diverse, real-time medical data from our global contributor network
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How MedSynapse Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our three-step process makes secure health data sharing simple and transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div className="card">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Upload & Encrypt
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Contributors securely upload their health data, which gets automatically encrypted and stored on Lighthouse's decentralized network
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="card">
                <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Grant Consent
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart contracts manage consent, giving you granular control over who can access your data and for what research purposes
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div className="card">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Research & Analyze
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Researchers discover breakthrough insights using our AI tools while maintaining complete privacy and data ownership
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join the growing community of contributors and researchers advancing medical research
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50M+</div>
              <div className="text-blue-100">Data Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Researchers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of contributors and researchers already using MedSynapse to advance medical research and improve global health outcomes
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contributor"
                className="btn-primary inline-flex items-center justify-center"
              >
                Start Contributing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/researcher"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Explore Datasets
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold">MedSynapse</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The world's first decentralized, AI-powered platform for secure health data sharing. 
                Transforming healthcare through blockchain technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/contributor" className="block text-gray-400 hover:text-white transition-colors">
                  Contributor Dashboard
                </Link>
                <Link to="/researcher" className="block text-gray-400 hover:text-white transition-colors">
                  Researcher Dashboard
                </Link>
                <Link to="/upload" className="block text-gray-400 hover:text-white transition-colors">
                  Upload Data
                </Link>
                <Link to="/analysis" className="block text-gray-400 hover:text-white transition-colors">
                  Data Analysis
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>support@medsynapse.com</p>
                <p>+1 (555) 123-4567</p>
                <p>San Francisco, CA</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MedSynapse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home