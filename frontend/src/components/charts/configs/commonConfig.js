/**
 * 图表通用配置 - 赛博朋克风格
 * 所有图表组件共享的配置项
 */

/**
 * 创建标题配置
 * @param {string} text - 标题文本
 * @param {object} options - 额外配置选项
 * @returns {object} 标题配置对象
 */
export const createTitleConfig = (text = '图表标题', options = {}) => ({
  text,
  left: 'center',
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600
  },
  ...options
})

/**
 * 通用 Tooltip 配置 - axis 触发类型
 */
export const commonAxisTooltip = {
  trigger: 'axis',
  backgroundColor: 'rgba(10, 11, 13, 0.95)',
  borderColor: 'rgba(0, 240, 255, 0.3)',
  borderWidth: 1,
  textStyle: {
    color: '#e5e5e5'
  },
  extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
}

/**
 * 通用 Tooltip 配置 - item 触发类型
 */
export const commonItemTooltip = {
  trigger: 'item',
  backgroundColor: 'rgba(10, 11, 13, 0.95)',
  borderColor: 'rgba(5, 255, 161, 0.3)',
  borderWidth: 1,
  textStyle: {
    color: '#e5e5e5'
  },
  extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px);'
}

/**
 * 通用图例配置
 */
export const commonLegend = {
  top: 30,
  textStyle: {
    color: '#e5e5e5'
  },
  icon: 'circle'
}

/**
 * 通用网格配置
 */
export const commonGrid = {
  left: '3%',
  right: '4%',
  bottom: '3%',
  top: '15%',
  containLabel: true
}

/**
 * 通用 X 轴配置 - 类目轴
 */
export const commonCategoryXAxis = {
  type: 'category',
  axisLine: {
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.15)'
    }
  },
  axisLabel: {
    color: '#909399'
  }
}

/**
 * 通用 Y 轴配置 - 数值轴
 */
export const commonValueYAxis = {
  type: 'value',
  axisLine: {
    show: false
  },
  axisLabel: {
    color: '#909399'
  },
  splitLine: {
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.08)',
      type: 'dashed'
    }
  }
}

/**
 * 赛博朋克配色方案
 */
export const cyberpunkColors = {
  cyan: '#00f0ff',
  purple: '#b967ff',
  green: '#05ffa1',
  pink: '#ff006e',
  yellow: '#ffbe0b',
  blue: '#0096ff',
  red: '#ef4444'
}

/**
 * 创建渐变色配置
 * @param {string} color - 主色
 * @param {number} startOpacity - 起始透明度
 * @param {number} endOpacity - 结束透明度
 * @returns {object} 渐变色配置
 */
export const createGradient = (color, startOpacity = 0.4, endOpacity = 0) => ({
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: color.replace(')', `, ${startOpacity})`).replace('rgb', 'rgba') },
    { offset: 1, color: color.replace(')', `, ${endOpacity})`).replace('rgb', 'rgba') }
  ]
})
