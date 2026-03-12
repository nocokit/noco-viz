/**
 * UI 工具集
 * 统一导出消息提示和确认对话框
 * 完全原生实现
 */

import message from './message'
import confirm from './confirm'

// 导出消息提示
export { message }

// 导出确认对话框
export { confirm }

// 兼容 API
export const ElMessage = message
export const ElMessageBox = {
  confirm: (message, title, options = {}) => {
    return confirm({
      title: title || '提示',
      content: message,
      ...options
    })
  },
  alert: (message, title, options = {}) => {
    return confirm({
      title: title || '提示',
      content: message,
      showCancelButton: false,
      ...options
    })
  },
  prompt: (message, title, options = {}) => {
    // 简单实现 prompt 功能
    return new Promise((resolve, reject) => {
      const value = window.prompt(message, options.inputValue || '')
      if (value !== null) {
        resolve({ value })
      } else {
        reject('cancel')
      }
    })
  }
}

// 默认导出
export default {
  message,
  confirm,
  ElMessage,
  ElMessageBox
}
