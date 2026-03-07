import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Sitemap from 'vite-plugin-sitemap'

/**
 * Vite Configuration
 * 
 * This file configures the Vite build tool for our React application.
 * 
 * Key configurations:
 * 1. React plugin - Enables React Fast Refresh for HMR (Hot Module Replacement)
 * 2. Path aliases - Makes imports cleaner (e.g., @/components instead of ../../components)
 * 3. Sitemap - Automatically generates sitemap.xml for SEO during build
 * 
 * WHY PATH ALIASES?
 * - Cleaner imports: import { Button } from '@/components/ui/Button'
 * - No more counting dots: ../../.. becomes @/
 * - Easier refactoring: moving files doesn't break imports
 */
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://pitchrr.in',
      generateRobotsTxt: true,
      // Focus on public routes for the sitemap since protected ones are useless for crawlers
      dynamicRoutes: [
        '/',
        '/login',
        '/register',
        '/privacy',
        '/terms',
        '/refund',
        '/contact',
        '/about'
      ]
    })
  ],

  // Path aliases configuration
  // Each alias maps a shorthand to a directory in src/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/layout': path.resolve(__dirname, './src/layout'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/app': path.resolve(__dirname, './src/app'),
    },
  },

  // Build optimization - split vendor libraries into separate chunks
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React libraries
          if (id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-router/')) {
            return 'vendor-react';
          }
          // Animation libraries
          if (id.includes('node_modules/gsap/') ||
            id.includes('node_modules/framer-motion/')) {
            return 'vendor-animation';
          }
          // Charting library
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-charts';
          }
          // State management and data fetching
          if (id.includes('node_modules/@tanstack/react-query/') ||
            id.includes('node_modules/zustand/') ||
            id.includes('node_modules/axios/')) {
            return 'vendor-utils';
          }
        },
      },
    },
    // Increase chunk size warning limit slightly (default is 500kb)
    chunkSizeWarningLimit: 600,
  },
})
