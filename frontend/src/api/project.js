/**
 * 项目管理相关 API
 */
import request from './http'

/**
 * 获取项目列表
 * @param {Object} params - { page, limit, search, type, status }
 */
export function getProjectList(params) {
  return request.get('/projects', { params })
}

/**
 * 获取项目详情
 * @param {number} id
 */
export function getProjectDetail(id) {
  return request.get(`/projects/${id}`)
}

/**
 * 创建项目
 * @param {Object} data - { name, description, type, config }
 */
export function createProject(data) {
  return request.post('/projects', data)
}

/**
 * 更新项目
 * @param {number} id
 * @param {Object} data - { name, description, config }
 */
export function updateProject(id, data) {
  return request.patch(`/projects/${id}`, data)
}

/**
 * 删除项目
 * @param {number} id
 */
export function deleteProject(id) {
  return request.delete(`/projects/${id}`)
}

/**
 * 复制项目
 * @param {number} id
 * @param {string} title
 */
export function cloneProject(id, title) {
  return request.post(`/projects/${id}/clone`, { title })
}

/**
 * 发布项目
 * @param {number} id
 */
export function publishProject(id) {
  return request.post(`/projects/${id}/publish`)
}

/**
 * 取消发布项目
 * @param {number} id
 */
export function unpublishProject(id) {
  return request.post(`/projects/${id}/unpublish`)
}

/**
 * 获取项目统计信息
 */
export function getProjectStats() {
  return request.get('/projects/stats/overview')
}
