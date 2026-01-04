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

// Phase 1 新增组件
import ProjectCard from './ProjectCard/index.vue'
import TabNavigation from './TabNavigation/index.vue'
import ActionButton from './ActionButton/index.vue'

// Phase 2 新增高级组件
import StepModal from './StepModal/index.vue'
import FilterBar from './FilterBar/index.vue'
import ActionDropdown from './ActionDropdown/index.vue'
import PageLayout from './PageLayout/index.vue'
import ResourceUploader from './ResourceUploader/index.vue'

// Phase 3 新增实用工具组件
import LoadingState from './LoadingState/index.vue'
import Breadcrumb from './Breadcrumb/index.vue'
import InfoCard from './InfoCard/index.vue'

// Phase 4 新增复用组件
import ViewSwitcher from './ViewSwitcher/index.vue'
import SearchToolbar from './SearchToolbar/index.vue'
import TableToolbar from './TableToolbar/index.vue'
import FolderTreePanel from './FolderTreePanel/index.vue'
import MetaInfoList from './MetaInfoList/index.vue'
import IconBox from './IconBox/index.vue'

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
  ConfirmDialog,

  // Phase 1 新增
  ProjectCard,
  TabNavigation,
  ActionButton,

  // Phase 2 新增高级组件
  StepModal,
  FilterBar,
  ActionDropdown,
  PageLayout,
  ResourceUploader,

  // Phase 3 新增实用工具组件
  LoadingState,
  Breadcrumb,
  InfoCard,

  // Phase 4 新增复用组件
  ViewSwitcher,
  SearchToolbar,
  TableToolbar,
  FolderTreePanel,
  MetaInfoList,
  IconBox
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

    // Phase 1 新增
    app.component('ProjectCard', ProjectCard)
    app.component('TabNavigation', TabNavigation)
    app.component('ActionButton', ActionButton)

    // Phase 2 新增高级组件
    app.component('StepModal', StepModal)
    app.component('FilterBar', FilterBar)
    app.component('ActionDropdown', ActionDropdown)
    app.component('PageLayout', PageLayout)
    app.component('ResourceUploader', ResourceUploader)

    // Phase 3 新增实用工具组件
    app.component('LoadingState', LoadingState)
    app.component('Breadcrumb', Breadcrumb)
    app.component('InfoCard', InfoCard)

    // Phase 4 新增复用组件
    app.component('ViewSwitcher', ViewSwitcher)
    app.component('SearchToolbar', SearchToolbar)
    app.component('TableToolbar', TableToolbar)
    app.component('FolderTreePanel', FolderTreePanel)
    app.component('MetaInfoList', MetaInfoList)
    app.component('IconBox', IconBox)
  }
}
