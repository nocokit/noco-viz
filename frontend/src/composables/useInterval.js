/**
 * useInterval - 定时器 Composable
 * 自动清理的定时器
 */
import { ref, onUnmounted } from 'vue'

export function useInterval(callback, delay = 1000, options = {}) {
  const {
    immediate = true
  } = options

  const timer = ref(null)
  const isActive = ref(false)

  const start = () => {
    if (isActive.value) return

    isActive.value = true
    timer.value = setInterval(callback, delay)
  }

  const pause = () => {
    if (!isActive.value) return

    isActive.value = false
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  const resume = () => {
    if (!isActive.value) {
      start()
    }
  }

  const reset = () => {
    pause()
    start()
  }

  // 自动清理
  onUnmounted(() => {
    pause()
  })

  // 立即开始
  if (immediate) {
    start()
  }

  return {
    isActive,
    start,
    pause,
    resume,
    reset
  }
}
