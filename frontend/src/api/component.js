import request from './http'

/**
 * 获取组件列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getComponents(params = {}) {
  return request({
    url: '/components',
    method: 'get',
    params
  })
}

/**
 * 获取组件详情
 * @param {number|string} id - 组件ID
 * @returns {Promise}
 */
export function getComponentDetail(id) {
  return request({
    url: `/components/${id}`,
    method: 'get'
  })
}

/**
 * 创建组件
 * @param {Object} data - 组件数据
 * @returns {Promise}
 */
export function createComponent(data) {
  return request({
    url: '/components',
    method: 'post',
    data
  })
}

/**
 * 更新组件
 * @param {number|string} id - 组件ID
 * @param {Object} data - 组件数据
 * @returns {Promise}
 */
export function updateComponent(id, data) {
  return request({
    url: `/components/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除组件
 * @param {number|string} id - 组件ID
 * @returns {Promise}
 */
export function deleteComponent(id) {
  return request({
    url: `/components/${id}`,
    method: 'delete'
  })
}

/**
 * 克隆组件
 * @param {number|string} id - 源组件ID
 * @param {string} name - 新组件名称
 * @returns {Promise}
 */
export function cloneComponent(id, name) {
  return request({
    url: `/components/${id}/clone`,
    method: 'post',
    data: { name }
  })
}

/**
 * 增加组件下载次数
 * @param {number|string} id - 组件ID
 * @returns {Promise}
 */
export function incrementDownloads(id) {
  return request({
    url: `/components/${id}/download`,
    method: 'post'
  })
}

/**
 * 点赞/取消点赞组件
 * @param {number|string} id - 组件ID
 * @param {string} action - 'like' 或 'unlike'
 * @returns {Promise}
 */
export function toggleLike(id, action = 'like') {
  return request({
    url: `/components/${id}/like`,
    method: 'post',
    data: { action }
  })
}

/**
 * 获取组件分类列表
 * @returns {Promise}
 */
export function getCategories() {
  return request({
    url: '/components/categories',
    method: 'get'
  })
}

/**
 * 获取组件统计信息
 * @returns {Promise}
 */
export function getStatistics() {
  return request({
    url: '/components/statistics',
    method: 'get'
  })
}
