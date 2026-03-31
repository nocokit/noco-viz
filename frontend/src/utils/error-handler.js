/**
 * 全局错误处理器
 * 统一处理应用中的各种错误
 */
import { message, notification } from 'ant-design-vue'
import logger from './logger'

/**
 * 错误类型枚举
 */
export const ErrorType = {
  NETWORK: 'network',           // 网络错误
  API: 'api',                   // API 错误
  VALIDATION: 'validation',     // 验证错误
  PERMISSION: 'permission',     // 权限错误
  BUSINESS: 'business',         // 业务错误
  UNKNOWN: 'unknown'            // 未知错误
}

/**
 * 错误级别枚举
 */
export const ErrorLevel = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal'
}

/**
 * 错误处理配置
 */
const config = {
  // 是否显示错误提示
  showMessage: true,
  // 是否上报错误
  reportError: false,
  // 错误上报地址
  reportUrl: '',
  // 是否在控制台打印错误
  logError: true
}

/**
 * 错误日志存储
 */
const errorLogs = []

/**
 * 格式化错误信息
 * @param {Error|Object} error - 错误对象
 * @returns {Object} 格式化后的错误信息
 */
function formatError(error) {
  const formattedError = {
    message: '',
    type: ErrorType.UNKNOWN,
    level: ErrorLevel.ERROR,
    code: null,
    stack: null,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }

  // 处理不同类型的错误
  if (error instanceof Error) {
    formattedError.message = error.message
    formattedError.stack = error.stack
    formattedError.name = error.name

    // 判断错误类型
    if (error.name === 'NetworkError' || error.message.includes('Network')) {
      formattedError.type = ErrorType.NETWORK
    } else if (error.name === 'ValidationError') {
      formattedError.type = ErrorType.VALIDATION
    }
  } else if (typeof error === 'object') {
    // API 错误响应
    formattedError.message = error.message || error.detail || '请求失败'
    formattedError.code = error.code || error.status
    formattedError.type = ErrorType.API

    // 判断是否是权限错误
    if (error.code === 403 || error.status === 403) {
      formattedError.type = ErrorType.PERMISSION
    }
  } else if (typeof error === 'string') {
    formattedError.message = error
  }

  return formattedError
}

/**
 * 显示错误提示
 * @param {Object} error - 格式化后的错误对象
 */
function showErrorMessage(error) {
  if (!config.showMessage) return

  const { message: msg, type, level } = error

  // 根据错误级别选择提示方式
  if (level === ErrorLevel.FATAL) {
    notification.error({
      message: '严重错误',
      description: msg,
      duration: 0 // 不自动关闭
    })
  } else if (level === ErrorLevel.ERROR) {
    message.error(msg)
  } else if (level === ErrorLevel.WARNING) {
    message.warning(msg)
  } else {
    message.info(msg)
  }
}

/**
 * 记录错误日志
 * @param {Object} error - 格式化后的错误对象
 */
function logError(error) {
  if (!config.logError) return

  logger.error('[Error Handler]', error)

  // 存储错误日志(最多保存 100 条)
  errorLogs.push(error)
  if (errorLogs.length > 100) {
    errorLogs.shift()
  }
}

/**
 * 上报错误
 * @param {Object} error - 格式化后的错误对象
 */
async function reportError(error) {
  if (!config.reportError || !config.reportUrl) return

  try {
    await fetch(config.reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(error)
    })
  } catch (err) {
    logger.error('错误上报���败:', err)
  }
}

/**
 * 处理错误
 * @param {Error|Object|string} error - 错误对象
 * @param {Object} options - 处理选项
 */
export function handleError(error, options = {}) {
  const {
    showMessage = config.showMessage,
    logError: shouldLog = config.logError,
    reportError: shouldReport = config.reportError,
    level = ErrorLevel.ERROR
  } = options

  // 格式化错误
  const formattedError = formatError(error)
  formattedError.level = level

  // 显示错误提示
  if (showMessage) {
    showErrorMessage(formattedError)
  }

  // 记录错误日志
  if (shouldLog) {
    logError(formattedError)
  }

  // 上报错误
  if (shouldReport) {
    reportError(formattedError)
  }

  return formattedError
}

/**
 * 处理 API 错误
 * @param {Object} error - API 错误对象
 * @param {Object} options - 处理选项
 */
export function handleApiError(error, options = {}) {
  return handleError(error, {
    ...options,
    type: ErrorType.API
  })
}

/**
 * 处理网络错误
 * @param {Error} error - 网络错误对象
 * @param {Object} options - 处理选项
 */
export function handleNetworkError(error, options = {}) {
  return handleError(error, {
    ...options,
    type: ErrorType.NETWORK,
    level: ErrorLevel.ERROR
  })
}

/**
 * 处理验证错误
 * @param {Object} error - 验证错误对象
 * @param {Object} options - 处理选项
 */
export function handleValidationError(error, options = {}) {
  return handleError(error, {
    ...options,
    type: ErrorType.VALIDATION,
    level: ErrorLevel.WARNING
  })
}

/**
 * 处理权限错误
 * @param {Object} error - 权限错误对象
 * @param {Object} options - 处理选项
 */
export function handlePermissionError(error, options = {}) {
  return handleError(error, {
    ...options,
    type: ErrorType.PERMISSION,
    level: ErrorLevel.WARNING
  })
}

/**
 * 获取错误日志
 * @returns {Array} 错误日志列表
 */
export function getErrorLogs() {
  return [...errorLogs]
}

/**
 * 清空错误日志
 */
export function clearErrorLogs() {
  errorLogs.length = 0
}

/**
 * 配置错误处理器
 * @param {Object} options - 配置选项
 */
export function configureErrorHandler(options) {
  Object.assign(config, options)
}

/**
 * 默认导出
 */
export default {
  handleError,
  handleApiError,
  handleNetworkError,
  handleValidationError,
  handlePermissionError,
  getErrorLogs,
  clearErrorLogs,
  configureErrorHandler,
  ErrorType,
  ErrorLevel
}
