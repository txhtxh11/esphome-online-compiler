import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // esp-web-tools 的 Web Component，按自定义元素处理
          isCustomElement: (tag) => tag.startsWith('esp-')
        }
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true
      }
    }
  }
});
