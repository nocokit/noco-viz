import { message } from 'ant-design-vue'

/**
 * 统一的消息提示 - 确保同时只显示一个消息
 */
export const showMessage = {
  success: (content) => { message.destroy(); message.success(content) },
  error: (content) => { message.destroy(); message.error(content) },
  warning: (content) => { message.destroy(); message.warning(content) },
  info: (content) => { message.destroy(); message.info(content) }
}
