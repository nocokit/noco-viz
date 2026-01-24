/**
 * 路由守卫统一导出
 */
import { authGuard } from './auth'
import { permissionGuard } from './permission'
import { titleGuard } from './title'

export { authGuard } from './auth'
export { permissionGuard } from './permission'
export { titleGuard, setTitle } from './title'

/**
 * 注册所有路由守卫
 * @param {Router} router - Vue Router 实例
 */
export function setupRouterGuards(router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    // 1. 认证守卫（最先执行）
    authGuard(to, from, (result) => {
      if (result === false || typeof result === 'string' || typeof result === 'object') {
        // 认证失败，停止后续守卫
        next(result)
        return
      }

      // 2. 权限守卫
      permissionGuard(to, from, (result) => {
        if (result === false || typeof result === 'string' || typeof result === 'object') {
          // 权限检查失败，停止后续守卫
          next(result)
          return
        }

        // 3. 标题守卫
        titleGuard(to, from, next)
      })
    })
  })

  // 全局后置钩子
  router.afterEach((to, from) => {
    // 页面切换后的处理
    // 例如：关闭加载动画、埋点统计等
  })

  // 全局错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
  })
}
