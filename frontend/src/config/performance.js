/**
 * 组件性能优化配置
 * 提供懒加载、虚拟滚动等性能优化方案
 */

// ============================================
// 1. 组件懒加载配置
// ============================================

import { defineAsyncComponent } from 'vue'

/**
 * 创建懒加载组件
 * @param {Function} loader - 组件加载函数
 * @param {Object} options - 配置选项
 */
export const createLazyComponent = (loader, options = {}) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: options.loading,
    errorComponent: options.error,
    delay: options.delay || 200,
    timeout: options.timeout || 30000,
    suspensible: options.suspensible !== false,
    onError: options.onError
  })
}

// ============================================
// 2. 常用组件懒加载配置
// ============================================

// 大型组件懒加载
export const lazyComponents = {
  // 演示中心（较大）
  ComponentDemo: createLazyComponent(() => import('@/views/ComponentDemo.vue')),

  // 复杂表单组件
  StepModal: createLazyComponent(() => import('@/components/common/StepModal/index.vue')),
  ResourceUploader: createLazyComponent(() => import('@/components/common/ResourceUploader/index.vue')),

  // 数据展示组件
  DataTable: createLazyComponent(() => import('@/components/common/DataTable/index.vue')),
  InfoCard: createLazyComponent(() => import('@/components/common/InfoCard/index.vue'))
}

// ============================================
// 3. 虚拟滚动配置
// ============================================

/**
 * DataTable 虚拟滚动配置
 */
export const virtualScrollConfig = {
  // 启用虚拟滚动的最小数据量
  minDataLength: 100,

  // 虚拟滚动配置
  virtualConfig: {
    height: 600, // 表格高度
    itemHeight: 48, // 每行高度
    buffer: 10 // 缓冲区行数
  }
}

/**
 * 判断是否应该启用虚拟滚动
 */
export const shouldUseVirtualScroll = (dataLength) => {
  return dataLength >= virtualScrollConfig.minDataLength
}

// ============================================
// 4. 图片懒加载配置
// ============================================

/**
 * 图片懒加载指令配置
 */
export const imageLazyLoadConfig = {
  // 占位图
  loading: '/assets/loading.png',
  error: '/assets/error.png',

  // IntersectionObserver 配置
  observerOptions: {
    rootMargin: '50px',
    threshold: 0.01
  }
}

// ============================================
// 5. 防抖节流配置
// ============================================

/**
 * 防抖延迟配置（毫秒）
 */
export const debounceDelays = {
  search: 300, // 搜索输入
  resize: 150, // 窗口调整
  scroll: 100, // 滚动事件
  input: 300 // 普通输入
}

/**
 * 节流延迟配置（毫秒）
 */
export const throttleDelays = {
  scroll: 100, // 滚动事件
  resize: 150, // 窗口调整
  mousemove: 50 // 鼠标移动
}

// ============================================
// 6. 缓存配置
// ============================================

/**
 * 组件缓存配置
 */
export const cacheConfig = {
  // 需要缓存的组件列表
  include: [
    'ProjectList',
    'MediaLibrary',
    'DataSourceList'
  ],

  // 不缓存的组件列表
  exclude: [
    'Login',
    'ComponentDemo'
  ],

  // 最大缓存数量
  max: 10
}

// ============================================
// 7. 代码分割配置
// ============================================

/**
 * 路由懒加载配置
 */
export const routeLazyLoadConfig = {
  // 预加载策略
  prefetch: true,

  // 预加载延迟（毫秒）
  prefetchDelay: 2000,

  // Webpack 魔法注释配置
  webpackChunkName: (path) => {
    const name = path.split('/').pop().replace('.vue', '')
    return `view-${name}`
  }
}

// ============================================
// 8. 性能监控配置
// ============================================

/**
 * 性能监控阈值
 */
export const performanceThresholds = {
  // 组件渲染时间（毫秒）
  componentRenderTime: 16, // 60fps

  // 数据加载时间（毫秒）
  dataLoadTime: 1000,

  // 首屏加载时间（毫秒）
  firstScreenTime: 2000,

  // 路由切换时间（毫秒）
  routeChangeTime: 300
}

// ============================================
// 9. 优化建议
// ============================================

/**
 * 性能优化最佳实践
 */
export const performanceBestPractices = {
  // 1. 组件懒加载
  lazyLoad: {
    description: '对大型组件使用懒加载',
    example: `
      const HeavyComponent = defineAsyncComponent(() =>
        import('@/components/HeavyComponent.vue')
      )
    `
  },

  // 2. 虚拟滚动
  virtualScroll: {
    description: '大数据量列表使用虚拟滚动',
    example: `
      <DataTable
        :data="largeDataset"
        :virtual="true"
        :height="600"
      />
    `
  },

  // 3. 图片优化
  imageOptimization: {
    description: '使用懒加载和合适的图片格式',
    example: `
      <img v-lazy="imageUrl" alt="description" />
    `
  },

  // 4. 防抖节流
  debounceThrottle: {
    description: '对频繁触发的事件使用防抖或节流',
    example: `
      import { debounce } from 'lodash-es'
      const handleSearch = debounce((value) => {
        // 搜索逻辑
      }, 300)
    `
  },

  // 5. 组件缓存
  keepAlive: {
    description: '对需要保持状态的组件使用 keep-alive',
    example: `
      <keep-alive :include="['ProjectList', 'MediaLibrary']">
        <router-view />
      </keep-alive>
    `
  },

  // 6. 代码分割
  codeSplitting: {
    description: '使用路由懒加载和动态导入',
    example: `
      {
        path: '/projects',
        component: () => import('@/views/ProjectList.vue')
      }
    `
  }
}

// ============================================
// 10. 导出配置
// ============================================

export default {
  createLazyComponent,
  lazyComponents,
  virtualScrollConfig,
  shouldUseVirtualScroll,
  imageLazyLoadConfig,
  debounceDelays,
  throttleDelays,
  cacheConfig,
  routeLazyLoadConfig,
  performanceThresholds,
  performanceBestPractices
}
