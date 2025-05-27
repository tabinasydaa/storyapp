import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/v1': {
        target: 'https://story-api.dicoding.dev/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, ''),
      },
    },
  },
});
