/**
 * 回收站相关 API
 */
import request from './http'

/**
 * 获取回收站列表
 * @param {string} type - project | datasource | media | component
 */
export function getRecycleList(type) {
  return request.get('/recycle', { params: { type } })
}

/**
 * 获取回收站统计
 */
export function getRecycleStats() {
  return request.get('/recycle/stats')
}

/**
 * 还原单个项目
 * @param {number} id
 */
export function restoreItem(id) {
  return request.post(`/recycle/${id}/restore`)
}

/**
 * 批量还原
 * @param {Array<number>} ids
 */
export function batchRestore(ids) {
  return request.post('/recycle/restore/batch', { ids })
}

/**
 * 彻底删除单个项目
 * @param {number} id
 */
export function deleteItem(id) {
  return request.delete(`/recycle/${id}`)
}

/**
 * 批量彻底删除
 * @param {Array<number>} ids
 */
export function batchDelete(ids) {
  return request.delete('/recycle/batch', { data: { ids } })
}

/**
 * 清空回收站
 * @param {string} type - 可选，指定类型
 */
export function emptyRecycleBin(type) {
  return request.delete('/recycle', { params: { type } })
}
