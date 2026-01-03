import { ref } from 'vue'

/**
 * 画布缩放管理
 * 负责画布的缩放、适应屏幕等功能
 */
export function useCanvasZoom(options = {}) {
  const {
    initialScale = 0.4,
    minScale = 0.1,
    maxScale = 3,
    canvasWidth = 1920,
    canvasHeight = 1080
  } = options

  // 画布缩放比例
  const canvasScale = ref(initialScale)

  /**
   * 放大画布
   */
  const zoomIn = () => {
    if (canvasScale.value < maxScale) {
      canvasScale.value = Math.min(maxScale, canvasScale.value + 0.1)
    }
  }

  /**
   * 缩小画布
   */
  const zoomOut = () => {
    if (canvasScale.value > minScale) {
      canvasScale.value = Math.max(minScale, canvasScale.value - 0.1)
    }
  }

  /**
   * 重置缩放
   */
  const resetZoom = () => {
    canvasScale.value = 1
  }

  /**
   * 适应屏幕
   * @param {Object} viewportRect - 视口的尺寸信息
   */
  const fitToScreen = (viewportRect) => {
    if (!viewportRect) return

    const scaleX = viewportRect.width / canvasWidth
    const scaleY = viewportRect.height / canvasHeight
    canvasScale.value = Math.min(scaleX, scaleY) * 0.9
  }

  /**
   * 设置缩放比例
   * @param {number} scale - 新的缩放比例
   */
  const setScale = (scale) => {
    canvasScale.value = Math.max(minScale, Math.min(maxScale, scale))
  }

  /**
   * 处理滚轮缩放
   * @param {WheelEvent} event - 滚轮事件
   * @param {Object} mousePosition - 鼠标位置 {x, y}
   * @param {Object} panOffset - 当前平移偏移 {x, y}
   * @returns {Object} 新的平移偏移
   */
  const handleWheelZoom = (event, mousePosition, panOffset) => {
    const delta = event.deltaY > 0 ? -0.05 : 0.05
    const oldScale = canvasScale.value
    const newScale = Math.max(minScale, Math.min(maxScale, oldScale + delta))

    if (oldScale === newScale) {
      return panOffset
    }

    // 计算缩放前鼠标在画布上的位置
    const canvasX = (mousePosition.x - panOffset.x) / oldScale
    const canvasY = (mousePosition.y - panOffset.y) / oldScale

    // 更新缩放
    canvasScale.value = newScale

    // 调整平移位置，使鼠标位置保持不变
    return {
      x: mousePosition.x - canvasX * newScale,
      y: mousePosition.y - canvasY * newScale
    }
  }

  return {
    canvasScale,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    setScale,
    handleWheelZoom
  }
}
