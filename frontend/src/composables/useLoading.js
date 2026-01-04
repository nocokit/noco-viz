/**
 * 加载状态 Composable
 * 提供统一的加载状态管理
 */
import { ref } from 'vue'
import { ElLoading } from 'element-plus'

export function useLoading(initialState = false) {
  const loading = ref(initialState)
  let loadingInstance = null

  /**
   * 开始加载
   */
  const startLoading = (options = {}) => {
    loading.value = true

    // 如果需要全屏加载
    if (options.fullscreen) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: options.text || '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
        ...options
      })
    }
  }

  /**
   * 停止加载
   */
  const stopLoading = () => {
    loading.value = false

    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
  }

  /**
   * 包装异步函数，自动管理加载状态
   */
  const withLoading = async (fn, options = {}) => {
    startLoading(options)
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  }
}
