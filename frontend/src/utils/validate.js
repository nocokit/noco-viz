/**
 * 通用验证工具函数
 */

/**
 * 验证 IP 地址或 CIDR 网段
 * @param {string} ip - IP 地址或 CIDR 网段
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validateIP = (ip) => {
  if (!ip) return ''

  // 简单验证：检查是否包含数字和点的基本格式
  if (!/\d+\.\d+/.test(ip)) {
    return '请输入有效的IP地址'
  }

  return ''
}

/**
 * 验证邮箱地址
 * @param {string} email - 邮箱地址
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validateEmail = (email) => {
  if (!email) return ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址'
  }

  return ''
}

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validatePhone = (phone) => {
  if (!phone) return ''

  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return '请输入有效的手机号'
  }

  return ''
}

/**
 * 验证 URL
 * @param {string} url - URL 地址
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validateURL = (url) => {
  if (!url) return ''

  try {
    new URL(url)
    return ''
  } catch {
    return '请输入有效的URL地址'
  }
}

/**
 * 验证端口号
 * @param {string|number} port - 端口号
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validatePort = (port) => {
  if (!port) return ''

  const portNum = Number(port)
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return '请输入有效的端口号(1-65535)'
  }

  return ''
}

/**
 * 验证必填项
 * @param {any} value - 值
 * @param {string} fieldName - 字段名称
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validateRequired = (value, fieldName = '此项') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName}不能为空`
  }
  return ''
}

/**
 * 验证长度范围
 * @param {string} value - 值
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @returns {string} 错误信息，空字符串表示验证通过
 */
export const validateLength = (value, min, max) => {
  if (!value) return ''

  const length = value.length
  if (min && length < min) {
    return `长度不能少于${min}个字符`
  }
  if (max && length > max) {
    return `长度不能超过${max}个字符`
  }

  return ''
}
