import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
});
