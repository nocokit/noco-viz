/**
 * 系统配置管理
 * 包含默认配置、配置验证和配置管理功能
 */

// 默认系统配置
export const defaultSystemConfig = {
  basic: {
    systemName: 'NocoViz 数据可视化平台',
    language: 'zh-CN',
    adminEmail: 'admin@company.com',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD HH:mm:ss'
  },
  branding: {
    logoUrl: '',
    faviconUrl: '',
    copyright: '© 2024 MyCompany Inc. All Rights Reserved.',
    primaryColor: '#3b82f6',
    companyName: ''
  },
  security: {
    watermark: true,
    strongPassword: false,
    forceHttps: true,
    ipWhitelist: false,
    maxLoginAttempts: 5,
    lockoutDuration: 30 // 分钟
  },
  session: {
    timeout: 30, // 分钟
    singleSignOn: false,
    rememberMe: true,
    rememberMeDuration: 30 // 天
  },
  email: {
    smtpServer: '',
    port: 465,
    encryption: 'ssl',
    account: '',
    password: '',
    senderName: 'NocoViz System'
  },
  backup: {
    autoBackup: false,
    backupInterval: 'daily', // daily, weekly, monthly
    backupTime: '02:00',
    retentionDays: 30,
    backupPath: '/data/backups'
  }
}

// 语言选项
export const languageOptions = [
  { label: '简体中文 (zh-CN)', value: 'zh-CN' },
  { label: 'English (en-US)', value: 'en-US' },
  { label: '繁體中文 (zh-TW)', value: 'zh-TW' },
  { label: '日本語 (ja-JP)', value: 'ja-JP' }
]

// 时区选项
export const timezoneOptions = [
  { label: '北京时间 (UTC+8)', value: 'Asia/Shanghai' },
  { label: '东京时间 (UTC+9)', value: 'Asia/Tokyo' },
  { label: '纽约时间 (UTC-5)', value: 'America/New_York' },
  { label: '伦敦时间 (UTC+0)', value: 'Europe/London' }
]

// 加密方式选项
export const encryptionOptions = [
  { label: 'SSL', value: 'ssl' },
  { label: 'TLS', value: 'tls' },
  { label: 'None', value: 'none' }
]

// 备份间隔选项
export const backupIntervalOptions = [
  { label: '每日备份', value: 'daily' },
  { label: '每周备份', value: 'weekly' },
  { label: '每月备份', value: 'monthly' }
]

// 配置验证规则
export const configValidationRules = {
  basic: {
    systemName: [
      { required: true, message: '系统名称不能为空', trigger: 'blur' },
      { min: 2, max: 50, message: '系统名称长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    adminEmail: [
      { required: true, message: '管理员邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  },
  email: {
    smtpServer: [
      { required: true, message: 'SMTP 服务器地址不能为空', trigger: 'blur' }
    ],
    port: [
      { required: true, message: '端口号不能为空', trigger: 'blur' },
      { type: 'number', min: 1, max: 65535, message: '端口号必须在 1-65535 之间', trigger: 'blur' }
    ],
    account: [
      { required: true, message: '发件账号不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  }
}

// 从 localStorage 加载配置
export const loadSystemConfig = () => {
  try {
    const savedConfig = localStorage.getItem('systemConfig')
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig)
      // 合并默认配置和保存的配置，确保新增字段有默认值
      return mergeConfig(defaultSystemConfig, parsed)
    }
  } catch (error) {
    console.error('加载系统配置失败:', error)
  }
  return { ...defaultSystemConfig }
}

// 保存配置到 localStorage
export const saveSystemConfig = (config) => {
  try {
    localStorage.setItem('systemConfig', JSON.stringify(config))
    return true
  } catch (error) {
    console.error('保存系统配置失败:', error)
    return false
  }
}

// 重置配置为默认值
export const resetSystemConfig = () => {
  try {
    localStorage.removeItem('systemConfig')
    return { ...defaultSystemConfig }
  } catch (error) {
    console.error('重置系统配置失败:', error)
    return null
  }
}

// 深度合并配置对象
const mergeConfig = (defaultConfig, savedConfig) => {
  const result = { ...defaultConfig }

  for (const key in savedConfig) {
    if (savedConfig.hasOwnProperty(key)) {
      if (typeof savedConfig[key] === 'object' && !Array.isArray(savedConfig[key])) {
        result[key] = mergeConfig(defaultConfig[key] || {}, savedConfig[key])
      } else {
        result[key] = savedConfig[key]
      }
    }
  }

  return result
}

// 导出配置为 JSON 文件
export const exportConfigToJSON = (config) => {
  try {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `nocoviz-config-${Date.now()}.json`
    link.click()

    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('导出配置失败:', error)
    return false
  }
}

// 从 JSON 文件导入配置
export const importConfigFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)
        // 验证配置格式
        if (validateConfigStructure(config)) {
          resolve(config)
        } else {
          reject(new Error('配置文件格式不正确'))
        }
      } catch (error) {
        reject(new Error('配置文件解析失败'))
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsText(file)
  })
}

// 验证配置结构
const validateConfigStructure = (config) => {
  const requiredKeys = ['basic', 'branding', 'security', 'session', 'email']
  return requiredKeys.every(key => config.hasOwnProperty(key))
}

// 获取配置项说明
export const getConfigDescription = (section, key) => {
  const descriptions = {
    basic: {
      systemName: '系统名称将显示在浏览器标题栏、登录页面和页面顶部',
      language: '系统界面显示语言，切换后需要刷新页面生效',
      adminEmail: '系统管理员邮箱，用于接收重要通知和告警',
      timezone: '系统使用的时区，影响日志时间和定时任务',
      dateFormat: '日期时间显示格式'
    },
    security: {
      watermark: '启用后，在所有可视化页面显示用户名和时间水印，防止截屏泄密',
      strongPassword: '强制用户使用复杂密码，包含大小写字母、数字和特殊符号',
      forceHttps: '自动将 HTTP 请求重定向到 HTTPS，确保传输安全',
      ipWhitelist: '启用后，只有白名单内的 IP 地址可以访问系统',
      maxLoginAttempts: '允许的最大连续登录失败次数',
      lockoutDuration: '账号锁定时长（分钟）'
    },
    session: {
      timeout: '用户无操作后自动登出的时间（分钟）',
      singleSignOn: '同一账号只能在一个设备登录，新登录会踢出旧会话',
      rememberMe: '允许用户选择"记住我"，延长登录有效期',
      rememberMeDuration: '"记住我"的有效期（天）'
    },
    email: {
      smtpServer: 'SMTP 服务器地址，如 smtp.qq.com',
      port: 'SMTP 服务器端口，SSL 通常使用 465，TLS 使用 587',
      encryption: '邮件传输加密方式',
      account: '发件邮箱账号',
      password: '邮箱授权码或密码',
      senderName: '邮件发送者名称'
    }
  }

  return descriptions[section]?.[key] || ''
}

// 检查配置变更
export const hasConfigChanged = (original, current) => {
  return JSON.stringify(original) !== JSON.stringify(current)
}
