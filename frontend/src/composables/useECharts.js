/**
 * ECharts 通用 Composable
 * 用于复用图表初始化、更新、销毁等逻辑
 */

import { ref, onMounted, onUnmounted, watch, computed, unref } from 'vue'
import * as echarts from 'echarts'

/**
 * @typedef {Object} UseEChartsOptions
 * @property {Object|import('vue').Ref<Object>} option - 图表配置项（支持响应式）
 * @property {string} [theme='dark'] - 图表主题
 * @property {boolean} [autoResize=true] - 是否自动监听窗口 resize
 * @property {boolean} [notMerge=false] - 是否不跟之前的配置合并
 * @property {boolean} [lazyUpdate=false] - 是否延迟更新
 * @property {Function} [onInit] - 图表初始化后的回调
 */

/**
 * 使用 ECharts
 * @param {UseEChartsOptions} options - 配置选项
 * @returns {{
 *   chartRef: import('vue').Ref,
 *   chartInstance: import('vue').Ref,
 *   setOption: Function,
 *   resize: Function,
 *   clear: Function,
 *   dispose: Function
 * }}
 */
export function useECharts(options = {}) {
  const {
    option,
    theme = 'dark',
    autoResize = true,
    notMerge = false,
    lazyUpdate = false,
    onInit
  } = options

  // 图表 DOM 引用
  const chartRef = ref(null)

  // 图表实例引用
  const chartInstance = ref(null)

  /**
   * 初始化图表
   */
  const initChart = () => {
    if (!chartRef.value) {
      console.warn('[useECharts] chartRef is not ready')
      return
    }

    // 如果已存在实例，先销毁
    if (chartInstance.value) {
      chartInstance.value.dispose()
    }

    // 创建新实例
    chartInstance.value = echarts.init(chartRef.value, unref(theme))

    // 设置初始配置
    if (option) {
      setOption(unref(option))
    }

    // 添加 resize 监听
    if (autoResize) {
      window.addEventListener('resize', handleResize)
    }

    // 执行初始化回调
    onInit?.(chartInstance.value)
  }

  /**
   * 设置图表配置
   * @param {Object} opts - ECharts 配置对象
   * @param {boolean} merge - 是否合并配置
   */
  const setOption = (opts, merge = !notMerge) => {
    if (!chartInstance.value) {
      console.warn('[useECharts] Chart instance is not initialized')
      return
    }

    chartInstance.value.setOption(opts, !merge, lazyUpdate)
  }

  /**
   * 调整图表大小
   */
  const resize = () => {
    chartInstance.value?.resize()
  }

  /**
   * 处理窗口 resize 事件
   */
  const handleResize = () => {
    resize()
  }

  /**
   * 清空图表
   */
  const clear = () => {
    chartInstance.value?.clear()
  }

  /**
   * 销毁图表实例
   */
  const dispose = () => {
    if (autoResize) {
      window.removeEventListener('resize', handleResize)
    }
    chartInstance.value?.dispose()
    chartInstance.value = null
  }

  // 监听配置变化
  if (option) {
    watch(
      () => unref(option),
      (newOption) => {
        if (newOption && chartInstance.value) {
          setOption(newOption)
        }
      },
      { deep: true }
    )
  }

  // 监听主题变化
  watch(
    () => unref(theme),
    () => {
      if (chartInstance.value) {
        dispose()
        initChart()
      }
    }
  )

  // 生命周期钩子
  onMounted(() => {
    initChart()
  })

  onUnmounted(() => {
    dispose()
  })

  return {
    chartRef,
    chartInstance,
    setOption,
    resize,
    clear,
    dispose
  }
}

/**
 * 使用 ECharts（简化版）
 * 直接传入配置对象，返回 chartRef
 * @param {Object|import('vue').Ref<Object>} option - 图表配置
 * @param {Object} options - 其他配置项
 * @returns {import('vue').Ref} chartRef
 */
export function useSimpleChart(option, options = {}) {
  const { chartRef, chartInstance } = useECharts({
    option,
    ...options
  })

  return chartRef
}

/**
 * 获取图表实例（用于高级操作）
 * @param {import('vue').Ref} chartRef - 图表 DOM 引用
 * @param {Object} options - 配置项
 * @returns {{
 *   instance: import('vue').Ref,
 *   init: Function,
 *   dispose: Function
 * }}
 */
export function useChartInstance(chartRef, options = {}) {
  const { theme = 'dark' } = options
  const instance = ref(null)

  const init = () => {
    if (!chartRef.value) return
    instance.value = echarts.init(chartRef.value, theme)
    return instance.value
  }

  const dispose = () => {
    instance.value?.dispose()
    instance.value = null
  }

  onMounted(init)
  onUnmounted(dispose)

  return {
    instance,
    init,
    dispose
  }
}
