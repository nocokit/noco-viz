/**
 * 集成发布相关 API
 */
import request from './http'

/**
 * 获取所有集成发布配置
 */
export function getIntegrationPublishList() {
  return request.get('/integration-publish')
}

/**
 * 获取单个集成发布配置
 * @param {number} id
 */
export function getIntegrationPublish(id) {
  return request.get(`/integration-publish/${id}`)
}

/**
 * 根据项目ID获取配置
 * @param {number} projectId
 */
export function getIntegrationPublishByProject(projectId) {
  return request.get(`/integration-publish/project/${projectId}`)
}

/**
 * 创建集成发布配置
 * @param {Object} data
 */
export function createIntegrationPublish(data) {
  return request.post('/integration-publish', data)
}

/**
 * 更新集成发布配置
 * @param {number} id
 * @param {Object} data
 */
export function updateIntegrationPublish(id, data) {
  return request.patch(`/integration-publish/${id}`, data)
}

/**
 * 删除集成发布配置
 * @param {number} id
 */
export function deleteIntegrationPublish(id) {
  return request.delete(`/integration-publish/${id}`)
}
