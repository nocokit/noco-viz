/**
 * useEventListener - 事件监听 Composable
 * 自动管理事件监听器的添加和移除
 */
import { onMounted, onUnmounted, watch, unref } from 'vue'

export function useEventListener(target, event, handler, options) {
  let cleanup

  const register = () => {
    const element = unref(target)
    if (!element) return

    element.addEventListener(event, handler, options)

    cleanup = () => {
      element.removeEventListener(event, handler, options)
    }
  }

  onMounted(register)

  // 如果 target 是 ref，监听其变化
  if (typeof target === 'object' && 'value' in target) {
    watch(target, (newTarget, oldTarget) => {
      if (cleanup) cleanup()
      if (newTarget) register()
    })
  }

  onUnmounted(() => {
    if (cleanup) cleanup()
  })

  return cleanup
}
