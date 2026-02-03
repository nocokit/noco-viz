/**
 * API请求优化工具
 * 提供防抖、节流、请求取消等功能
 */

import { ref } from 'vue'

/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间(毫秒)
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const context = this
    const later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

/**
 * 节流函数
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间(毫秒)
 * @param {Object} options 选项
 * @returns {Function} 节流后的函数
 */
export function throttle(func, wait = 300, options = {}) {
  let timeout, context, args, result
  let previous = 0
  if (!options) options = {}

  const later = function() {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }

  const throttled = function(...params) {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = params
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }

  throttled.cancel = function() {
    clearTimeout(timeout)
    previous = 0
    timeout = context = args = null
  }

  return throttled
}

/**
 * 请求取消管理器
 */
export class RequestCanceler {
  constructor() {
    this.pendingRequests = new Map()
  }

  /**
   * 添加待处理的请求
   * @param {string} key 请求标识
   * @param {AbortController} controller AbortController实例
   */
  add(key, controller) {
    // 如果已存在相同key的请求,先取消它
    if (this.pendingRequests.has(key)) {
      this.cancel(key)
    }
    this.pendingRequests.set(key, controller)
  }

  /**
   * 取消指定请求
   * @param {string} key 请求标识
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

  /**
   * 移除请求(已完成)
   * @param {string} key 请求标识
   */
  remove(key) {
    this.pendingRequests.delete(key)
  }
}

/**
 * 创建可取消的请求
 * @param {string} key 请求标识
 * @returns {Object} { signal, cancel }
 */
export function useCancelableRequest(key) {
  const controller = new AbortController()
  const canceler = new RequestCanceler()
  canceler.add(key, controller)

  return {
    signal: controller.signal,
    cancel: () => canceler.cancel(key)
  }
}

/**
 * 请求重试
 * @param {Function} requestFn 请求函数
 * @param {number} maxRetries 最大重试次数
 * @param {number} delay 重试延迟(毫秒)
 * @returns {Promise}
 */
export async function retryRequest(requestFn, maxRetries = 3, delay = 1000) {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError
}

/**
 * 请求队列管理器
 * 用于控制并发请求数量
 */
export class RequestQueue {
  constructor(maxConcurrent = 6) {
    this.maxConcurrent = maxConcurrent
    this.currentRunning = 0
    this.queue = []
  }

  /**
   * 添加请求到队列
   * @param {Function} requestFn 请求函数
   * @returns {Promise}
   */
  async add(requestFn) {
    while (this.currentRunning >= this.maxConcurrent) {
      await new Promise(resolve => {
        this.queue.push(resolve)
      })
    }

    this.currentRunning++

    try {
      return await requestFn()
    } finally {
      this.currentRunning--
      if (this.queue.length > 0) {
        const resolve = this.queue.shift()
        resolve()
      }
    }
  }

  /**
   * 批量执行请求
   * @param {Array<Function>} requestFns 请求函数数组
   * @returns {Promise<Array>}
   */
  async batchExecute(requestFns) {
    return Promise.all(requestFns.map(fn => this.add(fn)))
  }
}

/**
 * 请求缓存管理器
 */
export class RequestCache {
  constructor(maxAge = 5 * 60 * 1000) { // 默认5分钟
    this.cache = new Map()
    this.maxAge = maxAge
  }

  /**
   * 生成缓存key
   * @param {string} url 请求URL
   * @param {Object} params 请求参数
   * @returns {string}
   */
  generateKey(url, params = {}) {
    return `${url}:${JSON.stringify(params)}`
  }

  /**
   * 获取缓存
   * @param {string} key 缓存key
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
   * @param {string} key 缓存key
   * @param {*} data 缓存数据
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 清除缓存
   * @param {string} key 缓存key (可选,不传则清除所有)
   */
  clear(key) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  /**
   * 清除过期缓存
   */
  clearExpired() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key)
      }
    }
  }
}

/**
 * 带缓存的请求
 * @param {string} key 缓存key
 * @param {Function} requestFn 请求函数
 * @param {Object} options 选项
 * @returns {Promise}
 */
const defaultCache = new RequestCache()
export async function cachedRequest(key, requestFn, options = {}) {
  const { cache = defaultCache, forceRefresh = false } = options

  // 如果不强制刷新,先尝试从缓存获取
  if (!forceRefresh) {
    const cached = cache.get(key)
    if (cached) {
      return cached
    }
  }

  // 执行请求
  const data = await requestFn()

  // 缓存结果
  cache.set(key, data)

  return data
}

/**
 * useLoading组合式函数
 * 用于管理加载状态
 */
export function useLoading(initialValue = false) {
  const loading = ref(initialValue)
  const error = ref(null)

  const withLoading = async (fn) => {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    withLoading
  }
}

/**
 * 批量请求优化
 * 将多个请求合并为一个批量请求
 */
export class BatchRequestManager {
  constructor(batchFn, options = {}) {
    this.batchFn = batchFn
    this.delay = options.delay || 50
    this.maxSize = options.maxSize || 10
    this.pending = []
    this.timer = null
  }

  /**
   * 添加请求
   * @param {*} param 请求参数
   * @returns {Promise}
   */
  add(param) {
    return new Promise((resolve, reject) => {
      this.pending.push({ param, resolve, reject })

      // 如果达到最大批次大小,立即执行
      if (this.pending.length >= this.maxSize) {
        this.flush()
      } else {
        // 否则延迟执行
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => this.flush(), this.delay)
      }
    })
  }

  /**
   * 执行批量请求
   */
  async flush() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.pending.length === 0) return

    const requests = this.pending
    this.pending = []

    try {
      const params = requests.map(r => r.param)
      const results = await this.batchFn(params)

      requests.forEach((request, index) => {
        request.resolve(results[index])
      })
    } catch (error) {
      requests.forEach(request => {
        request.reject(error)
      })
    }
  }
}
