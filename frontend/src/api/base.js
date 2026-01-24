import request from './http'

/**
 * 基础 API 服务类
 * 提供通用的 CRUD 操作，减少重复代码
 */
export class BaseApiService {
  /**
   * @param {string} resource - 资源名称（如 'users', 'templates'）
   */
  constructor(resource) {
    this.resource = resource
  }

  /**
   * 获取列表
   * @param {Object} params - 查询参数
   */
  getList(params) {
    return request({
      url: `/${this.resource}`,
      method: 'get',
      params
    })
  }

  /**
   * 获取单条记录
   * @param {number|string} id - 记录ID
   */
  getOne(id) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'get'
    })
  }

  /**
   * 创建记录
   * @param {Object} data - 创建数据
   */
  create(data) {
    return request({
      url: `/${this.resource}`,
      method: 'post',
      data
    })
  }

  /**
   * 更新记录（PUT - 完整更新）
   * @param {number|string} id - 记录ID
   * @param {Object} data - 更新数据
   */
  update(id, data) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'put',
      data
    })
  }

  /**
   * 更新记录（PATCH - 部分更新）
   * @param {number|string} id - 记录ID
   * @param {Object} data - 更新数据
   */
  patch(id, data) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'patch',
      data
    })
  }

  /**
   * 删除记录
   * @param {number|string} id - 记录ID
   */
  delete(id) {
    return request({
      url: `/${this.resource}/${id}`,
      method: 'delete'
    })
  }

  /**
   * 批量删除
   * @param {Array} ids - 记录ID数组
   */
  batchDelete(ids) {
    return request({
      url: `/${this.resource}/batch`,
      method: 'delete',
      data: { ids }
    })
  }

  /**
   * 自定义请求
   * @param {string} path - 路径（相对于资源路径）
   * @param {string} method - 请求方法
   * @param {Object} options - 其他选项（params, data等）
   */
  custom(path, method = 'get', options = {}) {
    const url = path.startsWith('/')
      ? `/${this.resource}${path}`
      : `/${this.resource}/${path}`

    return request({
      url,
      method,
      ...options
    })
  }
}

/**
 * 创建 API 服务实例的工厂函数
 * @param {string} resource - 资源名称
 * @returns {BaseApiService}
 */
export function createApiService(resource) {
  return new BaseApiService(resource)
}
