/**
 * 表单验证规则库
 * 提供常用的验证规则，减少重复代码
 */

/**
 * 必填规则
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const required = (message = '此项为必填项', trigger = 'blur') => ({
  required: true,
  message,
  trigger
})

/**
 * 邮箱验证规则
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const email = (message = '请输入正确的邮箱地址', trigger = 'blur') => ({
  type: 'email',
  message,
  trigger
})

/**
 * 手机号验证规则
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const phone = (message = '请输入正确的手机号', trigger = 'blur') => ({
  pattern: /^1[3-9]\d{9}$/,
  message,
  trigger
})

/**
 * URL 验证规则
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const url = (message = '请输入正确的URL地址', trigger = 'blur') => ({
  type: 'url',
  message,
  trigger
})

/**
 * 数字验证规则
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const number = (message = '请输入数字', trigger = 'blur') => ({
  type: 'number',
  message,
  trigger
})

/**
 * 整数验证规则
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const integer = (message = '请输入整数', trigger = 'blur') => ({
  type: 'integer',
  message,
  trigger
})

/**
 * 最小长度验证
 * @param {number} min - 最小长度
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const minLength = (min, message = `长度不能少于${min}个字符`, trigger = 'blur') => ({
  min,
  message,
  trigger
})

/**
 * 最大长度验证
 * @param {number} max - 最大长度
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const maxLength = (max, message = `长度不能超过${max}个字符`, trigger = 'blur') => ({
  max,
  message,
  trigger
})

/**
 * 长度范围验证
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const lengthRange = (min, max, message = `长度必须在${min}-${max}个字符之间`, trigger = 'blur') => ({
  min,
  max,
  message,
  trigger
})

/**
 * 数值范围验证
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const range = (min, max, message = `数值必须在${min}-${max}之间`, trigger = 'blur') => ({
  type: 'number',
  min,
  max,
  message,
  trigger
})

/**
 * 用户名验证规则（字母、数字、下划线，4-20位）
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const username = (message = '用户名只能包含字母、数字、下划线，长度4-20位', trigger = 'blur') => ({
  pattern: /^[a-zA-Z0-9_]{4,20}$/,
  message,
  trigger
})

/**
 * 密码强度验证（至少包含字母和数字，6-20位）
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const password = (message = '密码必须包含字母和数字，长度6-20位', trigger = 'blur') => ({
  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/,
  message,
  trigger
})

/**
 * 强密码验证（必须包含大小写字母、数字和特殊字符，8-20位）
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const strongPassword = (message = '密码必须包含大小写字母、数字和特殊字符，长度8-20位', trigger = 'blur') => ({
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
  message,
  trigger
})

/**
 * IP地址验证
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const ip = (message = '请输入正确的IP地址', trigger = 'blur') => ({
  pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  message,
  trigger
})

/**
 * 端口号验证
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const port = (message = '请输入正确的端口号(1-65535)', trigger = 'blur') => ({
  validator: (rule, value, callback) => {
    if (!value) {
      callback()
      return
    }
    const portNum = Number(value)
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      callback(new Error(message))
    } else {
      callback()
    }
  },
  trigger
})

/**
 * 身份证号验证
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const idCard = (message = '请输入正确的身份证号', trigger = 'blur') => ({
  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  message,
  trigger
})

/**
 * 中文验证
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const chinese = (message = '只能输入中文', trigger = 'blur') => ({
  pattern: /^[\u4e00-\u9fa5]+$/,
  message,
  trigger
})

/**
 * 英文验证
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const english = (message = '只能输入英文字母', trigger = 'blur') => ({
  pattern: /^[a-zA-Z]+$/,
  message,
  trigger
})

/**
 * 自定义正则验证
 * @param {RegExp} pattern - 正则表达式
 * @param {string} message - 错误提示信息
 * @param {string} trigger - 触发方式
 */
export const pattern = (pattern, message = '格式不正确', trigger = 'blur') => ({
  pattern,
  message,
  trigger
})

/**
 * 自定义验证器
 * @param {Function} validator - 验证函数
 * @param {string} trigger - 触发方式
 */
export const custom = (validator, trigger = 'blur') => ({
  validator,
  trigger
})

/**
 * 组合多个验证规则
 * @param  {...any} rules - 验证规则
 */
export const combine = (...rules) => {
  return rules.flat()
}

/**
 * 常用组合规则
 */
export const commonRules = {
  // 必填用户名
  requiredUsername: [required('请输入用户名'), username()],

  // 必填邮箱
  requiredEmail: [required('请输入邮箱'), email()],

  // 必填手机号
  requiredPhone: [required('请输入手机号'), phone()],

  // 必填密码
  requiredPassword: [required('请输入密码'), password()],

  // 必填强密码
  requiredStrongPassword: [required('请输入密码'), strongPassword()],

  // 必填IP地址
  requiredIp: [required('请输入IP地址'), ip()],

  // 必填URL
  requiredUrl: [required('请输入URL'), url()],

  // 必填且长度限制
  requiredWithLength: (min, max) => [
    required(),
    lengthRange(min, max)
  ],

  // 可选邮箱（为空时不验证）
  optionalEmail: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],

  // 可选手机号（为空时不验证）
  optionalPhone: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        const phonePattern = /^1[3-9]\d{9}$/
        if (!phonePattern.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

/**
 * 默认导出
 */
export default {
  required,
  email,
  phone,
  url,
  number,
  integer,
  minLength,
  maxLength,
  lengthRange,
  range,
  username,
  password,
  strongPassword,
  ip,
  port,
  idCard,
  chinese,
  english,
  pattern,
  custom,
  combine,
  commonRules
}
