/**
 * 数据格式化工具函数
 * 用于统一格式化日期、文件大小、数字等数据
 */

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 * @example
 * formatFileSize(1024) // '1.0 KB'
 * formatFileSize(1048576) // '1.0 MB'
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  if (!bytes || isNaN(bytes)) return '-'

  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

/**
 * 格式化日期时间
 * @param {number|string|Date} timestamp - 时间戳或日期字符串
 * @param {string} format - 格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期时间
 * @example
 * formatDateTime(1609459200000) // '2021-01-01 00:00:00'
 * formatDateTime(1609459200000, 'YYYY-MM-DD') // '2021-01-01'
 */
export function formatDateTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!timestamp) return '-'

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化相对时间（几分钟前、几小时前等）
 * @param {number|string|Date} timestamp - 时间戳或日期字符串
 * @returns {string} 相对时间描述
 * @example
 * formatRelativeTime(Date.now() - 60000) // '1分钟前'
 * formatRelativeTime(Date.now() - 3600000) // '1小时前'
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return '-'

  const now = Date.now()
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '-'

  const diff = now - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (months < 12) return `${months}个月前`
  if (years < 2) return '1年前'
  return formatDateTime(timestamp, 'YYYY-MM-DD')
}

/**
 * 格式化数字（千分位分隔）
 * @param {number} num - 数字
 * @param {number} decimals - 小数位数，默认0
 * @returns {string} 格式化后的数字
 * @example
 * formatNumber(1234567) // '1,234,567'
 * formatNumber(1234.5678, 2) // '1,234.57'
 */
export function formatNumber(num, decimals = 0) {
  if (num === null || num === undefined || isNaN(num)) return '-'

  const fixed = Number(num).toFixed(decimals)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/**
 * 格式化百分比
 * @param {number} value - 数值（0-1 或 0-100）
 * @param {number} decimals - 小数位数，默认1
 * @param {boolean} isDecimal - 输入是否为小数形式（0-1），默认true
 * @returns {string} 格式化后的百分比
 * @example
 * formatPercentage(0.1234) // '12.3%'
 * formatPercentage(12.34, 1, false) // '12.3%'
 */
export function formatPercentage(value, decimals = 1, isDecimal = true) {
  if (value === null || value === undefined || isNaN(value)) return '-'

  const percentage = isDecimal ? value * 100 : value
  return `${percentage.toFixed(decimals)}%`
}

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {string} currency - 货币符号，默认'¥'
 * @param {number} decimals - 小数位数，默认2
 * @returns {string} 格式化后的货币
 * @example
 * formatCurrency(1234.56) // '¥1,234.56'
 * formatCurrency(1234.56, '$') // '$1,234.56'
 */
export function formatCurrency(amount, currency = '¥', decimals = 2) {
  if (amount === null || amount === undefined || isNaN(amount)) return '-'

  return `${currency}${formatNumber(amount, decimals)}`
}

/**
 * 格式化持续时间（秒转为时分秒）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时长
 * @example
 * formatDuration(3661) // '01:01:01'
 * formatDuration(61) // '01:01'
 */
export function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return '-'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * 截断文本并添加省略号
 * @param {string} text - 文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀，默认'...'
 * @returns {string} 截断后的文本
 * @example
 * truncateText('这是一段很长的文本', 5) // '这是一段很...'
 */
export function truncateText(text, maxLength, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

/**
 * 格式化文件名（移除扩展名）
 * @param {string} filename - 文件名
 * @returns {string} 不带扩展名的文件名
 * @example
 * formatFilename('document.pdf') // 'document'
 */
export function formatFilename(filename) {
  if (!filename) return ''
  return filename.replace(/\.[^/.]+$/, '')
}

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 文件扩展名（小写）
 * @example
 * getFileExtension('document.PDF') // 'pdf'
 */
export function getFileExtension(filename) {
  if (!filename) return ''
  const match = filename.match(/\.([^/.]+)$/)
  return match ? match[1].toLowerCase() : ''
}
