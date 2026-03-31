/**
 * 认证守卫
 * 检查用户登录状态，未登录则跳转到登录页
 */
import { useUserStore } from '@/store/modules/user'

/**
 * 白名单路由（不需要登录）
 */
const whiteList = ['/login', '/register', '/forgot-password']

/**
 * 认证守卫
 * @param {Object} to - 目标路由
 * @param {Object} from - 来源路由
 * @param {Function} next - 导航守卫回调
 */
export async function authGuard(to, from, next) {
  const userStore = useUserStore()

  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  // 不需要认证的路由，直接放行
  if (!requiresAuth || whiteList.includes(to.path)) {
    next()
    return
  }

  // 检查是否已登录
  if (!userStore.accessToken) {
    // 未登录，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录，检查是否有用户信息
  if (!userStore.userInfo) {
    // 没有用户信息，尝试获取
    try {
      await userStore.fetchUserInfo()
      next()
    } catch (error) {
      // 获取用户信息失败，清除登录状态并跳转登录页
      console.error('获取用户信息失败:', error)
      userStore.accessToken = ''
      userStore.refreshToken = ''
      userStore.userInfo = null
      userStore.isLoggedIn = false
      sessionStorage.removeItem('access_token')
      sessionStorage.removeItem('refresh_token')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    // 已有用户信息，直接放行
    next()
  }
}
