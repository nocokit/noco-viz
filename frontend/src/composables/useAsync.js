/**
 * useAsync - 异步数据加载 Composable
 * 提供统一的异步数据加载、错误处理和加载状态管理
 */
import { ref, shallowRef } from 'vue'

export function useAsync(asyncFn, options = {}) {
  const {
    immediate = false,
    shallow = true,
    onSuccess,
    onError
  } = options

  // 使用 shallowRef 优化大数据性能
  const data = shallow ? shallowRef(null) : ref(null)
  const error = ref(null)
  const loading = ref(false)

  const execute = async (...args) => {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFn(...args)
      data.value = result

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (e) {
      error.value = e

      if (onError) {
        onError(e)
      } else {
        console.error('Async error:', e)
      }

      throw e
    } finally {
      loading.value = false
    }
  }

  // 立即执行
  if (immediate) {
    execute()
  }

  return {
    data,
    error,
    loading,
    execute
  }
}
