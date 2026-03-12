/**
 * 剪贴板工具函数
 */

import { message } from 'ant-design-vue'

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @param {string} successMessage - 成功提示信息，默认'已复制到剪贴板'
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text, successMessage = '已复制到剪贴板') {
  if (!text) {
    message.warning('没有内容可复制')
    return false
  }

  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      message.success(successMessage)
      return true
    } else {
      // 降级方案：使用 execCommand
      return copyToClipboardFallback(text, successMessage)
    }
  } catch (err) {
    console.error('复制失败:', err)
    // 尝试降级方案
    return copyToClipboardFallback(text, successMessage)
  }
}

/**
 * 复制到剪贴板的降级方案
 * @param {string} text - 要复制的文本
 * @param {string} successMessage - 成功提示信息
 * @returns {boolean} 是否复制成功
 */
function copyToClipboardFallback(text, successMessage) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      message.success(successMessage)
      return true
    } else {
      message.error('复制失败')
      return false
    }
  } catch (err) {
    console.error('复制失败:', err)
    message.error('复制失败，请手动复制')
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

/**
 * 从剪贴板读取文本
 * @returns {Promise<string|null>} 剪贴板内容
 */
export async function readFromClipboard() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText()
      return text
    } else {
      message.warning('当前环境不支持读取剪贴板')
      return null
    }
  } catch (err) {
    console.error('读取剪贴板失败:', err)
    message.error('读取剪贴板失败')
    return null
  }
}

/**
 * 复制对象为JSON字符串
 * @param {Object} obj - 要复制的对象
 * @param {boolean} pretty - 是否格式化，默认true
 * @param {string} successMessage - 成功提示信息
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyObjectAsJSON(obj, pretty = true, successMessage = '已复制JSON到剪贴板') {
  try {
    const jsonString = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj)
    return await copyToClipboard(jsonString, successMessage)
  } catch (err) {
    console.error('复制对象失败:', err)
    message.error('复制失败，对象无法序列化')
    return false
  }
}

/**
 * 复制代码片段（保留格式）
 * @param {string} code - 代码片段
 * @param {string} successMessage - 成功提示信息
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyCode(code, successMessage = '已复制代码') {
  return await copyToClipboard(code, successMessage)
}

/**
 * 复制链接
 * @param {string} url - URL链接
 * @param {string} successMessage - 成功提示信息
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyLink(url, successMessage = '已复制链接') {
  return await copyToClipboard(url, successMessage)
}

/**
 * 检查是否支持剪贴板API
 * @returns {boolean} 是否支持
 */
export function isClipboardSupported() {
  return !!(navigator.clipboard && window.isSecureContext)
}
