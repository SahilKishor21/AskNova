import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@mui/material': '@mui/material/esm', // Explicitly tell Vite where to find MUI
    },
  },
  build: {
    rollupOptions: {
      external: ['@mui/material'], // Externalize the module if needed
    },
  },
});