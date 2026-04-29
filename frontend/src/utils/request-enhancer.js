import axios from 'axios'

class RequestCancelManager {
  constructor() {
    this.pendingRequests = new Map()
  }

  generateKey({ method, url, params, data }) {
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
  }

  add(config) {
    const key = this.generateKey(config)
    if (this.pendingRequests.has(key)) this.cancel(key)

    const controller = new AbortController()
    this.pendingRequests.set(key, controller)
    config.signal = controller.signal
    return key
  }

  remove(key) {
    this.pendingRequests.delete(key)
  }

  cancel(key) {
    const controller = this.pendingRequests.get(key)
    if (controller) {
      controller.abort()
      this.pendingRequests.delete(key)
    }
  }

  cancelAll() {
    this.pendingRequests.forEach(c => c.abort())
    this.pendingRequests.clear()
  }
}

class RequestCache {
  constructor(maxAge = 5 * 60 * 1000) {
    this.cache = new Map()
    this.maxAge = maxAge
  }

  generateKey({ method, url, params }) {
    return `${method}:${url}:${JSON.stringify(params)}`
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }
    return item.data
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  delete(key) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}

const defaultRetryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error) => !error.response || (error.response.status >= 500 && error.response.status < 600)
}

export async function retryRequest(fn, config = {}) {
  const { retries, retryDelay, retryCondition } = { ...defaultRetryConfig, ...config }
  let lastError

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < retries && retryCondition(error)) {
        await new Promise(r => setTimeout(r, retryDelay * (i + 1)))
        continue
      }
      throw error
    }
  }

  throw lastError
}

export function createRetryableRequest(axiosConfig = {}, retryConfig = {}) {
  const instance = axios.create(axiosConfig)
  const maxRetries = retryConfig.retries ?? defaultRetryConfig.retries
  const shouldRetry = retryConfig.retryCondition ?? defaultRetryConfig.retryCondition
  const delay = retryConfig.retryDelay ?? defaultRetryConfig.retryDelay

  instance.interceptors.response.use(
    res => res,
    async error => {
      const config = error.config
      if (!config || config.__retryCount >= maxRetries) return Promise.reject(error)
      if (!shouldRetry(error)) return Promise.reject(error)

      config.__retryCount = (config.__retryCount || 0) + 1
      await new Promise(r => setTimeout(r, delay * config.__retryCount))
      return instance(config)
    }
  )

  return instance
}

const makeProgressHandler = (key) => (config, onProgress) => ({
  ...config,
  [key]: (e) => onProgress({ loaded: e.loaded, total: e.total, percent: Math.round(e.loaded * 100 / e.total) })
})

export const withUploadProgress = makeProgressHandler('onUploadProgress')
export const withDownloadProgress = makeProgressHandler('onDownloadProgress')

export async function concurrentRequests(requests, limit = 5) {
  const results = []
  const executing = []

  for (const [index, request] of requests.entries()) {
    const promise = Promise.resolve().then(() => request()).then(
      value => { results[index] = { status: 'fulfilled', value } },
      reason => { results[index] = { status: 'rejected', reason } }
    )

    results.push(promise)

    if (limit <= requests.length) {
      const e = promise.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= limit) await Promise.race(executing)
    }
  }

  await Promise.all(results)
  return results
}

export const requestCancelManager = new RequestCancelManager()
export const requestCache = new RequestCache()
