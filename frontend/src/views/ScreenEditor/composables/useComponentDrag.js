import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 组件拖拽和调整大小管理
 */
export function useComponentDrag(options = {}) {
  const {
    canvasScale,
    selectedComponents,
    updateMultiSelectBox,
    calculateAlignmentLines,
    clearAlignmentLines
  } = options

  // 对齐辅助线状态
  const alignmentLines = reactive({
    vertical: [],
    horizontal: []
  })

  /**
   * 开始拖拽组件（支持多选）
   * @param {MouseEvent} event - 鼠标事件
   * @param {Object} comp - 被拖拽的组件
   * @param {boolean} isSpacePressed - 是否按下空格键
   */
  const startDrag = (event, comp, isSpacePressed) => {
    // 阻止空格键拖动画布
    if (isSpacePressed) {
      return
    }

    // 如果组件被锁定,禁止拖动
    if (comp.locked) {
      ElMessage.warning('组件已锁定,无法拖动')
      return
    }

    event.stopPropagation()

    // 检查选中的组件中是否有锁定的
    const hasLockedComponent = selectedComponents.value.some(c => c.locked)
    if (hasLockedComponent) {
      ElMessage.warning('选中的组件中包含已锁定的组件')
      return
    }

    const startX = event.clientX
    const startY = event.clientY

    // 记录所有选中组件的起始位置
    const startPositions = selectedComponents.value.map(c => ({
      id: c.id,
      x: c.x,
      y: c.y
    }))

    const onMouseMove = (e) => {
      // 考虑画布缩放比例
      const dx = (e.clientX - startX) / canvasScale.value
      const dy = (e.clientY - startY) / canvasScale.value

      // 批量移动所有选中的组件（先不应用吸附）
      const components = selectedComponents.value
      startPositions.forEach(pos => {
        const component = components.find(c => c.id === pos.id)
        if (component) {
          component.x = Math.max(0, Math.min(1920 - component.w, pos.x + dx))
          component.y = Math.max(0, Math.min(1080 - component.h, pos.y + dy))
        }
      })

      // 计算对齐并应用吸附
      if (calculateAlignmentLines) {
        const { snapX, snapY } = calculateAlignmentLines(components, alignmentLines)

        if (snapX !== null) {
          const offsetX = snapX - components[0].x
          components.forEach(c => {
            c.x = Math.max(0, Math.min(1920 - c.w, c.x + offsetX))
          })
        }

        if (snapY !== null) {
          const offsetY = snapY - components[0].y
          components.forEach(c => {
            c.y = Math.max(0, Math.min(1080 - c.h, c.y + offsetY))
          })
        }
      }

      // 实时更新多选包围盒
      updateMultiSelectBox?.()
    }

    const onMouseUp = () => {
      // 拖动结束后取整所有选中组件的位置
      selectedComponents.value.forEach(c => {
        c.x = Math.round(c.x)
        c.y = Math.round(c.y)
      })

      // 清除对齐辅助线
      if (clearAlignmentLines) {
        clearAlignmentLines(alignmentLines)
      }

      // 更新多选包围盒
      updateMultiSelectBox?.()

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  /**
   * 开始调整组件大小
   * @param {MouseEvent} event - 鼠标事件
   * @param {Object} comp - 被调整的组件
   * @param {string} direction - 调整方向 (n, ne, e, se, s, sw, w, nw)
   */
  const startResize = (event, comp, direction) => {
    event.preventDefault()
    event.stopPropagation()

    // 如果组件被锁定,禁止调整大小
    if (comp.locked) {
      ElMessage.warning('组件已锁定,无法调整大小')
      return
    }

    const startX = event.clientX
    const startY = event.clientY
    const startWidth = comp.w
    const startHeight = comp.h
    const startLeft = comp.x
    const startTop = comp.y

    const onMouseMove = (e) => {
      const dx = (e.clientX - startX) / canvasScale.value
      const dy = (e.clientY - startY) / canvasScale.value

      // 根据方向调整组件的位置和大小
      switch (direction) {
        case 'n': // 上
          comp.y = startTop + dy
          comp.h = Math.max(50, startHeight - dy)
          break
        case 'ne': // 右上
          comp.y = startTop + dy
          comp.w = Math.max(50, startWidth + dx)
          comp.h = Math.max(50, startHeight - dy)
          break
        case 'e': // 右
          comp.w = Math.max(50, startWidth + dx)
          break
        case 'se': // 右下
          comp.w = Math.max(50, startWidth + dx)
          comp.h = Math.max(50, startHeight + dy)
          break
        case 's': // 下
          comp.h = Math.max(50, startHeight + dy)
          break
        case 'sw': // 左下
          comp.x = startLeft + dx
          comp.w = Math.max(50, startWidth - dx)
          comp.h = Math.max(50, startHeight + dy)
          break
        case 'w': // 左
          comp.x = startLeft + dx
          comp.w = Math.max(50, startWidth - dx)
          break
        case 'nw': // 左上
          comp.x = startLeft + dx
          comp.y = startTop + dy
          comp.w = Math.max(50, startWidth - dx)
          comp.h = Math.max(50, startHeight - dy)
          break
      }
    }

    const onMouseUp = () => {
      // 拖动结束后取整
      comp.x = Math.round(comp.x)
      comp.y = Math.round(comp.y)
      comp.w = Math.round(comp.w)
      comp.h = Math.round(comp.h)

      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return {
    alignmentLines,
    startDrag,
    startResize
  }
}
