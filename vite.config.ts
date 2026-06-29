import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        cleanupOutdatedCaches: true
      },
      manifest: {
        name: 'ClickStudio — Free Aesthetic Web Photo Booth',
        short_name: 'ClickStudio',
        description: 'Free aesthetic web photo booth. Snap, filter, add stickers & text, and share beautiful photo strips instantly.',
        theme_color: '#FDF5F7',
        background_color: '#FDF5F7',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/store': resolve(__dirname, 'src/store'),
      '@/lib': resolve(__dirname, 'src/lib')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})