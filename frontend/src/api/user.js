/**
 * 用户管理相关 API
 */
import { createApiService } from './base'
import request from './http'

const userApi = createApiService('users')

/**
 * 获取用户列表（用于用户管理页面）
 * @param {Object} params - { PageNumber, PageSize, Filters }
 */
export function getUsersAsDataSet(params = {}) {
  const requestData = {
    $id: null,
    $type: "Nkd.Foundation.BusinessOrchestration.SecurityManagement.InputObjects.GetUsersAsDataSetInput, Nkd.Foundation.BusinessOrchestration",
    Filters: params.Filters || [],
    IgnoreLastServiceId: true,
    PageNumber: params.PageNumber || 1,
    PageSize: params.PageSize || 15
  }

  // 使用完整路径，不经过 baseURL
  return request({
    url: '/api/Security/GetUsersAsDataSet?_allow_anonymous=true',
    method: 'post',
    data: requestData,
    baseURL: '' // 覆盖默认的 baseURL
  })
}

/**
 * 获取用户列表（通用接口）
 * @param {Object} params - { page, limit, search, role, status }
 */
export function getUserList(params) {
  return userApi.getList(params)
}

/**
 * 获取用户详情
 * @param {number} id
 */
export function getUserDetail(id) {
  return userApi.getOne(id)
}

/**
 * 创建用户
 * @param {Object} data - { username, email, password, phone, roleId, isActive }
 */
export function createUser(data) {
  return userApi.create(data)
}

/**
 * 更新用户
 * @param {number} id
 * @param {Object} data - { email, phone, roleId, isActive }
 */
export function updateUser(id, data) {
  return userApi.patch(id, data)
}

/**
 * 删除用户
 * @param {number} id
 */
export function deleteUser(id) {
  return userApi.delete(id)
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

/**
 * 获取当前用户资料
 */
export function getUserProfile() {
  return request.get('/users/profile')
}

/**
 * 更新当前用户资料
 * @param {Object} data - { email, phone, realName, avatar }
 */
export function updateUserProfile(data) {
  return request.patch('/users/profile', data)
}

/**
 * 上传用户头像
 * @param {File} file
 * @param {Function} onProgress
 */
export function uploadAvatar(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/users/profile/avatar',
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

/**
 * 修改密码
 * @param {string} oldPassword
 * @param {string} newPassword
 */
export function changePassword(oldPassword, newPassword) {
  return request.post('/users/profile/change-password', {
    oldPassword,
    newPassword
  })
}
