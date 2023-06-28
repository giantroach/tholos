import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `modules/app.js`,
        chunkFileNames: 'modules/chunk.js',
        assetFileNames: `modules/[name].[ext]`,
      },
    },
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
