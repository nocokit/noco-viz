/**
 * 存储工具函数
 * 统一封装 localStorage 和 sessionStorage
 */

/**
 * 存储类型
 */
export const StorageType = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage'
}

/**
 * 存储类
 */
class Storage {
  constructor(type = StorageType.LOCAL) {
    this.storage = type === StorageType.SESSION ? sessionStorage : localStorage
    this.prefix = 'app_' // 统一前缀，避免冲突
  }

  /**
   * 生成完整的键名
   * @param {string} key - 键名
   * @returns {string}
   */
  getKey(key) {
    return `${this.prefix}${key}`
  }

  /**
   * 设置存储
   * @param {string} key - 键名
   * @param {*} value - 值
   * @param {number} expire - 过期时间（秒），0 表示永不过期
   */
  set(key, value, expire = 0) {
    const fullKey = this.getKey(key)

    const data = {
      value,
      expire: expire > 0 ? Date.now() + expire * 1000 : 0
    }

    try {
      this.storage.setItem(fullKey, JSON.stringify(data))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  }

  /**
   * 获取存储
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*}
   */
  get(key, defaultValue = null) {
    const fullKey = this.getKey(key)

    try {
      const item = this.storage.getItem(fullKey)

      if (!item) {
        return defaultValue
      }

      const data = JSON.parse(item)

      // 检查是否过期
      if (data.expire && data.expire < Date.now()) {
        this.remove(key)
        return defaultValue
      }

      return data.value
    } catch (e) {
      console.error('Storage get error:', e)
      return defaultValue
    }
  }

  /**
   * 移除存储
   * @param {string} key - 键名
   */
  remove(key) {
    const fullKey = this.getKey(key)
    this.storage.removeItem(fullKey)
  }

  /**
   * 清空所有存储
   */
  clear() {
    // 只清除带前缀的项
    const keys = Object.keys(this.storage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key)
      }
    })
  }

  /**
   * 检查键是否存在
   * @param {string} key - 键名
   * @returns {boolean}
   */
  has(key) {
    const fullKey = this.getKey(key)
    return this.storage.getItem(fullKey) !== null
  }

  /**
   * 获取所有键
   * @returns {Array}
   */
  keys() {
    const keys = Object.keys(this.storage)
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''))
  }

  /**
   * 获取存储大小（字节）
   * @returns {number}
   */
  size() {
    let size = 0
    const keys = Object.keys(this.storage)

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const value = this.storage.getItem(key)
        size += key.length + (value ? value.length : 0)
      }
    })

    return size
  }

  /**
   * 设置前缀
   * @param {string} prefix - 前缀
   */
  setPrefix(prefix) {
    this.prefix = prefix
  }
}

/**
 * localStorage 实例
 */
export const local = new Storage(StorageType.LOCAL)

/**
 * sessionStorage 实例
 */
export const session = new Storage(StorageType.SESSION)

/**
 * Cookie 工具
 */
export const cookie = {
  /**
   * 设置 Cookie
   * @param {string} name - 名称
   * @param {string} value - 值
   * @param {Object} options - 选项
   */
  set(name, value, options = {}) {
    const {
      expires = 0,      // 过期时间（天）
      path = '/',       // 路径
      domain = '',      // 域名
      secure = false,   // 是否仅 HTTPS
      sameSite = 'Lax'  // SameSite 属性
    } = options

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (expires) {
      const date = new Date()
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
      cookieString += `; expires=${date.toUTCString()}`
    }

    if (path) {
      cookieString += `; path=${path}`
    }

    if (domain) {
      cookieString += `; domain=${domain}`
    }

    if (secure) {
      cookieString += '; secure'
    }

    if (sameSite) {
      cookieString += `; samesite=${sameSite}`
    }

    document.cookie = cookieString
  },

  /**
   * 获取 Cookie
   * @param {string} name - 名称
   * @returns {string|null}
   */
  get(name) {
    const nameEQ = `${encodeURIComponent(name)}=`
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
      cookie = cookie.trim()
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }

    return null
  },

  /**
   * 移除 Cookie
   * @param {string} name - 名称
   * @param {Object} options - 选项
   */
  remove(name, options = {}) {
    this.set(name, '', { ...options, expires: -1 })
  },

  /**
   * 检查 Cookie 是否存在
   * @param {string} name - 名称
   * @returns {boolean}
   */
  has(name) {
    return this.get(name) !== null
  },

  /**
   * 获取所有 Cookie
   * @returns {Object}
   */
  getAll() {
    const cookies = {}
    const items = document.cookie.split(';')

    items.forEach(item => {
      const [name, value] = item.trim().split('=')
      if (name) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value || '')
      }
    })

    return cookies
  }
}

/**
 * 内存存储（用于不支持 localStorage 的环境）
 */
class MemoryStorage {
  constructor() {
    this.data = new Map()
  }

  set(key, value, expire = 0) {
    this.data.set(key, {
      value,
      expire: expire > 0 ? Date.now() + expire * 1000 : 0
    })
  }

  get(key, defaultValue = null) {
    const item = this.data.get(key)

    if (!item) {
      return defaultValue
    }

    // 检查是否过期
    if (item.expire && item.expire < Date.now()) {
      this.data.delete(key)
      return defaultValue
    }

    return item.value
  }

  remove(key) {
    this.data.delete(key)
  }

  clear() {
    this.data.clear()
  }

  has(key) {
    return this.data.has(key)
  }

  keys() {
    return Array.from(this.data.keys())
  }

  size() {
    return this.data.size
  }
}

/**
 * 内存存储实例
 */
export const memory = new MemoryStorage()

/**
 * 检查存储是否可用
 * @param {string} type - 存储类型
 * @returns {boolean}
 */
export function isStorageAvailable(type = 'localStorage') {
  try {
    const storage = window[type]
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 获取存储实例
 * @param {string} type - 存储类型
 * @returns {Storage|MemoryStorage}
 */
export function getStorage(type = StorageType.LOCAL) {
  if (isStorageAvailable(type)) {
    return new Storage(type)
  }
  return memory
}

/**
 * 默认导出
 */
export default {
  local,
  session,
  cookie,
  memory,
  Storage,
  MemoryStorage,
  StorageType,
  isStorageAvailable,
  getStorage
}
