/**
 * 权限守卫
 * 检查用户是否有访问路由的权限
 */
import { usePermission } from '@/composables/usePermission'
import { ElMessage } from 'element-plus'

/**
 * 权限守卫
 * @param {Object} to - 目标路由
 * @param {Object} from - 来源路由
 * @param {Function} next - 导航守卫回调
 */
export function permissionGuard(to, from, next) {
  const { hasPermission, hasRole, isSuperAdmin } = usePermission()

  // 获取路由元信息中的权限配置
  const { permission, permissions, role, roles } = to.meta

  // 超级管理员拥有所有权限
  if (isSuperAdmin.value) {
    next()
    return
  }

  // 检查单个权限
  if (permission && !hasPermission(permission)) {
    ElMessage.error('您没有权限访问该页面')
    next(from.path || '/')
    return
  }

  // 检查多个权限（需要全部拥有）
  if (permissions && Array.isArray(permissions)) {
    const hasAllPermissions = permissions.every(p => hasPermission(p))
    if (!hasAllPermissions) {
      ElMessage.error('您没有权限访问该页面')
      next(from.path || '/')
      return
    }
  }

  // 检查角色
  if (role && !hasRole(role)) {
    ElMessage.error('您的角色无权访问该页面')
    next(from.path || '/')
    return
  }

  // 检查多个角色（拥有任意一个即可）
  if (roles && Array.isArray(roles)) {
    const hasAnyRole = roles.some(r => hasRole(r))
    if (!hasAnyRole) {
      ElMessage.error('您的角色无权访问该页面')
      next(from.path || '/')
      return
    }
  }

  // 通过权限检查
  next()
}
