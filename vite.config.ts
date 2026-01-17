import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // SECURITY UPDATE: We explicitly set this to an empty string for the public build.
    // This ensures your local machine's API_KEY is NOT baked into the deployable code.
    'process.env.API_KEY': JSON.stringify(""),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});