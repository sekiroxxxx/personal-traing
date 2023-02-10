import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'

const isDev: boolean = (process.env.USE_MOCK as unknown as boolean) || false;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  viteMockServe({
    mockPath: "src/mock",
    localEnabled: true,
    supportTs: true,
    watchFiles: true,
  })
  ],
    
})
