import { ref, reactive } from 'vue'

/**
 * 画布管理 Composable
 * 提供画布缩放、平移、拖拽等功能
 */
export function useCanvas() {
  // 画布缩放和平移状态
  const canvasScale = ref(0.4)
  const canvasPanX = ref(0)
  const canvasPanY = ref(0)
  const isPanning = ref(false)
  const isSpacePressed = ref(false)
  const canvasViewport = ref(null)

  // 标尺相关 refs
  const rulerH = ref(null)
  const rulerV = ref(null)
  const guideH = ref(null)
  const guideV = ref(null)
  const labelX = ref(null)
  const labelY = ref(null)
  const hudX = ref(null)
  const hudY = ref(null)
  const cursorHud = ref(null)
  const mousePos = reactive({ x: -1, y: -1 })
  const logicalPos = reactive({ x: 0, y: 0 }) // 逻辑坐标（画布内）

  // 框选状态
  const isSelecting = ref(false)
  const selectionBox = reactive({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  })

  /**
   * 缩放画布
   */
  const zoomIn = () => {
    canvasScale.value = Math.min(3, canvasScale.value + 0.1)
  }

  const zoomOut = () => {
    canvasScale.value = Math.max(0.1, canvasScale.value - 0.1)
  }

  const fitToScreen = () => {
    canvasScale.value = 0.4
    canvasPanX.value = 0
    canvasPanY.value = 0
  }

  /**
   * 画布平移处理
   */
  const handleCanvasPanStart = (e, callbacks = {}) => {
    const { onSelectionStart, onSelectionMove, onSelectionEnd, drawRulers } = callbacks

    // 鼠标中键、右键或空格+左键拖动画布
    if (e.button === 1 || e.button === 2 || (e.button === 0 && isSpacePressed.value)) {
      e.preventDefault()
      isPanning.value = true

      const startX = e.clientX
      const startY = e.clientY
      const startPanX = canvasPanX.value
      const startPanY = canvasPanY.value

      const onMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        canvasPanX.value = startPanX + dx
        canvasPanY.value = startPanY + dy
        if (drawRulers) drawRulers()
      }

      const onMouseUp = () => {
        isPanning.value = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        if (drawRulers) drawRulers()
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      return
    }

    // 左键点击空白区域：开始框选
    if (e.button === 0 && e.target.classList.contains('screen-container')) {
      e.preventDefault()

      const rect = e.target.getBoundingClientRect()
      const startX = (e.clientX - rect.left - canvasPanX.value) / canvasScale.value
      const startY = (e.clientY - rect.top - canvasPanY.value) / canvasScale.value

      isSelecting.value = true
      selectionBox.startX = startX
      selectionBox.startY = startY
      selectionBox.currentX = startX
      selectionBox.currentY = startY

      if (onSelectionStart) {
        onSelectionStart(e)
      }

      const onMouseMove = (moveEvent) => {
        selectionBox.currentX = (moveEvent.clientX - rect.left - canvasPanX.value) / canvasScale.value
        selectionBox.currentY = (moveEvent.clientY - rect.top - canvasPanY.value) / canvasScale.value

        if (onSelectionMove) {
          onSelectionMove()
        }
      }

      const onMouseUp = () => {
        isSelecting.value = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        if (onSelectionEnd) {
          onSelectionEnd()
        }
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
  }

  /**
   * 滚轮缩放和滚动处理
   */
  const handleCanvasWheel = (e, drawRulers) => {
    e.preventDefault()

    // Shift + 滚轮 = 左右滚动
    if (e.shiftKey) {
      const scrollAmount = e.deltaY
      canvasPanX.value -= scrollAmount
      return
    }

    // Ctrl/Cmd + 滚轮 = 缩放
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? -0.05 : 0.05
      const newScale = Math.max(0.1, Math.min(3, canvasScale.value + delta))

      // 以鼠标位置为中心缩放
      if (canvasViewport.value) {
        const rect = canvasViewport.value.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // 计算缩放前鼠标在画布上的位置
        const canvasX = (mouseX - canvasPanX.value) / canvasScale.value
        const canvasY = (mouseY - canvasPanY.value) / canvasScale.value

        // 更新缩放
        canvasScale.value = newScale

        // 调整平移位置，使鼠标位置保持不变
        canvasPanX.value = mouseX - canvasX * newScale
        canvasPanY.value = mouseY - canvasY * newScale
      } else {
        canvasScale.value = newScale
      }
      return
    }

    // 普通滚轮 = 上下滚动
    canvasPanY.value -= e.deltaY

    // 如果有横向滚动值（触控板），也处理横向滚动
    if (e.deltaX) {
      canvasPanX.value -= e.deltaX
    }

    // 更新标尺
    if (drawRulers) drawRulers()
  }

  return {
    // 状态
    canvasScale,
    canvasPanX,
    canvasPanY,
    isPanning,
    isSpacePressed,
    canvasViewport,
    rulerH,
    rulerV,
    guideH,
    guideV,
    labelX,
    labelY,
    hudX,
    hudY,
    cursorHud,
    mousePos,
    logicalPos,
    isSelecting,
    selectionBox,

    // 方法
    zoomIn,
    zoomOut,
    fitToScreen,
    handleCanvasPanStart,
    handleCanvasWheel
  }
}
