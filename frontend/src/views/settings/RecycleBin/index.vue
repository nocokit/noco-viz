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

// 组件挂载时加载数据
onMounted(() => {
  recycleStore.loadData()
})
</script>

<style scoped>
/* IP Cell Styles */
.item-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon.icon-project {
  background: rgba(59, 130, 246, 0.1);
  color: var(--el-color-primary);
}

.item-icon.icon-datasource {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.item-icon.icon-media {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.item-icon.icon-component {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.item-location {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-id {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.days-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.days-badge.days-warning {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}
</style>

