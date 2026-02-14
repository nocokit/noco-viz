<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '系统设置', path: '/settings' },
      { label: 'IP白名单' }
    ]"
    :config="crudConfig"
    :data="ipWhitelistStore.ipList"
    :loading="ipWhitelistStore.loading"
    :pagination="ipWhitelistStore.pagination"
    :sort="ipWhitelistStore.sort"
    @add="ipWhitelistStore.handleAdd"
    @edit="ipWhitelistStore.handleEdit"
    @delete="ipWhitelistStore.handleDelete"
    @refresh="ipWhitelistStore.loadData"
    @page-change="ipWhitelistStore.handlePageChange"
    @page-size-change="ipWhitelistStore.handlePageSizeChange"
    @sort-change="ipWhitelistStore.handleSortChange"
  />
</template>

<script setup>
import { onMounted } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useIpWhitelistStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const ipWhitelistStore = useIpWhitelistStore()

// 初始化加载
onMounted(() => {
  ipWhitelistStore.loadData()
})
</script>

<style scoped>
/* IP Cell Styles */
.ip-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ip-badge {
  display: inline-block;
  padding: 4px 10px;
  background: var(--el-fill-color);
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: var(--el-text-color-primary);
}

.type-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.type-cidr {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.type-single {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.description-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
