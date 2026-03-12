<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '工作台', path: '/workspace' },
      { label: '连接配置' }
    ]"
    :config="crudConfig"
    :data="connectionStore.connectionList"
    :loading="connectionStore.loading"
    :pagination="connectionStore.pagination"
    :sort="connectionStore.sort"
    v-on="eventHandlers"
  />
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useConnectionStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const connectionStore = useConnectionStore()

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // CRUD 操作
  add: connectionStore.handleAdd,
  edit: connectionStore.handleEdit,
  delete: connectionStore.handleDelete,

  // 数据操作
  refresh: connectionStore.loadData,
  search: connectionStore.handleSearch,

  // 表格操作
  pageChange: connectionStore.handlePageChange,
  pageSizeChange: connectionStore.handlePageSizeChange,
  sortChange: connectionStore.handleSortChange,
}))

// 初始化加载
onMounted(() => {
  connectionStore.loadData()
})
</script>

