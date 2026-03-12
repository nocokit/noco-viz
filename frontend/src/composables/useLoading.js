/**
 * 加载状态 Composable
 * 提供统一的加载状态管理
 */
import { ref } from 'vue'
import { message } from 'ant-design-vue'

export function useLoading(initialState = false) {
  const loading = ref(initialState)
  let loadingMessageInstance = null

  /**
   * 开始加载
   */
  const startLoading = (options = {}) => {
    loading.value = true

    // 如果需要全屏加载提示
    if (options.fullscreen && options.text) {
      loadingMessageInstance = message.loading(options.text || '加载中...', 0)
    }
  }

  /**
   * 停止加载
   */
  const stopLoading = () => {
    loading.value = false

    if (loadingMessageInstance) {
      loadingMessageInstance()
      loadingMessageInstance = null
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
