/**
 * useToggle - 切换状态 Composable
 */
import { ref, unref } from 'vue'

export function useToggle(initialValue = false) {
  const state = ref(initialValue)

  const toggle = (value) => {
    if (typeof value === 'boolean') {
      state.value = value
    } else {
      state.value = !state.value
    }
  }

  const setTrue = () => {
    state.value = true
  }

  const setFalse = () => {
    state.value = false
  }

  return {
    state,
    toggle,
    setTrue,
    setFalse
  }
}
