/**
 * 媒体库相关 API
 */
import request from './http'

/**
 * 上传文件
 * @param {File} file - 文件对象
 * @param {Function} onProgress - 上传进度回调
 */
export function uploadMedia(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    }
  })
}

/**
 * 获取媒体列表
 * @param {Object} params - { page, limit, type, category, search }
 */
export function getMediaList(params) {
  return request.get('/media', { params })
}

/**
 * 获取媒体详情
 * @param {number} id
 */
export function getMediaDetail(id) {
  return request.get(`/media/${id}`)
}

/**
 * 创建媒体记录
 * @param {Object} data - { name, url, type, size, category, description }
 */
export function createMedia(data) {
  return request.post('/media', data)
}

/**
 * 更新媒体信息
 * @param {number} id
 * @param {Object} data - { name, category, description }
 */
export function updateMedia(id, data) {
  return request.patch(`/media/${id}`, data)
}

/**
 * 删除媒体
 * @param {number} id
 */
export function deleteMedia(id) {
  return request.delete(`/media/${id}`)
}

/**
 * 批量删除媒体
 * @param {Array} ids - 媒体ID数组
 */
export function batchDeleteMedia(ids) {
  return request.post('/media/batch-delete', { ids })
}

/**
 * 获取媒体分类列表
 */
export function getMediaCategories() {
  return request.get('/media/categories')
}

/**
 * 获取媒体统计信息
 */
export function getMediaStats() {
  return request.get('/media/stats')
}
