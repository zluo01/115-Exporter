import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import buildContentScript from './plugins/build-content-script';
import cleanBuildScript from './plugins/clean-build';
import makeManifest from './plugins/make-manifest';
import moveEntryScript from './plugins/move-entry';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'build');
const publicDir = resolve(__dirname, 'public');

export default defineConfig({
  resolve: {
    alias: {
      '@src': root,
    },
  },
  plugins: [
    react(),
    cleanBuildScript(),
    makeManifest(),
    moveEntryScript(),
    buildContentScript(),
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: process.env.__DEV__ === 'true',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        options: resolve(root, 'options', 'index.html'),
        background: resolve(root, 'background', 'index.ts'),
      },
      output: {
        entryFileNames: chunk => `${chunk.name}/index.js`,
      },
    },
  },
});
