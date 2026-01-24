/**
 * HTTP 请求 Composable
 * 提供请求状态管理、重试、取消等功能
 *
 * @example
 * const { data, loading, error, execute, cancel } = useRequest(
 *   () => api.getList(),
 *   { immediate: true, retry: 3 }
 * )
 */
import { ref, computed, onUnmounted } from 'vue'
import { retryRequest, requestCancelManager } from '@/utils/request-enhancer'
import { handleError } from '@/utils/error-handler'

export function useRequest(requestFn, options = {}) {
  const {
    immediate = false,        // 是否立即执行
    retry = 0,                // 重试次数
    retryDelay = 1000,        // 重试延迟
    onSuccess = null,         // 成功回调
    onError = null,           // 错误回调
    onFinally = null,         // 完成回调
    showError = true,         // 是否显示错误提示
    transform = null          // 数据转换函数
  } = options

  // 状态
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isSuccess = ref(false)
  const isError = ref(false)

  // 请求控制器
  let abortController = null
  let requestKey = null

  /**
   * 执行请求
   * @param {*} params - 请求参数
   */
  async function execute(...params) {
    loading.value = true
    error.value = null
    isSuccess.value = false
    isError.value = false

    try {
      // 创建取消控制器
      abortController = new AbortController()

      // 执行请求（带重试）
      let result
      if (retry > 0) {
        result = await retryRequest(
          () => requestFn(...params),
          {
            retries: retry,
            retryDelay
          }
        )
      } else {
        result = await requestFn(...params)
      }

      // 数据转换
      data.value = transform ? transform(result) : result
      isSuccess.value = true

      // 成功回调
      if (onSuccess) {
        onSuccess(data.value)
      }

      return data.value
    } catch (err) {
      error.value = err
      isError.value = true

      // 错误处理
      if (showError) {
        handleError(err)
      }

      // 错误回调
      if (onError) {
        onError(err)
      }

      throw err
    } finally {
      loading.value = false

      // 完成回调
      if (onFinally) {
        onFinally()
      }
    }
  }

  /**
   * 取消请求
   */
  function cancel() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }

    if (requestKey) {
      requestCancelManager.cancel(requestKey)
      requestKey = null
    }

    loading.value = false
  }

  /**
   * 重置状态
   */
  function reset() {
    data.value = null
    loading.value = false
    error.value = null
    isSuccess.value = false
    isError.value = false
  }

  // 立即执行
  if (immediate) {
    execute()
  }

  // 组件卸载时取消请求
  onUnmounted(() => {
    cancel()
  })

  return {
    // 状态
    data,
    loading,
    error,
    isSuccess,
    isError,

    // 方法
    execute,
    cancel,
    reset
  }
}

/**
 * 分页请求 Composable
 * @param {Function} requestFn - 请求函数
 * @param {Object} options - 配置选项
 */
export function usePaginatedRequest(requestFn, options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    ...requestOptions
  } = options

  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const { data, loading, error, execute, ...rest } = useRequest(
    (params = {}) => requestFn({
      page: page.value,
      limit: pageSize.value,
      ...params
    }),
    requestOptions
  )

  /**
   * 加载指定页
   * @param {number} pageNum - 页码
   */
  async function loadPage(pageNum, params = {}) {
    page.value = pageNum
    const result = await execute(params)

    // 更新总数
    if (result && typeof result.total === 'number') {
      total.value = result.total
    }

    return result
  }

  /**
   * 下一页
   */
  function nextPage(params = {}) {
    return loadPage(page.value + 1, params)
  }

  /**
   * 上一页
   */
  function prevPage(params = {}) {
    return loadPage(page.value - 1, params)
  }

  /**
   * 改变每页数量
   * @param {number} size - 每页数量
   */
  function changePageSize(size, params = {}) {
    pageSize.value = size
    return loadPage(1, params)
  }

  /**
   * 刷新当前页
   */
  function refresh(params = {}) {
    return loadPage(page.value, params)
  }

  // 计算属性
  const hasMore = computed(() => {
    return page.value * pageSize.value < total.value
  })

  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  return {
    // 状态
    data,
    loading,
    error,
    page,
    pageSize,
    total,
    hasMore,
    totalPages,

    // 方法
    execute,
    loadPage,
    nextPage,
    prevPage,
    changePageSize,
    refresh,
    ...rest
  }
}
