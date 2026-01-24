import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user'

/**
 * 权限控制 Composable
 * 提供权限判断、角色判断等功能
 *
 * @example
 * const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } = usePermission()
 *
 * if (hasPermission('user:create')) {
 *   // 有创建用户权限
 * }
 */
export function usePermission() {
  const userStore = useUserStore()

  /**
   * 获取当前用户信息
   */
  const currentUser = computed(() => userStore.userInfo)

  /**
   * 获取当前用户角色
   */
  const currentRole = computed(() => currentUser.value?.role)

  /**
   * 获取当前用户权限列表
   */
  const permissions = computed(() => {
    // 从用户信息中获取权限列表
    // 支持多种数据结构
    if (currentUser.value?.permissions) {
      return Array.isArray(currentUser.value.permissions)
        ? currentUser.value.permissions
        : []
    }

    // 从角色中获取权限
    if (currentRole.value?.permissions) {
      return Array.isArray(currentRole.value.permissions)
        ? currentRole.value.permissions
        : []
    }

    return []
  })

  /**
   * 是否是超级管理员
   */
  const isSuperAdmin = computed(() => {
    return currentRole.value?.code === 'super_admin' ||
           currentRole.value?.name === '超级管理员' ||
           currentUser.value?.isSuperAdmin === true
  })

  /**
   * 判断是否有指定权限
   * @param {string} permission - 权限标识，如 'user:create'
   * @returns {boolean}
   */
  function hasPermission(permission) {
    if (!permission) return true

    // 超级管理员拥有所有权限
    if (isSuperAdmin.value) return true

    // 检查权限列表
    return permissions.value.includes(permission)
  }

  /**
   * 判断是否有任意一个权限
   * @param {string[]} permissionList - 权限列表
   * @returns {boolean}
   */
  function hasAnyPermission(permissionList) {
    if (!permissionList || permissionList.length === 0) return true

    // 超级管理员拥有所有权限
    if (isSuperAdmin.value) return true

    // 只要有一个权限即可
    return permissionList.some(permission => hasPermission(permission))
  }

  /**
   * 判断是否拥有所有权限
   * @param {string[]} permissionList - 权限列表
   * @returns {boolean}
   */
  function hasAllPermissions(permissionList) {
    if (!permissionList || permissionList.length === 0) return true

    // 超级管理员拥有所有权限
    if (isSuperAdmin.value) return true

    // 必须拥有所有权限
    return permissionList.every(permission => hasPermission(permission))
  }

  /**
   * 判断是否有指定角色
   * @param {string|string[]} role - 角色标识或角色列表
   * @returns {boolean}
   */
  function hasRole(role) {
    if (!role) return true
    if (!currentRole.value) return false

    // 超级管理员拥有所有角色
    if (isSuperAdmin.value) return true

    const roleCode = currentRole.value.code || currentRole.value.name

    // 支持单个角色或角色数组
    if (Array.isArray(role)) {
      return role.includes(roleCode)
    }

    return roleCode === role
  }

  /**
   * 判断是否有任意一个角色
   * @param {string[]} roleList - 角色列表
   * @returns {boolean}
   */
  function hasAnyRole(roleList) {
    if (!roleList || roleList.length === 0) return true

    // 超级管理员拥有所有角色
    if (isSuperAdmin.value) return true

    return hasRole(roleList)
  }

  /**
   * 判断是否是资源的所有者
   * @param {Object} resource - 资源对象
   * @param {string} ownerField - 所有者字段名，默认 'createdBy' 或 'userId'
   * @returns {boolean}
   */
  function isOwner(resource, ownerField = 'createdBy') {
    if (!resource || !currentUser.value) return false

    // 超级管理员拥有所有资源
    if (isSuperAdmin.value) return true

    const ownerId = resource[ownerField] || resource.userId || resource.creator?.id
    const currentUserId = currentUser.value.id

    return ownerId === currentUserId
  }

  /**
   * 判断是否可以访问（权限或所有者）
   * @param {string} permission - 权限标识
   * @param {Object} resource - 资源对象
   * @param {string} ownerField - 所有者字段名
   * @returns {boolean}
   */
  function canAccess(permission, resource, ownerField) {
    return hasPermission(permission) || isOwner(resource, ownerField)
  }

  return {
    // 状态
    currentUser,
    currentRole,
    permissions,
    isSuperAdmin,

    // 权限判断
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // 角色判断
    hasRole,
    hasAnyRole,

    // 所有者判断
    isOwner,
    canAccess,
  }
}
