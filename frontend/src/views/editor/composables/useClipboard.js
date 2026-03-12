import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'

/**
 * 统一的消息提示函数 - 确保同时只显示一个消息
 */
const showMessage = {
  success: (content) => {
    message.destroy()
    message.success(content)
  },
  error: (content) => {
    message.destroy()
    message.error(content)
  },
  warning: (content) => {
    message.destroy()
    message.warning(content)
  },
  info: (content) => {
    message.destroy()
    message.info(content)
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
      const newComp = {
        ...JSON.parse(JSON.stringify(comp)),
        id: Date.now() + index,
        x: comp.x + 20,
        y: comp.y + 20,
        name: comp.name + ' (副本)'
      }
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
      const newComp = {
        ...JSON.parse(JSON.stringify(comp)),
        id: Date.now() + index,
        x: comp.x + 20,
        y: comp.y + 20,
        name: comp.name + ' (副本)'
      }
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
