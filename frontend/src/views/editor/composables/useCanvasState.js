import { ref, computed, reactive } from 'vue'
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
 * 画布状态管理 Composable
 * 管理画布组件、选中状态、多选包围盒等
 */
export function useCanvasState() {
  // 画布组件列表
  const canvasComponents = ref([])

  // 多选支持
  const selectedComponentIds = ref([])

  // 兼容单选逻辑
  const selectedComponentId = computed(() => {
    return selectedComponentIds.value.length === 1 ? selectedComponentIds.value[0] : null
  })

  const selectedComponent = computed(() => {
    return canvasComponents.value.find(c => c.id === selectedComponentId.value)
  })

  // 多选组件列表
  const selectedComponents = computed(() => {
    return canvasComponents.value.filter(c => selectedComponentIds.value.includes(c.id))
  })

  // 多选包围盒状态
  const multiSelectBox = reactive({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  /**
   * 选择组件（支持多选）
   */
  const selectComponent = (id, event) => {
    if (event && (event.ctrlKey || event.metaKey)) {
      // Ctrl/Cmd + 点击：切换选中状态
      const index = selectedComponentIds.value.indexOf(id)
      if (index > -1) {
        selectedComponentIds.value.splice(index, 1)
      } else {
        selectedComponentIds.value.push(id)
      }
    } else if (event && event.shiftKey) {
      // Shift + 点击：添加到选中列表（保留其他选中）
      if (!selectedComponentIds.value.includes(id)) {
        selectedComponentIds.value.push(id)
      }
    } else {
      // 普通点击：仅选中当前组件
      selectedComponentIds.value = [id]
    }
    updateMultiSelectBox()
  }

  /**
   * 取消所有选中
   */
  const deselectComponent = () => {
    selectedComponentIds.value = []
    updateMultiSelectBox()
  }

  /**
   * 批量选择组件
   */
  const selectMultipleComponents = (ids) => {
    selectedComponentIds.value = [...ids]
    updateMultiSelectBox()
  }

  /**
   * 更新多选包围盒
   */
  const updateMultiSelectBox = () => {
    if (selectedComponentIds.value.length < 2) {
      multiSelectBox.visible = false
      return
    }

    const selectedComps = canvasComponents.value.filter(c =>
      selectedComponentIds.value.includes(c.id)
    )

    // 计算包围盒
    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    selectedComps.forEach(comp => {
      minX = Math.min(minX, comp.x)
      minY = Math.min(minY, comp.y)
      maxX = Math.max(maxX, comp.x + comp.w)
      maxY = Math.max(maxY, comp.y + comp.h)
    })

    multiSelectBox.x = minX
    multiSelectBox.y = minY
    multiSelectBox.width = maxX - minX
    multiSelectBox.height = maxY - minY
    multiSelectBox.visible = true
  }

  /**
   * 删除组件
   */
  const deleteComponent = (id) => {
    canvasComponents.value = canvasComponents.value.filter(c => c.id !== id)
    if (selectedComponentId.value === id) {
      selectedComponentIds.value = []
    }
    updateMultiSelectBox()
  }

  /**
   * 锁定/解锁组件
   */
  const toggleLock = (id) => {
    const comp = canvasComponents.value.find(c => c.id === id)
    if (comp) {
      comp.locked = !comp.locked
      showMessage.success(comp.locked ? '已锁定组件' : '已解锁组件')
    }
  }

  return {
    canvasComponents,
    selectedComponentIds,
    selectedComponentId,
    selectedComponent,
    selectedComponents,
    multiSelectBox,
    selectComponent,
    deselectComponent,
    selectMultipleComponents,
    updateMultiSelectBox,
    deleteComponent,
    toggleLock
  }
}
