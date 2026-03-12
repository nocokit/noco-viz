import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path
      },
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    // 生产环境移除 console
    esbuild: {
      drop: ['console', 'debugger']
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Ant Design Vue 按模块拆分
            if (id.includes('ant-design-vue')) {
              if (id.includes('es/table')) return 'antd-table'
              if (id.includes('es/form')) return 'antd-form'
              if (id.includes('es/modal')) return 'antd-modal'
              return 'ant-design-vue'
            }
            // ECharts 按需拆分
            if (id.includes('echarts')) {
              if (id.includes('echarts-gl')) return 'echarts-gl'
              if (id.includes('echarts-wordcloud')) return 'echarts-wordcloud'
              if (id.includes('echarts-liquidfill')) return 'echarts-liquidfill'
              return 'echarts'
            }
            // Vue 相关
            if (id.includes('@vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor'
            }
            // Axios
            if (id.includes('axios')) {
              return 'axios'
            }
            // 其他第三方库
            return 'vendor'
          }
          // 编辑器相关
          if (id.includes('/src/views/ScreenEditor') || id.includes('/src/views/editor/')) {
            return 'screen-editor'
          }
          // 编辑器组件
          if (id.includes('/src/components/editor/')) {
            return 'editor-components'
          }
          // 图表组件
          if (id.includes('/src/components/charts/')) {
            return 'chart-components'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'ant-design-vue'
    ],
    exclude: ['vue-demi']
  }
})
