<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '工作台', path: '/projects' },
      { label: '数据资源管理' }
    ]"
    :config="crudConfig"
    :data="datasetStore.datasetList"
    :loading="datasetStore.loading"
    :pagination="datasetStore.pagination"
    :sort="datasetStore.sort"
    v-on="eventHandlers"
  />
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useDatasetStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const datasetStore = useDatasetStore()

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // CRUD 操作
  add: datasetStore.handleAdd,
  edit: datasetStore.handleEdit,
  delete: datasetStore.handleDelete,

  // 数据操作
  refresh: datasetStore.loadData,
  search: datasetStore.handleSearch,

  // 表格操作
  pageChange: datasetStore.handlePageChange,
  pageSizeChange: datasetStore.handlePageSizeChange,
  sortChange: datasetStore.handleSortChange,
}))

// 初始化加载
onMounted(() => {
  datasetStore.loadData()
})
</script>

