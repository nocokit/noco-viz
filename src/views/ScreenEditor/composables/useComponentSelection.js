import { ref, computed, reactive } from 'vue'

/**
 * 组件选择管理
 * 负责组件的选中、框选、多选等功能
 */
export function useComponentSelection(canvasComponents) {
  // 选中的组件 ID 列表
  const selectedComponentIds = ref([])

  // 框选状态
  const isSelecting = ref(false)
  const selectionBox = reactive({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  })

  // 多选包围盒
  const multiSelectBox = reactive({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  /**
   * 单选组件 ID（兼容旧逻辑）
   */
  const selectedComponentId = computed(() => {
    return selectedComponentIds.value.length === 1 ? selectedComponentIds.value[0] : null
  })

  /**
   * 当前选中的单个组件
   */
  const selectedComponent = computed(() => {
    return canvasComponents.value.find(c => c.id === selectedComponentId.value)
  })

  /**
   * 所有选中的组件列表
   */
  const selectedComponents = computed(() => {
    return canvasComponents.value.filter(c => selectedComponentIds.value.includes(c.id))
  })

  /**
   * 选择组件（支持多选）
   * @param {number} id - 组件 ID
   * @param {MouseEvent} event - 鼠标事件
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
      // Shift + 点击：添加到选中列表
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
   * @param {Array<number>} ids - 组件 ID 列表
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
   * 开始框选
   * @param {MouseEvent} event - 鼠标事件
   * @param {DOMRect} canvasRect - 画布区域
   * @param {number} panX - X轴偏移
   * @param {number} panY - Y轴偏移
   * @param {number} scale - 缩放比例
   */
  const startSelection = (event, canvasRect, panX, panY, scale) => {
    const startX = (event.clientX - canvasRect.left - panX) / scale
    const startY = (event.clientY - canvasRect.top - panY) / scale

    isSelecting.value = true
    selectionBox.startX = startX
    selectionBox.startY = startY
    selectionBox.currentX = startX
    selectionBox.currentY = startY

    // 如果不是按住 Ctrl/Cmd，清空之前的选中
    if (!event.ctrlKey && !event.metaKey) {
      selectedComponentIds.value = []
    }

    return {
      onMove: (moveEvent) => {
        selectionBox.currentX = (moveEvent.clientX - canvasRect.left - panX) / scale
        selectionBox.currentY = (moveEvent.clientY - canvasRect.top - panY) / scale
        updateSelectionFromBox()
      },
      onEnd: () => {
        isSelecting.value = false
      }
    }
  }

  /**
   * 根据框选范围更新选中的组件
   */
  const updateSelectionFromBox = () => {
    const minX = Math.min(selectionBox.startX, selectionBox.currentX)
    const maxX = Math.max(selectionBox.startX, selectionBox.currentX)
    const minY = Math.min(selectionBox.startY, selectionBox.currentY)
    const maxY = Math.max(selectionBox.startY, selectionBox.currentY)

    const selectedIds = canvasComponents.value
      .filter(comp => {
        // 判断组件是否与框选区域相交
        const compRight = comp.x + comp.w
        const compBottom = comp.y + comp.h

        return !(comp.x > maxX || compRight < minX || comp.y > maxY || compBottom < minY)
      })
      .map(comp => comp.id)

    selectedComponentIds.value = selectedIds
  }

  return {
    selectedComponentIds,
    selectedComponentId,
    selectedComponent,
    selectedComponents,
    isSelecting,
    selectionBox,
    multiSelectBox,
    selectComponent,
    deselectComponent,
    selectMultipleComponents,
    updateMultiSelectBox,
    startSelection,
    updateSelectionFromBox
  }
}
