/**
 * 坐标转换工具函数
 */

/**
 * 屏幕坐标转画布坐标
 * @param {number} screenX - 屏幕 X 坐标
 * @param {number} screenY - 屏幕 Y 坐标
 * @param {number} panX - 画布 X 偏移
 * @param {number} panY - 画布 Y 偏移
 * @param {number} scale - 缩放比例
 * @returns {Object} 画布坐标 {x, y}
 */
export function screenToCanvas(screenX, screenY, panX, panY, scale) {
  return {
    x: (screenX - panX) / scale,
    y: (screenY - panY) / scale
  }
}

/**
 * 画布坐标转屏幕坐标
 * @param {number} canvasX - 画布 X 坐标
 * @param {number} canvasY - 画布 Y 坐标
 * @param {number} panX - 画布 X 偏移
 * @param {number} panY - 画布 Y 偏移
 * @param {number} scale - 缩放比例
 * @returns {Object} 屏幕坐标 {x, y}
 */
export function canvasToScreen(canvasX, canvasY, panX, panY, scale) {
  return {
    x: canvasX * scale + panX,
    y: canvasY * scale + panY
  }
}

/**
 * 限制坐标在画布范围内
 * @param {number} x - X 坐标
 * @param {number} y - Y 坐标
 * @param {number} width - 组件宽度
 * @param {number} height - 组件高度
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 * @returns {Object} 限制后的坐标 {x, y}
 */
export function clampToCanvas(x, y, width, height, canvasWidth = 1920, canvasHeight = 1080) {
  return {
    x: Math.max(0, Math.min(canvasWidth - width, x)),
    y: Math.max(0, Math.min(canvasHeight - height, y))
  }
}

/**
 * 四舍五入坐标到网格
 * @param {number} value - 坐标值
 * @param {number} gridSize - 网格大小
 * @returns {number} 网格坐标
 */
export function snapToGrid(value, gridSize = 10) {
  return Math.round(value / gridSize) * gridSize
}

/**
 * 计算鼠标相对于元素的位置
 * @param {MouseEvent} event - 鼠标事件
 * @param {HTMLElement} element - 目标元素
 * @returns {Object} 相对位置 {x, y}
 */
export function getMousePosition(event, element) {
  const rect = element.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

/**
 * 计算两点之间的距离
 * @param {Object} point1 - 点1 {x, y}
 * @param {Object} point2 - 点2 {x, y}
 * @returns {number} 距离
 */
export function getDistance(point1, point2) {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}
