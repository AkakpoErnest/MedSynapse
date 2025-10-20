import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Brain, Heart, ArrowRight, Zap, Globe, Database } from 'lucide-react'

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Sphere animation
    const particles: Array<{
      x: number
      y: number
      z: number
      vx: number
      vy: number
      vz: number
    }> = []

    // Create particles in a sphere
    const numParticles = 50
    for (let i = 0; i < numParticles; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const radius = 100

      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2

      // Update particles
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.z += particle.vz

        // Keep particles in sphere
        const distance = Math.sqrt(particle.x ** 2 + particle.y ** 2 + particle.z ** 2)
        if (distance > 100) {
          particle.x *= 100 / distance
          particle.y *= 100 / distance
          particle.z *= 100 / distance
        }
      })

      // Draw connections
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dz = particles[i].z - particles[j].z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (distance < 80) {
            const alpha = 1 - distance / 80
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.3})`
            ctx.beginPath()
            ctx.moveTo(
              centerX + particles[i].x,
              centerY + particles[i].y
            )
            ctx.lineTo(
              centerX + particles[j].x,
              centerY + particles[j].y
            )
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach(particle => {
        const screenX = centerX + particle.x
        const screenY = centerY + particle.y
        const size = (100 + particle.z) / 200 * 3

        ctx.fillStyle = `rgba(59, 130, 246, ${(100 + particle.z) / 200})`
        ctx.beginPath()
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Sphere Background */}
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full opacity-60"
            style={{ background: 'transparent' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Logo and Brand */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/30">
                      <img src="/logo.png" alt="MedSynapse Logo" className="w-14 h-14 object-contain" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/20 animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                      MedSynapse
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mt-2"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-2xl text-gray-300 leading-relaxed">
                    The world's first <span className="font-semibold text-blue-400">decentralized, AI-powered</span> platform for secure health data sharing
                  </p>
                  <p className="text-lg text-gray-400">
                    Bridge siloed healthcare data across blockchains while maintaining complete privacy and patient control
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contributor"
                  className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 inline-flex items-center justify-center border border-blue-400/30"
                >
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  I'm a Contributor
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/researcher"
                  className="group relative bg-transparent border-2 border-blue-500 text-blue-400 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 inline-flex items-center justify-center"
                >
                  <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  I'm a Researcher
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
            
            {/* Right Content - Features */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/40 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Military-Grade Security</h3>
                      <p className="text-gray-400 text-sm">AES-256 encryption with blockchain-verified consent</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/40 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">AI-Powered Insights</h3>
                      <p className="text-gray-400 text-sm">Advanced ML algorithms for medical discoveries</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/40 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Global Network</h3>
                      <p className="text-gray-400 text-sm">Worldwide researcher access to diverse datasets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why Choose MedSynapse?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We combine cutting-edge blockchain technology with AI to create the most secure and efficient health data platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Decentralized Storage
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your health data is encrypted and stored across multiple blockchain networks for maximum security and availability
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Real-Time Processing
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Lightning-fast data processing and analysis using advanced AI algorithms for instant insights
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Privacy First
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Complete patient control with granular consent management and anonymization protocols
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-blue-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">MedSynapse</h3>
            <p className="text-gray-400">Transforming healthcare through decentralized data sharing</p>
            <div className="flex justify-center space-x-6">
              <Link to="/contributor" className="text-gray-400 hover:text-blue-400 transition-colors">
                Contributor
              </Link>
              <Link to="/researcher" className="text-gray-400 hover:text-blue-400 transition-colors">
                Researcher
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home