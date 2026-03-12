<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '运维中心', path: '/monitor' },
      { label: '集成发布' }
    ]"
    :config="crudConfig"
    :data="integrationPublishStore.configList"
    :loading="integrationPublishStore.loading"
    :pagination="integrationPublishStore.pagination"
    :sort="integrationPublishStore.sort"
    v-on="eventHandlers"
  />
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useIntegrationPublishStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const integrationPublishStore = useIntegrationPublishStore()

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // CRUD 操作
  add: integrationPublishStore.handleAdd,
  edit: integrationPublishStore.handleEdit,
  delete: integrationPublishStore.handleDelete,

  // 数据操作
  refresh: integrationPublishStore.loadData,
  search: integrationPublishStore.handleSearch,

  // 表格操作
  pageChange: integrationPublishStore.handlePageChange,
  pageSizeChange: integrationPublishStore.handlePageSizeChange,
  sortChange: integrationPublishStore.handleSortChange,
}))

// 初始化加载
onMounted(() => {
  integrationPublishStore.loadData()
})
</script>


