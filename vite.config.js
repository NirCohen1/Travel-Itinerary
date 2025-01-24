import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  external: ['vue'],
  base: '/Travel-Itinerary/', // Correct base path for GitHub Pages
})
