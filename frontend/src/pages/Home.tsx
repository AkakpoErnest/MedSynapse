import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Brain, Heart, ArrowRight, Sparkles, Lock, Globe, Zap, Database, Users, TrendingUp, Star } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 cyber-grid opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full glass-card animate-slide-up">
              <Sparkles className="w-6 h-6 neon-text mr-3 animate-glow" />
              <span className="text-lg font-bold text-white">Revolutionizing Healthcare Data</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-7xl md:text-9xl font-black animate-slide-up stagger-1">
              <span className="text-gradient-animated">
                MedSynapse
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-gray-300 max-w-5xl mx-auto leading-relaxed font-medium animate-slide-up stagger-2">
              The world's first <span className="neon-text font-bold">decentralized, AI-powered platform</span> for secure health data sharing
            </p>
            
            <p className="text-xl text-gray-400 max-w-4xl mx-auto animate-slide-up stagger-3">
              Bridge siloed healthcare data across blockchains while maintaining complete privacy and patient control
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12 animate-slide-up stagger-4">
              <Link
                to="/contributor"
                className="group btn-neon inline-flex items-center justify-center px-10 py-5 text-xl font-bold"
              >
                <Heart className="w-6 h-6 mr-3" />
                I'm a Contributor
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/researcher"
                className="group btn-cyber inline-flex items-center justify-center px-10 py-5 text-xl font-bold"
              >
                <Brain className="w-6 h-6 mr-3" />
                I'm a Researcher
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 max-w-6xl mx-auto">
              <div className="floating-card text-center animate-scale-in stagger-1">
                <div className="text-5xl font-black neon-text mb-3">10K+</div>
                <div className="text-lg font-semibold text-gray-300">Active Contributors</div>
              </div>
              <div className="floating-card text-center animate-scale-in stagger-2">
                <div className="text-5xl font-black neon-text mb-3">50M+</div>
                <div className="text-lg font-semibold text-gray-300">Data Points</div>
              </div>
              <div className="floating-card text-center animate-scale-in stagger-3">
                <div className="text-5xl font-black neon-text mb-3">500+</div>
                <div className="text-lg font-semibold text-gray-300">Researchers</div>
              </div>
              <div className="floating-card text-center animate-scale-in stagger-4">
                <div className="text-5xl font-black neon-text mb-3">99.9%</div>
                <div className="text-lg font-semibold text-gray-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 animate-slide-up">
              Why Choose <span className="text-gradient-animated">MedSynapse</span>?
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto animate-slide-up stagger-1">
              We combine cutting-edge blockchain technology with AI to create the most secure and efficient health data platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="floating-card text-center group animate-slide-up stagger-1">
              <div className="icon-container icon-neon mx-auto group-hover:animate-glow">
                <Shield className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Military-Grade Security
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Your health data is encrypted with AES-256 and stored securely on Lighthouse with blockchain-verified consent
              </p>
            </div>

            {/* Feature 2 */}
            <div className="floating-card text-center group animate-slide-up stagger-2">
              <div className="icon-container icon-purple mx-auto group-hover:animate-glow">
                <Brain className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI-Powered Insights
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Advanced machine learning algorithms analyze anonymized data to discover breakthrough medical insights
              </p>
            </div>

            {/* Feature 3 */}
            <div className="floating-card text-center group animate-slide-up stagger-3">
              <div className="icon-container icon-green mx-auto group-hover:animate-glow">
                <Globe className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Global Network
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                Researchers worldwide can access diverse, real-time medical data from our global contributor network
              </p>
            </div>

            {/* Feature 4 */}
            <div className="floating-card text-center group animate-slide-up stagger-4">
              <div className="icon-container icon-pink mx-auto group-hover:animate-glow">
                <Lock className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Complete Control
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                You own your data. Control who accesses it, when, and for what purpose with transparent audit trails
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 animate-slide-up">
              How <span className="text-gradient-animated">MedSynapse</span> Works
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto animate-slide-up stagger-1">
              Our three-step process makes secure health data sharing simple and transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Step 1 */}
            <div className="text-center animate-slide-up stagger-1">
              <div className="step-circle step-blue animate-float">
                <span className="relative z-10">1</span>
              </div>
              <div className="floating-card">
                <Zap className="w-16 h-16 neon-text mx-auto mb-6 animate-glow" />
                <h3 className="text-3xl font-bold text-white mb-6">
                  Upload & Encrypt
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Contributors securely upload their health data, which gets automatically encrypted and stored on Lighthouse's decentralized network
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center animate-slide-up stagger-2">
              <div className="step-circle step-cyan animate-float">
                <span className="relative z-10">2</span>
              </div>
              <div className="floating-card">
                <Lock className="w-16 h-16 neon-text mx-auto mb-6 animate-glow" />
                <h3 className="text-3xl font-bold text-white mb-6">
                  Grant Consent
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Smart contracts manage consent, giving you granular control over who can access your data and for what research purposes
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center animate-slide-up stagger-3">
              <div className="step-circle step-pink animate-float">
                <span className="relative z-10">3</span>
              </div>
              <div className="floating-card">
                <Brain className="w-16 h-16 neon-text mx-auto mb-6 animate-glow" />
                <h3 className="text-3xl font-bold text-white mb-6">
                  Research & Analyze
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Researchers discover breakthrough insights using our AI tools while maintaining complete privacy and data ownership
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="floating-card p-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 animate-slide-up">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto animate-slide-up stagger-1">
              Join thousands of contributors and researchers already using MedSynapse to advance medical research and improve global health outcomes
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 animate-slide-up stagger-2">
              <Link
                to="/contributor"
                className="group btn-neon inline-flex items-center justify-center px-12 py-6 text-2xl font-bold"
              >
                Start Contributing
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/researcher"
                className="group btn-cyber inline-flex items-center justify-center px-12 py-6 text-2xl font-bold"
              >
                Explore Datasets
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home