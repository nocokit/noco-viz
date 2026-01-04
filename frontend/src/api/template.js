import request from './http'

/**
 * 模板管理API
 */

// 获取模板列表
export function getTemplates(params) {
  return request({
    url: '/templates',
    method: 'get',
    params
  })
}

// 获取单个模板详情
export function getTemplate(id) {
  return request({
    url: `/templates/${id}`,
    method: 'get'
  })
}

// 创建模板
export function createTemplate(data) {
  return request({
    url: '/templates',
    method: 'post',
    data
  })
}

// 更新模板
export function updateTemplate(id, data) {
  return request({
    url: `/templates/${id}`,
    method: 'put',
    data
  })
}

// 删除模板
export function deleteTemplate(id) {
  return request({
    url: `/templates/${id}`,
    method: 'delete'
  })
}

// 发布模板
export function publishTemplate(data) {
  return request({
    url: '/templates/publish',
    method: 'post',
    data
  })
}

// 上传模板缩略图
export function uploadThumbnail(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/templates/upload/thumbnail',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: progressEvent => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    }
  })
}

// 复制模板（基于现有模板创建新模板）
export function cloneTemplate(id, data) {
  return request({
    url: `/templates/${id}/clone`,
    method: 'post',
    data
  })
}

// 获取模板分类列表
export function getTemplateCategories() {
  return request({
    url: '/templates/categories',
    method: 'get'
  })
}

// 获取我的模板
export function getMyTemplates(params) {
  return request({
    url: '/templates/my',
    method: 'get',
    params
  })
}

// 审核模板（管理员）
export function reviewTemplate(id, data) {
  return request({
    url: `/templates/${id}/review`,
    method: 'post',
    data
  })
}

// 增加使用次数
export function incrementUsageCount(id) {
  return request({
    url: `/templates/${id}/usage`,
    method: 'post'
  })
}
