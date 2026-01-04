/**
 * useVModel - 双向绑定 Composable
 * 简化 v-model 实现
 */
import { computed } from 'vue'

export function useVModel(props, propName = 'modelValue', emit) {
  return computed({
    get() {
      return props[propName]
    },
    set(value) {
      emit(`update:${propName}`, value)
    }
  })
}

/**
 * useVModels - 多个 v-model
 */
export function useVModels(props, emit) {
  const models = {}

  Object.keys(props).forEach(key => {
    if (key.startsWith('modelValue') || key === 'modelValue') {
      models[key] = useVModel(props, key, emit)
    }
  })

  return models
}
