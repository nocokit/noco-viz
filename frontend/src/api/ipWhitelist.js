/**
 * IP 白名单相关 API
 */
import request from './http'

/**
 * 获取所有 IP 白名单规则
 */
export function getIpWhitelistList() {
  return request.get('/ip-whitelist')
}

/**
 * 获取单个 IP 白名单规则
 * @param {number} id
 */
export function getIpWhitelist(id) {
  return request.get(`/ip-whitelist/${id}`)
}

/**
 * 添加 IP 白名单规则
 * @param {Object} data - { ip, description }
 */
export function createIpWhitelist(data) {
  return request.post('/ip-whitelist', data)
}

/**
 * 更新 IP 白名单规则
 * @param {number} id
 * @param {Object} data - { ip, description }
 */
export function updateIpWhitelist(id, data) {
  return request.patch(`/ip-whitelist/${id}`, data)
}

/**
 * 删除 IP 白名单规则
 * @param {number} id
 */
export function deleteIpWhitelist(id) {
  return request.delete(`/ip-whitelist/${id}`)
}

/**
 * 获取白名单启用状态
 */
export function getWhitelistStatus() {
  return request.get('/ip-whitelist/status')
}

/**
 * 更新白名单启用状态
 * @param {boolean} enabled
 */
export function updateWhitelistStatus(enabled) {
  return request.post('/ip-whitelist/status', { enabled })
}
