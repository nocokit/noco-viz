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
          导出最近 30 天日志
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
        <option value="project">项目管理</option>
        <option value="datasource">数据源管理</option>
        <option value="system">系统设置</option>
        <option value="auth">登录认证</option>
      </select>

      <select class="filter-select" v-model="filters.status">
        <option value="">所有状态</option>
        <option value="success">成功</option>
        <option value="fail">失败</option>
      </select>

      <button class="btn btn-primary" style="margin-left:auto" @click="handleQuery">查询</button>
    </div>

    <!-- Table Area -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th width="18%">操作时间</th>
            <th width="20%">操作人 / IP</th>
            <th width="12%">功能模块</th>
            <th width="12%">操作类型</th>
            <th width="20%">操作对象 / 描述</th>
            <th width="10%">状态</th>
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
                <div class="user-info">
                  <div>{{ log.userName }}</div>
                  <div class="user-ip">{{ log.ip }}</div>
                </div>
              </div>
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
import { ref, computed } from 'vue'

const totalLogs = ref(45201)
const drawerOpen = ref(false)
const selectedLog = ref(null)

const filters = ref({
  search: '',
  dateRange: '',
  module: '',
  status: ''
})

const logs = ref([
  {
    id: 1,
    timestamp: '2023-10-27 14:32:05',
    userName: 'Sarah Jen',
    userInitials: 'SJ',
    avatarColor: '#f59e0b',
    ip: '192.168.10.5',
    module: '数据源管理',
    action: '删除',
    actionType: 'delete',
    description: '删除连接 <span class="obj-text">财务备用库</span>',
    status: 'success',
    statusText: '成功',
    statusColor: '',
    traceId: 'req_829301928301',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/119.0.0.0',
    detailsLabel: '快照备份',
    details: `// 已自动备份被删除的数据源配置
{
  "name": "财务备用库",
  "type": "Oracle",
  "host": "192.168.1.200",
  "deleted_at": "2023-10-27T14:32:05Z"
}`
  },
  {
    id: 2,
    timestamp: '2023-10-27 14:30:11',
    userName: 'Unknown',
    userInitials: '?',
    avatarColor: '#333',
    ip: '202.106.0.1',
    module: '系统登录',
    action: '登录',
    actionType: 'login',
    description: '尝试登录账号 <span class="obj-text">admin</span>',
    status: 'fail',
    statusText: '密码错误',
    statusColor: '#ef4444',
    traceId: 'req_829301928302',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    detailsLabel: '失败原因',
    details: '密码验证失败 (重试次数: 3)'
  },
  {
    id: 3,
    timestamp: '2023-10-27 11:15:23',
    userName: 'David Miller',
    userInitials: 'DM',
    avatarColor: '#3b82f6',
    ip: '192.168.10.2',
    module: '系统设置',
    action: '更新',
    actionType: 'update',
    description: '修改安全策略配置',
    status: 'success',
    statusText: '成功',
    statusColor: '',
    traceId: 'req_829301928303',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/119.0.0.0',
    detailsLabel: '变更内容 (Diff)',
    details: `{
  "module": "security",
  "changes": [
    {
      "key": "watermark_enabled",
      "old_value": false,
      "new_value": true
    },
    {
      "key": "session_timeout",
      "old_value": 30,
      "new_value": 15
    }
  ]
}`
  },
  {
    id: 4,
    timestamp: '2023-10-27 09:45:00',
    userName: 'Mike Ross',
    userInitials: 'MR',
    avatarColor: '#8b5cf6',
    ip: '192.168.10.8',
    module: '项目管理',
    action: '新建',
    actionType: 'create',
    description: '创建项目 <span class="obj-text">Q4销售大屏</span>',
    status: 'success',
    statusText: '成功',
    statusColor: '',
    traceId: 'req_829301928304',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    detailsLabel: '项目信息',
    details: `{
  "name": "Q4销售大屏",
  "type": "dashboard",
  "created_at": "2023-10-27T09:45:00Z"
}`
  }
])

const filteredLogs = computed(() => {
  let result = logs.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(log =>
      log.userName.toLowerCase().includes(search) ||
      log.ip.includes(search)
    )
  }

  if (filters.value.module) {
    result = result.filter(log => log.module.includes(filters.value.module))
  }

  if (filters.value.status) {
    result = result.filter(log => log.status === filters.value.status)
  }

  return result
})

const openDrawer = (log) => {
  selectedLog.value = log
  drawerOpen.value = true
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const handleQuery = () => {
  console.log('查询条件:', filters.value)
}

const handleExport = () => {
  console.log('导出日志')
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

.user-info div {
  line-height: 1.4;
}

.user-ip {
  font-size: 11px;
  color: var(--text-muted);
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
