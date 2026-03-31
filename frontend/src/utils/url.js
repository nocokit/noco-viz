/**
 * URL 工具函数
 * 提供 URL 参数处理、构建等功能
 */

/**
 * 解析 URL 参数
 * @param {string} url - URL 字符串，默认为当前页面 URL
 * @returns {Object} 参数对象
 */
export function parseQuery(url = window.location.href) {
  const queryString = url.split('?')[1]
  if (!queryString) return {}

  const params = {}
  const pairs = queryString.split('&')

  pairs.forEach(pair => {
    const [key, value] = pair.split('=')
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }
  })

  return params
}

/**
 * 构建 URL 参数字符串
 * @param {Object} params - 参数对象
 * @returns {string} 参数字符串
 */
export function stringifyQuery(params) {
  if (!params || Object.keys(params).length === 0) return ''

  const pairs = []

  Object.keys(params).forEach(key => {
    const value = params[key]

    if (value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach(v => {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
      })
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  })

  return pairs.join('&')
}

/**
 * 添加 URL 参数
 * @param {string} url - URL 字符串
 * @param {Object} params - 要添加的参数
 * @returns {string} 新的 URL
 */
export function addQuery(url, params) {
  if (!params || Object.keys(params).length === 0) return url

  const [baseUrl, hash] = url.split('#')
  const [path, existingQuery] = baseUrl.split('?')

  const existingParams = existingQuery ? parseQuery(`?${existingQuery}`) : {}
  const mergedParams = { ...existingParams, ...params }
  const queryString = stringifyQuery(mergedParams)

  let newUrl = path
  if (queryString) {
    newUrl += `?${queryString}`
  }
  if (hash) {
    newUrl += `#${hash}`
  }

  return newUrl
}

/**
 * 移除 URL 参数
 * @param {string} url - URL 字符串
 * @param {string|Array} keys - 要移除的参数键
 * @returns {string} 新的 URL
 */
export function removeQuery(url, keys) {
  const keysToRemove = Array.isArray(keys) ? keys : [keys]
  const [baseUrl, hash] = url.split('#')
  const [path, existingQuery] = baseUrl.split('?')

  if (!existingQuery) return url

  const params = parseQuery(`?${existingQuery}`)

  keysToRemove.forEach(key => {
    delete params[key]
  })

  const queryString = stringifyQuery(params)

  let newUrl = path
  if (queryString) {
    newUrl += `?${queryString}`
  }
  if (hash) {
    newUrl += `#${hash}`
  }

  return newUrl
}

/**
 * 获取 URL 参数值
 * @param {string} key - 参数键
 * @param {string} url - URL 字符串，默认为当前页面 URL
 * @returns {string|null} 参数值
 */
export function getQueryValue(key, url = window.location.href) {
  const params = parseQuery(url)
  return params[key] || null
}

/**
 * 构建完整 URL
 * @param {string} path - 路径
 * @param {Object} params - 参数对象
 * @param {string} baseUrl - 基础 URL
 * @returns {string} 完整 URL
 */
export function buildUrl(path, params = {}, baseUrl = '') {
  let url = baseUrl ? `${baseUrl}${path}` : path
  const queryString = stringifyQuery(params)

  if (queryString) {
    url += `?${queryString}`
  }

  return url
}

/**
 * 判断是否是绝对 URL
 * @param {string} url - URL 字符串
 * @returns {boolean}
 */
export function isAbsoluteUrl(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

/**
 * 判断是否是外部链接
 * @param {string} url - URL 字符串
 * @returns {boolean}
 */
export function isExternalLink(url) {
  return /^(https?:|mailto:|tel:)/.test(url)
}

/**
 * 获取 URL 的域名
 * @param {string} url - URL 字符串
 * @returns {string} 域名
 */
export function getDomain(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (e) {
    return ''
  }
}

/**
 * 获取 URL 的路径
 * @param {string} url - URL 字符串
 * @returns {string} 路径
 */
export function getPath(url) {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch (e) {
    return url.split('?')[0].split('#')[0]
  }
}

/**
 * 合并 URL 路径
 * @param  {...string} paths - 路径片段
 * @returns {string} 合并后的路径
 */
export function joinPath(...paths) {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/$/, '')
      }
      return path.replace(/^\//, '').replace(/\/$/, '')
    })
    .filter(Boolean)
    .join('/')
}

/**
 * 规范化 URL 路径
 * @param {string} path - 路径
 * @returns {string} 规范化后的路径
 */
export function normalizePath(path) {
  return path
    .replace(/\/+/g, '/') // 多个斜杠替换为单个
    .replace(/\/\.\//g, '/') // 移除 /./
    .replace(/\/[^/]+\/\.\.\//g, '/') // 移除 /../
}

/**
 * 下载文件
 * @param {string} url - 文件 URL
 * @param {string} filename - 文件名
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || ''
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 打开新窗口
 * @param {string} url - URL
 * @param {string} target - 目标窗口
 * @param {string} features - 窗口特性
 */
export function openWindow(url, target = '_blank', features = '') {
  return window.open(url, target, features)
}

/**
 * 默认导出
 */
export default {
  parseQuery,
  stringifyQuery,
  addQuery,
  removeQuery,
  getQueryValue,
  buildUrl,
  isAbsoluteUrl,
  isExternalLink,
  getDomain,
  getPath,
  joinPath,
  normalizePath,
  downloadFile,
  openWindow
}
