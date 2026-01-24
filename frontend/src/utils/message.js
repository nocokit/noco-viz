import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

/**
 * 消息提示工具
 * 统一封装 Element Plus 的消息组件，提供一致的 API
 */

/**
 * 成功消息
 * @param {string} message - 消息内容
 * @param {Object} options - 其他选项
 */
export function success(message, options = {}) {
  return ElMessage.success({
    message,
    duration: 3000,
    ...options
  })
}

/**
 * 错误消息
 * @param {string} message - 消息内容
 * @param {Object} options - 其他选项
 */
export function error(message, options = {}) {
  return ElMessage.error({
    message,
    duration: 3000,
    ...options
  })
}

/**
 * 警告消息
 * @param {string} message - 消息内容
 * @param {Object} options - 其他选项
 */
export function warning(message, options = {}) {
  return ElMessage.warning({
    message,
    duration: 3000,
    ...options
  })
}

/**
 * 信息消息
 * @param {string} message - 消息内容
 * @param {Object} options - 其他选项
 */
export function info(message, options = {}) {
  return ElMessage.info({
    message,
    duration: 3000,
    ...options
  })
}

/**
 * 确认对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function confirm(message, title = '提示', options = {}) {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    ...options
  })
}

/**
 * 删除确认对话框
 * @param {string} message - 消息内容
 * @param {Object} options - 其他选项
 */
export function confirmDelete(message = '此操作将永久删除该数据，是否继续？', options = {}) {
  return confirm(message, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    confirmButtonClass: 'el-button--danger',
    ...options
  })
}

/**
 * 提示对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function alert(message, title = '提示', options = {}) {
  return ElMessageBox.alert(message, title, {
    confirmButtonText: '确定',
    ...options
  })
}

/**
 * 输入对话框
 * @param {string} message - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function prompt(message, title = '提示', options = {}) {
  return ElMessageBox.prompt(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    ...options
  })
}

/**
 * 通知 - 成功
 * @param {string} message - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function notifySuccess(message, title = '成功', options = {}) {
  return ElNotification.success({
    title,
    message,
    duration: 4500,
    ...options
  })
}

/**
 * 通知 - 错误
 * @param {string} message - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function notifyError(message, title = '错误', options = {}) {
  return ElNotification.error({
    title,
    message,
    duration: 4500,
    ...options
  })
}

/**
 * 通知 - 警告
 * @param {string} message - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function notifyWarning(message, title = '警告', options = {}) {
  return ElNotification.warning({
    title,
    message,
    duration: 4500,
    ...options
  })
}

/**
 * 通知 - 信息
 * @param {string} message - 消息内���
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function notifyInfo(message, title = '提示', options = {}) {
  return ElNotification.info({
    title,
    message,
    duration: 4500,
    ...options
  })
}

/**
 * 默认导出对象
 */
export default {
  success,
  error,
  warning,
  info,
  confirm,
  confirmDelete,
  alert,
  prompt,
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo
}
