/**
 * 统一确认对话框
 * 支持二次确认输入、异步操作、自定义样式
 */

import { ElMessageBox, ElMessage } from 'element-plus'

/**
 * 确认对话框配置
 * @typedef {Object} ConfirmOptions
 * @property {string} title 标题
 * @property {string} message 消息内容
 * @property {string} type 类型 'warning' | 'info' | 'success' | 'error'
 * @property {string} confirmButtonText 确认按钮文本
 * @property {string} cancelButtonText 取消按钮文本
 * @property {boolean} requireInput 是否需要输入确认
 * @property {string} inputPlaceholder 输入框占位符
 * @property {string} inputPattern 输入验证正则
 * @property {string} inputErrorMessage 输入错误提示
 * @property {Function} inputValidator 自定义输入验证函数
 * @property {boolean} dangerouslyUseHTMLString 是否使用HTML字符串
 * @property {boolean} showCancelButton 是否显示取消按钮
 * @property {boolean} closeOnClickModal 点击遮罩是否关闭
 * @property {boolean} closeOnPressEscape 按ESC是否关闭
 * @property {Function} beforeClose 关闭前回调
 */

/**
 * 创建确认对话框
 */
export function useConfirmDialog() {
  /**
   * 显示确认对话框
   * @param {ConfirmOptions|string} options 配置对象或消息字符串
   * @returns {Promise<boolean>} 返回用户是否确认
   */
  const confirm = async (options) => {
    // 如果传入字符串，转换为配置对象
    if (typeof options === 'string') {
      options = { message: options }
    }

    const {
      title = '确认操作',
      message = '确定要执行此操作吗？',
      type = 'warning',
      confirmButtonText = '确定',
      cancelButtonText = '取消',
      requireInput = false,
      inputPlaceholder = '请输入以确认',
      inputPattern = null,
      inputErrorMessage = '输入不匹配',
      inputValidator = null,
      dangerouslyUseHTMLString = false,
      showCancelButton = true,
      closeOnClickModal = false,
      closeOnPressEscape = true,
      beforeClose = null
    } = options

    try {
      const config = {
        type,
        confirmButtonText,
        cancelButtonText,
        showCancelButton,
        closeOnClickModal,
        closeOnPressEscape,
        dangerouslyUseHTMLString,
        beforeClose
      }

      // 危险操作样式
      if (type === 'warning' || type === 'error') {
        config.confirmButtonClass = 'el-button--danger'
      }

      // 需要输入确认
      if (requireInput) {
        config.showInput = true
        config.inputPlaceholder = inputPlaceholder

        // 自定义验证器
        if (inputValidator) {
          config.inputValidator = inputValidator
          config.inputErrorMessage = inputErrorMessage
        }
        // 正则验证
        else if (inputPattern) {
          config.inputPattern = inputPattern
          config.inputErrorMessage = inputErrorMessage
        }
        // 默认非空验证
        else {
          config.inputValidator = (value) => {
            return value && value.trim().length > 0
          }
          config.inputErrorMessage = '输入不能为空'
        }
      }

      await ElMessageBox.confirm(message, title, config)
      return true
    } catch (error) {
      // 用户取消
      if (error === 'cancel' || error === 'close') {
        return false
      }
      // 其他错误
      console.error('Confirm dialog error:', error)
      return false
    }
  }

  /**
   * 删除确认（预设配置）
   * @param {string|Object} itemName 要删除的项名称或配置对象
   * @param {Object} customOptions 自定义选项
   */
  const confirmDelete = async (itemName, customOptions = {}) => {
    const isObject = typeof itemName === 'object'
    const name = isObject ? itemName.name : itemName
    const requireInput = isObject ? itemName.requireInput : false

    const options = {
      title: '确认删除',
      message: name
        ? `确定要删除 "${name}" 吗？此操作不可恢复。`
        : '确定要删除吗？此操作不可恢复。',
      type: 'warning',
      confirmButtonText: '删除',
      requireInput,
      ...customOptions
    }

    // 如果需要输入确认，验证输入是否匹配名称
    if (requireInput && name) {
      options.inputPlaceholder = `请输入 "${name}" 以确认删除`
      options.inputValidator = (value) => {
        return value === name
      }
      options.inputErrorMessage = `输入不匹配，请输入 "${name}"`
    }

    return confirm(options)
  }

  /**
   * 批量删除确认
   * @param {number} count 删除数量
   * @param {Object} customOptions 自定义选项
   */
  const confirmBatchDelete = async (count, customOptions = {}) => {
    if (!count || count === 0) {
      ElMessage.warning('请选择要删除的项')
      return false
    }

    const options = {
      title: '确认批量删除',
      message: `确定要删除选中的 ${count} 项吗？此操作不可恢复。`,
      type: 'warning',
      confirmButtonText: '删除',
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 信息提示（仅确认按钮）
   * @param {string} message 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const alert = async (message, customOptions = {}) => {
    const options = {
      title: '提示',
      message,
      type: 'info',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 警告提示
   * @param {string} message 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const warning = async (message, customOptions = {}) => {
    const options = {
      title: '警告',
      message,
      type: 'warning',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 错误提示
   * @param {string} message 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const error = async (message, customOptions = {}) => {
    const options = {
      title: '错误',
      message,
      type: 'error',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 成功提示
   * @param {string} message 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const success = async (message, customOptions = {}) => {
    const options = {
      title: '成功',
      message,
      type: 'success',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 自定义输入对话框
   * @param {Object} options 配置选项
   */
  const prompt = async (options = {}) => {
    const {
      title = '请输入',
      message = '',
      inputPlaceholder = '请输入内容',
      inputType = 'text',
      inputValue = '',
      inputValidator = null,
      inputErrorMessage = '输入格式不正确',
      ...restOptions
    } = options

    try {
      const result = await ElMessageBox.prompt(message, title, {
        inputPlaceholder,
        inputType,
        inputValue,
        inputValidator,
        inputErrorMessage,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        ...restOptions
      })

      return {
        confirmed: true,
        value: result.value
      }
    } catch (error) {
      return {
        confirmed: false,
        value: null
      }
    }
  }

  return {
    confirm,
    confirmDelete,
    confirmBatchDelete,
    alert,
    warning,
    error,
    success,
    prompt
  }
}
