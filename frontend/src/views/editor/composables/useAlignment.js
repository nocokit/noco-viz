import { reactive } from 'vue'
import { showMessage } from './useMessage'

/**
 * 对齐辅助线 Composable
 * 提供对齐辅助线、吸附、对齐、分布等功能
 */
export function useAlignment(canvasComponents, selectedComponentIds) {
  // 对齐辅助线
  const alignmentLines = reactive({
    horizontal: [],
    vertical: []
  })

  // 吸附阈值（像素）
  const SNAP_THRESHOLD = 5

  /**
   * 计算对齐辅助线 - 优化版：只显示最近组件的辅助线
   * @param {Array} draggingComponents - 正在拖动的组件列表
   * @returns {Object} { snapX, snapY } - 吸附位置
   */
  const calculateAlignmentLines = (draggingComponents) => {
    // 获取所有未被拖动的组件
    const draggingIds = draggingComponents.map(c => c.id)
    let otherComponents = canvasComponents.value.filter(c => !draggingIds.includes(c.id))

    // 添加画布中心线作为虚拟参照物
    const canvasCenter = {
      id: 'canvas-center',
      x: 960 - 1, // 1920 / 2 (虚拟宽度为1)
      y: 540 - 1, // 1080 / 2 (虚拟高度为1)
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
    const draggingComp = draggingComponents[0] // 以第一个组件为参考
    const draggingLeft = draggingComp.x
    const draggingRight = draggingComp.x + draggingComp.w
    const draggingCenterX = draggingComp.x + draggingComp.w / 2
    const draggingTop = draggingComp.y
    const draggingBottom = draggingComp.y + draggingComp.h
    const draggingCenterY = draggingComp.y + draggingComp.h / 2

    let snapX = null
    let snapY = null
    let minDistX = SNAP_THRESHOLD
    let minDistY = SNAP_THRESHOLD
    let nearestCompX = null // 最近的X轴对齐组件
    let nearestCompY = null // 最近的Y轴对齐组件
    let alignTypeX = '' // 对齐类型
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

    // 只绘制最近组件的辅助线，并且辅助线只在两个组件之间显示
    if (nearestCompX) {
      const lineX = alignTypeX === 'left'
        ? nearestCompX.x
        : alignTypeX === 'right'
        ? nearestCompX.x + nearestCompX.w
        : nearestCompX.x + nearestCompX.w / 2

      // 计算辅助线的范围（只在拖动组件和参照组件之间）
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

      // 计算辅助线的范围（只在拖动组件和参照组件之间）
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
   */
  const clearAlignmentLines = () => {
    alignmentLines.vertical = []
    alignmentLines.horizontal = []
  }

  /**
   * 对齐选中的组件
   * @param {String} type - 对齐类型: left, right, center-x, top, bottom, center-y, same-width, same-height, dist-h, dist-v
   */
  const alignSelectedComponents = (type) => {
    if (selectedComponentIds.value.length < 2) return

    const comps = canvasComponents.value.filter(c =>
      selectedComponentIds.value.includes(c.id)
    )

    // 计算边界
    const minX = Math.min(...comps.map(c => c.x))
    const maxX = Math.max(...comps.map(c => c.x + c.w))
    const minY = Math.min(...comps.map(c => c.y))
    const maxY = Math.max(...comps.map(c => c.y + c.h))
    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2

    // 等宽等高：使用第一个选中组件的尺寸
    if (type === 'same-width' || type === 'same-height') {
      const referenceComp = comps[0]
      comps.forEach(comp => {
        if (type === 'same-width') {
          comp.w = referenceComp.w
        } else {
          comp.h = referenceComp.h
        }
      })
      showMessage.success(`已统一${type === 'same-width' ? '宽度' : '高度'}`)
      return
    }

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
        case 'dist-h':
        case 'dist-v':
          // 分布逻辑在下面统一处理
          break
      }
    })

    // 分布逻辑
    if (type === 'dist-h' || type === 'dist-v') {
      const sorted = [...comps].sort((a, b) =>
        type === 'dist-h' ? a.x - b.x : a.y - b.y
      )

      const n = sorted.length
      if (n >= 3) {
        if (type === 'dist-h') {
          // 计算总宽度（最右边组件的右边界 - 最左边组件的左边界）
          const leftMost = sorted[0].x
          const rightMost = sorted[n - 1].x + sorted[n - 1].w
          const totalWidth = rightMost - leftMost

          // 计算所有组件的总宽度
          const sumWidths = sorted.reduce((sum, comp) => sum + comp.w, 0)

          // 计算间距
          const totalGap = totalWidth - sumWidths
          const gap = totalGap / (n - 1)

          // 重新分布
          let currentX = leftMost
          sorted.forEach((comp) => {
            comp.x = currentX
            currentX += comp.w + gap
          })
        } else {
          // 计算总高度（最下边组件的下边界 - 最上边组件的上边界）
          const topMost = sorted[0].y
          const bottomMost = sorted[n - 1].y + sorted[n - 1].h
          const totalHeight = bottomMost - topMost

          // 计算所有组件的总高度
          const sumHeights = sorted.reduce((sum, comp) => sum + comp.h, 0)

          // 计算间距
          const totalGap = totalHeight - sumHeights
          const gap = totalGap / (n - 1)

          // 重新分布
          let currentY = topMost
          sorted.forEach((comp) => {
            comp.y = currentY
            currentY += comp.h + gap
          })
        }
      } else if (n === 2) {
        showMessage.warning('等间距分布需要至少3个组件')
        return
      }
    }

    showMessage.success('已对齐组件')
  }

  return {
    alignmentLines,
    SNAP_THRESHOLD,
    calculateAlignmentLines,
    clearAlignmentLines,
    alignSelectedComponents
  }
}
