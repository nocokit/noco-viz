/**
 * 统一确认对话框
 * 支持二次确认输入、异步操作、自定义样式
 */

import { Modal, message } from 'ant-design-vue'
import { h } from 'vue'

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
      message: msg = '确定要执行此操作吗？',
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

    return new Promise((resolve) => {
      const config = {
        title,
        content: msg,
        okText: confirmButtonText,
        cancelText: cancelButtonText,
        maskClosable: closeOnClickModal,
        keyboard: closeOnPressEscape,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      }

      // 设置按钮类型
      if (type === 'warning' || type === 'error') {
        config.okType = 'danger'
      }

      // 如果需要输入确认，使用自定义内容
      if (requireInput) {
        let inputValue = ''
        let errorMsg = ''

        config.content = h('div', [
          h('p', { style: { marginBottom: '12px' } }, msg),
          h('input', {
            type: 'text',
            placeholder: inputPlaceholder,
            class: 'ant-input',
            style: { width: '100%', marginBottom: errorMsg ? '4px' : '0' },
            onInput: (e) => {
              inputValue = e.target.value
              errorMsg = ''
            }
          }),
          errorMsg ? h('p', { style: { color: '#ff4d4f', fontSize: '12px', margin: '4px 0 0' } }, errorMsg) : null
        ])

        const originalOnOk = config.onOk
        config.onOk = () => {
          // 验证输入
          let isValid = false
          if (inputValidator) {
            isValid = inputValidator(inputValue)
          } else if (inputPattern) {
            isValid = new RegExp(inputPattern).test(inputValue)
          } else {
            isValid = inputValue && inputValue.trim().length > 0
          }

          if (!isValid) {
            message.error(inputErrorMessage)
            return Promise.reject()
          }

          originalOnOk()
          return Promise.resolve()
        }
      }

      Modal.confirm(config)
    })
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
      message.warning('请选择要删除的项')
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
   * @param {string} msg 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const alert = async (msg, customOptions = {}) => {
    const options = {
      title: '提示',
      message: msg,
      type: 'info',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 警告提示
   * @param {string} msg 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const warning = async (msg, customOptions = {}) => {
    const options = {
      title: '警告',
      message: msg,
      type: 'warning',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 错误提示
   * @param {string} msg 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const error = async (msg, customOptions = {}) => {
    const options = {
      title: '错误',
      message: msg,
      type: 'error',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 成功提示
   * @param {string} msg 消息内容
   * @param {Object} customOptions 自定义选项
   */
  const success = async (msg, customOptions = {}) => {
    const options = {
      title: '成功',
      message: msg,
      type: 'success',
      confirmButtonText: '知道了',
      showCancelButton: false,
      ...customOptions
    }

    return confirm(options)
  }

  /**
   * 输入提示框
   * @param {string} msg 消息内容
   * @param {string} title 标题
   * @param {Object} options 配置选项
   */
  const prompt = async (msg, title = '请输入', options = {}) => {
    const {
      inputPlaceholder = '请输入',
      inputType = 'text',
      inputValue = '',
      inputValidator = null,
      inputErrorMessage = '输入不合法',
      ...restOptions
    } = options

    let value = inputValue
    let errorMsg = ''

    return new Promise((resolve) => {
      Modal.confirm({
        title,
        content: h('div', [
          h('p', { style: { marginBottom: '12px' } }, msg),
          h('input', {
            type: inputType,
            placeholder: inputPlaceholder,
            value: value,
            class: 'ant-input',
            style: { width: '100%', marginBottom: errorMsg ? '4px' : '0' },
            onInput: (e) => {
              value = e.target.value
              errorMsg = ''
            }
          }),
          errorMsg ? h('p', { style: { color: '#ff4d4f', fontSize: '12px', margin: '4px 0 0' } }, errorMsg) : null
        ]),
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          // 验证输入
          if (inputValidator) {
            const validResult = inputValidator(value)
            if (validResult !== true) {
              message.error(inputErrorMessage)
              return Promise.reject()
            }
          }

          resolve({
            confirmed: true,
            value: value
          })
          return Promise.resolve()
        },
        onCancel: () => {
          resolve({
            confirmed: false,
            value: null
          })
        },
        ...restOptions
      })
    })
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
