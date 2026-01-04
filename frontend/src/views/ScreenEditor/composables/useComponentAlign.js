import { ElMessage } from 'element-plus'

/**
 * 组件对齐管理
 * 负责组件的对齐、分布、吸附等功能
 */
export function useComponentAlign(options = {}) {
  const { snapThreshold = 5 } = options

  /**
   * 计算对齐辅助线
   * @param {Array} draggingComponents - 正在拖动的组件
   * @param {Object} alignmentLines - 辅助线对象
   * @param {Array} allComponents - 所有组件
   * @returns {Object} 吸附坐标 { snapX, snapY }
   */
  const calculateAlignmentLines = (draggingComponents, alignmentLines, allComponents) => {
    // 获取所有未被拖动的组件
    const draggingIds = draggingComponents.map(c => c.id)
    let otherComponents = allComponents.filter(c => !draggingIds.includes(c.id))

    // 添加画布中心线作为虚拟参照物
    const canvasCenter = {
      id: 'canvas-center',
      x: 960 - 1, // 1920 / 2
      y: 540 - 1, // 1080 / 2
      w: 1,
      h: 1,
      isCanvas: true
    }
    otherComponents = [...otherComponents, canvasCenter]

    // 清空当前辅助线
    alignmentLines.vertical = []
    alignmentLines.horizontal = []

    if (otherComponents.length === 0) return { snapX: null, snapY: null }

    // 获取拖动组件的边界
    const draggingComp = draggingComponents[0]
    const draggingLeft = draggingComp.x
    const draggingRight = draggingComp.x + draggingComp.w
    const draggingCenterX = draggingComp.x + draggingComp.w / 2
    const draggingTop = draggingComp.y
    const draggingBottom = draggingComp.y + draggingComp.h
    const draggingCenterY = draggingComp.y + draggingComp.h / 2

    let snapX = null
    let snapY = null
    let minDistX = snapThreshold
    let minDistY = snapThreshold
    let nearestCompX = null
    let nearestCompY = null
    let alignTypeX = ''
    let alignTypeY = ''

    // 检测与其他组件的对齐
    otherComponents.forEach(comp => {
      const compLeft = comp.x
      const compRight = comp.x + comp.w
      const compCenterX = comp.x + comp.w / 2
      const compTop = comp.y
      const compBottom = comp.y + comp.h
      const compCenterY = comp.y + comp.h / 2

      // 垂直方向对齐检测（X轴）
      // 左对齐
      const distLeft = Math.abs(draggingLeft - compLeft)
      if (distLeft < minDistX) {
        minDistX = distLeft
        snapX = compLeft
        nearestCompX = comp
        alignTypeX = 'left'
      }

      // 右对齐
      const distRight = Math.abs(draggingRight - compRight)
      if (distRight < minDistX) {
        minDistX = distRight
        snapX = compRight - draggingComp.w
        nearestCompX = comp
        alignTypeX = 'right'
      }

      // 中心对齐
      const distCenterX = Math.abs(draggingCenterX - compCenterX)
      if (distCenterX < minDistX) {
        minDistX = distCenterX
        snapX = compCenterX - draggingComp.w / 2
        nearestCompX = comp
        alignTypeX = 'center'
      }

      // 水平方向对齐检测（Y轴）
      // 顶对齐
      const distTop = Math.abs(draggingTop - compTop)
      if (distTop < minDistY) {
        minDistY = distTop
        snapY = compTop
        nearestCompY = comp
        alignTypeY = 'top'
      }

      // 底对齐
      const distBottom = Math.abs(draggingBottom - compBottom)
      if (distBottom < minDistY) {
        minDistY = distBottom
        snapY = compBottom - draggingComp.h
        nearestCompY = comp
        alignTypeY = 'bottom'
      }

      // 中心对齐
      const distCenterY = Math.abs(draggingCenterY - compCenterY)
      if (distCenterY < minDistY) {
        minDistY = distCenterY
        snapY = compCenterY - draggingComp.h / 2
        nearestCompY = comp
        alignTypeY = 'middle'
      }
    })

    // 只绘制最近组件的辅助线
    if (nearestCompX) {
      const lineX = alignTypeX === 'left'
        ? nearestCompX.x
        : alignTypeX === 'right'
        ? nearestCompX.x + nearestCompX.w
        : nearestCompX.x + nearestCompX.w / 2

      const dragCurrentTop = snapY !== null ? snapY : draggingComp.y
      const dragCurrentBottom = dragCurrentTop + draggingComp.h

      const minTop = Math.min(dragCurrentTop, nearestCompX.y)
      const maxBottom = Math.max(dragCurrentBottom, nearestCompX.y + nearestCompX.h)

      alignmentLines.vertical = [{
        position: lineX,
        type: alignTypeX,
        top: minTop,
        height: maxBottom - minTop
      }]
    }

    if (nearestCompY) {
      const lineY = alignTypeY === 'top'
        ? nearestCompY.y
        : alignTypeY === 'bottom'
        ? nearestCompY.y + nearestCompY.h
        : nearestCompY.y + nearestCompY.h / 2

      const dragCurrentLeft = snapX !== null ? snapX : draggingComp.x
      const dragCurrentRight = dragCurrentLeft + draggingComp.w

      const minLeft = Math.min(dragCurrentLeft, nearestCompY.x)
      const maxRight = Math.max(dragCurrentRight, nearestCompY.x + nearestCompY.w)

      alignmentLines.horizontal = [{
        position: lineY,
        type: alignTypeY,
        left: minLeft,
        width: maxRight - minLeft
      }]
    }

    return { snapX, snapY }
  }

  /**
   * 清除对齐辅助线
   * @param {Object} alignmentLines - 辅助线对象
   */
  const clearAlignmentLines = (alignmentLines) => {
    alignmentLines.vertical = []
    alignmentLines.horizontal = []
  }

  /**
   * 对齐选中的组件
   * @param {string} type - 对齐类型
   * @param {Array} selectedComponents - 选中的组件
   * @param {Function} updateMultiSelectBox - 更新多选包围盒回调
   */
  const alignSelectedComponents = (type, selectedComponents, updateMultiSelectBox) => {
    if (selectedComponents.length < 2) return

    const comps = selectedComponents

    // 计算边界
    const minX = Math.min(...comps.map(c => c.x))
    const maxX = Math.max(...comps.map(c => c.x + c.w))
    const minY = Math.min(...comps.map(c => c.y))
    const maxY = Math.max(...comps.map(c => c.y + c.h))
    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2

    comps.forEach(comp => {
      switch (type) {
        case 'left':
          comp.x = minX
          break
        case 'right':
          comp.x = maxX - comp.w
          break
        case 'center-x':
          comp.x = midX - comp.w / 2
          break
        case 'top':
          comp.y = minY
          break
        case 'bottom':
          comp.y = maxY - comp.h
          break
        case 'center-y':
          comp.y = midY - comp.h / 2
          break
      }
    })

    // 分布逻辑
    if (type === 'dist-h' || type === 'dist-v') {
      const sorted = [...comps].sort((a, b) =>
        type === 'dist-h' ? a.x - b.x : a.y - b.y
      )

      const n = sorted.length
      if (n > 2) {
        if (type === 'dist-h') {
          const totalDist = sorted[n - 1].x - sorted[0].x
          const step = totalDist / (n - 1)
          sorted.forEach((comp, index) => {
            comp.x = sorted[0].x + index * step
          })
        } else {
          const totalDist = sorted[n - 1].y - sorted[0].y
          const step = totalDist / (n - 1)
          sorted.forEach((comp, index) => {
            comp.y = sorted[0].y + index * step
          })
        }
      }
    }

    // 更新多选包围盒
    updateMultiSelectBox?.()
    ElMessage.success('已对齐组件')
  }

  return {
    calculateAlignmentLines,
    clearAlignmentLines,
    alignSelectedComponents
  }
}
