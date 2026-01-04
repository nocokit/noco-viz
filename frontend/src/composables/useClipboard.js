/**
 * useClipboard - 剪贴板 Composable
 */
import { ref } from 'vue'

export function useClipboard(options = {}) {
  const {
    copiedDuring = 2000
  } = options

  const text = ref('')
  const copied = ref(false)
  const error = ref(null)
  const isSupported = ref(!!navigator?.clipboard)

  let timeout = null

  const copy = async (value) => {
    if (!isSupported.value) {
      error.value = new Error('Clipboard API not supported')
      return false
    }

    try {
      await navigator.clipboard.writeText(value)
      text.value = value
      copied.value = true
      error.value = null

      // 重置状态
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        copied.value = false
      }, copiedDuring)

      return true
    } catch (e) {
      error.value = e
      copied.value = false
      return false
    }
  }

  const read = async () => {
    if (!isSupported.value) {
      error.value = new Error('Clipboard API not supported')
      return null
    }

    try {
      const value = await navigator.clipboard.readText()
      text.value = value
      error.value = null
      return value
    } catch (e) {
      error.value = e
      return null
    }
  }

  return {
    text,
    copied,
    error,
    isSupported,
    copy,
    read
  }
}
