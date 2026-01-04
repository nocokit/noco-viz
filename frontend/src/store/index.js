/**
 * Pinia Store 入口
 */
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出 store
export { useUserStore } from './modules/user'
