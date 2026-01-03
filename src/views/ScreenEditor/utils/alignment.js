/**
 * 对齐计算工具函数
 */

/**
 * 计算两个矩形的对齐距离
 * @param {Object} rect1 - 矩形1 {x, y, w, h}
 * @param {Object} rect2 - 矩形2 {x, y, w, h}
 * @param {string} type - 对齐类型 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle'
 * @returns {number} 对齐距离
 */
export function getAlignDistance(rect1, rect2, type) {
  switch (type) {
    case 'left':
      return Math.abs(rect1.x - rect2.x)
    case 'right':
      return Math.abs((rect1.x + rect1.w) - (rect2.x + rect2.w))
    case 'center':
      return Math.abs((rect1.x + rect1.w / 2) - (rect2.x + rect2.w / 2))
    case 'top':
      return Math.abs(rect1.y - rect2.y)
    case 'bottom':
      return Math.abs((rect1.y + rect1.h) - (rect2.y + rect2.h))
    case 'middle':
      return Math.abs((rect1.y + rect1.h / 2) - (rect2.y + rect2.h / 2))
    default:
      return Infinity
  }
}

/**
 * 获取矩形的边界信息
 * @param {Object} rect - 矩形 {x, y, w, h}
 * @returns {Object} 边界信息
 */
export function getRectBounds(rect) {
  return {
    left: rect.x,
    right: rect.x + rect.w,
    top: rect.y,
    bottom: rect.y + rect.h,
    centerX: rect.x + rect.w / 2,
    centerY: rect.y + rect.h / 2,
    width: rect.w,
    height: rect.h
  }
}

/**
 * 计算多个组件的包围盒
 * @param {Array} components - 组件列表
 * @returns {Object} 包围盒 {x, y, width, height}
 */
export function getBoundingBox(components) {
  if (components.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  components.forEach(comp => {
    minX = Math.min(minX, comp.x)
    minY = Math.min(minY, comp.y)
    maxX = Math.max(maxX, comp.x + comp.w)
    maxY = Math.max(maxY, comp.y + comp.h)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

/**
 * 判断两个矩形是否相交
 * @param {Object} rect1 - 矩形1
 * @param {Object} rect2 - 矩形2
 * @returns {boolean} 是否相交
 */
export function isRectIntersect(rect1, rect2) {
  const bounds1 = getRectBounds(rect1)
  const bounds2 = getRectBounds(rect2)

  return !(
    bounds1.right < bounds2.left ||
    bounds1.left > bounds2.right ||
    bounds1.bottom < bounds2.top ||
    bounds1.top > bounds2.bottom
  )
}
