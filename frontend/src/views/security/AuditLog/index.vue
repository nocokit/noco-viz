<template>
  <div class="audit-log-page">
    <!-- Header -->
    <header class="page-header">
      <h2>审计日志 <span class="log-count">Total: {{ totalLogs }}</span></h2>
      <div style="display:flex; gap:12px">
        <button class="btn" @click="handleExport">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z"/>
          </svg>
          导出查询结果 ({{ filteredLogs.length }})
        </button>
      </div>
    </header>

    <!-- Toolbar & Filters -->
    <div class="toolbar">
      <div style="position:relative">
        <input
          type="text"
          class="filter-input"
          placeholder="搜索操作人 / IP..."
          v-model="filters.search"
        >
        <svg style="position:absolute; right:10px; top:8px; color:#666; width:14px; height:14px" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>

      <input
        type="date"
        class="filter-input"
        v-model="filters.dateRange"
      >

      <select class="filter-select" v-model="filters.module">
        <option value="">所有模块</option>
        <option value="系统登录">系统登录</option>
        <option value="用户管理">用户管理</option>
        <option value="角色管理">角色管理</option>
        <option value="项目管理">项目管理</option>
        <option value="数据源管理">数据源管理</option>
        <option value="模板管理">模板管理</option>
        <option value="系统设置">系统设置</option>
        <option value="IP白名单">IP白名单</option>
        <option value="备份管理">备份管理</option>
        <option value="媒体管理">媒体管理</option>
        <option value="播放列表">播放列表</option>
      </select>

      <select class="filter-select" v-model="filters.status">
        <option value="">所有状态</option>
        <option value="success">成功</option>
        <option value="fail">失败</option>
      </select>

      <div style="margin-left:auto; display:flex; gap:12px">
        <button class="btn" @click="handleReset">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          重置
        </button>
        <button class="btn btn-primary" @click="handleQuery">查询</button>
      </div>
    </div>

    <!-- Table Area -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th width="16%">操作时间</th>
            <th width="12%">操作人</th>
            <th width="12%">IP地址</th>
            <th width="12%">功能模块</th>
            <th width="12%">操作类型</th>
            <th width="20%">操作对象 / 描述</th>
            <th width="8%">状态</th>
            <th width="8%">详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td class="time-text">{{ log.timestamp }}</td>
            <td>
              <div class="col-user">
                <div class="avatar" :style="{ background: log.avatarColor }">
                  {{ log.userInitials }}
                </div>
                <div class="user-name">{{ log.userName }}</div>
              </div>
            </td>
            <td>
              <span class="user-ip">{{ log.ip }}</span>
            </td>
            <td>{{ log.module }}</td>
            <td>
              <span class="action-badge" :class="`action-${log.actionType}`">
                {{ log.action }}
              </span>
            </td>
            <td v-html="log.description"></td>
            <td>
              <span style="font-size:12px" :style="{ color: log.statusColor }">
                <span class="status-dot" :class="`status-${log.status}`"></span>
                {{ log.statusText }}
              </span>
            </td>
            <td>
              <span class="btn-link" @click="openDrawer(log)">查看</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAuditLogs, getAuditLogDetail, getAuditLogStatistics } from '@/api/auditLog'

const totalLogs = ref(0)
const drawerOpen = ref(false)
const selectedLog = ref(null)
const loading = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 20,
  total: 0
})

const filters = ref({
  search: '',
  dateRange: '',
  module: '',
  status: ''
})

const logs = ref([])

// 获取用户首字母
const getUserInitials = (userName) => {
  if (!userName || userName === 'Unknown') return '?'
  const words = userName.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return userName.substring(0, 2).toUpperCase()
}

// 生成头像颜色
const getAvatarColor = (userName) => {
  const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#6366f1']
  if (!userName) return '#333'
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}

// 格式化时间
const formatTimestamp = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 转换后端数据为前端格式
const transformLogData = (log) => {
  return {
    id: log.id,
    timestamp: formatTimestamp(log.createdAt),
    userName: log.userName || 'Unknown',
    userInitials: getUserInitials(log.userName),
    avatarColor: getAvatarColor(log.userName),
    ip: log.ipAddress,
    module: log.module,
    action: log.action,
    actionType: log.actionType,
    description: log.description,
    status: log.status,
    statusText: log.status === 'success' ? '成功' : (log.error || '失败'),
    statusColor: log.status === 'success' ? '' : '#ef4444',
    traceId: log.traceId || '-',
    userAgent: log.userAgent || '-',
    detailsLabel: log.error ? '错误信息' : '请求详情',
    details: log.error || log.requestBody || '-'
  }
}

// 加载审计日志列表
const loadAuditLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: filters.value.search || undefined,
      module: filters.value.module || undefined,
      status: filters.value.status || undefined,
      startDate: filters.value.dateRange || undefined,
      endDate: filters.value.dateRange || undefined
    }

    const response = await getAuditLogs(params)

    if (response.data) {
      logs.value = response.data.map(transformLogData)
      pagination.value.total = response.total || 0
      totalLogs.value = response.total || 0
    }
  } catch (error) {
    console.error('加载审计日志失败:', error)
    ElMessage.error('加载审计日志失败')
    logs.value = []
  } finally {
    loading.value = false
  }
}

// 加载统计信息
const loadStatistics = async () => {
  try {
    const response = await getAuditLogStatistics()
    if (response.total !== undefined) {
      totalLogs.value = response.total
    }
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

const filteredLogs = computed(() => {
  return logs.value
})

const openDrawer = (log) => {
  selectedLog.value = log
  drawerOpen.value = true
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const handleQuery = () => {
  pagination.value.page = 1
  loadAuditLogs()
}

const handleReset = () => {
  filters.value = {
    search: '',
    dateRange: '',
    module: '',
    status: ''
  }
  pagination.value.page = 1
  loadAuditLogs()
  ElMessage.success('筛选条件已重置')
}

// 初始化加载
onMounted(() => {
  loadAuditLogs()
  loadStatistics()
})

const handleExport = () => {
  try {
    // 获取当前筛选后的数据
    const dataToExport = filteredLogs.value

    if (dataToExport.length === 0) {
      ElMessage.warning('没有数据可导出')
      return
    }

    // CSV 表头
    const headers = [
      '操作时间',
      '操作人',
      'IP地址',
      '功能模块',
      '操作类型',
      '操作描述',
      '状态',
      '请求ID',
      'User Agent'
    ]

    // 转换数据为 CSV 格式
    const csvContent = [
      headers.join(','), // 表头
      ...dataToExport.map(log => {
        // 清理 HTML 标签
        const cleanDescription = log.description.replace(/<[^>]*>/g, '')

        return [
          log.timestamp,
          `"${log.userName}"`, // 用引号包裹，防止逗号问题
          log.ip,
          log.module,
          log.action,
          `"${cleanDescription}"`,
          log.statusText,
          log.traceId,
          `"${log.userAgent}"`
        ].join(',')
      })
    ].join('\n')

    // 添加 BOM 以支持中文
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

    // 创建下载链接
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    // 生成文件名（包含当前日期和筛选条件）
    const now = new Date()
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`

    // 添加筛选条件到文件名
    let filterSuffix = ''
    if (filters.value.module) {
      filterSuffix += `_${filters.value.module}`
    }
    if (filters.value.status) {
      filterSuffix += `_${filters.value.status === 'success' ? '成功' : '失败'}`
    }

    const filename = `审计日志${filterSuffix}_${dateStr}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    ElMessage.success(`成功导出 ${dataToExport.length} 条日志记录`)
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  }
}
</script>

<style scoped>
/* =========================================
   全局变量 (复用深色主题)
   ========================================= */
.audit-log-page {
  --bg-body: #0a0b0d;
  --bg-sidebar: #141519;
  --bg-card: #1c1d21;
  --bg-hover: #26272c;
  --bg-input: #0f1012;

  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #6366f1;

  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border: #2d2e33;

  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-body);
}

/* Header */
.page-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 21, 25, 0.9);
  backdrop-filter: blur(5px);
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
}

.log-count {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 400;
  background: rgba(255,255,255,0.05);
  padding: 2px 8px;
  border-radius: 12px;
}

.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  transition: 0.2s;
}

.btn:hover {
  border-color: var(--text-main);
  color: var(--text-main);
}

.btn-primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: #2563eb;
}

/* Toolbar & Filters */
.toolbar {
  padding: 20px 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-input {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  width: 200px;
}

.filter-select {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  width: 140px;
}

/* Table Area */
.table-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  margin-top: 20px;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  font-weight: 500;
  position: sticky;
  top: 0;
  background: var(--bg-body);
  z-index: 2;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  vertical-align: top;
}

.data-table tr:hover {
  background: var(--bg-hover);
}

/* Column Styles */
.col-user {
  display: flex;
  gap: 10px;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #fff;
  flex-shrink: 0;
}

.user-name {
  line-height: 1.4;
}

.user-ip {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
}

.action-badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  border: 1px solid rgba(255,255,255,0.1);
}

.action-login {
  color: var(--info);
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
}

.action-create {
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.action-delete {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.action-update {
  color: var(--warning);
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.status-success {
  background: var(--success);
}

.status-fail {
  background: var(--danger);
}

.time-text {
  color: var(--text-secondary);
  font-family: monospace;
}

:deep(.obj-text) {
  font-family: monospace;
  color: var(--text-secondary);
  background: rgba(0,0,0,0.3);
  padding: 2px 4px;
  border-radius: 3px;
}

.btn-link {
  color: var(--primary);
  cursor: pointer;
  text-decoration: none;
  font-size: 12px;
}

.btn-link:hover {
  text-decoration: underline;
}

/* Drawer (Slide-over) */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(2px);
  z-index: 90;
  display: none;
  justify-content: flex-end;
}

.drawer-overlay.open {
  display: flex;
}

.drawer {
  width: 500px;
  background: var(--bg-card);
  height: 100%;
  box-shadow: -10px 0 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s;
  border-left: 1px solid var(--border);
}

.drawer-overlay.open .drawer {
  transform: translateX(0);
}

.drawer-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.log-detail-row {
  margin-bottom: 20px;
}

.detail-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
  display: block;
}

.detail-value {
  font-size: 14px;
  color: var(--text-main);
}

.code-block {
  background: #000;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  color: #a5b3ce;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
}
</style>
