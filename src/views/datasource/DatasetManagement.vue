<!--
  数据集管理页面
  支持分类/文件夹管理的数据集列表
-->
<template>
  <div class="dataset-management">
    <!-- 分类侧边栏 -->
    <div class="folder-sidebar">
      <div class="folder-header">
        <span>数据集分类</span>
        <button class="btn-add-folder" @click="handleAddFolder" title="新建分组">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      </div>

      <div class="folder-list">
        <!-- 默认分类 -->
        <div
          :class="['folder-item', { active: activeFolder === 'all' }]"
          @click="activeFolder = 'all'"
        >
          <div class="folder-name">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            全部数据集
          </div>
          <span class="folder-count">{{ getTotalCount() }}</span>
        </div>

        <div
          :class="['folder-item', { active: activeFolder === 'recent' }]"
          @click="activeFolder = 'recent'"
        >
          <div class="folder-name">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            最近使用
          </div>
          <span class="folder-count">{{ getRecentCount() }}</span>
        </div>

        <div
          :class="['folder-item', { active: activeFolder === 'starred' }]"
          @click="activeFolder = 'starred'"
        >
          <div class="folder-name">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            特别关注
          </div>
          <span class="folder-count">{{ getStarredCount() }}</span>
        </div>

        <!-- 业务分组 -->
        <div class="folder-section-header">
          <span>业务分组</span>
          <button class="btn-add-group" @click="handleAddFolder" title="添加分组">+</button>
        </div>

        <div
          v-for="folder in customFolders"
          :key="folder.id"
          :class="['folder-item', { active: activeFolder === folder.id }]"
          @click="activeFolder = folder.id"
        >
          <div class="folder-name">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" :style="{ color: folder.color }">
              <path d="M2.25 6.75c0-.966.784-1.75 1.75-1.75h4.155c.66 0 1.25.402 1.517 1.006l.378.855c.133.302.428.503.759.503h8.941c.966 0 1.75.784 1.75 1.75v8.136c0 .966-.784 1.75-1.75 1.75H4c-.966 0-1.75-.784-1.75-1.75V6.75z"/>
            </svg>
            {{ folder.name }}
          </div>
          <span class="folder-count">{{ getFolderCount(folder.id) }}</span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">{{ getCurrentFolderName() }}</h1>
            <p class="page-desc">{{ getCurrentFolderDesc() }}</p>
          </div>
          <div class="header-actions">
            <div class="search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索数据集..."
                class="search-input"
              />
            </div>
            <button class="btn-create" @click="handleCreateDataset">
              + 新建
            </button>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-area">
        <div class="dataset-grid">

          <!-- 新建卡片 -->
          <div class="ds-card create" @click="handleCreateDataset">
            <div class="create-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h3 class="create-title">新建数据集</h3>
            <p class="create-desc">从连接提取数据并清洗</p>
          </div>

          <!-- 数据集卡片 -->
          <div
            v-for="dataset in filteredDatasets"
            :key="dataset.id"
            :class="['ds-card', { error: dataset.status === 'error' }]"
          >
            <!-- Header -->
            <div class="card-header">
              <span :class="['badge', `badge-${dataset.sourceType}`]">
                {{ dataset.sourceType.toUpperCase() }}
              </span>

              <!-- Error Badge -->
              <div v-if="dataset.status === 'error'" class="error-tag">
                <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ dataset.errorType }}
              </div>

              <!-- Actions -->
              <div v-else class="card-actions">
                <button class="btn-action" @click="handleEdit(dataset.id)" title="编辑">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button class="btn-action" @click="toggleStar(dataset.id)" :title="dataset.starred ? '取消关注' : '特别关注'">
                  <svg width="14" height="14" :fill="dataset.starred ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <h3 class="card-title">{{ dataset.name }}</h3>
            <p class="card-desc">{{ dataset.description }}</p>

            <!-- Footer -->
            <div class="card-footer">
              <div class="footer-left">
                <span :class="['status-badge', dataset.updateStrategy]">
                  <span class="status-dot"></span>
                  {{ getStrategyText(dataset.updateStrategy) }}
                </span>
              </div>

              <div class="footer-right">
                <span class="stat-text">{{ dataset.rowCount }} Rows</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 数据源类型选择对话框 -->
    <el-dialog
      v-model="sourceTypeDialogVisible"
      title="选择数据源类型"
      width="700px"
      :show-close="true"
    >
      <div class="source-type-description">
        <p>请根据您的业务需求选择最合适的数据接入方式</p>
      </div>
      <div class="source-type-grid">
        <div class="source-type-card" @click="selectSourceType('sql')">
          <div class="source-icon sql-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.58 3 4 4.79 4 7V17C4 19.21 7.59 21 12 21S20 19.21 20 17V7C20 4.79 16.42 3 12 3M18 17C18 17.5 15.87 19 12 19S6 17.5 6 17V14.77C7.61 15.55 9.72 16 12 16S16.39 15.55 18 14.77V17M18 12.45C16.7 13.4 14.42 14 12 14C9.58 14 7.3 13.4 6 12.45V9.64C7.47 10.47 9.61 11 12 11C14.39 11 16.53 10.47 18 9.64V12.45M12 9C8.13 9 6 7.5 6 7S8.13 5 12 5C15.87 5 18 6.5 18 7S15.87 9 12 9Z"/>
            </svg>
          </div>
          <div class="source-info">
            <h4>SQL 数据库</h4>
            <p>支持 MySQL, PostgreSQL, Oracle 等主流数据库</p>
          </div>
        </div>

        <div class="source-type-card" @click="selectSourceType('api')">
          <div class="source-icon api-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
            </svg>
          </div>
          <div class="source-info">
            <h4>REST API</h4>
            <p>通过 HTTP 协议获取实时接口数据</p>
          </div>
        </div>

        <div class="source-type-card" @click="selectSourceType('excel')">
          <div class="source-icon excel-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12.9,14.5L15.8,19H14L12,15.6L10,19H8.2L11.1,14.5L8.2,10H10L12,13.4L14,10H15.8L12.9,14.5Z"/>
            </svg>
          </div>
          <div class="source-info">
            <h4>Excel/CSV</h4>
            <p>本地上传离线报表或表格数据</p>
          </div>
        </div>

        <div class="source-type-card" @click="selectSourceType('json')">
          <div class="source-icon json-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z"/>
            </svg>
          </div>
          <div class="source-info">
            <h4>JSON 文件</h4>
            <p>接入结构化配置文件或静态 Mock 数据</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="sourceTypeDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 新建/编辑数据集对话框 -->
    <el-dialog
      v-model="datasetDialogVisible"
      :title="datasetFormMode === 'create' ? '新建数据集' : '编辑数据集'"
      width="600px"
    >
      <el-form :model="datasetForm" label-width="100px">
        <el-form-item label="数据集名称" required>
          <el-input v-model="datasetForm.name" placeholder="请输入数据集名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="datasetForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述信息"
          />
        </el-form-item>
        <el-form-item label="数据类型" required v-if="datasetFormMode === 'edit'">
          <el-select v-model="datasetForm.type" placeholder="请选择数据类型" style="width: 100%" disabled>
            <el-option label="SQL" value="sql" />
            <el-option label="Excel/CSV" value="excel" />
            <el-option label="API" value="api" />
            <el-option label="JSON" value="json" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型" required v-else>
          <el-tag :type="getTypeTagType(datasetForm.type)" size="large">
            {{ getTypeLabel(datasetForm.type) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="数据来源" v-if="datasetForm.type === 'sql'">
          <el-select v-model="datasetForm.connectionId" placeholder="请选择数据连接" style="width: 100%">
            <el-option
              v-for="conn in connections"
              :key="conn.id"
              :label="`${conn.name} (${conn.type?.toUpperCase() || ''})`"
              :value="conn.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SQL 查询" v-if="datasetForm.type === 'sql'">
          <el-input
            v-model="datasetForm.sqlQuery"
            type="textarea"
            :rows="5"
            placeholder="SELECT * FROM table_name"
          />
        </el-form-item>
        <el-form-item label="文件上传" v-if="datasetForm.type === 'excel'">
          <el-upload
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
          </el-upload>
          <el-progress
            v-if="uploadProgress > 0 && uploadProgress < 100"
            :percentage="uploadProgress"
            style="margin-top: 10px"
          />
        </el-form-item>
        <el-form-item label="API 地址" v-if="datasetForm.type === 'api'">
          <el-input v-model="datasetForm.apiUrl" placeholder="https://api.example.com/data" />
        </el-form-item>
        <el-form-item label="JSON 内容" v-if="datasetForm.type === 'json'">
          <el-input
            v-model="datasetForm.jsonContent"
            type="textarea"
            :rows="8"
            placeholder='{"key": "value", "data": [...]}'
          />
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="datasetForm.folder" placeholder="请选择分组" style="width: 100%">
            <el-option label="销售大屏项目" value="sales" />
            <el-option label="财务月报" value="finance" />
            <el-option label="未分类" value="uncategorized" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="datasetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDataset" :loading="saving">
            {{ saving ? '保存中...' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getDatasets,
  createDataset,
  updateDataset,
  uploadExcel
} from '@/api/dataset'
import { getConnections } from '@/api/dataset'
import { validateSQL, isReadOnlySQL } from '@/utils/sqlValidator'

const activeFolder = ref('all')
const searchQuery = ref('')

// 对话框状态
const sourceTypeDialogVisible = ref(false)
const datasetDialogVisible = ref(false)
const datasetFormMode = ref('create') // 'create' or 'edit'
const saving = ref(false)

// 表单数据
const datasetForm = ref({
  id: null,
  name: '',
  description: '',
  type: '',
  connectionId: null,
  sqlQuery: '',
  apiUrl: '',
  jsonContent: '',
  folder: 'uncategorized',
  status: 'running',
  rowCount: 0
})

// 文件上传
const uploadFileList = ref([])
const uploadProgress = ref(0)

// 连接列表
const connections = ref([])

// 自定义分组
const customFolders = ref([
  { id: 'sales', name: '销售大屏项目', color: '#3b82f6', count: 8 },
  { id: 'finance', name: '财务月报', color: '#8b5cf6', count: 3 },
  { id: 'uncategorized', name: '未分类', color: '#6b7280', count: 6 }
])

// Mock 数据集列表
const datasets = ref([
  {
    id: 1,
    name: '华东区_销售大屏汇总',
    description: '聚合了订单表和用户表，按季度统计 GMV，已过滤测试数据。',
    sourceType: 'sql',
    sourceName: '交易主库 (MySQL)',
    status: 'running',
    updateStrategy: 'realtime',
    rowCount: '2,845',
    dataSize: '125 KB',
    folder: 'sales',
    starred: true,
    lastUsed: Date.now() - 1000 * 60 * 30
  },
  {
    id: 2,
    name: 'Q1_门店物料清单',
    description: '静态数据导入，包含各门店的桌椅、耗材库存明细。',
    sourceType: 'excel',
    sourceName: '2025_物料表.xlsx',
    status: 'static',
    updateStrategy: 'static',
    rowCount: '1,200',
    dataSize: '86 KB',
    folder: 'sales',
    starred: false,
    lastUsed: Date.now() - 1000 * 60 * 60 * 2
  },
  {
    id: 3,
    name: '财务_实时流水',
    description: '源表字段 `amount` 类型已变更为 String，导致聚合计算失败。',
    sourceType: 'sql',
    sourceName: 'Oracle_财务库',
    status: 'error',
    errorType: 'Schema Mismatch',
    updateStrategy: 'realtime',
    rowCount: '-',
    dataSize: '-',
    folder: 'finance',
    starred: false,
    lastUsed: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 4,
    name: '用户行为分析数据集',
    description: '整合了埋点日志、用户画像、会话时长等多维度数据。',
    sourceType: 'sql',
    sourceName: 'ClickHouse_日志库',
    status: 'running',
    updateStrategy: 'cached',
    rowCount: '15,234',
    dataSize: '2.3 MB',
    folder: 'sales',
    starred: true,
    lastUsed: Date.now() - 1000 * 60 * 10
  },
  {
    id: 5,
    name: '供应商评分表_2025',
    description: '年度供应商绩效考核评分，来自 Excel 导入。',
    sourceType: 'excel',
    sourceName: '供应商评分_final.xlsx',
    status: 'error',
    errorType: 'File Not Found',
    updateStrategy: 'static',
    rowCount: '-',
    dataSize: '-',
    folder: 'uncategorized',
    starred: false,
    lastUsed: Date.now() - 1000 * 60 * 60 * 48
  },
  {
    id: 6,
    name: '季度业绩报表',
    description: '按部门汇总的季度业绩数据。',
    sourceType: 'sql',
    sourceName: '业绩数据库',
    status: 'running',
    updateStrategy: 'cached',
    rowCount: '856',
    dataSize: '45 KB',
    folder: 'finance',
    starred: false,
    lastUsed: Date.now() - 1000 * 60 * 60 * 5
  }
])

// 计算属性
const filteredDatasets = computed(() => {
  let filtered = datasets.value

  // 按文件夹筛选
  if (activeFolder.value === 'recent') {
    const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7
    filtered = filtered.filter(d => d.lastUsed > oneWeekAgo)
    filtered.sort((a, b) => b.lastUsed - a.lastUsed)
  } else if (activeFolder.value === 'starred') {
    filtered = filtered.filter(d => d.starred)
  } else if (activeFolder.value !== 'all') {
    filtered = filtered.filter(d => d.folder === activeFolder.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getTotalCount = () => datasets.value.length
const getRecentCount = () => {
  const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7
  return datasets.value.filter(d => d.lastUsed > oneWeekAgo).length
}
const getStarredCount = () => datasets.value.filter(d => d.starred).length
const getFolderCount = (folderId) => {
  return datasets.value.filter(d => d.folder === folderId).length
}

const getCurrentFolderName = () => {
  if (activeFolder.value === 'all') return '全部数据集'
  if (activeFolder.value === 'recent') return '最近使用'
  if (activeFolder.value === 'starred') return '特别关注'
  const folder = customFolders.value.find(f => f.id === activeFolder.value)
  return folder ? folder.name : '未知分类'
}

const getCurrentFolderDesc = () => {
  if (activeFolder.value === 'all') return '管理所有业务数据模型。'
  if (activeFolder.value === 'recent') return '最近7天内使用过的数据集。'
  if (activeFolder.value === 'starred') return '您标记为特别关注的数据集。'
  return '该分组下的数据集列表。'
}

// 初始化加载
onMounted(() => {
  loadConnections()
  loadDatasets()
})

// 加载连接列表
const loadConnections = async () => {
  try {
    const response = await getConnections()
    if (response.code === 200) {
      connections.value = response.data || []
    }
  } catch (error) {
    console.error('加载连接列表失败:', error)
  }
}

// 加载数据集列表
const loadDatasets = async () => {
  try {
    const response = await getDatasets()
    if (response.code === 200 && response.data) {
      // 将API数据映射到当前格式
      datasets.value = response.data.map(item => ({
        ...item,
        sourceType: item.type || 'sql',
        updateStrategy: 'realtime',
        starred: false,
        lastUsed: Date.now()
      }))
    }
  } catch (error) {
    console.error('加载数据集失败:', error)
    // 保留mock数据
  }
}

// 重置表单
const resetDatasetForm = () => {
  datasetForm.value = {
    id: null,
    name: '',
    description: '',
    type: '',
    connectionId: null,
    sqlQuery: '',
    apiUrl: '',
    jsonContent: '',
    folder: 'uncategorized',
    status: 'running',
    rowCount: 0
  }
  uploadFileList.value = []
  uploadProgress.value = 0
}

// 文件变更处理
const handleFileChange = (file, fileList) => {
  uploadFileList.value = fileList
}

// 文件移除处理
const handleFileRemove = (file, fileList) => {
  uploadFileList.value = fileList
}

// 方法
const handleCreateDataset = () => {
  datasetFormMode.value = 'create'
  resetDatasetForm()
  sourceTypeDialogVisible.value = true
}

// 选择数据源类型
const selectSourceType = (type) => {
  datasetForm.value.type = type
  sourceTypeDialogVisible.value = false
  datasetDialogVisible.value = true
}

// 获取类型标签类型
const getTypeTagType = (type) => {
  const map = {
    sql: 'primary',
    api: 'warning',
    excel: 'success',
    json: ''
  }
  return map[type] || ''
}

// 获取类型标签文字
const getTypeLabel = (type) => {
  const map = {
    sql: 'SQL 数据库',
    api: 'REST API',
    excel: 'Excel/CSV',
    json: 'JSON 文件'
  }
  return map[type] || type
}

const handleEdit = (id) => {
  const dataset = datasets.value.find(d => d.id === id)
  if (dataset) {
    datasetFormMode.value = 'edit'
    datasetForm.value = {
      id: dataset.id,
      name: dataset.name,
      description: dataset.description,
      type: dataset.sourceType,
      connectionId: null,
      sqlQuery: '',
      apiUrl: '',
      jsonContent: '',
      folder: dataset.folder || 'uncategorized',
      status: dataset.status,
      rowCount: parseInt(dataset.rowCount) || 0
    }
    datasetDialogVisible.value = true
  }
}

// 保存数据集
const saveDataset = async () => {
  // 表单验证
  if (!datasetForm.value.name) {
    ElMessage.warning('请输入数据集名称')
    return
  }
  if (!datasetForm.value.type) {
    ElMessage.warning('请选择数据类型')
    return
  }
  if (datasetForm.value.type === 'sql' && !datasetForm.value.connectionId) {
    ElMessage.warning('请选择数据连接')
    return
  }

  // SQL查询验证
  if (datasetForm.value.type === 'sql' && datasetForm.value.sqlQuery) {
    const validation = validateSQL(datasetForm.value.sqlQuery)
    if (!validation.valid) {
      ElMessage.error(`SQL验证失败: ${validation.errors.join(', ')}`)
      return
    }
    if (!isReadOnlySQL(datasetForm.value.sqlQuery)) {
      try {
        await ElMessageBox.confirm(
          '检测到非只读SQL语句，继续保存可能会修改数据库。是否继续？',
          '警告',
          { type: 'warning' }
        )
      } catch {
        return
      }
    }
  }

  saving.value = true

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
      ElMessage.error('文件上传失败')
      saving.value = false
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
      ElMessage.success(datasetFormMode.value === 'create' ? '数据集创建成功' : '数据集更新成功')
      datasetDialogVisible.value = false
      resetDatasetForm()
      loadDatasets() // 重新加载列表
    } else {
      ElMessage.error(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存数据集失败:', error)
    // Fallback: 本地保存（用于演示）
    if (datasetFormMode.value === 'create') {
      const newDataset = {
        id: Date.now(),
        name: datasetForm.value.name,
        description: datasetForm.value.description,
        sourceType: datasetForm.value.type,
        sourceName: datasetForm.value.type === 'sql' ? '数据连接' : '本地文件',
        status: 'running',
        updateStrategy: 'realtime',
        rowCount: Math.floor(Math.random() * 3000).toString(),
        dataSize: '125 KB',
        folder: datasetForm.value.folder,
        starred: false,
        lastUsed: Date.now()
      }
      datasets.value.unshift(newDataset)
      ElMessage.success('数据集创建成功（Mock）')
    } else {
      const index = datasets.value.findIndex(d => d.id === datasetForm.value.id)
      if (index !== -1) {
        datasets.value[index] = {
          ...datasets.value[index],
          name: datasetForm.value.name,
          description: datasetForm.value.description,
          sourceType: datasetForm.value.type,
          folder: datasetForm.value.folder
        }
        ElMessage.success('数据集更新成功（Mock）')
      }
    }
    datasetDialogVisible.value = false
    resetDatasetForm()
  } finally {
    saving.value = false
  }
}

const handleAddFolder = () => {
  ElMessage.info('新建分组功能开发中...')
}

const toggleStar = (id) => {
  const dataset = datasets.value.find(d => d.id === id)
  if (dataset) {
    dataset.starred = !dataset.starred
    ElMessage.success(dataset.starred ? '已添加到特别关注' : '已取消关注')
  }
}

const getStrategyText = (strategy) => {
  const strategyMap = {
    realtime: '实时',
    cached: '缓存',
    static: '静态'
  }
  return strategyMap[strategy] || strategy
}
</script>

<style scoped>
.dataset-management {
  display: flex;
  height: 100vh;
  background: #0b0c0e;
  color: #e2e8f0;
}

/* 分类侧边栏 */
.folder-sidebar {
  width: 240px;
  background: #15181e;
  border-right: 1px solid #2a2e35;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.folder-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #2a2e35;
  font-weight: 600;
  font-size: 13px;
}

.btn-add-folder {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-add-folder:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.folder-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.folder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 13px;
  border-left: 2px solid transparent;
  transition: all 0.2s;
}

.folder-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
}

.folder-item.active {
  background: rgba(245, 158, 11, 0.1);
  color: #fff;
  border-left-color: #f59e0b;
}

.folder-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-count {
  font-size: 11px;
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 10px;
}

.folder-section-header {
  padding: 12px 20px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.btn-add-group {
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
}

.folder-section-header:hover .btn-add-group {
  opacity: 1;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-header {
  padding: 24px 32px;
  border-bottom: 1px solid #2a2e35;
  background: #101216;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px 0;
}

.page-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-box {
  position: relative;
}

.search-box svg {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.search-input {
  background: #181b21;
  border: 1px solid #2a2e35;
  border-radius: 6px;
  padding: 6px 12px 6px 32px;
  font-size: 13px;
  color: #fff;
  outline: none;
  transition: border-color 0.2s;
  width: 200px;
}

.search-input:focus {
  border-color: #f59e0b;
}

.search-input::placeholder {
  color: #64748b;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--el-color-primary);
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-create:hover {
  background: var(--el-color-primary-light-3);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: transparent;
}

.content-area::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.dataset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 卡片样式 */
.ds-card {
  background: #181b21;
  border: 1px solid #2a2e35;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 160px;
  transition: all 0.2s;
  position: relative;
}

.ds-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  background: #22262e;
  border-color: #444;
}

/* Create Card */
.ds-card.create {
  border: 1px dashed #444;
  background: transparent;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.ds-card.create:hover {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.ds-card.create:hover .create-icon {
  color: #f59e0b;
  transform: scale(1.1);
}

.create-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #788595;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.create-title {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.create-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

/* Error Card */
.ds-card.error {
  border-color: rgba(239, 68, 68, 0.4);
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, #181b21 40%);
}

.ds-card.error:hover {
  border-color: #ef4444;
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.15);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
}

/* Badges */
.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

.badge-sql {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.badge-excel {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.error-tag {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Card Actions */
.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.ds-card:hover .card-actions {
  opacity: 1;
}

.btn-action {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #334155;
  color: #fff;
}

/* Card Body */
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 33px;
}

/* Card Footer */
.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.status-badge.realtime {
  color: #10b981;
}

.status-badge.cached {
  color: #f59e0b;
}

.status-badge.static {
  color: #9ca3af;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.realtime .status-dot {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.stat-text {
  color: #5c6b7f;
}

/* ========== 数据源类型选择对话框样式 ========== */
.source-type-description {
  text-align: center;
  margin-bottom: 30px;
  color: #9ca3af;
  font-size: 14px;
}

.source-type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.source-type-card {
  border: 1px solid #2d2e33;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.2);
}

.source-type-card:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.source-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  flex-shrink: 0;
}

.sql-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.api-icon {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.excel-icon {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.json-icon {
  background: rgba(163, 112, 255, 0.1);
  color: #a370ff;
}

.source-info h4 {
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.source-info p {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0;
}
</style>
