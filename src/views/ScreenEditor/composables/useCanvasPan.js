import { ref } from 'vue'

/**
 * 画布平移管理
 * 负责画布的拖动、平移等功能
 */
export function useCanvasPan(options = {}) {
  const { onPanChange } = options

  // 画布平移偏移
  const canvasPanX = ref(0)
  const canvasPanY = ref(0)

  // 是否正在平移
  const isPanning = ref(false)

  // 是否按下空格键
  const isSpacePressed = ref(false)

  /**
   * 重置平移
   */
  const resetPan = () => {
    canvasPanX.value = 0
    canvasPanY.value = 0
  }

  /**
   * 设置平移偏移
   * @param {number} x - X轴偏移
   * @param {number} y - Y轴偏移
   */
  const setPan = (x, y) => {
    canvasPanX.value = x
    canvasPanY.value = y
    onPanChange?.({ x, y })
  }

  /**
   * 居中显示画布
   * @param {Object} viewportRect - 视口尺寸
   * @param {number} canvasWidth - 画布宽度
   * @param {number} canvasHeight - 画布高度
   * @param {number} scale - 当前缩放比例
   */
  const centerCanvas = (viewportRect, canvasWidth, canvasHeight, scale) => {
    if (!viewportRect) return

    const x = (viewportRect.width - canvasWidth * scale) / 2
    const y = (viewportRect.height - canvasHeight * scale) / 2
    setPan(x, y)
  }

  /**
   * 开始平移
   * @param {MouseEvent} event - 鼠标事件
   * @param {Function} drawRulers - 绘制标尺回调
   * @returns {boolean} 是否开始平移
   */
  const startPan = (event, drawRulers) => {
    // 鼠标中键、右键或空格+左键拖动画布
    if (event.button === 1 || event.button === 2 || (event.button === 0 && isSpacePressed.value)) {
      event.preventDefault()
      isPanning.value = true

      const startX = event.clientX
      const startY = event.clientY
      const startPanX = canvasPanX.value
      const startPanY = canvasPanY.value

      const onMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        setPan(startPanX + dx, startPanY + dy)
        drawRulers?.()
      }

      const onMouseUp = () => {
        isPanning.value = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        drawRulers?.()
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)

      return true
    }

    return false
  }

  /**
   * 处理滚轮平移
   * @param {WheelEvent} event - 滚轮事件
   */
  const handleWheelPan = (event) => {
    // Shift + 滚轮 = 左右滚动
    if (event.shiftKey) {
      canvasPanX.value -= event.deltaY
      return true
    }

    // 普通滚轮 = 上下滚动
    if (!event.ctrlKey && !event.metaKey) {
      canvasPanY.value -= event.deltaY

      // 处理横向滚动值（触控板）
      if (event.deltaX) {
        canvasPanX.value -= event.deltaX
      }
      return true
    }

    return false
  }

  return {
    canvasPanX,
    canvasPanY,
    isPanning,
    isSpacePressed,
    resetPan,
    setPan,
    centerCanvas,
    startPan,
    handleWheelPan
  }
}
