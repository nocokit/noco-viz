/**
 * useInfiniteScroll - 无限滚动 Composable
 * 自动加载更多数据
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(loadMore, options = {}) {
  const {
    distance = 100,
    disabled = ref(false),
    direction = 'bottom' // 'bottom' | 'top'
  } = options

  const loading = ref(false)
  const el = ref(null)
  const isFinished = ref(false)

  const handleScroll = async () => {
    if (disabled.value || loading.value || isFinished.value) return

    const element = el.value
    if (!element) return

    const { scrollTop, scrollHeight, clientHeight } = element

    let shouldLoad = false

    if (direction === 'bottom') {
      shouldLoad = scrollHeight - scrollTop - clientHeight < distance
    } else {
      shouldLoad = scrollTop < distance
    }

    if (shouldLoad) {
      loading.value = true
      try {
        const result = await loadMore()
        // 如果返回 false 或空数组，标记为完成
        if (result === false || (Array.isArray(result) && result.length === 0)) {
          isFinished.value = true
        }
      } catch (error) {
        console.error('Load more error:', error)
      } finally {
        loading.value = false
      }
    }
  }

  const reset = () => {
    isFinished.value = false
    loading.value = false
  }

  onMounted(() => {
    el.value?.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    el.value?.removeEventListener('scroll', handleScroll)
  })

  return {
    el,
    loading,
    isFinished,
    reset
  }
}
