import { defineConfig } from 'vite';
import { resolve } from 'path';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  build: {
    outDir: 'dist/frontend',
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.ts'),
      },
      output: {
        manualChunks: {
          vendor: ['@angular/core', '@angular/common', '@angular/platform-browser'],
        },
      },
    },
  },
  resolve: {
    mainFields: ['module'],
  },
  server: {
    port: 4200,
  },
}); 