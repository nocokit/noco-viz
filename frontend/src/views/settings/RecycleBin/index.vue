<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '系统设置', path: '/settings' },
      { label: '回收站' }
    ]"
    :config="crudConfig"
    :data="recycleStore.filteredItems"
    :loading="recycleStore.loading"
    @refresh="recycleStore.loadData"
    @delete="handleDelete"
    @search="recycleStore.handleSearch"
    @batch-delete="handleBatchDelete"
  />
</template>

<script setup>
import { onMounted } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useRecycleStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const recycleStore = useRecycleStore()

// 处理删除操作
function handleDelete(item) {
  recycleStore.handleDeleteSingle(item)
}

// 处理批量删除操作
function handleBatchDelete(items) {
  recycleStore.handleBatchDelete(items)
}

// 组件挂载时加载数据
onMounted(() => {
  recycleStore.loadData()
})
</script>


