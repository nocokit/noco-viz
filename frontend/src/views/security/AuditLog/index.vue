<template>
  <div class="audit-log-page">
    <SimpleCrudPage
      :breadcrumb="[
        { label: '首页', path: '/' },
        { label: '安全与权限', path: '/users' },
        { label: '审计日志' }
      ]"
      :config="crudConfig"
      :data="auditLogStore.logList"
      :loading="auditLogStore.loading"
      :pagination="auditLogStore.pagination"
      :sort="auditLogStore.sort"
      @refresh="auditLogStore.loadData"
      @search="auditLogStore.handleSearch"
      @page-change="auditLogStore.handlePageChange"
      @page-size-change="auditLogStore.handlePageSizeChange"
      @sort-change="auditLogStore.handleSortChange"
      @view-detail="openDrawer"
      @export="handleExport"
    />

    <!-- Detail Drawer -->
    <div class="drawer-overlay" :class="{ open: drawerOpen }" @click.self="closeDrawer">
      <div class="drawer">
        <div class="drawer-header">
          <div class="drawer-title">日志详情</div>
          <div style="cursor:pointer; color:#888" @click="closeDrawer">✕</div>
        </div>
        <div class="drawer-body">
          <div v-if="selectedLog">
            <div class="log-detail-row">
              <span class="detail-label">请求 ID (Trace ID)</span>
              <div class="detail-value" style="font-family:monospace">{{ selectedLog.traceId }}</div>
            </div>
            <div class="log-detail-row">
              <span class="detail-label">User Agent</span>
              <div class="detail-value">{{ selectedLog.userAgent }}</div>
            </div>
            <div class="log-detail-row" v-if="selectedLog.details">
              <span class="detail-label">{{ selectedLog.detailsLabel }}</span>
              <div class="code-block" v-html="selectedLog.details"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import SimpleCrudPage from '@/components/simple/SimpleCrudPage.vue'
import { useAuditLogStore } from '@/store'
import { crudConfig } from './crudConfig'
import { exportAuditLogs } from '@/api/auditLog'

// 使用 Pinia store
const auditLogStore = useAuditLogStore()

// 详情抽屉状态
const drawerOpen = ref(false)
const selectedLog = ref(null)

// 打开详情抽屉
const openDrawer = (log) => {
  selectedLog.value = log
  drawerOpen.value = true
}

// 关闭详情抽屉
const closeDrawer = () => {
  drawerOpen.value = false
}

// 导出审计日志
const handleExport = async () => {
  try {
    message.loading({ content: '正在导出...', key: 'export', duration: 0 })

    // 使用当前的搜索条件
    const params = { ...auditLogStore.searchQuery }

    const blob = await exportAuditLogs(params)

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    message.success({ content: '导出成功', key: 'export' })
  } catch (error) {
    console.error('导出失败:', error)
    message.error({ content: '导出失败', key: 'export' })
  }
}

// 初始化加载
onMounted(() => {
  auditLogStore.loadData()
})
</script>

