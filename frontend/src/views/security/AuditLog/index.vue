<template>
  <div class="audit-log-page">
    <!-- Header -->
    <PageHeader
      title="审计日志"
      description="记录系统所有操作行为，支持按模块、用户、时间等条件筛选和导出。"
      :stats="[{ label: '总记录数', value: totalLogs }]"
      :actions="[
        { text: `导出查询结果 (${filteredLogs.length})`, icon: 'Download', handler: handleExport }
      ]"
    />

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-left">
        <el-input
          v-model="filters.search"
          placeholder="搜索操作人 / IP..."
          prefix-icon="Search"
          clearable
          style="width: 240px"
        />

        <el-date-picker
          v-model="filters.dateRange"
          type="date"
          placeholder="选择日期"
          style="width: 180px"
        />

        <el-select v-model="filters.module" placeholder="所有模块" clearable style="width: 140px">
          <el-option label="所有模块" value="" />
          <el-option label="系统登录" value="系统登录" />
          <el-option label="用户管理" value="用户管理" />
          <el-option label="角色管理" value="角色管理" />
          <el-option label="项目管理" value="项目管理" />
          <el-option label="数据源管理" value="数据源管���" />
          <el-option label="模板管理" value="模板管理" />
          <el-option label="系统设置" value="系统设置" />
          <el-option label="IP白名单" value="IP白名单" />
          <el-option label="备份管理" value="备份管理" />
          <el-option label="媒体管理" value="媒体管理" />
          <el-option label="播放列表" value="播放列表" />
        </el-select>

        <el-select v-model="filters.status" placeholder="所有状态" clearable style="width: 120px">
          <el-option label="所有状态" value="" />
          <el-option label="成功" value="success" />
          <el-option label="失败" value="fail" />
        </el-select>
      </div>

      <div class="filter-right">
        <el-button @click="handleReset">
          <el-icon><RefreshLeft /></el-icon>
          重置
        </el-button>
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </div>
    </div>

    <!-- Table Area -->
    <div class="content-body">
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
import { Download, RefreshLeft } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
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
.audit-log-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;
  background-color: var(--el-bg-color-page);
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
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  transition: 0.2s;
}

.btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.btn-primary {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

/* 筛选工具栏 */
.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--el-border-color);
  margin-bottom: 20px;
  gap: 16px;
}

.filter-left {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
}

.filter-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Table Area */
.content-body {
  flex: 1;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 12px 20px;
  color: var(--el-text-color-secondary);
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 500;
  background: var(--el-bg-color);
}

.data-table th:first-child {
  border-top-left-radius: 8px;
}

.data-table th:last-child {
  border-top-right-radius: 8px;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  vertical-align: middle;
}

.data-table tr:hover td {
  background: var(--el-fill-color-light);
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
  color: var(--el-text-color-secondary);
  font-family: monospace;
}

.action-badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.action-login {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.action-create {
  color: var(--el-color-success);
  background: var(--el-color-success-light-9);
}

.action-delete {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}

.action-update {
  color: var(--el-color-warning);
  background: var(--el-color-warning-light-9);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.status-success {
  background: var(--el-color-success);
}

.status-fail {
  background: var(--el-color-danger);
}

.time-text {
  color: var(--el-text-color-secondary);
  font-family: monospace;
}

:deep(.obj-text) {
  font-family: monospace;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-darker);
  padding: 2px 4px;
  border-radius: 3px;
}

.btn-link {
  color: var(--el-color-primary);
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
  background: var(--el-bg-color);
  height: 100%;
  box-shadow: -10px 0 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s;
  border-left: 1px solid var(--el-border-color);
}

.drawer-overlay.open .drawer {
  transform: translateX(0);
}

.drawer-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
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
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
  display: block;
}

.detail-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.code-block {
  background: var(--el-fill-color-darker);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 12px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
}
</style>
