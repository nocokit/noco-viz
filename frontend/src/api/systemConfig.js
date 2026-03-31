/**
 * 系统配置相关 API
 */
import request from './http'

/**
 * 获取所有系统配置
 */
export function getSystemConfig() {
  return request.get('/system-config')
}

/**
 * 获取单个配置
 * @param {string} key - 配置键
 */
export function getConfigByKey(key) {
  return request.get(`/system-config/${key}`)
}

/**
 * 更新单个配置
 * @param {string} key - 配置键
 * @param {Object} data - { value, description }
 */
export function updateConfig(key, data) {
  return request.put(`/system-config/${key}`, data)
}

/**
 * 批量更新配置
 * @param {Object} configs - 配置对象
 */
export function batchUpdateConfig(configs) {
  return request.post('/system-config/batch', { configs })
}

/**
 * 删除配置
 * @param {string} key - 配置键
 */
export function deleteConfig(key) {
  return request.delete(`/system-config/${key}`)
}

/**
 * 发送测试邮件
 * @param {Object} emailConfig - 邮件配置
 */
export function sendTestEmail(emailConfig) {
  return request.post('/system-config/test-email', emailConfig)
}
