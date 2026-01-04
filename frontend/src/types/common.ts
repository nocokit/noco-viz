/**
 * 通用类型定义
 */

// 基础ID类型
export type ID = string | number

// 时间戳类型
export type Timestamp = number | string | Date

// 分辨率类型
export type Resolution = '1920x1080' | '2560x1440' | '3840x2160' | string

// 部门类型
export type Department = string

// 数据状态
export type DataStatus = 'loading' | 'success' | 'error' | 'empty'

// 排序方向
export type SortOrder = 'asc' | 'desc'

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// 通用响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 通用列表响应
export interface ListResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
