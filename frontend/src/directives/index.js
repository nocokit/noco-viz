/**
 * 全局指令注册
 */
import permission from './permission'

export default {
  install(app) {
    // 注册权限指令
    permission.install(app)

    // 后续可以在这里注册其他指令
    // loading.install(app)
    // debounce.install(app)
  }
}
