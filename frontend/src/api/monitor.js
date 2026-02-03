import request from '@/api/http'

// 获取完整监控数据
export function getMonitorData() {
  return request({
    url: '/api/monitor',
    method: 'get'
  })
}

// 获取系统资源
export function getSystemResources() {
  return request({
    url: '/api/monitor/system',
    method: 'get'
  })
}

// 获取应用统计
export function getApplicationStats() {
  return request({
    url: '/api/monitor/application',
    method: 'get'
  })
}

// 获取最近活动
export function getRecentActivities() {
  return request({
    url: '/api/monitor/activities',
    method: 'get'
  })
}

// 获取API统计
export function getApiStats() {
  return request({
    url: '/api/monitor/api-stats',
    method: 'get'
  })
}

// 获取错误统计
export function getErrorStats() {
  return request({
    url: '/api/monitor/errors',
    method: 'get'
  })
}

// 获取数据源统计
export function getDatasourceStats() {
  return request({
    url: '/api/datasources/stats/overview',
    method: 'get'
  })
}

// 获取数据源健康状态
export function getDatasourceHealth() {
  return request({
    url: '/api/datasources/health/status',
    method: 'get'
  })
}
