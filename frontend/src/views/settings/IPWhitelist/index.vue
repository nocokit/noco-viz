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

