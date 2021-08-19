import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';
import yaml from '@rollup/plugin-yaml';
import {
  formatjsCompilePlugin,
  formatjsTransformPlugin,
} from 'rollup-plugin-formatjs';

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
    formatjsTransformPlugin(),
    formatjsCompilePlugin({
      include: 'src/translations/*.json',
      format: 'crowdin',
      ast: true,
    }),
    ...(process.env.NODE_ENV !== 'test' ? [reactRefresh()] : []),
    svgr(),
    yaml(),
  ],
  resolve: {
    alias: {
      '@formatjs/icu-messageformat-parser':
        '@formatjs/icu-messageformat-parser/no-parser',
      app: path.resolve(__dirname, '/src'),
    },
  },
});
