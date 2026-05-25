import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the draft SPA as a single self-contained IIFE bundle that Drupal
// loads via the lorcana_draft/app library on /draft only. Output names are
// fixed (no content hashes) so the library definition stays stable, and the
// committed dist/ is what ships — no Node runtime on the server.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.tsx',
      output: {
        format: 'iife',
        entryFileNames: 'draft.js',
        assetFileNames: (asset) =>
          asset.names?.some((n) => n.endsWith('.css')) ? 'draft.css' : '[name][extname]',
      },
    },
  },
});
