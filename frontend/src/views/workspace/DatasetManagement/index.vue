<template>
  <div class="dataset-management">
    <!-- Header -->
    <PageHeader
      title="数据资源管理"
      description="管理和配置数据集资源"
      :actions="[
        { text: '导入Excel', icon: 'Download', handler: showExcelImportDialog },
        { text: '新建数据集', icon: 'Plus', type: 'primary', handler: handleCreateDataset }
      ]"
    />

    <div class="content-body">
      <!-- Left: Organization Tree -->
      <aside class="org-tree-panel">
        <div class="tree-header">
          <el-input
            v-model="filterText"
            placeholder="搜索组织节点..."
            prefix-icon="Search"
            class="tree-search"
          />
        </div>
        <div class="tree-content">
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            highlight-current
            node-key="id"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <el-icon class="node-icon">
                  <component :is="getNodeIcon(data)" />
                </el-icon>
                <span class="node-name">{{ node.label }}</span>
                <span v-if="data.datasetCount > 0" class="node-count">
                  {{ data.datasetCount }}
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </aside>

      <!-- Right: Dataset Panel -->
      <aside class="dataset-panel">
        <div class="panel-toolbar">
          <div class="breadcrumb">
            <template v-if="breadcrumbs.length > 0">
              <template v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
                <span class="crumb-item">{{ crumb.label }}</span>
                <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
              </template>
            </template>
            <span v-else class="crumb-item">请选择组织节点</span>
            <span class="crumb-meta" v-if="currentNode">
              / 数据集 ({{ currentDatasets.length }})
            </span>
          </div>
          <div class="toolbar-actions">
            <el-input
              v-model="searchDataset"
              placeholder="搜索数据集..."
              prefix-icon="Search"
              style="width: 200px"
            />
          </div>
        </div>

        <div class="table-container" v-if="currentDatasets.length > 0">
          <el-table
            :data="filteredDatasets"
            style="width: 100%"
            :header-cell-style="{ background: 'rgba(0,0,0,0.2)', color: '#9ca3af', borderBottom: '1px solid #2d2e33' }"
            :cell-style="{ background: 'transparent', color: '#fff', borderBottom: '1px solid #2d2e33' }"
          >
            <el-table-column label="数据集名称" width="300">
              <template #default="scope">
                <div class="dataset-cell">
                  <div class="dataset-name">{{ scope.row.name }}</div>
                  <div class="dataset-key">key: {{ scope.row.key }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template #default="scope">
                <span :class="['type-badge', `type-${scope.row.type}`]">
                  {{ getTypeLabel(scope.row.type) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="数据源" width="200">
              <template #default="scope">
                <span class="source-text">{{ scope.row.source }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
              <template #default="scope">
                <span class="status-cell">
                  <span :class="['status-dot', `status-${scope.row.status}`]"></span>
                  {{ scope.row.statusText }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" width="150">
              <template #default="scope">
                <span class="time-text">{{ scope.row.updatedAt }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handlePreview(scope.row)">
                  预览
                </el-button>
                <el-button link type="primary" size="small" @click="editDataset(scope.row)">
                  编辑
                </el-button>
                <el-button link type="primary" size="small" @click="viewDataset(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <el-icon class="empty-icon" :size="64"><FolderOpened /></el-icon>
          <div class="empty-text">
            {{ currentNode ? '当前节点暂无数据集' : '请从左侧选择组织节点' }}
          </div>
          <el-button v-if="currentNode" type="primary" size="small" @click="handleCreateDataset">
            <el-icon><Plus /></el-icon>
            新建数据集
          </el-button>
        </div>
      </aside>
    </div>

    <!-- Excel导入对话框 -->
    <el-dialog
      v-model="excelImportDialogVisible"
      title="导入Excel数据"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="excelUploadRef"
        class="upload-demo"
        drag
        :auto-upload="false"
        :on-change="handleExcelChange"
        :file-list="excelFileList"
        accept=".xlsx,.xls"
        :limit="1"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          拖拽Excel文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 .xlsx 和 .xls 格式，文件大小不超过 10MB
          </div>
        </template>
      </el-upload>

      <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
        <el-progress :percentage="uploadProgress" />
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeExcelImportDialog">取消</el-button>
          <el-button
            type="primary"
            @click="handleExcelImportSubmit"
            :loading="excelImporting"
            :disabled="!excelFileList.length"
          >
            {{ excelImporting ? '导入中...' : '开始导入' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 数据预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :title="`数据预览 - ${previewDatasetName}`"
      width="80%"
      :close-on-click-modal="false"
    >
      <div v-loading="previewLoading" class="preview-container">
        <div v-if="previewData.length > 0" class="preview-table-wrapper">
          <el-table
            :data="previewData"
            style="width: 100%"
            max-height="500"
            :header-cell-style="{ background: 'rgba(0,0,0,0.2)', color: '#9ca3af' }"
          >
            <el-table-column
              v-for="(col, index) in previewColumns"
              :key="index"
              :prop="col"
              :label="col"
              min-width="120"
            />
          </el-table>
          <div class="preview-footer">
            <span>共 {{ previewTotal }} 条数据，当前显示前 {{ previewData.length }} 条</span>
          </div>
        </div>
        <div v-else class="preview-empty">
          <el-empty description="暂无数据" />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Plus, Download,
  OfficeBuilding, Folder, FolderOpened,
  Monitor, TrendCharts, DataAnalysis, UploadFilled
} from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import { getDatasets, deleteDataset as deleteDatasetApi, getConnections, previewDataset, uploadExcel, validateSQL, testApiDataSource } from '@/api/dataset'

// ==================== 数据加载 ====================
const loading = ref(false)
const allDatasets = ref([])
const connections = ref([])

// 加载数据集列表
const loadDatasets = async () => {
  try {
    loading.value = true
    const data = await getDatasets()
    allDatasets.value = data || []
  } catch (error) {
    console.error('加载数据集失败:', error)
    ElMessage.error('加载数据集列表失败')
  } finally {
    loading.value = false
  }
}

// 加载连接列表
const loadConnections = async () => {
  try {
    const data = await getConnections()
    connections.value = data || []
  } catch (error) {
    console.error('加载连接列表失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadDatasets()
  loadConnections()
})

// Excel导入相关状态
const excelImportDialogVisible = ref(false)
const excelFileList = ref([])
const excelUploadRef = ref(null)
const excelImporting = ref(false)
const uploadProgress = ref(0)

// 数据预览相关状态
const previewDialogVisible = ref(false)
const previewLoading = ref(false)
const previewData = ref([])
const previewColumns = ref([])
const previewTotal = ref(0)
const previewDatasetName = ref('')

// 获取连接名称
const getConnectionName = (connectionId) => {
  const conn = connections.value.find(c => c.id === connectionId)
  return conn ? conn.name : `连接 #${connectionId}`
}

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

// ==================== 树形结构 ====================
const filterText = ref('')
const treeRef = ref(null)
const currentNode = ref(null)

const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeData = ref([
  {
    id: 'all',
    label: '全部数据集',
    icon: 'office',
    datasetCount: 0,
  }
])

// 计算数据集总数
watch(allDatasets, (datasets) => {
  treeData.value[0].datasetCount = datasets.length
}, { immediate: true })

// 获取节点图标
const getNodeIcon = (data) => {
  if (data.icon === 'office') return OfficeBuilding
  if (data.icon === 'chart') return Monitor
  return Folder
}

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (data) => {
  currentNode.value = data
}

// 初始选中第一个节点
currentNode.value = treeData.value[0]

// ==================== 面包屑导航 ====================
const breadcrumbs = computed(() => {
  if (!currentNode.value) return []
  return [{ id: currentNode.value.id, label: currentNode.value.label }]
})

// ==================== 数据集列表 ====================
const searchDataset = ref('')

const currentDatasets = computed(() => {
  return allDatasets.value.map(dataset => ({
    id: dataset.id,
    name: dataset.name,
    key: `dataset_${dataset.id}`,
    type: dataset.type,
    source: dataset.config?.connectionId ? getConnectionName(dataset.config.connectionId) : '-',
    status: dataset.status,
    statusText: dataset.status === 'active' ? '正常' : '未激活',
    updatedAt: formatTime(dataset.updatedAt)
  }))
})

const filteredDatasets = computed(() => {
  let result = currentDatasets.value

  if (searchDataset.value) {
    const query = searchDataset.value.toLowerCase()
    result = result.filter(d =>
      d.name.toLowerCase().includes(query) ||
      d.key.toLowerCase().includes(query)
    )
  }

  return result
})

const getTypeLabel = (type) => {
  const labels = {
    sql: 'SQL',
    excel: 'Excel',
    api: 'API'
  }
  return labels[type] || type
}

const handleCreateDataset = () => {
  ElMessage.info('新建数据集功能开发中...')
}

const editDataset = (dataset) => {
  ElMessage.info(`编辑数据集: ${dataset.name}`)
}

const viewDataset = (dataset) => {
  ElMessage.info(`查看数据集: ${dataset.name}`)
}

// 删除数据集
const deleteDataset = async (dataset) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除数据集 "${dataset.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteDatasetApi(dataset.id)
    ElMessage.success('数据集已删除')
    // 重新加载数据集列表
    await loadDatasets()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除数据集失败:', error)
      ElMessage.error('删除数据集失败')
    }
  }
}

// ==================== Excel导入功能 ====================
const showExcelImportDialog = () => {
  excelImportDialogVisible.value = true
}

const closeExcelImportDialog = () => {
  excelImportDialogVisible.value = false
  excelFileList.value = []
  uploadProgress.value = 0
  if (excelUploadRef.value) {
    excelUploadRef.value.clearFiles()
  }
}

const handleExcelChange = (file, fileList) => {
  excelFileList.value = fileList

  if (file.raw) {
    const isExcel = file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.raw.type === 'application/vnd.ms-excel' ||
                    file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    const isLt10M = file.raw.size / 1024 / 1024 < 10

    if (!isExcel) {
      ElMessage.error('只能上传 Excel 文件!')
      excelFileList.value = []
      return
    }
    if (!isLt10M) {
      ElMessage.error('文件大小不能超过 10MB!')
      excelFileList.value = []
      return
    }
  }
}

const handleExcelImportSubmit = async () => {
  if (!excelFileList.value.length) {
    ElMessage.warning('请先选择文件')
    return
  }

  excelImporting.value = true
  uploadProgress.value = 0

  try {
    const file = excelFileList.value[0].raw
    const result = await uploadExcel(file, (progress) => {
      uploadProgress.value = progress
    })

    ElMessage.success(`成功导入数据集: ${result.name}`)
    closeExcelImportDialog()
    await loadDatasets()
  } catch (error) {
    console.error('导入Excel失败:', error)
    ElMessage.error('导入Excel失败')
  } finally {
    excelImporting.value = false
  }
}

// ==================== 数据预览功能 ====================
const handlePreview = async (dataset) => {
  previewDatasetName.value = dataset.name
  previewDialogVisible.value = true
  previewLoading.value = true

  try {
    const result = await previewDataset(dataset.id, { page: 1, pageSize: 100 })

    if (result.data && result.data.length > 0) {
      previewData.value = result.data
      previewColumns.value = Object.keys(result.data[0])
      previewTotal.value = result.total || result.data.length
    } else {
      previewData.value = []
      previewColumns.value = []
      previewTotal.value = 0
    }
  } catch (error) {
    console.error('加载预览数据失败:', error)
    ElMessage.error('加载预览数据失败')
    previewData.value = []
  } finally {
    previewLoading.value = false
  }
}
</script>

<style scoped>
/* =========================================
   Global Variables & Reset
   ========================================= */
.dataset-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  overflow: hidden;
  padding: 24px;
}

/* =========================================
   Content Body
   ========================================= */
.content-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding-top: 20px;
  gap: 24px;
}

/* --- Left: Org Tree Panel --- */
.org-tree-panel {
  width: 300px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.tree-search :deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.tree-search :deep(.el-input__inner) {
  color: var(--el-text-color-primary);
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.tree-content :deep(.el-tree) {
  background: transparent;
  color: var(--el-text-color-secondary);
}

.tree-content :deep(.el-tree-node__content:hover) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

.tree-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 13px;
  width: 100%;
}

.node-icon {
  margin-right: 8px;
  font-size: 14px;
}

.node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-count {
  font-size: 11px;
  background: var(--el-fill-color);
  padding: 1px 6px;
  border-radius: 10px;
  color: var(--el-text-color-secondary);
}

/* --- Right: Dataset Panel --- */
.dataset-panel {
  flex: 1;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.crumb-item {
  color: var(--el-text-color-secondary);
}

.crumb-item:last-of-type {
  color: var(--el-text-color-primary);
}

.separator {
  color: var(--el-text-color-placeholder);
  font-weight: 300;
}

.crumb-meta {
  color: var(--el-text-color-secondary);
  font-weight: 400;
  font-size: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.toolbar-actions :deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-blank);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.toolbar-actions :deep(.el-input__inner) {
  color: var(--el-text-color-primary);
}

/* Table Container */
.table-container {
  flex: 1;
  overflow-y: auto;
}

.table-container :deep(.el-table) {
  background-color: transparent;
  font-size: 13px;
}

.table-container :deep(.el-table th.el-table__cell) {
  background: var(--el-bg-color);
  color: var(--el-text-color-secondary);
  font-weight: 500;
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.table-container :deep(.el-table td.el-table__cell) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: transparent;
  color: var(--el-text-color-primary);
}

.table-container :deep(.el-table tr:hover > td) {
  background: var(--el-fill-color-light) !important;
}

/* Dataset Cell */
.dataset-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dataset-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.dataset-key {
  font-size: 11px;
  color: var(--el-text-color-placeholder);
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

/* Type Badge */
.type-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.type-sql {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.type-badge.type-excel {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.type-badge.type-api {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Source Text */
.source-text {
  font-size: 12px;
  color: #9ca3af;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
}

/* Status Cell */
.status-cell {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}

.status-dot.status-active {
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.status-dot.status-error {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}

/* Time Text */
.time-text {
  font-size: 12px;
  color: #666;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #666;
  padding: 60px 20px;
}

.empty-icon {
  color: #444;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  color: #666;
}

/* Upload Progress */
.upload-progress {
  margin-top: 20px;
}

/* Preview Container */
.preview-container {
  min-height: 300px;
}

.preview-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-footer {
  padding: 12px 16px;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
  text-align: right;
  font-size: 13px;
  color: #9ca3af;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
