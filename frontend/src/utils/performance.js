/**
 * 性能优化工具集
 */

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export function throttle(fn, delay = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 请求动画帧节流
 * @param {Function} fn - 要节流的函数
 * @returns {Function}
 */
export function rafThrottle(fn) {
  let rafId = null
  return function (...args) {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      fn.apply(this, args)
      rafId = null
    })
  }
}

/**
 * 空闲时执行
 * @param {Function} fn - 要执行的函数
 * @param {Object} options - 配置选项
 */
export function runWhenIdle(fn, options = {}) {
  const { timeout = 2000 } = options

  if ('requestIdleCallback' in window) {
    requestIdleCallback(fn, { timeout })
  } else {
    setTimeout(fn, 0)
  }
}

/**
 * 批量执行任务
 * @param {Array<Function>} tasks - 任务数组
 * @param {number} batchSize - 每批次数量
 * @returns {Promise}
 */
export async function batchExecute(tasks, batchSize = 10) {
  const results = []
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(task => task()))
    results.push(...batchResults)
  }
  return results
}

/**
 * 图片预加载
 * @param {string|Array<string>} urls - 图片URL或URL数组
 * @returns {Promise}
 */
export function preloadImages(urls) {
  const urlArray = Array.isArray(urls) ? urls : [urls]

  return Promise.all(
    urlArray.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(url)
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
        img.src = url
      })
    })
  )
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 * @param {Function} fn - 要重试的函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delay - 重试延迟（毫秒）
 * @returns {Promise}
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await sleep(delay * (i + 1))
      }
    }
  }
  throw lastError
}

/**
 * 内存优化：清理大对象
 * @param {Object} obj - 要清理的对象
 */
export function clearObject(obj) {
  if (!obj || typeof obj !== 'object') return

  Object.keys(obj).forEach(key => {
    delete obj[key]
  })
}

/**
 * 性能监控
 * @param {string} name - 监控名称
 * @param {Function} fn - 要监控的函数
 * @returns {Promise}
 */
export async function measurePerformance(name, fn) {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}

export default {
  debounce,
  throttle,
  rafThrottle,
  runWhenIdle,
  batchExecute,
  preloadImages,
  sleep,
  retry,
  clearObject,
  measurePerformance
}
