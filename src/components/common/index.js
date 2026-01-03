/**
 * 公共组件统一导出
 */

// 核心组件
import DataTable from './DataTable/index.vue'
import FormModal from './FormModal/index.vue'
import StatusBadge from './StatusBadge/index.vue'
import EmptyState from './EmptyState/index.vue'

// 视图组件
import CardGrid from './CardGrid/index.vue'
import SearchBar from './SearchBar/index.vue'
import PageHeader from './PageHeader/index.vue'
import TabFilter from './TabFilter/index.vue'

// 功能组件
import UploadFile from './UploadFile/index.vue'
import FolderTree from './FolderTree/index.vue'
import DetailPanel from './DetailPanel/index.vue'
import ConfirmDialog from './ConfirmDialog/index.vue'

// 导出所有组件
export {
  // 核心组件
  DataTable,
  FormModal,
  StatusBadge,
  EmptyState,

  // 视图组件
  CardGrid,
  SearchBar,
  PageHeader,
  TabFilter,

  // 功能组件
  UploadFile,
  FolderTree,
  DetailPanel,
  ConfirmDialog
}

// 提供全局注册方法
export default {
  install(app) {
    // 核心组件
    app.component('DataTable', DataTable)
    app.component('FormModal', FormModal)
    app.component('StatusBadge', StatusBadge)
    app.component('EmptyState', EmptyState)

    // 视图组件
    app.component('CardGrid', CardGrid)
    app.component('SearchBar', SearchBar)
    app.component('PageHeader', PageHeader)
    app.component('TabFilter', TabFilter)

    // 功能组件
    app.component('UploadFile', UploadFile)
    app.component('FolderTree', FolderTree)
    app.component('DetailPanel', DetailPanel)
    app.component('ConfirmDialog', ConfirmDialog)
  }
}
