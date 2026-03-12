import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // 热加载配置
    hmr: {
      overlay: true, // 在浏览器中显示错误覆盖层
    },
    watch: {
      usePolling: true, // Docker 环境需要轮询模式
      interval: 100,    // 轮询间隔
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // /safe 开头的请求代理到 PHP 后端
      '/safe': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },
})
