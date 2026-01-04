/**
 * useVirtualList - 虚拟列表 Composable
 * 优化大列表渲染性能
 */
import { ref, computed, watch } from 'vue'

export function useVirtualList(list, options = {}) {
  const {
    itemHeight = 50,
    buffer = 5,
    containerHeight = 600
  } = options

  const containerRef = ref(null)
  const scrollTop = ref(0)

  // 可见数量
  const visibleCount = computed(() => {
    const height = containerRef.value?.clientHeight || containerHeight
    return Math.ceil(height / itemHeight)
  })

  // 开始索引
  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
  })

  // 结束索引
  const endIndex = computed(() => {
    return Math.min(
      list.value.length,
      startIndex.value + visibleCount.value + buffer * 2
    )
  })

  // 可见数据
  const visibleData = computed(() => {
    return list.value.slice(startIndex.value, endIndex.value).map((item, index) => ({
      data: item,
      index: startIndex.value + index
    }))
  })

  // 偏移量
  const offsetY = computed(() => {
    return startIndex.value * itemHeight
  })

  // 总高度
  const totalHeight = computed(() => {
    return list.value.length * itemHeight
  })

  // 滚动处理
  const handleScroll = (e) => {
    scrollTop.value = e.target.scrollTop
  }

  // 滚动到指定索引
  const scrollToIndex = (index) => {
    if (!containerRef.value) return

    const targetScrollTop = index * itemHeight
    containerRef.value.scrollTop = targetScrollTop
    scrollTop.value = targetScrollTop
  }

  return {
    containerRef,
    visibleData,
    offsetY,
    totalHeight,
    handleScroll,
    scrollToIndex,
    startIndex,
    endIndex
  }
}
