/**
 * 菜单相关类型定义
 */

import type { ID } from './common'

// 菜单项类型
export type MenuType = 'submenu' | 'item'

// 图标名称类型
export type IconName =
  | 'Odometer'
  | 'Setting'
  | 'Coin'
  | 'DocumentCopy'
  | 'Files'
  | 'Document'
  | 'UserFilled'
  | 'Delete'

// 菜单项接口
export interface MenuItem {
  id: ID
  title: string
  icon?: IconName
  path?: string
  type?: MenuType
  children?: MenuItem[]
  meta?: MenuMeta
}

// 菜单元数据
export interface MenuMeta {
  requiresAuth?: boolean
  roles?: string[]
  badge?: string | number
  hidden?: boolean
  order?: number
}

// 菜单配置
export interface MenuConfig {
  collapse?: boolean
  mode?: 'vertical' | 'horizontal'
  theme?: 'light' | 'dark'
}
