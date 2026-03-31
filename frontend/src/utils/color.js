/**
 * 颜色工具函数
 */

/**
 * 根据字符串生成固定颜色
 * @param {string} str - 输入字符串
 * @returns {string} 十六进制颜色值
 * @example
 * stringToColor('张三') // '#3b82f6'
 */
export function stringToColor(str) {
  const colors = [
    '#3b82f6', // blue
    '#f59e0b', // orange
    '#10b981', // green
    '#8b5cf6', // purple
    '#ef4444', // red
    '#06b6d4', // cyan
    '#f97316', // orange-dark
    '#6366f1', // indigo
    '#ec4899', // pink
    '#14b8a6', // teal
  ]

  if (!str) return colors[0]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

/**
 * 获取用户名首字母（用于头像显示）
 * @param {string} name - 用户名
 * @returns {string} 首字母（1-2个字符）
 * @example
 * getUserInitials('张三') // '张三'
 * getUserInitials('Zhang San') // 'ZS'
 * getUserInitials('John') // 'JO'
 */
export function getUserInitials(name) {
  if (!name) return '?'

  const trimmed = name.trim()

  // 中文名：取前两个字
  if (/[\u4e00-\u9fa5]/.test(trimmed)) {
    return trimmed.substring(0, 2)
  }

  // 英文名：取首字母
  const parts = trimmed.split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  return trimmed.substring(0, 2).toUpperCase()
}

/**
 * 根据数据库类型获取颜色
 * @param {string} type - 数据库类型
 * @returns {string} 十六进制颜色值
 * @example
 * getDbColor('mysql') // '#409eff'
 */
export function getDbColor(type) {
  const colors = {
    mysql: '#409eff',
    mariadb: '#003545',
    postgresql: '#336791',
    postgres: '#336791',
    oracle: '#f56c6c',
    mongodb: '#67c23a',
    redis: '#ef4444',
    sqlserver: '#0078d4',
    'sql server': '#0078d4',
    mssql: '#0078d4',
    sqlite: '#003b57',
    clickhouse: '#ffcc00',
    elasticsearch: '#005571',
    cassandra: '#1287b1',
  }

  return colors[type?.toLowerCase()] || '#909399'
}

/**
 * 根据文件类型获取颜色
 * @param {string} extension - 文件扩展名
 * @returns {string} 十六进制颜色值
 */
export function getFileColor(extension) {
  const colors = {
    // 文档
    pdf: '#ef4444',
    doc: '#2b579a',
    docx: '#2b579a',
    xls: '#217346',
    xlsx: '#217346',
    ppt: '#d24726',
    pptx: '#d24726',
    txt: '#909399',

    // 图片
    jpg: '#8b5cf6',
    jpeg: '#8b5cf6',
    png: '#10b981',
    gif: '#f59e0b',
    svg: '#f97316',
    webp: '#06b6d4',

    // 代码
    js: '#f7df1e',
    ts: '#3178c6',
    vue: '#42b883',
    jsx: '#61dafb',
    tsx: '#61dafb',
    html: '#e34c26',
    css: '#264de4',
    scss: '#cc6699',
    less: '#1d365d',
    json: '#000000',
    xml: '#ff6600',

    // 压缩包
    zip: '#909399',
    rar: '#909399',
    '7z': '#909399',
    tar: '#909399',
    gz: '#909399',

    // 音视频
    mp3: '#ff6b6b',
    wav: '#ff6b6b',
    mp4: '#845ec2',
    avi: '#845ec2',
    mov: '#845ec2',
  }

  return colors[extension?.toLowerCase()] || '#606266'
}

/**
 * 根据状态获取颜色
 * @param {string} status - 状态
 * @returns {string} 十六进制颜色值
 */
export function getStatusColor(status) {
  const colors = {
    success: '#67c23a',
    running: '#67c23a',
    active: '#67c23a',
    online: '#67c23a',
    connected: '#67c23a',

    error: '#f56c6c',
    failed: '#f56c6c',
    offline: '#f56c6c',
    disconnected: '#f56c6c',

    warning: '#e6a23c',
    pending: '#e6a23c',
    processing: '#e6a23c',

    info: '#409eff',
    cached: '#409eff',

    default: '#909399',
    disabled: '#909399',
    draft: '#909399',
    idle: '#909399',
  }

  return colors[status?.toLowerCase()] || colors.default
}

/**
 * 十六进制颜色转RGB
 * @param {string} hex - 十六进制颜色值
 * @returns {Object} RGB对象 {r, g, b}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * RGB转十六进制颜色
 * @param {number} r - 红色值 (0-255)
 * @param {number} g - 绿色值 (0-255)
 * @param {number} b - 蓝色值 (0-255)
 * @returns {string} 十六进制颜色值
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * 调整颜色亮度
 * @param {string} hex - 十六进制颜色值
 * @param {number} percent - 亮度调整百分比 (-100 到 100)
 * @returns {string} 调整后的十六进制颜色值
 */
export function adjustBrightness(hex, percent) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const adjust = (value) => {
    const adjusted = Math.round(value * (100 + percent) / 100)
    return Math.max(0, Math.min(255, adjusted))
  }

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
}

/**
 * 获取颜色的对比文本颜色（黑或白）
 * @param {string} hex - 十六进制颜色值
 * @returns {string} '#000000' 或 '#ffffff'
 */
export function getContrastColor(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'

  // 计算相对亮度
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

/**
 * 生成随机颜色
 * @returns {string} 十六进制颜色值
 */
export function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

/**
 * 颜色透明度转换
 * @param {string} hex - 十六进制颜色值
 * @param {number} alpha - 透明度 (0-1)
 * @returns {string} RGBA字符串
 */
export function hexToRgba(hex, alpha = 1) {
  const rgb = hexToRgb(hex)
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}
