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

    // Medical-themed animation variables
    let time = 0
    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    
    // ECG waveform data
    const ecgPoints: number[] = []
    for (let i = 0; i < canvas.offsetWidth; i++) {
      ecgPoints.push(0)
    }
    
    // Heartbeat pulse
    let pulsePhase = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      time += 0.015
      pulsePhase += 0.02

      // Update canvas dimensions if resized
      const currentCenterX = canvas.offsetWidth / 2
      const currentCenterY = canvas.offsetHeight / 2

      // Draw ECG heartbeat waveforms
      const ecgWaveCount = 3
      for (let wave = 0; wave < ecgWaveCount; wave++) {
        const waveY = currentCenterY + (wave - 1) * 150
        const waveOffset = wave * 200
        
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.4 - wave * 0.1})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        
        let isFirstPoint = true
        for (let x = 0; x < canvas.offsetWidth; x += 2) {
          const t = (x + waveOffset + time * 100) * 0.02
          
          // Create heartbeat pattern
          let y = waveY
          
          // ECG baseline with heartbeat spikes
          if (Math.sin(t * 0.5) > 0.98) {
            // Strong heartbeat spike
            y += Math.sin(t * 20) * 30 * Math.exp(-Math.abs(Math.cos(t * 0.5)))
          } else if (Math.sin(t * 0.5) > 0.7) {
            // Minor spike
            y += Math.sin(t * 30) * 10
          }
          
          // Subtle rhythm
          y += Math.sin(t) * 5 * (1 + 0.3 * Math.sin(pulsePhase * 2))
          
          if (isFirstPoint) {
            ctx.moveTo(x, y)
            isFirstPoint = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      // Draw pulse circles at center (heartbeat effect)
      const pulseRadius = 80 + Math.sin(pulsePhase) * 30
      const pulseOpacity = 0.1 + Math.sin(pulsePhase) * 0.15
      
      // Create ripple effect
      for (let i = 0; i < 3; i++) {
        const rippleTime = (pulsePhase + i * 0.5) % (Math.PI * 2)
        const rippleRadius = 50 + rippleTime * 40
        const rippleAlpha = Math.max(0, 0.3 - rippleTime / 20)
        
        ctx.strokeStyle = `rgba(239, 68, 68, ${rippleAlpha})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(currentCenterX, currentCenterY, rippleRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw medical data nodes with connections (representing health data)
      const nodeCount = 15
      const nodes: Array<{ x: number; y: number; pulse: number }> = []
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + time
        const radius = 200 + Math.sin(time * 2 + i) * 50
        const pulse = Math.sin(time * 3 + i)
        
        const x = currentCenterX + Math.cos(angle) * radius
        const y = currentCenterY + Math.sin(angle) * radius
        
        nodes.push({ x, y, pulse })
      }

      // Draw connections between nodes
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 250) {
            const alpha = (1 - distance / 250) * 0.2
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw pulse points for each node
      nodes.forEach(node => {
        const size = 3 + node.pulse * 2
        const alpha = 0.6 + node.pulse * 0.4
        
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fill()
        
        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw a subtle heartbeat line at top
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      for (let x = 0; x < canvas.offsetWidth; x += 2) {
        const t = x * 0.05 + time * 1.5
        const y = 50 + Math.sin(t) * 15
        
        // Heartbeat spikes
        if (Math.sin(t * 2) > 0.95) {
          const spikeY = y - Math.sin(t * 15) * 40
          if (x === 0) {
            ctx.moveTo(x, spikeY)
          } else {
            ctx.lineTo(x, spikeY)
          }
        } else {
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      }
      ctx.stroke()

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
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/medsynapse-hero.jpg" 
            alt="Medical Technology" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Medical-themed animated background */}
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full opacity-50"
            style={{ background: 'transparent' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              {/* Logo and Brand */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl border border-blue-400/30">
                      <img src="/logo.png" alt="MedSynapse Logo" className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/20 animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                      MedSynapse
                    </h1>
                    <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mt-2"></div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
                    A <span className="font-semibold text-blue-400">blockchain-based platform</span> where patients can securely share their health data with medical researchers
                  </p>
                  <p className="text-base sm:text-lg text-gray-400">
                    Patients upload encrypted health data, researchers request access for studies, and patients approve or deny each request. All transactions are recorded on the blockchain for transparency.
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/contributor"
                  className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 inline-flex items-center justify-center border border-blue-400/30 text-sm sm:text-base"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-300 animate-heartbeat" />
                  I'm a Contributor
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  to="/researcher"
                  className="group relative bg-transparent border-2 border-blue-500 text-blue-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:bg-blue-500/10 inline-flex items-center justify-center text-sm sm:text-base"
                >
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  I'm a Researcher
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-400/30">
                <img 
                  src="/chemist.jpg" 
                  alt="Medical Research" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-2">Advanced Medical Research</h3>
                  <p className="text-gray-300 text-sm">Cutting-edge technology meets healthcare innovation</p>
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
              How MedSynapse Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A simple 3-step process that connects patients with researchers while keeping data secure and private
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="relative mb-6">
                <img 
                  src="/blockchain.jpg" 
                  alt="Blockchain Technology" 
                  className="w-full h-32 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Step 1: Upload Health Data
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Patients upload their health data (lab results, wearable data, surveys) which gets encrypted and stored securely on the blockchain
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="relative mb-6">
                <img 
                  src="/telehealth.jpg" 
                  alt="Telehealth Technology" 
                  className="w-full h-32 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Step 2: Researchers Request Access
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Medical researchers browse available datasets and request access for their studies, explaining their research purpose
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="relative mb-6">
                <img 
                  src="/medical-tech.jpg" 
                  alt="Medical Technology" 
                  className="w-full h-32 object-cover rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Step 3: Patients Control Access
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Patients review each request and decide whether to approve or deny access. They can revoke access at any time
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