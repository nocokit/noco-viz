/**
 * 表单验证规则库
 * 提供常用的表单验证规则，兼容 Element Plus
 */

/**
 * 必填验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function required(message = '此项为必填项', trigger = 'blur') {
  return {
    required: true,
    message,
    trigger
  }
}

/**
 * 邮箱验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function email(message = '请输入正确的邮箱地址', trigger = 'blur') {
  return {
    type: 'email',
    message,
    trigger
  }
}

/**
 * 手机号验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function phone(message = '请输入正确的手机号', trigger = 'blur') {
  return {
    pattern: /^1[3-9]\d{9}$/,
    message,
    trigger
  }
}

/**
 * 身份证验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function idCard(message = '请输入正确的身份证号', trigger = 'blur') {
  return {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message,
    trigger
  }
}

/**
 * URL 验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function url(message = '请输入正确的URL地址', trigger = 'blur') {
  return {
    type: 'url',
    message,
    trigger
  }
}

/**
 * 数字验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function number(message = '请输入数字', trigger = 'blur') {
  return {
    type: 'number',
    message,
    trigger
  }
}

/**
 * 整数验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function integer(message = '请输入整数', trigger = 'blur') {
  return {
    type: 'integer',
    message,
    trigger
  }
}

/**
 * 长度验证
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function length(min, max, message, trigger = 'blur') {
  const msg = message || `长度在 ${min} 到 ${max} 个字符`
  return {
    min,
    max,
    message: msg,
    trigger
  }
}

/**
 * 最小长度验证
 * @param {number} min - 最小长度
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function minLength(min, message, trigger = 'blur') {
  const msg = message || `长度不能少于 ${min} 个字符`
  return {
    min,
    message: msg,
    trigger
  }
}

/**
 * 最大长度验证
 * @param {number} max - 最大长度
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function maxLength(max, message, trigger = 'blur') {
  const msg = message || `长度不能超过 ${max} 个字符`
  return {
    max,
    message: msg,
    trigger
  }
}

/**
 * 范围验证
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function range(min, max, message, trigger = 'blur') {
  const msg = message || `值必须在 ${min} 到 ${max} 之间`
  return {
    type: 'number',
    min,
    max,
    message: msg,
    trigger
  }
}

/**
 * 最小值验证
 * @param {number} min - 最小值
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function min(min, message, trigger = 'blur') {
  const msg = message || `值不能小于 ${min}`
  return {
    type: 'number',
    min,
    message: msg,
    trigger
  }
}

/**
 * 最大值验证
 * @param {number} max - 最大值
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function max(max, message, trigger = 'blur') {
  const msg = message || `值不能大于 ${max}`
  return {
    type: 'number',
    max,
    message: msg,
    trigger
  }
}

/**
 * 正则验证
 * @param {RegExp} pattern - 正则表达式
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function pattern(pattern, message = '格式不正确', trigger = 'blur') {
  return {
    pattern,
    message,
    trigger
  }
}

/**
 * 自定义验证
 * @param {Function} validator - 验证函数
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function custom(validator, trigger = 'blur') {
  return {
    validator,
    trigger
  }
}

/**
 * 密码强度验证
 * @param {string} level - 强度等级 (weak/medium/strong)
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function password(level = 'medium', message, trigger = 'blur') {
  const patterns = {
    weak: /^.{6,}$/,                                    // 至少6位
    medium: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,           // 至少8位，包含字母和数字
    strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/ // 至少8位，包含大小写字母、数字和特殊字符
  }

  const messages = {
    weak: '密码至少6位',
    medium: '密码至少8位，需包含字母和数字',
    strong: '密码至少8位，需包含大小写字母、数字和特殊字符'
  }

  return {
    pattern: patterns[level],
    message: message || messages[level],
    trigger
  }
}

/**
 * 用户名验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function username(message = '用户名只能包含字母、数字、下划线，4-20位', trigger = 'blur') {
  return {
    pattern: /^[a-zA-Z0-9_]{4,20}$/,
    message,
    trigger
  }
}

/**
 * 中文验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function chinese(message = '只能输入中文', trigger = 'blur') {
  return {
    pattern: /^[\u4e00-\u9fa5]+$/,
    message,
    trigger
  }
}

/**
 * 英文验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function english(message = '只能输入英文', trigger = 'blur') {
  return {
    pattern: /^[a-zA-Z]+$/,
    message,
    trigger
  }
}

/**
 * IP地址验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function ip(message = '请输入正确的IP地址', trigger = 'blur') {
  return {
    pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    message,
    trigger
  }
}

/**
 * 端口号验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function port(message = '请输入正确的端口号(1-65535)', trigger = 'blur') {
  return {
    validator: (rule, value, callback) => {
      const portNum = parseInt(value)
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        callback(new Error(message))
      } else {
        callback()
      }
    },
    trigger
  }
}

/**
 * 日期验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function date(message = '请选择日期', trigger = 'change') {
  return {
    type: 'date',
    required: true,
    message,
    trigger
  }
}

/**
 * 日期范围验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function dateRange(message = '请选择日期范围', trigger = 'change') {
  return {
    type: 'array',
    required: true,
    message,
    trigger
  }
}

/**
 * 数组验证
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function array(message = '请至少选择一项', trigger = 'change') {
  return {
    type: 'array',
    required: true,
    message,
    trigger
  }
}

/**
 * 确认密码验证
 * @param {string} passwordField - 密码字段名
 * @param {string} message - 错误提示
 * @param {string} trigger - 触发方式
 * @returns {Object}
 */
export function confirmPassword(passwordField = 'password', message = '两次输入的密码不一致', trigger = 'blur') {
  return {
    validator: (rule, value, callback, source) => {
      if (value !== source[passwordField]) {
        callback(new Error(message))
      } else {
        callback()
      }
    },
    trigger
  }
}

/**
 * 组合多个验证规则
 * @param {Array} rules - 规则数组
 * @returns {Array}
 */
export function combine(...rules) {
  return rules.flat()
}

/**
 * 常用规则组合
 */
export const commonRules = {
  // 用户名：必填 + 格式验证
  username: [
    required('请输入用户名'),
    username()
  ],

  // 密码：必填 + 强度验证
  password: [
    required('请输入密码'),
    password('medium')
  ],

  // 邮箱：必填 + 格式验证
  email: [
    required('请输入邮箱'),
    email()
  ],

  // 手机号：必填 + 格式验证
  phone: [
    required('请输入手机号'),
    phone()
  ],

  // 姓名：必填 + 长度限制
  name: [
    required('请输入姓名'),
    length(2, 20, '姓名长度在2-20个字符')
  ],

  // 描述：长度限制
  description: [
    maxLength(500, '描述不能超过500个字符')
  ]
}

/**
 * 默认导出
 */
export default {
  required,
  email,
  phone,
  idCard,
  url,
  number,
  integer,
  length,
  minLength,
  maxLength,
  range,
  min,
  max,
  pattern,
  custom,
  password,
  username,
  chinese,
  english,
  ip,
  port,
  date,
  dateRange,
  array,
  confirmPassword,
  combine,
  commonRules
}
