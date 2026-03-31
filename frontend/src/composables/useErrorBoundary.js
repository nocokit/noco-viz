/**
 * 错误边界 Composable
 * 用于捕获组件内的错误
 *
 * @example
 * const { error, errorInfo, clearError, captureError } = useErrorBoundary()
 *
 * // 在异步操作中使用
 * await captureError(async () => {
 *   await fetchData()
 * })
 */
import { ref, onErrorCaptured } from 'vue'
import { handleError } from '@/utils/error-handler'

export function useErrorBoundary(options = {}) {
  const {
    onError = null,
    showMessage = true,
    logError = true,
    reportError = false
  } = options

  // 错误状态
  const error = ref(null)
  const errorInfo = ref(null)
  const hasError = ref(false)

  /**
   * 清除错误
   */
  function clearError() {
    error.value = null
    errorInfo.value = null
    hasError.value = false
  }

  /**
   * 捕获错误
   * @param {Function} fn - 要执行的函数
   * @param {Object} context - 错误上下文信息
   */
  async function captureError(fn, context = {}) {
    try {
      clearError()
      return await fn()
    } catch (err) {
      error.value = err
      errorInfo.value = {
        ...context,
        timestamp: new Date().toISOString()
      }
      hasError.value = true

      // 处理错误
      handleError(err, {
        showMessage,
        logError,
        reportError
      })

      // 调用自定义错误处理函数
      if (onError) {
        onError(err, errorInfo.value)
      }

      throw err
    }
  }

  /**
   * 捕获同步错误
   * @param {Function} fn - 要执行的函数
   * @param {Object} context - 错误上下文信息
   */
  function captureErrorSync(fn, context = {}) {
    try {
      clearError()
      return fn()
    } catch (err) {
      error.value = err
      errorInfo.value = {
        ...context,
        timestamp: new Date().toISOString()
      }
      hasError.value = true

      // 处理错误
      handleError(err, {
        showMessage,
        logError,
        reportError
      })

      // 调用自定义错误处理函数
      if (onError) {
        onError(err, errorInfo.value)
      }

      throw err
    }
  }

  /**
   * 安全执行函数（不抛出错误）
   * @param {Function} fn - 要执行的函数
   * @param {*} defaultValue - 发生错误时的默认返回值
   */
  async function safeExecute(fn, defaultValue = null) {
    try {
      return await captureError(fn)
    } catch (err) {
      return defaultValue
    }
  }

  /**
   * 安全执行同步函数（不抛出错误）
   * @param {Function} fn - 要执行的函数
   * @param {*} defaultValue - 发生错误时的默认返回值
   */
  function safeExecuteSync(fn, defaultValue = null) {
    try {
      return captureErrorSync(fn)
    } catch (err) {
      return defaultValue
    }
  }

  // 捕获组件错误
  onErrorCaptured((err, instance, info) => {
    error.value = err
    errorInfo.value = {
      componentName: instance?.$options?.name || 'Unknown',
      info,
      timestamp: new Date().toISOString()
    }
    hasError.value = true

    // 处理错误
    handleError(err, {
      showMessage,
      logError,
      reportError
    })

    // 调用自定义错误处理函数
    if (onError) {
      onError(err, errorInfo.value)
    }

    // 阻止错误继续向上传播
    return false
  })

  return {
    // 状态
    error,
    errorInfo,
    hasError,

    // 方法
    clearError,
    captureError,
    captureErrorSync,
    safeExecute,
    safeExecuteSync
  }
}
