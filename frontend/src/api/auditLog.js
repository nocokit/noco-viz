import request from './http'

/**
 * 获取审计日志列表
 */
export function getAuditLogs(params) {
  return request.get('/audit-logs', { params })
}

/**
 * 获取审计日志详情
 */
export function getAuditLogDetail(id) {
  return request.get(`/audit-logs/${id}`)
}

/**
 * 获取审计日志统计信息
 */
export function getAuditLogStatistics() {
  return request.get('/audit-logs/statistics')
}

/**
 * 导出审计日志
 */
export function exportAuditLogs(params) {
  return request.get('/audit-logs', {
    params,
    responseType: 'blob'
  })
}
