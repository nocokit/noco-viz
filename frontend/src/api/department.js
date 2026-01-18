import request from './index'

/**
 * 获取部门树形结构
 */
export function getDepartmentTree() {
  return request({
    url: '/api/departments',
    method: 'get'
  })
}

/**
 * 获取部门详情
 */
export function getDepartmentDetail(id) {
  return request({
    url: `/api/departments/${id}`,
    method: 'get'
  })
}

/**
 * 创建部门
 */
export function createDepartment(data) {
  return request({
    url: '/api/departments',
    method: 'post',
    data
  })
}

/**
 * 更新部门
 */
export function updateDepartment(id, data) {
  return request({
    url: `/api/departments/${id}`,
    method: 'patch',
    data
  })
}

/**
 * 删除部门
 */
export function deleteDepartment(id) {
  return request({
    url: `/api/departments/${id}`,
    method: 'delete'
  })
}

/**
 * 更新部门成员数量
 */
export function updateDepartmentCount(id, count) {
  return request({
    url: `/api/departments/${id}/count`,
    method: 'patch',
    data: { count }
  })
}

/**
 * 获取部门的所有子部门
 */
export function getDepartmentDescendants(id) {
  return request({
    url: `/api/departments/${id}/descendants`,
    method: 'get'
  })
}
