import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Hostinger serves whatever we upload; there is no server-side transpiling,
    // so target the baseline every browser we care about already supports.
    target: 'es2020',

    // Nothing on a shared host should be shipping original sources.
    sourcemap: false,

    // Anything smaller than this is inlined as a data URI, which trades a
    // round-trip for a few bytes. Worth it on a shared host with no HTTP/3.
    assetsInlineLimit: 4096,

    cssMinify: true,
    reportCompressedSize: true,

    rollupOptions: {
      output: {
        /**
         * Split the vendor libraries out of the app bundle.
         *
         * The point is cache lifetime, not total bytes: three.js and framer-motion
         * change only when we upgrade them, while the app code changes every
         * deploy. Kept in one bundle, every copy edit re-downloads 1.6 MB.
         */
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion'],
          react: ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
        },
        /**
         * Built output goes to /static/, not the default /assets/.
         *
         * public/assets/ is copied to dist/assets/ verbatim with stable names,
         * so mixing the two would force one cache policy on both. Separated, the
         * .htaccess can mark /static/ immutable for a year (every filename is
         * content-hashed) while keeping /assets/ on a shorter TTL, so replacing
         * a photo does not require a cache bust.
         */
        entryFileNames: 'static/[name]-[hash].js',
        chunkFileNames: 'static/[name]-[hash].js',
        assetFileNames: 'static/[name]-[hash][extname]',
      },
    },

    // three.js alone is over the default 500 kB warning. Raised so a real
    // regression stands out instead of being lost in expected noise.
    chunkSizeWarningLimit: 700,
  },
});
