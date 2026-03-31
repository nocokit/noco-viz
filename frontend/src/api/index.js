/**
 * API 模块统一导出
 */

// 用户认证
export { userApi } from './modules/user'

// 角色管理
export * as roleApi from './role'

// 数据集管理
export * as datasetApi from './dataset'

// 模板管理
export * as templateApi from './template'

// 项目管理
export * as projectApi from './project'

// 用户管理
export * as userManagementApi from './user'

// 媒体库
export * as mediaApi from './media'

// IP白名单
export * as ipWhitelistApi from './ipWhitelist'

// 系统配置
export * as systemConfigApi from './systemConfig'

// HTTP 客户端
export { default as request } from './http'
export { default as http } from './http' // 保留兼容性，逐步迁移
