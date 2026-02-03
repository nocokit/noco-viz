/**
 * 全局指令注册
 */
import permission from './permission'
import lazyLoad from './lazy-load'

export default {
  install(app) {
    permission.install(app)

    app.directive('lazy', lazyLoad)
  }
}

export { lazyLoad }
