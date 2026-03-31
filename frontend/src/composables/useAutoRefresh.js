import { onUnmounted } from 'vue'

/**
 * 图表组件自动刷新
 * 支持 local（临时API）和 ref（引用数据集）两种模式
 *
 * @param {import('vue').Ref} components - 组件数组的响应式引用
 */
export function useAutoRefresh(components) {
  const timers = new Map()

  const fetchAPIData = async (comp) => {
    const { apiUrl, apiMethod = 'GET' } = comp.dataSource || {}
    if (!apiUrl) return
    try {
      const res = await fetch(apiUrl, { method: apiMethod })
      if (!res.ok) return
      const json = await res.json()
      comp.data = json
    } catch (e) {
      console.warn(`[AutoRefresh] 组件 ${comp.id} 刷新失败:`, e.message)
    }
  }

  const startRefresh = (comp) => {
    const cfg = comp.refreshConfig
    if (!cfg?.enabled) return
    const interval = Math.max(5, cfg.interval || 30) * 1000
    if (timers.has(comp.id)) return

    const timer = setInterval(() => {
      const mode = comp.dataSource?.mode
      if (mode === 'local') {
        fetchAPIData(comp)
      }
      // ref 模式预留：后续对接数据集 API 时在此扩展
    }, interval)

    timers.set(comp.id, timer)
  }

  const stopRefresh = (compId) => {
    const timer = timers.get(compId)
    if (timer) {
      clearInterval(timer)
      timers.delete(compId)
    }
  }

  const setupAll = () => {
    if (!components.value) return
    components.value.forEach(startRefresh)
  }

  const cleanupAll = () => {
    timers.forEach((timer) => clearInterval(timer))
    timers.clear()
  }

  onUnmounted(cleanupAll)

  return { setupAll, cleanupAll, startRefresh, stopRefresh }
}
