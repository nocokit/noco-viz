<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '资产管理', path: '/assets' },
      { label: '企业模板库' }
    ]"
    :config="crudConfig"
    :data="componentLibraryStore.componentList"
    :loading="componentLibraryStore.loading"
    :pagination="componentLibraryStore.pagination"
    :sort="componentLibraryStore.sort"
    v-on="eventHandlers"
  />
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useComponentLibraryStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const componentLibraryStore = useComponentLibraryStore()

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // CRUD 操作
  add: componentLibraryStore.handleAdd,
  edit: componentLibraryStore.handleEdit,
  delete: componentLibraryStore.handleDelete,

  // 数据操作
  refresh: componentLibraryStore.loadData,
  search: componentLibraryStore.handleSearch,

  // 表格操作
  pageChange: componentLibraryStore.handlePageChange,
  pageSizeChange: componentLibraryStore.handlePageSizeChange,
  sortChange: componentLibraryStore.handleSortChange,
}))

// 初始化加载
onMounted(() => {
  componentLibraryStore.loadData()
})
</script>

