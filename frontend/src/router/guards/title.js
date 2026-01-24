/**
 * 标题守卫
 * 根据路由元信息设置页面标题
 */

/**
 * 默认标题
 */
const defaultTitle = 'NocoSpace'

/**
 * 标题守卫
 * @param {Object} to - 目标路由
 * @param {Object} from - 来源路由
 * @param {Function} next - 导航守卫回调
 */
export function titleGuard(to, from, next) {
  // 获取路由元信息中的标题
  const { title } = to.meta

  // 设置页面标题
  if (title) {
    document.title = `${title} - ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }

  next()
}

/**
 * 设置页面标题
 * @param {string} title - 标题
 */
export function setTitle(title) {
  if (title) {
    document.title = `${title} - ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }
}
