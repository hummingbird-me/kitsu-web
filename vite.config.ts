/// <reference types="vitest" />

import path from 'path';
import { defineConfig, BuildOptions } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';
import {
  formatjsCompilePlugin,
  formatjsTransformPlugin,
} from 'rollup-plugin-formatjs';

let build: BuildOptions;
switch (process.env.BUILD_TARGET) {
  case 'library':
    build = {
      outDir: path.resolve(__dirname, 'dist/library'),
      lib: {
        entry: path.resolve(__dirname, 'src/entry-ember.tsx'),
        formats: ['es'],
        fileName: 'kitsu-v4',
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
      },
    };
    break;
  case 'client':
    build = {
      sourcemap: true,
      outDir: path.resolve(__dirname, 'dist/client'),
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          oauth2: path.resolve(__dirname, 'oauth2-callback.html'),
          quEmbed: path.resolve(__dirname, 'qu-embed.html'),
        },
      },
    };
    break;
  case 'server':
    build = {
      outDir: path.resolve(__dirname, 'dist/server'),
      ssr: 'src/entry-server.tsx',
      rollupOptions: {
        input: 'src/entry-server.tsx',
      },
    };
    break;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build,
  json: {
    stringify: true,
  },
  test: {
    exclude: ['cypress', 'node_modules', 'dist', '.git', '.cache'],
    environment: 'happy-dom',
  },
  plugins: [
    formatjsTransformPlugin(),
    formatjsCompilePlugin({
      include: 'src/locales/translations/*.json',
      format: 'crowdin',
      ast: true,
    }),
    ...(process.env.NODE_ENV !== 'test' ? [reactRefresh()] : []),
    svgr(),
  ],
  resolve: {
    alias: {
      ...(mode !== 'development'
        ? {
            '@formatjs/icu-messageformat-parser':
              '@formatjs/icu-messageformat-parser/no-parser',
          }
        : {}),
      app: path.resolve(__dirname, '/src'),
    },
  },
}));
