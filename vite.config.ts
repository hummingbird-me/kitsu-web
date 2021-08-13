import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/ember.tsx'),
      formats: ['es'],
      fileName: 'kitsu-v4',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  plugins: [
    ...(process.env.NODE_ENV !== 'test' ? [reactRefresh()] : []),
    svgr(),
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, '/src'),
    },
  },
});
