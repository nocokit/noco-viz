import request from '@/api/http'

// 获取数据源列表
export function getDatasources() {
  return request({
    url: '/api/datasources',
    method: 'get'
  })
}

// 获取数据源详情
export function getDatasource(id) {
  return request({
    url: `/api/datasources/${id}`,
    method: 'get'
  })
}

// 创建数据源
export function createDatasource(data) {
  return request({
    url: '/api/datasources',
    method: 'post',
    data
  })
}

// 更新数据源
export function updateDatasource(id, data) {
  return request({
    url: `/api/datasources/${id}`,
    method: 'put',
    data
  })
}

// 删除数据源
export function deleteDatasource(id) {
  return request({
    url: `/api/datasources/${id}`,
    method: 'delete'
  })
}

// 测试连接
export function testConnection(data) {
  return request({
    url: '/api/datasources/test-connection',
    method: 'post',
    data
  })
}

// 测试已保存的数据源连接
export function testSavedConnection(id) {
  return request({
    url: `/api/datasources/${id}/test`,
    method: 'post'
  })
}
