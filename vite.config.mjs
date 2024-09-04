import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig(({ mode }) => {
  console.log(`Running in ${mode} mode`);

  // Set the backend URL based on the environment
  const backendUrl = process.env[`VITE_API_BASE_URL_${mode.toUpperCase()}`] || process.env.VITE_API_BASE_URL;

  console.log(`Backend URL: ${backendUrl}`);

  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl, // Your backend API server
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix from path
          secure: true // Make sure requests are secure (HTTPS)
        },
      },
    },
  }
})
