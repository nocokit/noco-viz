import { message as antMessage, Modal, notification } from 'ant-design-vue'

/**
 * 消息提示工具
 * 统一封装 Ant Design Vue 的消息组件，提供一致的 API
 */

/**
 * 成功消息
 * @param {string} content - 消息内容
 * @param {Object} options - 其他选项
 */
export function success(content, options = {}) {
  return antMessage.success({
    content,
    duration: 3,
    ...options
  })
}

/**
 * 错误消息
 * @param {string} content - 消息内容
 * @param {Object} options - 其他选项
 */
export function error(content, options = {}) {
  return antMessage.error({
    content,
    duration: 3,
    ...options
  })
}

/**
 * 警告消息
 * @param {string} content - 消息内容
 * @param {Object} options - 其他选项
 */
export function warning(content, options = {}) {
  return antMessage.warning({
    content,
    duration: 3,
    ...options
  })
}

/**
 * 信息消息
 * @param {string} content - 消息内容
 * @param {Object} options - 其他选项
 */
export function info(content, options = {}) {
  return antMessage.info({
    content,
    duration: 3,
    ...options
  })
}

/**
 * 确认对话框
 * @param {string} content - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function confirm(content, title = '提示', options = {}) {
  return Modal.confirm({
    title,
    content,
    okText: '确定',
    cancelText: '取消',
    ...options
  })
}

/**
 * 删除确认对话框
 * @param {string} content - 消息内容
 * @param {Object} options - 其他选项
 */
export function confirmDelete(content = '此操作将永久删除该数据，是否继续？', options = {}) {
  return Modal.confirm({
    title: '删除确认',
    content,
    okText: '删除',
    cancelText: '取消',
    okType: 'danger',
    ...options
  })
}

/**
 * 提示对话框
 * @param {string} content - 消息内容
 * @param {string} title - 标题
 * @param {Object} options - 其他选项
 */
export function alert(content, title = '提示', options = {}) {
  return Modal.info({
    title,
    content,
    okText: '确定',
    ...options
  })
}

/**
 * 通知 - 成功
 * @param {string} message - 消息内容
 * @param {string} description - 描述
 * @param {Object} options - 其他选项
 */
export function notifySuccess(message, description = '', options = {}) {
  return notification.success({
    message,
    description,
    duration: 4.5,
    ...options
  })
}

/**
 * 通知 - 错误
 * @param {string} message - 消息内容
 * @param {string} description - 描述
 * @param {Object} options - 其他选项
 */
export function notifyError(message, description = '', options = {}) {
  return notification.error({
    message,
    description,
    duration: 4.5,
    ...options
  })
}

/**
 * 通知 - 警告
 * @param {string} message - 消息内容
 * @param {string} description - 描述
 * @param {Object} options - 其他选项
 */
export function notifyWarning(message, description = '', options = {}) {
  return notification.warning({
    message,
    description,
    duration: 4.5,
    ...options
  })
}

/**
 * 通知 - 信息
 * @param {string} message - 消息内容
 * @param {string} description - 描述
 * @param {Object} options - 其他选项
 */
export function notifyInfo(message, description = '', options = {}) {
  return notification.info({
    message,
    description,
    duration: 4.5,
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
  notifySuccess,
  notifyError,
  notifyWarning,
  notifyInfo
}
