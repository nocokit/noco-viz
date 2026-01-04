import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 历史记录管理（撤销/重做）
 */
export function useHistory(options = {}) {
  const { maxHistorySize = 50 } = options

  // 历史记录
  const history = ref([])
  const historyIndex = ref(-1)

  /**
   * 是否可以撤销
   */
  const canUndo = computed(() => historyIndex.value > 0)

  /**
   * 是否可以重做
   */
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  /**
   * 添加历史记录
   * @param {any} state - 要保存的状态
   */
  const pushHistory = (state) => {
    // 如果当前不在历史记录的末尾，删除后面的记录
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    // 添加新记录
    history.value.push(JSON.parse(JSON.stringify(state)))
    historyIndex.value++

    // 限制历史记录大小
    if (history.value.length > maxHistorySize) {
      history.value.shift()
      historyIndex.value--
    }
  }

  /**
   * 撤销操作
   * @returns {any} 撤销后的状态
   */
  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--
      const state = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      ElMessage.success('已撤销')
      return state
    }
    return null
  }

  /**
   * 重做操作
   * @returns {any} 重做后的状态
   */
  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++
      const state = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      ElMessage.success('已重做')
      return state
    }
    return null
  }

  /**
   * 清空历史记录
   */
  const clearHistory = () => {
    history.value = []
    historyIndex.value = -1
  }

  /**
   * 初始化历史记录
   * @param {any} initialState - 初始状态
   */
  const initHistory = (initialState) => {
    clearHistory()
    pushHistory(initialState)
  }

  return {
    history,
    historyIndex,
    canUndo,
    canRedo,
    pushHistory,
    undo,
    redo,
    clearHistory,
    initHistory
  }
}
