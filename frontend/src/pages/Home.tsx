import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Brain, Users, Heart, ArrowRight, Sparkles, Lock, Globe, Zap } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Revolutionizing Healthcare Data</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-gradient">MedSynapse</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              The world's first <span className="font-semibold text-purple-600">decentralized, AI-powered platform</span> for secure health data sharing. 
              Bridge siloed healthcare data across blockchains while maintaining complete privacy and patient control.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Link
                to="/contributor"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Heart className="w-5 h-5 mr-2" />
                I'm a Contributor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/researcher"
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                <Brain className="w-5 h-5 mr-2" />
                I'm a Researcher
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Active Contributors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50M+</div>
                <div className="text-sm text-gray-600">Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Researchers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">MedSynapse</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge blockchain technology with AI to create the most secure and efficient health data platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card text-center">
              <div className="icon-wrapper icon-blue mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Military-Grade Security
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your health data is encrypted with AES-256 and stored securely on Lighthouse with blockchain-verified consent.
              </p>
            </div>

            <div className="feature-card text-center">
              <div className="icon-wrapper icon-purple mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning algorithms analyze anonymized data to discover breakthrough medical insights.
              </p>
            </div>

            <div className="feature-card text-center">
              <div className="icon-wrapper icon-green mx-auto">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Global Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Researchers worldwide can access diverse, real-time medical data from our global contributor network.
              </p>
            </div>

            <div className="feature-card text-center">
              <div className="icon-wrapper icon-orange mx-auto">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Complete Control
              </h3>
              <p className="text-gray-600 leading-relaxed">
                You own your data. Control who accesses it, when, and for what purpose with transparent audit trails.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-gradient">MedSynapse</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our three-step process makes secure health data sharing simple and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="step-number step-blue">1</div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Upload & Encrypt
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Contributors securely upload their health data, which gets automatically encrypted and stored on Lighthouse's decentralized network.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="step-number step-green">2</div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Grant Consent
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart contracts manage consent, giving you granular control over who can access your data and for what research purposes.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="step-number step-purple">3</div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Research & Analyze
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Researchers discover breakthrough insights using our AI tools while maintaining complete privacy and data ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of contributors and researchers already using MedSynapse to advance medical research.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/contributor"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Start Contributing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/researcher"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center justify-center"
            >
              Explore Datasets
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
