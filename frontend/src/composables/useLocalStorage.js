/**
 * useLocalStorage - 本地存储 Composable
 */
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  // 从 localStorage 读取
  const read = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        data.value = JSON.parse(item)
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
  }

  // 写入 localStorage
  const write = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }

  // 删除
  const remove = () => {
    try {
      localStorage.removeItem(key)
      data.value = defaultValue
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }

  // 初始化读取
  read()

  // 监听变化自动保存
  watch(data, write, { deep: true })

  return {
    data,
    write,
    remove
  }
}
