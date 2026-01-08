import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core-api': path.resolve(__dirname, './src/app/core/api'),
      '@core-auth': path.resolve(__dirname, './src/app/core/auth'),
      '@core-config': path.resolve(__dirname, './src/app/core/config'),
      '@core-hooks': path.resolve(__dirname, './src/app/core/hooks'),
      '@core-types': path.resolve(__dirname, './src/app/core/types'),
      '@core-utils': path.resolve(__dirname, './src/app/core/utils'),
      '@app-main': path.resolve(__dirname, './src/app/main'),
      '@pages-LiveGames': path.resolve(__dirname, './src/app/pages/LiveGames'),
      '@pages-RecentGames': path.resolve(__dirname, './src/app/pages/RecentGames'),
      '@pages-UpcomingSchedule': path.resolve(__dirname, './src/app/pages/UpcomingSchedule'),
      '@pages-Login': path.resolve(__dirname, './src/app/pages/Login'),
      '@shared-components': path.resolve(__dirname, './src/app/shared/components'),
      '@shared-hooks': path.resolve(__dirname, './src/app/shared/hooks'),
      '@shared-types': path.resolve(__dirname, './src/app/shared/types'),
      '@shared-constants': path.resolve(__dirname, './src/app/shared/constants'),
      '@shared-services': path.resolve(__dirname, './src/app/shared/services'),
      '@shared-utils': path.resolve(__dirname, './src/app/shared/utils'),
    },
  },
})