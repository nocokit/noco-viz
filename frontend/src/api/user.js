/**
 * 用户管理相关 API
 */
import request from './http'

/**
 * 获取用户列表
 * @param {Object} params - { page, limit, search, role, status }
 */
export function getUserList(params) {
  return request.get('/users', { params })
}

/**
 * 获取用户详情
 * @param {number} id
 */
export function getUserDetail(id) {
  return request.get(`/users/${id}`)
}

/**
 * 创建用户
 * @param {Object} data - { username, email, password, phone, roleId, isActive }
 */
export function createUser(data) {
  return request.post('/users', data)
}

/**
 * 更新用户
 * @param {number} id
 * @param {Object} data - { email, phone, roleId, isActive }
 */
export function updateUser(id, data) {
  return request.patch(`/users/${id}`, data)
}

/**
 * 删除用户
 * @param {number} id
 */
export function deleteUser(id) {
  return request.delete(`/users/${id}`)
}

/**
 * 批量删除用户
 * @param {Array} ids - 用户ID数组
 */
export function batchDeleteUsers(ids) {
  return request.post('/users/batch-delete', { ids })
}

/**
 * 重置用户密码
 * @param {number} id
 * @param {string} newPassword
 */
export function resetUserPassword(id, newPassword) {
  return request.post(`/users/${id}/reset-password`, { newPassword })
}

/**
 * 启用/禁用用户
 * @param {number} id
 * @param {boolean} isActive
 */
export function toggleUserStatus(id, isActive) {
  return request.patch(`/users/${id}/status`, { isActive })
}
