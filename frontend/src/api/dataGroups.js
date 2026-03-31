import request from './http'

// 数据集（分组）API
export function getDataGroups() {
  return request({
    url: '/data-groups',
    method: 'get'
  })
}

export function createDataGroup(data) {
  return request({
    url: '/data-groups',
    method: 'post',
    data
  })
}

export function updateDataGroup(id, data) {
  return request({
    url: `/data-groups/${id}`,
    method: 'patch',
    data
  })
}

export function deleteDataGroup(id) {
  return request({
    url: `/data-groups/${id}`,
    method: 'delete'
  })
}

// 数据项 API
export function getDataItems(groupId) {
  return request({
    url: '/data-items',
    method: 'get',
    ...(groupId ? { params: { groupId } } : {})
  })
}

export function createDataItem(data) {
  return request({
    url: '/data-items',
    method: 'post',
    data
  })
}

export function updateDataItem(id, data) {
  return request({
    url: `/data-items/${id}`,
    method: 'patch',
    data
  })
}

export function deleteDataItem(id) {
  return request({
    url: `/data-items/${id}`,
    method: 'delete'
  })
}

export function previewDataItem(id, params = {}) {
  return request({
    url: `/data-items/${id}/preview`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 100
    }
  })
}
