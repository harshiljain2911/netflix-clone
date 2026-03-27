import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Netflix Clone Premium',
        short_name: 'Netflix',
        description: 'Ultra Premium Netflix Clone with React Query and Firestore',
        theme_color: '#141414',
        background_color: '#141414',
        display: 'standalone',
        icons: [
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
