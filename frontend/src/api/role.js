import { createApiService } from './base'
import request from './http'

const roleApi = createApiService('roles')

/**
 * 获取角色列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getRoles(params = {}) {
  return roleApi.getList(params)
}

/**
 * 获取角色详情
 * @param {number|string} id - 角色ID
 * @returns {Promise}
 */
export function getRoleDetail(id) {
  return roleApi.getOne(id)
}

/**
 * 创建角色
 * @param {Object} data - 角色数据
 * @returns {Promise}
 */
export function createRole(data) {
  return roleApi.create(data)
}

/**
 * 更新角色
 * @param {number|string} id - 角色ID
 * @param {Object} data - 角色数据
 * @returns {Promise}
 */
export function updateRole(id, data) {
  return roleApi.update(id, data)
}

/**
 * 删除角色
 * @param {number|string} id - 角色ID
 * @returns {Promise}
 */
export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

/**
 * 批量导入角色
 * @param {Array} roles - 角色数组
 * @returns {Promise}
 */
export function importRoles(roles) {
  return request({
    url: '/roles/import',
    method: 'post',
    data: { roles }
  })
}

/**
 * 导出角色
 * @param {Array} roleIds - 角色ID数组，不传则导出全部
 * @returns {Promise}
 */
export function exportRoles(roleIds = []) {
  return request({
    url: '/roles/export',
    method: 'post',
    data: { roleIds },
    responseType: 'blob'
  })
}

/**
 * 上传角色JSON文件
 * @param {File} file - JSON文件
 * @returns {Promise}
 */
export function uploadRoleFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/roles/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 验证角色数据
 * @param {Array} roles - 角色数组
 * @returns {Promise}
 */
export function validateRoles(roles) {
  return request({
    url: '/roles/validate',
    method: 'post',
    data: { roles }
  })
}

/**
 * 获取角色权限树
 * @returns {Promise}
 */
export function getPermissionTree() {
  return request({
    url: '/roles/permissions/tree',
    method: 'get'
  })
}

/**
 * 复制角色
 * @param {number|string} id - 源角色ID
 * @param {Object} data - 新角色数据
 * @returns {Promise}
 */
export function cloneRole(id, data) {
  return request({
    url: `/roles/${id}/clone`,
    method: 'post',
    data
  })
}

/**
 * 获取角色权限
 * @param {number|string} id - 角色ID
 * @returns {Promise}
 */
export function getRolePermissions(id) {
  return request({
    url: `/api/roles/${id}/permissions`,
    method: 'get'
  })
}

/**
 * 更新角色权限
 * @param {number|string} id - 角色ID
 * @param {Object} permissions - 权限数据
 * @returns {Promise}
 */
export function updateRolePermissions(id, permissions) {
  return request({
    url: `/api/roles/${id}/permissions`,
    method: 'put',
    data: { permissions }
  })
}
