/**
 * 获取图片完整 URL
 * @param {string} url - 图片路径
 * @returns {string} 完整的图片 URL
 */
export function getImageUrl(url) {
  if (!url) return ''

  // 如果是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 如果路径以 / 开头，直接使用（由 vite proxy 处理）
  if (url.startsWith('/')) {
    return url
  }

  // 否则拼接 API 基础路径
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  return baseUrl ? `${baseUrl}/${url}` : url
}

/**
 * 处理图片加载错误
 * @param {Event} e - 错误事件
 */
export function handleImageError(e) {
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  if (parent) {
    const defaultDiv = parent.querySelector('.list-item-thumb-default, .thumb-placeholder')
    if (defaultDiv) {
      defaultDiv.style.display = 'flex'
    }
  }
}
