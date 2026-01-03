import request from './request'

/**
 * 数据集管理API
 */

// 获取数据集列表
export function getDatasets(params) {
  return request({
    url: '/datasets',
    method: 'get',
    params
  })
}

// 获取单个数据集详情
export function getDataset(id) {
  return request({
    url: `/datasets/${id}`,
    method: 'get'
  })
}

// 创建数据集
export function createDataset(data) {
  return request({
    url: '/datasets',
    method: 'post',
    data
  })
}

// 更新数据集
export function updateDataset(id, data) {
  return request({
    url: `/datasets/${id}`,
    method: 'put',
    data
  })
}

// 删除数据集
export function deleteDataset(id) {
  return request({
    url: `/datasets/${id}`,
    method: 'delete'
  })
}

// 预览数据集数据
export function previewDataset(id, params = {}) {
  return request({
    url: `/datasets/${id}/preview`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 100
    }
  })
}

// 上传Excel文件
export function uploadExcel(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/datasets/upload/excel',
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

// 验证SQL查询
export function validateSQL(sql, connectionId) {
  return request({
    url: '/datasets/validate-sql',
    method: 'post',
    data: {
      sql,
      connectionId
    }
  })
}

// 测试API数据源
export function testApiDataSource(url, method = 'GET', headers = {}) {
  return request({
    url: '/datasets/test-api',
    method: 'post',
    data: {
      url,
      method,
      headers
    }
  })
}

/**
 * 数据连接管理API
 */

// 获取连接列表
export function getConnections(params) {
  return request({
    url: '/connections',
    method: 'get',
    params
  })
}

// 创建连接
export function createConnection(data) {
  return request({
    url: '/connections',
    method: 'post',
    data
  })
}

// 更新连接
export function updateConnection(id, data) {
  return request({
    url: `/connections/${id}`,
    method: 'put',
    data
  })
}

// 删除连接
export function deleteConnection(id) {
  return request({
    url: `/connections/${id}`,
    method: 'delete'
  })
}

// 测试连接
export function testConnection(id) {
  return request({
    url: `/connections/${id}/test`,
    method: 'post'
  })
}

// 测试连接配置（未保存的连接）
export function testConnectionConfig(config) {
  return request({
    url: '/connections/test',
    method: 'post',
    data: config
  })
}
