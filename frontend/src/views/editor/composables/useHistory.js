import { ref, computed, watch, nextTick } from 'vue'
import { showMessage } from './useMessage'

/**
 * 历史记录管理 Composable
 * 提供撤销/重做功能
 */
export function useHistory(canvasComponents) {
  const history = ref([])
  const historyIndex = ref(-1)
  const isUndoRedoing = ref(false) // 标记是否正在执行撤销/重做操作
  let debounceTimer = null

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  /**
   * 添加历史记录
   */
  const addHistory = (components) => {
    // 如果正在执行撤销/重做操作,不记录历史
    if (isUndoRedoing.value) return

    // 删除当前索引之后的所有历史记录
    history.value = history.value.slice(0, historyIndex.value + 1)
    // 添加新的历史记录
    history.value.push(JSON.parse(JSON.stringify(components)))
    historyIndex.value = history.value.length - 1

    // 限制历史记录数量,避免内存溢出
    const MAX_HISTORY = 50
    if (history.value.length > MAX_HISTORY) {
      history.value.shift()
      historyIndex.value--
    }
  }

  /**
   * 撤销操作
   */
  const handleUndo = () => {
    if (canUndo.value) {
      isUndoRedoing.value = true
      historyIndex.value--

      // 清除防抖定时器
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }

      canvasComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      showMessage.success('已撤销')

      // 延迟重置标记,确保 watch 不会触发
      nextTick(() => {
        setTimeout(() => {
          isUndoRedoing.value = false
        }, 500)
      })
    }
  }

  /**
   * 重做操作
   */
  const handleRedo = () => {
    if (canRedo.value) {
      isUndoRedoing.value = true
      historyIndex.value++

      // 清除防抖定时器
      if (debounceTimer) {
        clearTimeout(debounceTimer)
        debounceTimer = null
      }

      canvasComponents.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      showMessage.success('已重做')

      // 延迟重置标记,确保 watch 不会触发
      nextTick(() => {
        setTimeout(() => {
          isUndoRedoing.value = false
        }, 500)
      })
    }
  }

  /**
   * 清空历史记录
   */
  const clearHistory = () => {
    history.value = []
    historyIndex.value = -1
  }

  // 监听 canvasComponents 的变化,自动记录历史
  // 使用 deep watch 来监听数组内部对象的变化
  watch(
    () => canvasComponents.value,
    (newVal) => {
      // 如果正在执行撤销/重做,不记录
      if (isUndoRedoing.value) return

      // 防抖处理,避免频繁记录
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (!isUndoRedoing.value && newVal.length >= 0) {
          addHistory(newVal)
        }
      }, 300) // 300ms 防抖
    },
    { deep: true }
  )

  // 初始化:记录初始状态
  if (canvasComponents.value.length >= 0) {
    addHistory(canvasComponents.value)
  }

  return {
    history,
    historyIndex,
    canUndo,
    canRedo,
    addHistory,
    handleUndo,
    handleRedo,
    clearHistory
  }
}
