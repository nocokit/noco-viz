/**
 * 权限指令 v-permission
 * 用于控制元素的显示/隐藏
 *
 * @example
 * <!-- 单个权限 -->
 * <el-button v-permission="'user:create'">创建用户</el-button>
 *
 * <!-- 多个权限（任意一个） -->
 * <el-button v-permission="['user:create', 'user:edit']">操作</el-button>
 *
 * <!-- 多个权限（全部拥有） -->
 * <el-button v-permission:all="['user:create', 'user:edit']">操作</el-button>
 *
 * <!-- 角色判断 -->
 * <el-button v-permission:role="'admin'">管理员操作</el-button>
 */

import { usePermission } from '@/composables/usePermission'

/**
 * 检查权限
 * @param {HTMLElement} el - DOM 元素
 * @param {Object} binding - 指令绑定对象
 */
function checkPermission(el, binding) {
  const { value, arg } = binding
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } = usePermission()

  // 没有传值，默认显示
  if (!value) {
    return true
  }

  let hasAuth = false

  // 根据修饰符判断权限类型
  switch (arg) {
    case 'role':
      // 角色判断
      hasAuth = hasRole(value)
      break

    case 'all':
      // 需要拥有所有权限
      hasAuth = Array.isArray(value)
        ? hasAllPermissions(value)
        : hasPermission(value)
      break

    case 'any':
    default:
      // 拥有任意一个权限即可（默认）
      hasAuth = Array.isArray(value)
        ? hasAnyPermission(value)
        : hasPermission(value)
      break
  }

  return hasAuth
}

/**
 * 权限指令定义
 */
export const permission = {
  // Vue 3 指令钩子
  mounted(el, binding) {
    const hasAuth = checkPermission(el, binding)

    if (!hasAuth) {
      // 移除元素
      el.parentNode?.removeChild(el)
    }
  },

  updated(el, binding) {
    const hasAuth = checkPermission(el, binding)

    if (!hasAuth) {
      // 移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 禁用指令 v-permission-disabled
 * 用于控制元素的禁用状态（不移除元素）
 *
 * @example
 * <el-button v-permission-disabled="'user:create'">创建用户</el-button>
 */
export const permissionDisabled = {
  mounted(el, binding) {
    const hasAuth = checkPermission(el, binding)

    if (!hasAuth) {
      // 禁用元素
      el.disabled = true
      el.classList.add('is-disabled')

      // 如果是 Element Plus 组件，添加禁用样式
      if (el.classList.contains('el-button')) {
        el.classList.add('is-disabled')
      }
    }
  },

  updated(el, binding) {
    const hasAuth = checkPermission(el, binding)

    if (!hasAuth) {
      el.disabled = true
      el.classList.add('is-disabled')
    } else {
      el.disabled = false
      el.classList.remove('is-disabled')
    }
  }
}

/**
 * 默认导出
 */
export default {
  install(app) {
    // 注册全局指令
    app.directive('permission', permission)
    app.directive('permission-disabled', permissionDisabled)
  }
}
