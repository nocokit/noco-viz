/**
 * HTTP 请求增强工具
 * 提供请求重试、取消、进度监控等功能
 */
import axios from 'axios'

/**
 * 请求取消管理器
 */
class RequestCancelManager {
  constructor() {
    this.pendingRequests = new Map()
  }

  /**
   * 生成请求唯一标识
   * @param {Object} config - 请求配置
   * @returns {string}
   */
  generateKey(config) {
    const { method, url, params, data } = config
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
  }

  /**
   * 添加请求
   * @param {Object} config - 请求配置
   */
  add(config) {
    const key = this.generateKey(config)

    // 如果已存在相同请求，取消之前的请求
    if (this.pendingRequests.has(key)) {
      this.cancel(key)
    }

    const controller = new AbortController()
    this.pendingRequests.set(key, controller)
    config.signal = controller.signal

    return key
  }

  /**
   * 移除请求
   * @param {string} key - 请求标识
   */
  remove(key) {
    this.pendingRequests.delete(key)
  }

  /**
   * 取消请求
   * @param {string} key - 请求标识
   */
  cancel(key) {
    const controller = this.pendingRequests.get(key)
    if (controller) {
      controller.abort()
      this.pendingRequests.delete(key)
    }
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    this.pendingRequests.forEach((controller) => {
      controller.abort()
    })
    this.pendingRequests.clear()
  }
}

/**
 * 请求重试配置
 */
const defaultRetryConfig = {
  retries: 3,                    // 重试次数
  retryDelay: 1000,              // 重试延迟（毫秒）
  retryCondition: (error) => {   // 重试条件
    // 网络错误或 5xx 错误才重试
    return !error.response || (error.response.status >= 500 && error.response.status < 600)
  }
}

/**
 * 请求重试
 * @param {Function} fn - 请求函数
 * @param {Object} config - 重试配置
 * @returns {Promise}
 */
export async function retryRequest(fn, config = {}) {
  const { retries, retryDelay, retryCondition } = { ...defaultRetryConfig, ...config }

  let lastError = null

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // 检查是否应该重试
      if (i < retries && retryCondition(error)) {
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)))
        continue
      }

      // 不满足重试条件或已达到最大重试次数
      throw error
    }
  }

  throw lastError
}

/**
 * 创建带重试的请求实例
 * @param {Object} axiosConfig - Axios 配置
 * @param {Object} retryConfig - 重试配置
 * @returns {AxiosInstance}
 */
export function createRetryableRequest(axiosConfig = {}, retryConfig = {}) {
  const instance = axios.create(axiosConfig)

  // 添加重试拦截器
  instance.interceptors.response.use(
    response => response,
    async error => {
      const config = error.config

      // 如果没有配置重试或已经重试过，直接抛出错误
      if (!config || config.__retryCount >= (retryConfig.retries || defaultRetryConfig.retries)) {
        return Promise.reject(error)
      }

      // 初始化重试计数
      config.__retryCount = config.__retryCount || 0

      // 检查是否应该重试
      const shouldRetry = retryConfig.retryCondition
        ? retryConfig.retryCondition(error)
        : defaultRetryConfig.retryCondition(error)

      if (!shouldRetry) {
        return Promise.reject(error)
      }

      // 增加重试计数
      config.__retryCount += 1

      // 计算延迟时间
      const delay = (retryConfig.retryDelay || defaultRetryConfig.retryDelay) * config.__retryCount

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay))

      return instance(config)
    }
  )

  return instance
}

/**
 * 上传进度监控
 * @param {Object} config - 请求配置
 * @param {Function} onProgress - 进度回调
 * @returns {Object}
 */
export function withUploadProgress(config, onProgress) {
  return {
    ...config,
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress({
        loaded: progressEvent.loaded,
        total: progressEvent.total,
        percent: percentCompleted
      })
    }
  }
}

/**
 * 下载进度监控
 * @param {Object} config - 请求配置
 * @param {Function} onProgress - 进度回调
 * @returns {Object}
 */
export function withDownloadProgress(config, onProgress) {
  return {
    ...config,
    onDownloadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress({
        loaded: progressEvent.loaded,
        total: progressEvent.total,
        percent: percentCompleted
      })
    }
  }
}

/**
 * 并发请求控制
 * @param {Array} requests - 请求数组
 * @param {number} limit - 并发限制
 * @returns {Promise}
 */
export async function concurrentRequests(requests, limit = 5) {
  const results = []
  const executing = []

  for (const [index, request] of requests.entries()) {
    const promise = Promise.resolve().then(() => request()).then(
      result => {
        results[index] = { status: 'fulfilled', value: result }
      },
      error => {
        results[index] = { status: 'rejected', reason: error }
      }
    )

    results.push(promise)

    if (limit <= requests.length) {
      const e = promise.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)

      if (executing.length >= limit) {
        await Promise.race(executing)
      }
    }
  }

  await Promise.all(results)
  return results
}

/**
 * 请求缓存
 */
class RequestCache {
  constructor(maxAge = 5 * 60 * 1000) { // 默认 5 分钟
    this.cache = new Map()
    this.maxAge = maxAge
  }

  /**
   * 生成缓存键
   * @param {Object} config - 请求配置
   * @returns {string}
   */
  generateKey(config) {
    const { method, url, params } = config
    return `${method}:${url}:${JSON.stringify(params)}`
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {*}
   */
  get(key) {
    const item = this.cache.get(key)

    if (!item) return null

    // 检查是否过期
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {*} data - 缓存数据
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 清除缓存
   * @param {string} key - 缓存键
   */
  delete(key) {
    this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear()
  }
}

// 导出单例
export const requestCancelManager = new RequestCancelManager()
export const requestCache = new RequestCache()

/**
 * 默认导出
 */
export default {
  retryRequest,
  createRetryableRequest,
  withUploadProgress,
  withDownloadProgress,
  concurrentRequests,
  requestCancelManager,
  requestCache,
  RequestCancelManager,
  RequestCache
}
