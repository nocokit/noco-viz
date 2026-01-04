/**
 * 防抖和节流工具函数
 */

/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒），默认300ms
 * @param {boolean} immediate - 是否立即执行，默认false
 * @returns {Function} 防抖后的函数
 * @example
 * const handleSearch = debounce((query) => {
 *   console.log('搜索:', query)
 * }, 500)
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout

  return function executedFunction(...args) {
    const context = this

    const later = () => {
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
 * 规定时间内只执行一次，第一次立即执行
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒），默认300ms
 * @param {Object} options - 配置选项
 * @param {boolean} options.leading - 是否在开始时立即执行，默认true
 * @param {boolean} options.trailing - 是否在结束时执行，默认true
 * @returns {Function} 节流后的函数
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('滚动中...')
 * }, 200)
 */
export function throttle(func, wait = 300, options = {}) {
  let timeout
  let previous = 0
  const { leading = true, trailing = true } = options

  return function executedFunction(...args) {
    const context = this
    const now = Date.now()

    // 如果不需要首次执行，则设置previous为当前时间
    if (!previous && !leading) previous = now

    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }
}

/**
 * 防抖函数（Promise版本）
 * 返回Promise，便于在async/await中使用
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 返回Promise的防抖函数
 */
export function debounceAsync(func, wait = 300) {
  let timeout

  return function executedFunction(...args) {
    const context = this

    return new Promise((resolve, reject) => {
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        try {
          const result = await func.apply(context, args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, wait)
    })
  }
}

/**
 * 创建带有取消功能的防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Object} 包含 run 和 cancel 方法的对象
 */
export function debounceCancellable(func, wait = 300) {
  let timeout

  const debouncedFunc = function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }

  debouncedFunc.cancel = () => {
    clearTimeout(timeout)
  }

  return debouncedFunc
}

/**
 * 创建带有取消功能的节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Object} 包含 run 和 cancel 方法的对象
 */
export function throttleCancellable(func, wait = 300) {
  let timeout
  let previous = 0

  const throttledFunc = function (...args) {
    const context = this
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }

  throttledFunc.cancel = () => {
    clearTimeout(timeout)
    previous = 0
  }

  return throttledFunc
}

/**
 * 限制函数在指定时间内只执行一次
 * @param {Function} func - 要限制的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 限制后的函数
 */
export function once(func) {
  let called = false
  let result

  return function (...args) {
    if (!called) {
      called = true
      result = func.apply(this, args)
    }
    return result
  }
}

/**
 * 延迟执行函数
 * @param {Function} func - 要延迟执行的函数
 * @param {number} wait - 延迟时间（毫秒）
 * @returns {Promise} Promise对象
 */
export function delay(func, wait) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(func())
    }, wait)
  })
}
