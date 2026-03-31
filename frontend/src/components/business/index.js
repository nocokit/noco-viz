/**
 * 业务组件统一导出
 */

import CrudTable from './CrudTable.vue'
import DataSourceSelector from './DataSourceSelector.vue'
import FolderNavigator from './FolderNavigator.vue'

export {
  CrudTable,
  DataSourceSelector,
  FolderNavigator
}

export default {
  install(app) {
    app.component('CrudTable', CrudTable)
    app.component('DataSourceSelector', DataSourceSelector)
    app.component('FolderNavigator', FolderNavigator)
  }
}
