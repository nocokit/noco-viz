/**
 * useDebounce - 防抖 Composable
 * 使用 customRef 实现高性能防抖
 */
import { customRef } from 'vue'

export function useDebounce(value, delay = 300) {
  let timeout

  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

/**
 * useDebounceFn - 防抖函数
 */
export function useDebounceFn(fn, delay = 300) {
  let timeout

  const debouncedFn = (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  const cancel = () => {
    clearTimeout(timeout)
  }

  return {
    run: debouncedFn,
    cancel
  }
}
