import { ref, computed, onUnmounted } from 'vue'
import { retryRequest, requestCancelManager } from '@/utils/request-enhancer'
import { handleError } from '@/utils/error-handler'

export function useRequest(requestFn, options = {}) {
  const {
    immediate = false,
    retry = 0,
    retryDelay = 1000,
    onSuccess = null,
    onError = null,
    onFinally = null,
    showError = true,
    transform = null
  } = options

  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const isSuccess = ref(false)
  const isError = ref(false)

  let abortController = null
  let requestKey = null

  async function execute(...params) {
    loading.value = true
    error.value = null
    isSuccess.value = false
    isError.value = false

    try {
      abortController = new AbortController()
      const result = retry > 0
        ? await retryRequest(() => requestFn(...params), { retries: retry, retryDelay })
        : await requestFn(...params)

      data.value = transform ? transform(result) : result
      isSuccess.value = true
      onSuccess?.(data.value)
      return data.value
    } catch (err) {
      error.value = err
      isError.value = true
      if (showError) handleError(err)
      onError?.(err)
      throw err
    } finally {
      loading.value = false
      onFinally?.()
    }
  }

  function cancel() {
    abortController?.abort()
    abortController = null
    if (requestKey) {
      requestCancelManager.cancel(requestKey)
      requestKey = null
    }
    loading.value = false
  }

  function reset() {
    data.value = null
    loading.value = false
    error.value = null
    isSuccess.value = false
    isError.value = false
  }

  if (immediate) execute()

  onUnmounted(cancel)

  return { data, loading, error, isSuccess, isError, execute, cancel, reset }
}

export function usePaginatedRequest(requestFn, options = {}) {
  const { initialPage = 1, initialPageSize = 10, ...requestOptions } = options

  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  const { data, loading, error, execute, ...rest } = useRequest(
    (params = {}) => requestFn({ page: page.value, limit: pageSize.value, ...params }),
    requestOptions
  )

  const hasMore = computed(() => page.value * pageSize.value < total.value)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  async function loadPage(pageNum, params = {}) {
    page.value = pageNum
    const result = await execute(params)
    if (result && typeof result.total === 'number') total.value = result.total
    return result
  }

  const nextPage = (params = {}) => loadPage(page.value + 1, params)
  const prevPage = (params = {}) => loadPage(page.value - 1, params)
  const refresh = (params = {}) => loadPage(page.value, params)
  function changePageSize(size, params = {}) {
    pageSize.value = size
    return loadPage(1, params)
  }

  return {
    data, loading, error,
    page, pageSize, total, hasMore, totalPages,
    execute, loadPage, nextPage, prevPage, changePageSize, refresh,
    ...rest
  }
}
