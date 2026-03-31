/**
 * useThrottle - 节流 Composable
 */
import { customRef } from 'vue'

export function useThrottle(value, delay = 300) {
  return customRef((track, trigger) => {
    let lastTime = 0
    let timer = null

    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        const now = Date.now()

        if (now - lastTime >= delay) {
          value = newValue
          lastTime = now
          trigger()
        } else {
          clearTimeout(timer)
          timer = setTimeout(() => {
            value = newValue
            lastTime = Date.now()
            trigger()
          }, delay - (now - lastTime))
        }
      }
    }
  })
}

export function useThrottleFn(fn, delay = 300) {
  let lastTime = 0
  let timer = null

  const throttled = (...args) => {
    const now = Date.now()

    if (now - lastTime >= delay) {
      lastTime = now
      fn(...args)
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        lastTime = Date.now()
        fn(...args)
      }, delay - (now - lastTime))
    }
  }

  const cancel = () => {
    clearTimeout(timer)
  }

  return {
    run: throttled,
    cancel
  }
}
