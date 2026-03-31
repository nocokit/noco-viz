/**
 * 响应式屏幕尺寸管理
 * 提供统一的响应式断点判断
 */

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { breakpoints } from '../config/theme'

/**
 * 使用媒体查询监听屏幕尺寸
 * @param {number} breakpoint - 断点值（px）
 * @returns {Ref<boolean>} 是否匹配断点
 */
export function useMediaQuery(breakpoint) {
  const matches = ref(false)
  let mediaQuery = null

  const updateMatches = (e) => {
    matches.value = e.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(`(min-width: ${breakpoint + 1}px)`)
    matches.value = mediaQuery.matches

    // 监听变化
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches)
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(updateMatches)
    }
  })

  onUnmounted(() => {
    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMatches)
      } else {
        mediaQuery.removeListener(updateMatches)
      }
    }
  })

  return matches
}

/**
 * 判断是否为大屏幕
 * @returns {Ref<boolean>}
 */
export function useIsLargeScreen() {
  return useMediaQuery(breakpoints.small)
}

/**
 * 判断是否为小屏幕
 * @returns {ComputedRef<boolean>}
 */
export function useIsSmallScreen() {
  const isLarge = useMediaQuery(breakpoints.small)
  // 使用 computed 实现响应式
  return computed(() => !isLarge.value)
}

/**
 * 获取当前屏幕尺寸类型
 * @returns {Ref<'small' | 'medium' | 'large'>}
 */
export function useScreenSize() {
  const size = ref('small')

  const updateSize = () => {
    const width = window.innerWidth
    if (width > breakpoints.medium) {
      size.value = 'large'
    } else if (width > breakpoints.small) {
      size.value = 'medium'
    } else {
      size.value = 'small'
    }
  }

  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return size
}
