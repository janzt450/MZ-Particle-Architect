
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This ensures assets load correctly on Neocities (relative paths)
  base: './',
  define: {
    // We define this as a safe fallback string to prevent runtime crashes if code references it.
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
