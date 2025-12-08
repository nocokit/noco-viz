<template>
  <div class="datasource-management">
    <!-- 头部区域 -->
    <header class="library-header">
      <div class="header-top">
        <div class="header-title">
          <h1>数据源管理</h1>
          <p>配置与管理大屏所需的所有数据库、API及文件连接。</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" class="btn-primary" @click="openModal()">
            <el-icon><Plus /></el-icon>
            新建数据源
          </el-button>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-bar">
        <div
          v-for="filter in filters"
          :key="filter.id"
          :class="['filter-item', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }} ({{ getCount(filter.id) }})
        </div>
      </div>
    </header>

    <!-- 滚动列表 -->
    <div class="datasource-scroll">
      <!-- 数据库 -->
      <div v-if="filteredDatabase.length > 0" class="category-section">
        <div class="section-title">
          数据库连接 <span class="section-badge">Database</span>
        </div>
        <div class="datasource-grid">
          <div
            v-for="ds in filteredDatabase"
            :key="ds.id"
            class="ds-card"
          >
            <!-- Card Header -->
            <div class="ds-header">
              <div class="ds-icon-box" :class="getIconClass(ds.type)">
                {{ getIconText(ds.type) }}
              </div>
              <div class="ds-status" :class="ds.status === 'connected' ? 'status-success' : 'status-error'">
                <span class="dot"></span>
                {{ ds.status === 'connected' ? '连接正常' : '连接失败' }}
              </div>
            </div>

            <!-- Card Body -->
            <div class="ds-body">
              <div class="ds-name">{{ ds.name }}</div>
              <div class="ds-meta">
                <div class="meta-row">
                  <span class="meta-label">类型:</span> {{ ds.typeLabel }}
                </div>
                <div class="meta-row">
                  <span class="meta-label">Host:</span> {{ ds.host }}
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="ds-footer">
              <el-button size="small" @click="testConnection(ds)">
                {{ ds.status === 'connected' ? '测试' : '重试' }}
              </el-button>
              <el-button size="small" @click="editDatasource(ds)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="deleteDatasource(ds)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- API / 文件 -->
      <div v-if="filteredApiFile.length > 0" class="category-section">
        <div class="section-title">
          API 与 文件 <span class="section-badge">External</span>
        </div>
        <div class="datasource-grid">
          <div
            v-for="ds in filteredApiFile"
            :key="ds.id"
            class="ds-card"
          >
            <!-- Card Header -->
            <div class="ds-header">
              <div class="ds-icon-box" :class="getIconClass(ds.type)">
                {{ getIconText(ds.type) }}
              </div>
              <div class="ds-status" :class="ds.status === 'connected' ? 'status-success' : 'status-error'">
                <span class="dot"></span>
                {{ ds.status === 'connected' ? '有效' : '无效' }}
              </div>
            </div>

            <!-- Card Body -->
            <div class="ds-body">
              <div class="ds-name">{{ ds.name }}</div>
              <div class="ds-meta">
                <div class="meta-row">
                  <span class="meta-label">类型:</span> {{ ds.typeLabel }}
                </div>
                <div class="meta-row">
                  <span class="meta-label">地址:</span> {{ ds.host }}
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="ds-footer">
              <el-button size="small" @click="testConnection(ds)">测试</el-button>
              <el-button size="small" @click="editDatasource(ds)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="deleteDatasource(ds)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="filteredDatabase.length === 0 && filteredApiFile.length === 0"
        description="暂无数据源"
      />
    </div>

    <!-- Modal (保持原样逻辑，样式微调适配 Element Plus) -->
    <el-dialog
      v-model="modalOpen"
      :title="editingDs ? '编辑数据源' : '新建数据源'"
      width="600px"
    >
      <div class="modal-body">
        <el-form :model="formData" label-position="top">
          <!-- Type Selector -->
          <el-form-item label="选择数据源类型">
            <div class="type-selector">
              <div
                v-for="type in dsTypes"
                :key="type.value"
                class="type-item"
                :class="{ selected: formData.type === type.value }"
                @click="formData.type = type.value"
              >
                {{ type.label }}
              </div>
            </div>
          </el-form-item>

          <!-- Name -->
          <el-form-item label="显示名称">
            <el-input v-model="formData.name" placeholder="例如：生产主库" />
          </el-form-item>

          <!-- Host & Port -->
          <div class="form-grid">
            <el-form-item label="主机地址 (Host)">
              <el-input v-model="formData.host" placeholder="127.0.0.1" />
            </el-form-item>
            <el-form-item label="端口 (Port)">
              <el-input v-model="formData.port" :placeholder="getDefaultPort(formData.type)" />
            </el-form-item>
          </div>

          <!-- Database -->
          <el-form-item v-if="formData.type !== 'api'" label="数据库名 (Database)">
            <el-input v-model="formData.database" placeholder="nocoviz_db" />
          </el-form-item>

          <!-- Username & Password -->
          <div v-if="formData.type !== 'api'" class="form-grid">
            <el-form-item label="用户名">
              <el-input v-model="formData.username" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="formData.password" type="password" show-password />
            </el-form-item>
          </div>

          <!-- Advanced Config -->
          <div class="advanced-toggle" @click="showAdvanced = !showAdvanced">
            <el-icon><setting /></el-icon> 高级配置 (连接池)
            <el-icon :class="{ 'is-rotated': showAdvanced }"><arrow-down /></el-icon>
          </div>
          
          <div v-show="showAdvanced" class="advanced-panel">
            <div class="form-grid">
              <el-form-item label="最大连接数">
                <el-input-number v-model="formData.maxActive" :min="1" />
              </el-form-item>
              <el-form-item label="空闲超时 (ms)">
                <el-input-number v-model="formData.idleTimeout" :step="1000" />
              </el-form-item>
            </div>
            <div class="tip-text">注意：私有化部署环境下，请根据数据库负载能力谨慎调整。</div>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="modalOpen = false">取消</el-button>
          <el-button type="primary" plain @click="testConnectionInModal">测试连接</el-button>
          <el-button type="primary" @click="saveDatasource">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Setting, ArrowDown } from '@element-plus/icons-vue'

// 筛选器配置
const filters = [
  { id: 'all', label: '全部' },
  { id: 'database', label: '数据库' },
  { id: 'api', label: 'API 接口' },
  { id: 'file', label: '本地文件' }
]

const activeFilter = ref('all')
const modalOpen = ref(false)
const editingDs = ref(null)
const showAdvanced = ref(false)

// Mock Data
const datasources = ref([
  {
    id: 1,
    name: '交易订单主库',
    type: 'mysql',
    typeLabel: 'MySQL 8.0',
    host: '192.168.1.100:3306',
    status: 'connected',
    category: 'database'
  },
  {
    id: 2,
    name: '财务数仓',
    type: 'oracle',
    typeLabel: 'Oracle 11g',
    host: '192.168.1.102:1521',
    status: 'error',
    category: 'database'
  },
  {
    id: 3,
    name: '实时天气接口',
    type: 'api',
    typeLabel: 'RESTful API',
    host: 'api.weather.com',
    status: 'connected',
    category: 'api'
  },
  {
    id: 4,
    name: '用户行为日志',
    type: 'postgresql',
    typeLabel: 'PostgreSQL 14',
    host: '10.0.0.5:5432',
    status: 'connected',
    category: 'database'
  }
])

// Form Data
const dsTypes = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'Oracle', value: 'oracle' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'API', value: 'api' }
]

const formData = ref({
  type: 'mysql',
  name: '',
  host: '',
  port: '',
  database: '',
  username: '',
  password: '',
  maxActive: 10,
  idleTimeout: 30000
})

// Helpers
const getCount = (filterValue) => {
  if (filterValue === 'all') return datasources.value.length
  return datasources.value.filter(ds => ds.category === filterValue).length
}

const getIconClass = (type) => {
  const map = {
    mysql: 'icon-mysql',
    oracle: 'icon-oracle',
    postgresql: 'icon-pg',
    api: 'icon-api',
    excel: 'icon-excel'
  }
  return map[type] || 'icon-mysql'
}

const getIconText = (type) => {
  const map = {
    mysql: 'SQL',
    oracle: 'ORA',
    postgresql: 'PG',
    api: 'API',
    excel: 'XLS'
  }
  return map[type] || 'DB'
}

const getDefaultPort = (type) => {
  const map = {
    mysql: '3306',
    oracle: '1521',
    postgresql: '5432',
    api: '80'
  }
  return map[type] || '3306'
}

// Computed Filtering
const filteredDatabase = computed(() => {
  return datasources.value.filter(ds => {
    if (activeFilter.value !== 'all' && ds.category !== activeFilter.value) return false
    return ds.category === 'database'
  })
})

const filteredApiFile = computed(() => {
  return datasources.value.filter(ds => {
    if (activeFilter.value !== 'all' && ds.category !== activeFilter.value) return false
    return ds.category === 'api' || ds.category === 'file'
  })
})

// Actions
const openModal = () => {
  editingDs.value = null
  formData.value = {
    type: 'mysql',
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    maxActive: 10,
    idleTimeout: 30000
  }
  showAdvanced.value = false
  modalOpen.value = true
}

const editDatasource = (ds) => {
  editingDs.value = ds
  formData.value = {
    type: ds.type,
    name: ds.name,
    host: ds.host.split(':')[0],
    port: ds.host.split(':')[1] || getDefaultPort(ds.type),
    database: '',
    username: '',
    password: '',
    maxActive: 10,
    idleTimeout: 30000
  }
  modalOpen.value = true
}

const testConnection = (ds) => {
  if (ds.status === 'connected') {
    ElMessage.success(`${ds.name} 连接测试成功`)
  } else {
    ElMessage.error(`${ds.name} 连接测试失败，请检查配置`)
  }
}

const testConnectionInModal = () => {
  ElMessage.info('正在测试连接...')
  setTimeout(() => {
    ElMessage.success('连接测试成功')
  }, 1000)
}

const saveDatasource = () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入显示名称')
    return
  }
  if (!formData.value.host && formData.value.type !== 'file') {
    ElMessage.warning('请输入主机地址')
    return
  }
  ElMessage.success(editingDs.value ? '数据源配置已更新' : '数据源创建成功')
  modalOpen.value = false
}

const deleteDatasource = (ds) => {
  ElMessageBox.confirm(`确定删除 ${ds.name}？`, '提示', {
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
/* =========================================
   全局样式 (Consistent with TemplateLibrary)
   ========================================= */
.datasource-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
}

/* Header Area */
.library-header {
  padding: 30px 40px;
  background: linear-gradient(180deg, rgba(64, 158, 255, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid var(--el-border-color);
  flex-shrink: 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.header-title p {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  max-width: 600px;
  line-height: 1.5;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  padding-bottom: 2px;
}

.filter-item {
  padding-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.filter-item:hover {
  color: var(--el-text-color-primary);
}

.filter-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--el-color-primary);
}

/* Scroll Area */
.datasource-scroll {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto;
}

.category-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-primary);
}

.section-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-weight: 400;
}

.datasource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* Datasource Card */
.ds-card {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.ds-card:hover {
  transform: translateY(-6px);
  border-color: var(--el-color-primary);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.ds-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ds-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid var(--el-border-color);
}

.icon-mysql { color: #00758f; background: rgba(0, 117, 143, 0.1); }
.icon-oracle { color: #f80000; background: rgba(248, 0, 0, 0.1); }
.icon-pg { color: #336791; background: rgba(51, 103, 145, 0.1); }
.icon-api { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.icon-excel { color: #217346; background: rgba(33, 115, 70, 0.1); }

.ds-status {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-success { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.status-error { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.ds-body {
  flex: 1;
  margin-bottom: 20px;
}

.ds-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.ds-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-row {
  display: flex;
  gap: 8px;
}

.meta-label {
  color: var(--el-text-color-placeholder);
}

.ds-footer {
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 16px;
  justify-content: flex-end;
}

/* Modal Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.type-selector {
  display: flex;
  gap: 12px;
  width: 100%;
}

.type-item {
  flex: 1;
  border: 1px solid var(--el-border-color);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  transition: 0.2s;
  color: var(--el-text-color-regular);
}

.type-item:hover,
.type-item.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.advanced-toggle {
  font-size: 13px;
  color: var(--el-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.advanced-panel {
  background: var(--el-fill-color-light);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.tip-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}

.is-rotated {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

/* Scrollbar */
.datasource-scroll::-webkit-scrollbar {
  width: 6px;
}

.datasource-scroll::-webkit-scrollbar-thumb {
  background: var(--el-fill-color-darker);
  border-radius: 3px;
}

.datasource-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>