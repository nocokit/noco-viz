import { ref, computed } from 'vue'
import { showMessage } from './useMessage'

/**
 * 创建组件副本
 * @param {Object} comp - 原始组件
 * @param {Number} index - 索引（用于生成唯一ID）
 * @param {Object} offset - 偏移量 { x, y }
 * @returns {Object} 新组件
 */
const createComponentCopy = (comp, index, offset = { x: 20, y: 20 }) => {
  return {
    ...JSON.parse(JSON.stringify(comp)),
    id: Date.now() + index,
    x: comp.x + offset.x,
    y: comp.y + offset.y,
    name: comp.name + ' (副本)'
  }
}

/**
 * 剪贴板管理 Composable
 * 提供复制、粘贴、快速复制功能
 */
export function useClipboard(canvasComponents, selectedComponentIds) {
  const copiedComponent = ref(null)

  // 计算选中的组件列表
  const selectedComponents = computed(() => {
    return canvasComponents.value.filter(c => selectedComponentIds.value.includes(c.id))
  })

  /**
   * 复制组件
   */
  const handleCopy = () => {
    if (selectedComponents.value.length > 0) {
      copiedComponent.value = JSON.parse(JSON.stringify(selectedComponents.value))
      showMessage.success(`已复制 ${selectedComponents.value.length} 个组件`)
    }
  }

  /**
   * 粘贴组件
   */
  const handlePaste = () => {
    if (!copiedComponent.value) return

    const newIds = []
    const components = Array.isArray(copiedComponent.value) ? copiedComponent.value : [copiedComponent.value]

    components.forEach((comp, index) => {
      const newComp = createComponentCopy(comp, index)
      canvasComponents.value.push(newComp)
      newIds.push(newComp.id)
    })

    // 选中新粘贴的组件
    selectedComponentIds.value = newIds
    showMessage.success(`已粘贴 ${components.length} 个组件`)
  }

  /**
   * 快速复制组件
   */
  const handleDuplicate = () => {
    if (selectedComponents.value.length === 0) return

    const newIds = []
    selectedComponents.value.forEach((comp, index) => {
      const newComp = createComponentCopy(comp, index)
      canvasComponents.value.push(newComp)
      newIds.push(newComp.id)
    })

    // 选中新复制的组件
    selectedComponentIds.value = newIds
    showMessage.success(`已快速复制 ${selectedComponents.value.length} 个组件`)
  }

  return {
    copiedComponent,
    handleCopy,
    handlePaste,
    handleDuplicate
  }
}
