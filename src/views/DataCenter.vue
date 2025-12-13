<template>
  <div class="data-center">
    <!-- 顶部 Header & Tabs -->
    <div class="header">
      <div class="tab-group">
        <!-- Tab 1: 业务数据 -->
        <div
          :class="['tab-btn', { active: activeTab === 'datasets' }]"
          @click="switchTab('datasets')"
        >
          <span>📦 数据集管理</span>
          <span class="badge">{{ datasets.length }}</span>
        </div>
        <!-- Tab 2: 基础设施 -->
        <div
          :class="['tab-btn', { active: activeTab === 'connections' }]"
          @click="switchTab('connections')"
        >
          <span>🔌 连接配置</span>
          <span class="badge">{{ connections.length }}</span>
        </div>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary">帮助文档</button>
        <button class="btn btn-primary" @click="handleCreate">
          {{ activeTab === 'datasets' ? '+ 新建数据集' : '+ 新建连接' }}
        </button>
      </div>
    </div>

    <!-- 视图 1: 数据集 (Datasets) - 业务人员主要工作的地方 -->
    <div v-show="activeTab === 'datasets'" class="view-port">
      <div class="toolbar">
        <input
          type="text"
          class="search-input"
          placeholder="搜索数据集名称..."
          v-model="datasetSearchQuery"
        >
        <div class="toolbar-filters">
          <select class="filter-select" v-model="datasetTypeFilter">
            <option value="">全部类型</option>
            <option value="sql">SQL</option>
            <option value="excel">Excel/CSV</option>
            <option value="api">API</option>
          </select>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th width="35%">数据集名称 / 描述</th>
            <th width="20%">数据来源</th>
            <th width="15%">类型</th>
            <th width="15%">状态 / 行数</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dataset in filteredDatasets" :key="dataset.id">
            <td>
              <div class="dataset-name">{{ dataset.name }}</div>
              <div class="dataset-desc">{{ dataset.description }}</div>
            </td>
            <td>
              <div
                v-if="dataset.connectionId"
                class="conn-ref"
                @click="viewConnection(dataset.connectionId)"
              >
                🔗 {{ getConnectionName(dataset.connectionId) }}
              </div>
              <div v-else class="conn-ref">
                -- 本地文件 --
              </div>
            </td>
            <td>
              <span :class="['tag', `tag-${dataset.type}`]">
                {{ getTypeLabel(dataset.type) }}
              </span>
            </td>
            <td>
              <div class="status-cell">
                <span :class="['dot', dataset.status === 'active' ? 'dot-green' : 'dot-red']"></span>
                {{ dataset.rowCount }} Rows
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  class="btn-action"
                  @click="editDataset(dataset)"
                >
                  {{ dataset.type === 'excel' ? '重传' : '编辑' }}
                </button>
                <button class="btn-action" @click="previewDataset(dataset)">
                  预览
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredDatasets.length === 0">
            <td colspan="5" class="empty-state">
              暂无数据集，点击右上角"新建数据集"开始创建
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 视图 2: 连接配置 (Connections) - IT配置的地方 -->
    <div v-show="activeTab === 'connections'" class="view-port">
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
        <div class="conn-card conn-card-new" @click="handleCreate">
          <div class="new-icon">+</div>
          <div class="new-text">新建数据连接</div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('datasets')
const datasetSearchQuery = ref('')
const datasetTypeFilter = ref('')

// 模拟数据集数据
const datasets = ref([
  {
    id: 1,
    name: 'Q1_门店物料清单',
    description: '静态数据导入，包含库存明细',
    type: 'excel',
    connectionId: null,
    status: 'active',
    rowCount: 1200
  },
  {
    id: 2,
    name: '华东区_销售大屏汇总',
    description: '聚合了订单表，按季度统计GMV',
    type: 'sql',
    connectionId: 1,
    status: 'active',
    rowCount: 2845
  },
  {
    id: 3,
    name: '实时天气服务',
    description: 'External Weather API',
    type: 'api',
    connectionId: null,
    status: 'active',
    rowCount: '自动刷新'
  },
  {
    id: 4,
    name: '2025Q1_销售总表',
    description: '第一季度完整销售数据',
    type: 'excel',
    connectionId: null,
    status: 'active',
    rowCount: 856
  }
])

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

// 过滤后的数据集
const filteredDatasets = computed(() => {
  let result = datasets.value

  if (datasetSearchQuery.value) {
    const query = datasetSearchQuery.value.toLowerCase()
    result = result.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  }

  if (datasetTypeFilter.value) {
    result = result.filter(d => d.type === datasetTypeFilter.value)
  }

  return result
})

const switchTab = (tab) => {
  activeTab.value = tab
}

const handleCreate = () => {
  if (activeTab.value === 'datasets') {
    ElMessage.info('打开新建数据集对话框')
  } else {
    ElMessage.info('打开新建连接对话框')
  }
}

const getConnectionName = (connId) => {
  const conn = connections.value.find(c => c.id === connId)
  return conn ? `${conn.name} (${conn.type.toUpperCase()})` : '未知连接'
}

const getTypeLabel = (type) => {
  const labels = {
    sql: 'SQL',
    excel: 'Excel',
    api: 'API'
  }
  return labels[type] || type
}

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

const viewConnection = (connId) => {
  activeTab.value = 'connections'
  ElMessage.success(`切换到连接视图: ${getConnectionName(connId)}`)
}

const editDataset = (dataset) => {
  ElMessage.info(`编辑数据集: ${dataset.name}`)
}

const previewDataset = (dataset) => {
  ElMessage.info(`预览数据集: ${dataset.name}`)
}

const testConnection = (conn) => {
  ElMessage.info(`测试连接: ${conn.name}`)
}

const editConnection = (conn) => {
  ElMessage.info(`编辑连接: ${conn.name}`)
}
</script>

<style scoped>
.data-center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f1014;
  color: #e5e5e5;
}

/* 顶部 Header & Tabs */
.header {
  height: 60px;
  border-bottom: 1px solid #303033;
  background: #18181c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.tab-group {
  display: flex;
  gap: 24px;
  height: 100%;
}

.tab-btn {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #909399;
  font-size: 14px;
  position: relative;
  border-bottom: 2px solid transparent;
  transition: 0.2s;
  padding: 0 4px;
}

.tab-btn:hover {
  color: #e5e5e5;
}

.tab-btn.active {
  color: white;
  font-weight: 500;
  border-bottom-color: #409eff;
}

.badge {
  background: #333;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  color: #888;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: 0.2s;
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

/* 视图容器 */
.view-port {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  background: #111;
  border: 1px solid #303033;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  width: 300px;
  outline: none;
  font-size: 13px;
}

.search-input:focus {
  border-color: #409eff;
}

.toolbar-filters {
  display: flex;
  gap: 10px;
}

.filter-select {
  background: #111;
  border: 1px solid #303033;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  width: 120px;
  outline: none;
  font-size: 13px;
  cursor: pointer;
}

.filter-select:hover {
  border-color: #444;
}

/* 数据表格 */
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #18181c;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th {
  text-align: left;
  color: #666;
  font-size: 12px;
  padding: 12px;
  border-bottom: 1px solid #303033;
  font-weight: 500;
  background: #1e1e20;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #252529;
  font-size: 13px;
  color: #ccc;
}

.data-table tr:hover td {
  background: #26262a;
}

.dataset-name {
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
}

.dataset-desc {
  font-size: 12px;
  color: #666;
}

.conn-ref {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.conn-ref:hover {
  color: #409eff;
}

/* 类型标签 */
.tag {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tag-sql {
  background: rgba(64, 158, 255, 0.15);
  color: #409eff;
}

.tag-excel {
  background: rgba(103, 194, 58, 0.15);
  color: #67c23a;
}

.tag-api {
  background: rgba(230, 162, 60, 0.15);
  color: #e6a23c;
}

.status-cell {
  display: flex;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.dot-green {
  background: #67c23a;
}

.dot-red {
  background: #f56c6c;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 4px 8px;
  font-size: 12px;
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-action:hover {
  border-color: #666;
  color: white;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px !important;
}

/* 连接卡片网格 */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.conn-card {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
  position: relative;
}

.conn-card:hover {
  border-color: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.conn-card.conn-error {
  border-color: rgba(245, 108, 108, 0.3);
}

.card-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.db-logo {
  width: 44px;
  height: 44px;
  background: #2c2c30;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
  font-size: 14px;
}

.status-badge {
  font-size: 12px;
  padding: 2px 8px;
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
  margin: 0 0 4px 0;
  font-size: 15px;
  color: white;
}

.card-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
  font-family: monospace;
}

.card-meta {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #333;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.card-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.card-actions .btn {
  flex: 1;
  padding: 6px 12px;
  font-size: 12px;
}

/* 新建连接卡片 */
.conn-card-new {
  border-style: dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 180px;
}

.conn-card-new:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.new-icon {
  font-size: 24px;
  color: #666;
  margin-bottom: 8px;
}

.new-text {
  font-size: 14px;
  color: #888;
}
</style>
