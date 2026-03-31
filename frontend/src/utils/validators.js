/**
 * 表单验证工具函数
 * 提供常用的表单验证规则和验证器
 */

/**
 * 邮箱验证器
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const emailValidator = (rule, value, callback) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) {
    callback(new Error('请输入邮箱地址'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

/**
 * IP地址验证器（支持IPv4和CIDR格式）
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const ipValidator = (rule, value, callback) => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/

  if (!value) {
    callback(new Error('请输入IP地址'))
  } else if (!ipRegex.test(value) && !cidrRegex.test(value)) {
    callback(new Error('请输入正确的IP地址或CIDR格式 (如: 192.168.1.1 或 192.168.1.0/24)'))
  } else if (ipRegex.test(value)) {
    // 验证IP每段是否在0-255范围内
    const parts = value.split('.')
    const isValid = parts.every(part => {
      const num = parseInt(part)
      return num >= 0 && num <= 255
    })
    if (!isValid) {
      callback(new Error('IP地址每段必须在0-255之间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

/**
 * 端口号验证器
 * @param {Object} rule - 验证规则
 * @param {string|number} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const portValidator = (rule, value, callback) => {
  const port = parseInt(value)
  if (!value && value !== 0) {
    callback(new Error('请输入端口号'))
  } else if (isNaN(port) || port < 1 || port > 65535) {
    callback(new Error('端口号范围为 1-65535'))
  } else {
    callback()
  }
}

/**
 * URL验证器
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const urlValidator = (rule, value, callback) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  if (!value) {
    callback(new Error('请输入URL地址'))
  } else if (!urlRegex.test(value)) {
    callback(new Error('请输入正确的URL地址'))
  } else {
    callback()
  }
}

/**
 * 手机号验证器（中国大陆）
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const phoneValidator = (rule, value, callback) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

/**
 * 身份证号验证器（中国大陆）
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const idCardValidator = (rule, value, callback) => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    callback(new Error('请输入身份证号'))
  } else if (!idCardRegex.test(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}

/**
 * 用户名验证器（字母、数字、下划线、中划线）
 * @param {number} minLength - 最小长度，默认3
 * @param {number} maxLength - 最大长度，默认20
 * @returns {Function} 验证器函数
 */
export const usernameValidator = (minLength = 3, maxLength = 20) => {
  return (rule, value, callback) => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!value) {
      callback(new Error('请输入用户名'))
    } else if (value.length < minLength || value.length > maxLength) {
      callback(new Error(`用户名长度应在 ${minLength}-${maxLength} 个字符之间`))
    } else if (!usernameRegex.test(value)) {
      callback(new Error('用户名只能包含字母、数字、下划线和中划线'))
    } else {
      callback()
    }
  }
}

/**
 * 密码强度验证器
 * @param {number} minLength - 最小长度，默认8
 * @param {boolean} requireSpecial - 是否要求特殊字符，默认true
 * @returns {Function} 验证器函数
 */
export const passwordValidator = (minLength = 8, requireSpecial = true) => {
  return (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else if (value.length < minLength) {
      callback(new Error(`密码长度不能少于 ${minLength} 个字符`))
    } else {
      const hasLetter = /[a-zA-Z]/.test(value)
      const hasNumber = /\d/.test(value)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)

      if (!hasLetter || !hasNumber) {
        callback(new Error('密码必须包含字母和数字'))
      } else if (requireSpecial && !hasSpecial) {
        callback(new Error('密码必须包含特殊字符'))
      } else {
        callback()
      }
    }
  }
}

/**
 * 通用长度验证器
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} fieldName - 字段名称
 * @returns {Function} 验证器函数
 */
export const lengthValidator = (min, max, fieldName = '此字段') => {
  return (rule, value, callback) => {
    if (!value) {
      callback(new Error(`${fieldName}不能为空`))
    } else if (value.length < min || value.length > max) {
      callback(new Error(`${fieldName}长度应在 ${min}-${max} 个字符之间`))
    } else {
      callback()
    }
  }
}

/**
 * 数字范围验证器
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} fieldName - 字段名称
 * @returns {Function} 验证器函数
 */
export const numberRangeValidator = (min, max, fieldName = '此字段') => {
  return (rule, value, callback) => {
    if (value === null || value === undefined || value === '') {
      callback(new Error(`${fieldName}不能为空`))
    } else {
      const num = Number(value)
      if (isNaN(num)) {
        callback(new Error(`${fieldName}必须为数字`))
      } else if (num < min || num > max) {
        callback(new Error(`${fieldName}应在 ${min}-${max} 之间`))
      } else {
        callback()
      }
    }
  }
}

/**
 * 必填验证器
 * @param {string} message - 错误提示信息
 * @returns {Object} 验证规则对象
 */
export const requiredValidator = (message = '此字段不能为空') => {
  return { required: true, message, trigger: 'blur' }
}

/**
 * JSON格式验证器
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const jsonValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入JSON数据'))
  } else {
    try {
      JSON.parse(value)
      callback()
    } catch (e) {
      callback(new Error('JSON格式不正确'))
    }
  }
}

/**
 * 正则表达式验证器
 * @param {RegExp} regex - 正则表达式
 * @param {string} message - 错误提示信息
 * @returns {Function} 验证器函数
 */
export const regexValidator = (regex, message) => {
  return (rule, value, callback) => {
    if (!value) {
      callback(new Error('此字段不能为空'))
    } else if (!regex.test(value)) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
}

/**
 * 文件大小验证
 * @param {number} maxSize - 最大文件大小（字节）
 * @param {string} message - 错误提示信息
 * @returns {Function} 验证器函数
 */
export const fileSizeValidator = (maxSize, message) => {
  return (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.size > maxSize) {
      callback(new Error(message || `文件大小不能超过 ${maxSize / 1024 / 1024}MB`))
    } else {
      callback()
    }
  }
}

/**
 * 文件类型验证
 * @param {Array<string>} allowedTypes - 允许的文件类型数组，如 ['.jpg', '.png']
 * @param {string} message - 错误提示信息
 * @returns {Function} 验证器函数
 */
export const fileTypeValidator = (allowedTypes, message) => {
  return (rule, value, callback) => {
    if (!value) {
      callback()
    } else {
      const fileName = value.name || value
      const ext = '.' + fileName.split('.').pop().toLowerCase()
      if (!allowedTypes.includes(ext)) {
        callback(new Error(message || `只支持 ${allowedTypes.join(', ')} 格式的文件`))
      } else {
        callback()
      }
    }
  }
}

/**
 * 数据库名称验证器
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const dbNameValidator = (rule, value, callback) => {
  const dbNameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/
  if (!value) {
    callback(new Error('请输入数据库名称'))
  } else if (!dbNameRegex.test(value)) {
    callback(new Error('数据库名称必须以字母开头，只能包含字母、数字和下划线'))
  } else if (value.length > 64) {
    callback(new Error('数据库名称长度不能超过64个字符'))
  } else {
    callback()
  }
}

/**
 * SQL语句验证器（基础验证）
 * @param {Object} rule - 验证规则
 * @param {string} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
export const sqlValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入SQL语句'))
  } else {
    // 检查危险操作
    const dangerousKeywords = ['drop', 'delete', 'truncate', 'alter']
    const lowerValue = value.toLowerCase()
    const hasDangerous = dangerousKeywords.some(keyword =>
      lowerValue.includes(keyword + ' ')
    )

    if (hasDangerous) {
      callback(new Error('SQL语句包含危险操作关键字'))
    } else {
      callback()
    }
  }
}

/**
 * 常用验证规则集合
 */
export const commonRules = {
  required: requiredValidator(),
  email: [requiredValidator('请输入邮箱'), { validator: emailValidator, trigger: 'blur' }],
  phone: [requiredValidator('请输入手机号'), { validator: phoneValidator, trigger: 'blur' }],
  url: [requiredValidator('请输入URL'), { validator: urlValidator, trigger: 'blur' }],
  ip: [requiredValidator('请输入IP地址'), { validator: ipValidator, trigger: 'blur' }],
  port: [requiredValidator('请输入端口号'), { validator: portValidator, trigger: 'blur' }],
  json: [requiredValidator('请输入JSON'), { validator: jsonValidator, trigger: 'blur' }],
}
