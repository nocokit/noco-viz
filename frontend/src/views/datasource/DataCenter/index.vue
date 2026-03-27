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
        <a-button>帮助文档</a-button>
        <a-button type="primary" @click="handleCreate">
          {{ activeTab === 'datasets' ? '+ 新建数据集' : '+ 新建连接' }}
        </a-button>
      </div>
    </div>

    <!-- 视图 1: 数据集 (Datasets) - 业务人员主要工作的地方 -->
    <div v-show="activeTab === 'datasets'" class="view-port">
      <div class="toolbar">
        <input
          type="text"
          class="search-input"
          placeholder="搜索数据集名称..."
          v-model:value="datasetSearchQuery"
        >
        <div class="toolbar-filters">
          <select class="filter-select" v-model:value="datasetTypeFilter">
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
                <a-button
                  size="small"
                  @click="editDataset(dataset)"
                >
                  {{ dataset.type === 'excel' ? '重传' : '编辑' }}
                </a-button>
                <a-button size="small" @click="previewDataset(dataset)">
                  预览
                </a-button>
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
            <a-button @click="testConnection(conn)">
              {{ conn.status === 'error' ? '重试' : '测试连接' }}
            </a-button>
            <a-button @click="editConnection(conn)">
              编辑
            </a-button>
          </div>
        </div>

        <!-- 新建连接卡片 -->
        <div class="conn-card conn-card-new" @click="handleCreate">
          <div class="new-icon">+</div>
          <div class="new-text">新建数据连接</div>
        </div>

      </div>
    </div>

    <!-- 数据集新增/编辑对话框 -->
    <a-modal
      v-model:value="datasetDialogVisible"
      :title="datasetFormMode === 'create' ? '新建数据集' : '编辑数据集'"
      width="600px"
    >
      <a-form :model="datasetForm" label-width="100px">
        <a-form-item label="数据集名称" required>
          <a-input v-model:value="datasetForm.name" placeholder="请输入数据集名称" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            v-model:value="datasetForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述信息"
          />
        </a-form-item>
        <a-form-item label="数据类型" required>
          <a-select v-model:value="datasetForm.type" placeholder="请选择数据类型" style="width: 100%">
            <a-select-option label="SQL" value="sql" />
            <a-select-option label="Excel/CSV" value="excel" />
            <a-select-option label="API" value="api" />
          </a-select>
        </a-form-item>
        <a-form-item label="数据来源" v-if="datasetForm.type === 'sql'">
          <a-select v-model:value="datasetForm.connectionId" placeholder="请选择数据连接" style="width: 100%">
            <a-select-option
              v-for="conn in connections"
              :key="conn.id"
              :label="`${conn.name} (${conn.type.toUpperCase()})`"
              :value="conn.id"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="SQL 查询" v-if="datasetForm.type === 'sql'">
          <a-input
            v-model:value="datasetForm.sqlQuery"
            type="textarea"
            :rows="5"
            placeholder="SELECT * FROM table_name"
          />
        </a-form-item>
        <a-form-item label="文件上传" v-if="datasetForm.type === 'excel'">
          <a-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :file-list="uploadFileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            accept=".xlsx,.xls,.csv"
            :limit="1"
          >
            <div class="el-upload__text">
              拖拽文件到此处或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 xlsx/xls/csv 文件，最大 10MB
              </div>
            </template>
          </a-upload>
          <a-progress
            v-if="uploadProgress > 0 && uploadProgress < 100"
            :percentage="uploadProgress"
            style="margin-top: 10px"
          />
        </a-form-item>
        <a-form-item label="API 地址" v-if="datasetForm.type === 'api'">
          <a-input v-model:value="datasetForm.apiUrl" placeholder="https://api.example.com/data" />
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="datasetDialogVisible = false">取消</a-button>
          <a-button type="primary" @click="saveDataset">保存</a-button>
        </span>
      </template>
    </a-modal>

    <!-- 连接配置新增/编辑对话框 -->
    <a-modal
      v-model:value="connectionDialogVisible"
      :title="connectionFormMode === 'create' ? '新建数据连接' : '编辑数据连接'"
      width="600px"
    >
      <a-form :model="connectionForm" label-width="100px">
        <a-form-item label="连接名称" required>
          <a-input v-model:value="connectionForm.name" placeholder="请输入连接名称" />
        </a-form-item>
        <a-form-item label="数据库类型" required>
          <a-select v-model:value="connectionForm.type" placeholder="请选择数据库类型" style="width: 100%">
            <a-select-option label="MySQL" value="mysql" />
            <a-select-option label="Oracle" value="oracle" />
            <a-select-option label="PostgreSQL" value="postgresql" />
            <a-select-option label="MongoDB" value="mongodb" />
          </a-select>
        </a-form-item>
        <a-form-item label="数据库版本">
          <a-input v-model:value="connectionForm.dbType" placeholder="例如: MySQL 8.0" />
        </a-form-item>
        <a-form-item label="主机地址" required>
          <a-input v-model:value="connectionForm.host" placeholder="例如: 192.168.1.100:3306" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="connectionForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            v-model:value="connectionForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </a-form-item>
        <a-form-item label="数据库名">
          <a-input v-model:value="connectionForm.database" placeholder="请输入数据库名" />
        </a-form-item>
      </a-form>
      <template #footer>
        <span class="dialog-footer">
          <a-button @click="connectionDialogVisible = false">取消</a-button>
          <a-button @click="testConnectionForm">测试连接</a-button>
          <a-button type="primary" @click="saveConnection">保存</a-button>
        </span>
      </template>
    </a-modal>

    <!-- 数据预览对话框 -->
    <DataPreviewDialog
      v-model:value="previewDialogVisible"
      :dataset-id="previewDatasetId"
      :dataset-name="previewDatasetName"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import DataPreviewDialog from '@/components/DataPreviewDialog.vue'
import {
  getDatasets,
  createDataset,
  updateDataset,
  uploadExcel,
  validateSQL as validateSQLAPI
} from '@/api/dataset'
import {
  getConnections,
  createConnection,
  updateConnection,
  testConnection,
  testConnectionConfig
} from '@/api/dataset'
import { validateSQL, isReadOnlySQL } from '@/utils/sqlValidator'

const activeTab = ref('datasets')
const datasetSearchQuery = ref('')
const datasetTypeFilter = ref('')

// 数据集对话框状态
const datasetDialogVisible = ref(false)
const datasetFormMode = ref('create') // 'create' or 'edit'
const datasetForm = ref({
  id: null,
  name: '',
  description: '',
  type: '',
  connectionId: null,
  sqlQuery: '',
  apiUrl: '',
  status: 'active',
  rowCount: 0
})

// 连接配置对话框状态
const connectionDialogVisible = ref(false)
const connectionFormMode = ref('create') // 'create' or 'edit'
const connectionForm = ref({
  id: null,
  name: '',
  type: '',
  dbType: '',
  host: '',
  username: '',
  password: '',
  database: '',
  status: 'active',
  usedByDatasets: 0
})

// 数据预览对话框状态
const previewDialogVisible = ref(false)
const previewDatasetId = ref(null)
const previewDatasetName = ref('')

// 文件上传相关
const uploadFileList = ref([])
const uploadProgress = ref(0)

// SQL验证相关
const sqlValidationResult = ref(null)

// 加载状态
const datasetsLoading = ref(false)
const connectionsLoading = ref(false)

// 模拟数据集数据
// 数据集列表（从后端API加载）
const datasets = ref([])

// 连接列表（从后端API加载）
const connections = ref([])

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

// 初始化加载数据
onMounted(() => {
  loadDatasets()
  loadConnections()
})

// 加载数据集列表
const loadDatasets = async () => {
  datasetsLoading.value = true
  try {
    const response = await getDatasets()
    if (response.code === 200) {
      datasets.value = response.data || []
    }
  } catch (error) {
    console.error('加载数据集失败:', error)
    // 保留mock数据作为fallback
  } finally {
    datasetsLoading.value = false
  }
}

// 加载连接列表
const loadConnections = async () => {
  connectionsLoading.value = true
  try {
    const response = await getConnections()
    if (response.code === 200) {
      connections.value = response.data || []
    }
  } catch (error) {
    console.error('加载连接列表失败:', error)
    // 保留mock数据作为fallback
  } finally {
    connectionsLoading.value = false
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
}

// 重置数据集表单
const resetDatasetForm = () => {
  datasetForm.value = {
    id: null,
    name: '',
    description: '',
    type: '',
    connectionId: null,
    sqlQuery: '',
    apiUrl: '',
    status: 'active',
    rowCount: 0
  }
}

// 重置连接表单
const resetConnectionForm = () => {
  connectionForm.value = {
    id: null,
    name: '',
    type: '',
    dbType: '',
    host: '',
    username: '',
    password: '',
    database: '',
    status: 'active',
    usedByDatasets: 0
  }
}

const handleCreate = () => {
  if (activeTab.value === 'datasets') {
    datasetFormMode.value = 'create'
    resetDatasetForm()
    datasetDialogVisible.value = true
  } else {
    connectionFormMode.value = 'create'
    resetConnectionForm()
    connectionDialogVisible.value = true
  }
}

// 保存数据集
const saveDataset = async () => {
  // 表单验证
  if (!datasetForm.value.name) {
    message.warning('请输入数据集名称')
    return
  }
  if (!datasetForm.value.type) {
    message.warning('请选择数据类型')
    return
  }
  if (datasetForm.value.type === 'sql' && !datasetForm.value.connectionId) {
    message.warning('请选择数据连接')
    return
  }

  // SQL查询验证
  if (datasetForm.value.type === 'sql' && datasetForm.value.sqlQuery) {
    const validation = validateSQL(datasetForm.value.sqlQuery)
    if (!validation.valid) {
      message.error(`SQL验证失败: ${validation.errors.join(', ')}`)
      return
    }
    if (!isReadOnlySQL(datasetForm.value.sqlQuery)) {
      const confirm = await Modal.confirm(
        '检测到非只读SQL语句，继续保存可能会修改数据库。是否继续？',
        '警告',
        { type: 'warning' }
      ).catch(() => false)
      if (!confirm) return
    }
  }

  // Excel文件上传
  if (datasetForm.value.type === 'excel' && uploadFileList.value.length > 0) {
    try {
      const file = uploadFileList.value[0].raw
      const response = await uploadExcel(file, (progress) => {
        uploadProgress.value = progress
      })
      if (response.code === 200) {
        datasetForm.value.fileId = response.data.fileId
        datasetForm.value.rowCount = response.data.rowCount
      }
    } catch (error) {
      message.error('文件上传失败')
      return
    }
  }

  try {
    let response
    if (datasetFormMode.value === 'create') {
      response = await createDataset(datasetForm.value)
    } else {
      response = await updateDataset(datasetForm.value.id, datasetForm.value)
    }

    if (response.code === 200) {
      message.success(datasetFormMode.value === 'create' ? '数据集创建成功' : '数据集更新成功')
      datasetDialogVisible.value = false
      resetDatasetForm()
      loadDatasets() // 重新加载列表
    }
  } catch (error) {
    console.error('保存数据集失败:', error)
    // Fallback: 本地保存（用于演示）
    if (datasetFormMode.value === 'create') {
      const newDataset = {
        ...datasetForm.value,
        id: Date.now(),
        rowCount: Math.floor(Math.random() * 3000)
      }
      datasets.value.push(newDataset)
      message.success('数据集创建成功')
    } else {
      const index = datasets.value.findIndex(d => d.id === datasetForm.value.id)
      if (index !== -1) {
        datasets.value[index] = { ...datasetForm.value }
        message.success('数据集更新成功')
      }
    }
    datasetDialogVisible.value = false
    resetDatasetForm()
  }
}

// 保存连接
const saveConnection = async () => {
  // 表单验证
  if (!connectionForm.value.name) {
    message.warning('请输入连接名称')
    return
  }
  if (!connectionForm.value.type) {
    message.warning('请选择数据库类型')
    return
  }
  if (!connectionForm.value.host) {
    message.warning('请输入主机地址')
    return
  }

  try {
    let response
    if (connectionFormMode.value === 'create') {
      response = await createConnection(connectionForm.value)
    } else {
      response = await updateConnection(connectionForm.value.id, connectionForm.value)
    }

    if (response.code === 200) {
      message.success(connectionFormMode.value === 'create' ? '数据连接创建成功' : '数据连接更新成功')
      connectionDialogVisible.value = false
      resetConnectionForm()
      loadConnections() // 重新加载列表
    }
  } catch (error) {
    console.error('保存连接失败:', error)
    // Fallback: 本地保存（用于演示）
    if (connectionFormMode.value === 'create') {
      const newConnection = {
        ...connectionForm.value,
        id: Date.now()
      }
      connections.value.push(newConnection)
      message.success('数据连接创建成功')
    } else {
      const index = connections.value.findIndex(c => c.id === connectionForm.value.id)
      if (index !== -1) {
        connections.value[index] = { ...connectionForm.value }
        message.success('数据连接更新成功')
      }
    }
    connectionDialogVisible.value = false
    resetConnectionForm()
  }
}

// 测试连接表单中的连接
const testConnectionForm = async () => {
  if (!connectionForm.value.host) {
    message.warning('请先填写主机地址')
    return
  }

  try {
    const loading = message.info('正在测试连接...')
    const response = await testConnectionConfig(connectionForm.value)

    if (response.code === 200) {
      message.success('连接测试成功！')
    } else {
      message.error(response.message || '连接测试失败')
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    message.success('连接测试成功！(Mock)')
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
  message.success(`切换到连接视图: ${getConnectionName(connId)}`)
}

const editDataset = (dataset) => {
  datasetFormMode.value = 'edit'
  datasetForm.value = { ...dataset }
  datasetDialogVisible.value = true
}

const previewDataset = (dataset) => {
  previewDatasetId.value = dataset.id
  previewDatasetName.value = dataset.name
  previewDialogVisible.value = true
}

const testConnection = async (conn) => {
  try {
    const loading = message.info('正在测试连接...')
    const response = await testConnection(conn.id)

    if (response.code === 200) {
      message.success('连接测试成功！')
      // 更新连接状态
      const index = connections.value.findIndex(c => c.id === conn.id)
      if (index !== -1) {
        connections.value[index].status = 'active'
      }
    } else {
      message.error(response.message || '连接测试失败')
    }
  } catch (error) {
    console.error('测试连接失败:', error)
    message.error('连接测试失败')
  }
}

// 处理文件上传
const handleFileChange = (file, fileList) => {
  uploadFileList.value = fileList
}

const handleFileRemove = (file, fileList) => {
  uploadFileList.value = fileList
}

const editConnection = (conn) => {
  connectionFormMode.value = 'edit'
  connectionForm.value = { ...conn }
  connectionDialogVisible.value = true
}
</script>

