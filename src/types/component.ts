/**
 * 组件相关类型定义
 */

import type { ID } from './common'
import type { ChartType } from './chart'

// 组件类型
export type ComponentType = ChartType | 'decoration' | 'info' | 'media' | 'container'

// 组件分类
export type ComponentCategory =
  | 'basic'
  | 'advanced'
  | 'map'
  | 'special'
  | 'decoration'
  | 'info'

// 组件接口
export interface Component {
  id: ID
  type: ComponentType
  category?: ComponentCategory
  name: string
  icon?: string
  component?: any
  config?: ComponentConfig
  position?: ComponentPosition
  size?: ComponentSize
  locked?: boolean
  visible?: boolean
  zIndex?: number
}

// 组件配置
export interface ComponentConfig {
  style?: ComponentStyleConfig
  data?: any
  events?: ComponentEvent[]
  [key: string]: any
}

// 组件样式配置
export interface ComponentStyleConfig {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  opacity?: number
  shadow?: string
  [key: string]: any
}

// 组件位置
export interface ComponentPosition {
  x: number
  y: number
}

// 组件尺寸
export interface ComponentSize {
  width: number
  height: number
}

// 组件事件
export interface ComponentEvent {
  type: 'click' | 'hover' | 'change' | 'custom'
  action: string
  params?: Record<string, any>
}

// 组件库项
export interface ComponentLibraryItem {
  id: ID
  name: string
  category: ComponentCategory
  icon: string
  component: string
  defaultConfig?: ComponentConfig
  thumbnail?: string
  description?: string
}
