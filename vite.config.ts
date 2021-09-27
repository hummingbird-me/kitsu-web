import path from 'path';
import { defineConfig, BuildOptions } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgr from 'vite-plugin-svgr';
import {
  formatjsCompilePlugin,
  formatjsTransformPlugin,
} from 'rollup-plugin-formatjs';
import { visualizer } from 'rollup-plugin-visualizer';

let build: BuildOptions;
switch (process.env.BUILD_TARGET) {
  case 'library':
    build = {
      outDir: path.resolve(__dirname, 'dist/library'),
      lib: {
        entry: path.resolve(__dirname, 'src/ember.tsx'),
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
      outDir: path.resolve(__dirname, 'dist/client'),
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          oauth2: path.resolve(__dirname, 'oauth2-callback.html'),
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
export default defineConfig({
  build,
  json: {
    stringify: true,
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
  ],
  resolve: {
    alias: {
      '@formatjs/icu-messageformat-parser':
        '@formatjs/icu-messageformat-parser/no-parser',
      app: path.resolve(__dirname, '/src'),
    },
  },
});
