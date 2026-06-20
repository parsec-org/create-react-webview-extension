import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ command }) => {
  const port = 5174;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: './',
    server:
      command === 'serve'
        ? {
            port,
            strictPort: true,
            cors: { origin: '*' },
            headers: { 'Access-Control-Allow-Origin': '*' },
          }
        : undefined,
    build: {
      assetsInlineLimit: 10000,
      outDir: 'dist/webview',
      emptyOutDir: true,
      rollupOptions: {
        input: 'index.html',
      },
    },
  };
});
