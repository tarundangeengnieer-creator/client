import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      exclude: ['maplibre-gl']
    },
    define: {
      // Prevent injection of blocked/restricted MapTiler key and URL that triggers 403 AJAXError
      ...(process.env.VITE_MAP_STYLE_URL?.includes('zYKYSrqBLdICoKctGogc') || process.env.VITE_MAPTILER_API_KEY === 'zYKYSrqBLdICoKctGogc' ? {
        'import.meta.env.VITE_MAP_STYLE_URL': JSON.stringify('https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'),
        'import.meta.env.VITE_MAPTILER_API_KEY': JSON.stringify(''),
      } : {}),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
