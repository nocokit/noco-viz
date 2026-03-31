/**
 * 模板相关类型定义
 */

import type { ID, Resolution, Department } from './common'

// 模板类型
export type TemplateType = 'official' | 'shared' | 'custom'

// 模板分类
export type TemplateCategory =
  | 'data-overview'
  | 'business-analysis'
  | 'monitoring'
  | 'report'
  | 'other'

// 模板状态
export type TemplateStatus = 'draft' | 'published' | 'archived'

// 模板接口
export interface Template {
  id: ID
  name: string
  description: string
  thumbnail: string
  type: TemplateType
  category?: TemplateCategory
  resolution: Resolution
  usageCount: number
  department?: Department
  isSystem?: boolean
  status?: TemplateStatus
  createdAt?: string
  updatedAt?: string
  author?: string
  tags?: string[]
  config?: TemplateConfig
}

// 模板配置
export interface TemplateConfig {
  width?: number
  height?: number
  backgroundColor?: string
  backgroundImage?: string
  components?: any[]
  [key: string]: any
}

// 模板筛选参数
export interface TemplateFilter {
  type?: TemplateType
  category?: TemplateCategory
  keyword?: string
  tags?: string[]
}
