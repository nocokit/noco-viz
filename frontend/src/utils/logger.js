/**
 * 统一日志工具
 * 开发环境输出日志,生产环境静默
 */

const isDev = import.meta.env.MODE === 'development'

export const logger = {
  log(...args) {
    if (isDev) {
      console.log('[LOG]', ...args)
    }
  },

  info(...args) {
    if (isDev) {
      console.info('[INFO]', ...args)
    }
  },

  warn(...args) {
    if (isDev) {
      console.warn('[WARN]', ...args)
    }
  },

  error(...args) {
    // 错误日志在生产环境也输出,但可以发送到监控系统
    console.error('[ERROR]', ...args)
    // TODO: 集成错误监控服务(如 Sentry)
  },

  debug(...args) {
    if (isDev) {
      console.debug('[DEBUG]', ...args)
    }
  }
}

export default logger
