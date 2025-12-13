<template>
  <div class="connection-management">
    <!-- 顶部工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">连接配置</h1>
        <span class="page-subtitle">管理数据库和API连接</span>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          帮助文档
        </button>
        <button class="btn btn-primary" @click="handleCreateConnection">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          新建连接
        </button>
      </div>
    </div>

    <!-- 连接卡片网格 -->
    <div class="content-area">
      <div class="grid-layout">

        <!-- 遍历连接卡片 -->
        <div
          v-for="conn in connections"
          :key="conn.id"
          :class="['conn-card', { 'conn-error': conn.status === 'error' }]"
        >
          <div class="card-head">
            <div class="db-logo" :style="{ color: getDbColor(conn.type) }">
              {{ getDbIcon(conn.type) }}
            </div>
            <span :class="['status-badge', conn.status === 'error' ? 'error' : '']">
              ● {{ conn.status === 'active' ? '连接正常' : '连接失败' }}
            </span>
          </div>
          <div class="card-info">
            <h3>{{ conn.name }}</h3>
            <p>{{ conn.host }}</p>
          </div>
          <div class="card-meta">
            <span>{{ conn.dbType }}</span>
            <span>被 {{ conn.usedByDatasets || 0 }} 个数据集引用</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary" @click="testConnection(conn)">
              {{ conn.status === 'error' ? '重试' : '测试连接' }}
            </button>
            <button class="btn btn-secondary" @click="editConnection(conn)">
              编辑
            </button>
          </div>
        </div>

        <!-- 新建连接卡片 -->
        <div class="conn-card conn-card-new" @click="handleCreateConnection">
          <div class="new-icon">+</div>
          <div class="new-text">新建数据连接</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟连接数据
const connections = ref([
  {
    id: 1,
    name: '交易订单主库',
    type: 'mysql',
    dbType: 'MySQL 8.0',
    host: '192.168.1.100:3306',
    status: 'active',
    usedByDatasets: 5
  },
  {
    id: 2,
    name: '财务数仓_只读',
    type: 'oracle',
    dbType: 'Oracle 11g',
    host: '192.168.1.102:1521',
    status: 'error',
    usedByDatasets: 2
  },
  {
    id: 3,
    name: '用户行为分析库',
    type: 'postgresql',
    dbType: 'PostgreSQL 14',
    host: '192.168.1.103:5432',
    status: 'active',
    usedByDatasets: 3
  }
])

const getDbIcon = (type) => {
  const icons = {
    mysql: 'My',
    oracle: 'Ora',
    postgresql: 'PG',
    mongodb: 'Mo'
  }
  return icons[type] || 'DB'
}

const getDbColor = (type) => {
  const colors = {
    mysql: '#409eff',
    oracle: '#f56c6c',
    postgresql: '#409eff',
    mongodb: '#67c23a'
  }
  return colors[type] || '#909399'
}

const handleCreateConnection = () => {
  ElMessage.info('打开新建连接对话框')
}

const testConnection = (conn) => {
  ElMessage.info(`测试连接: ${conn.name}`)
}

const editConnection = (conn) => {
  ElMessage.info(`编辑连接: ${conn.name}`)
}
</script>

<style scoped>
.connection-management {
  min-height: 100vh;
  background: #0f1014;
  color: #e5e5e5;
}

/* 页面头部 */
.page-header {
  height: 80px;
  border-bottom: 1px solid #303033;
  background: #18181c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #e5e5e5;
}

.page-subtitle {
  font-size: 13px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: 0.2s;
}

.btn svg {
  flex-shrink: 0;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-secondary {
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
}

.btn-secondary:hover {
  border-color: #666;
  color: white;
}

/* 内容区域 */
.content-area {
  padding: 32px;
}

/* 连接卡片网格 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.conn-card {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s;
  position: relative;
}

.conn-card:hover {
  border-color: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.conn-card.conn-error {
  border-color: rgba(245, 108, 108, 0.3);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.db-logo {
  width: 48px;
  height: 48px;
  background: #2c2c30;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
  font-size: 16px;
}

.status-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.2);
  height: fit-content;
}

.status-badge.error {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
  border-color: rgba(245, 108, 108, 0.2);
}

.card-info h3 {
  margin: 0 0 6px 0;
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.card-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.card-meta {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.card-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.card-actions .btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  justify-content: center;
}

/* 新建连接卡片 */
.conn-card-new {
  border-style: dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 220px;
}

.conn-card-new:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.new-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 12px;
}

.new-text {
  font-size: 14px;
  color: #888;
}
</style>
