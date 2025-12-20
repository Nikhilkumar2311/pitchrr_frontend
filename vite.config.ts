import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite Configuration
 * 
 * This file configures the Vite build tool for our React application.
 * 
 * Key configurations:
 * 1. React plugin - Enables React Fast Refresh for HMR (Hot Module Replacement)
 * 2. Path aliases - Makes imports cleaner (e.g., @/components instead of ../../components)
 * 
 * WHY PATH ALIASES?
 * - Cleaner imports: import { Button } from '@/components/ui/Button'
 * - No more counting dots: ../../.. becomes @/
 * - Easier refactoring: moving files doesn't break imports
 */
export default defineConfig({
  plugins: [react()],

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
})
