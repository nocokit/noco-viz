<template>
  <SimpleCrudPage
    :breadcrumb="[
      { label: '首页', path: '/' },
      { label: '安全与权限', path: '/users' },
      { label: '角色管理' }
    ]"
    :config="crudConfig"
    :data="roleStore.roleList"
    :loading="roleStore.loading"
    :pagination="roleStore.pagination"
    :sort="roleStore.sort"
    v-on="eventHandlers"
  />
</template>

<script setup>
import { onMounted, computed } from 'vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useRoleStore } from '@/store'
import { crudConfig } from './crudConfig'

// 使用 Pinia store
const roleStore = useRoleStore()

// 统一的事件处理器
const eventHandlers = computed(() => ({
  // CRUD 操作
  add: roleStore.handleAdd,
  edit: roleStore.handleEdit,
  delete: roleStore.handleDelete,

  // 数据操作
  refresh: roleStore.loadData,
  search: roleStore.handleSearch,

  // 表格操作
  pageChange: roleStore.handlePageChange,
  pageSizeChange: roleStore.handlePageSizeChange,
  sortChange: roleStore.handleSortChange,
}))

// 初始化加载
onMounted(() => {
  roleStore.loadData()
})
</script>

