<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '运维中心', path: '/monitor' },
      { label: '数据源监控' }
    ]"
    :config="crudConfig"
    :data="monitorStore.monitorList"
    :loading="monitorStore.loading"
    :pagination="monitorStore.pagination"
    :sort="monitorStore.sort"
    :show-add-button="false"
    v-on="eventHandlers"
  />
</template>

<script setup>
import { onMounted, computed, onUnmounted } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useDatasourceMonitorStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const monitorStore = useDatasourceMonitorStore()

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // 数据操作
  refresh: monitorStore.loadData,
  search: monitorStore.handleSearch,

  // 表格操作
  pageChange: monitorStore.handlePageChange,
  pageSizeChange: monitorStore.handlePageSizeChange,
  sortChange: monitorStore.handleSortChange,

  // 自定义操作
  testConnection: monitorStore.testConnection,
  viewDetails: monitorStore.viewDetails,
}))

// 自动刷新定时器
let refreshTimer = null

// 初始化加载
onMounted(() => {
  monitorStore.loadData()

  // 每30秒自动刷新
  refreshTimer = setInterval(() => {
    monitorStore.loadData()
  }, 30000)
})

// 清理定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

