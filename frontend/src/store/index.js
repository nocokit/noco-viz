/**
 * Pinia Store 入口
 */
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 导出 store
export { useUserStore } from './modules/user'
export { useUserListStore } from './modules/userList'
export { useIpWhitelistStore } from './modules/ipWhitelist'
export { useRecycleStore } from './modules/recycle'
export { useIntegrationPublishStore } from './modules/integrationPublish'
export { useAuditLogStore } from './modules/auditLog'
export { useRoleStore } from './modules/role'
export { useDatasetStore } from './modules/dataset'
export { useComponentLibraryStore } from './modules/componentLibrary'
export { useConnectionStore } from './modules/connection'
export { useDepartmentStore } from './modules/department'
export { useDatasourceMonitorStore } from './modules/datasourceMonitor'
export { usePlaylistStore } from './modules/playlist'
export { useThemeStore } from './modules/theme'



