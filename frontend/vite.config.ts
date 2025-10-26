import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: http://localhost:* ws://localhost:*;"
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps for production
    minify: 'esbuild',
    rollupOptions: {
      external: (id) => {
        return id.includes('@safe-global') || id.includes('@safe-globalThis')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          wagmi: ['wagmi', 'viem'],
          ui: ['lucide-react'],
          utils: ['ethers', 'graphql-request']
        }
      }
    },
    // Optimize for production
    target: 'esnext',
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  define: {
    global: 'globalThis',
    'process.env': process.env
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'wagmi',
      'viem',
      'ethers',
      'lucide-react'
    ],
    exclude: ['@base-org/account'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  // Environment variables
  envPrefix: 'VITE_'
})
