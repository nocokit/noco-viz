<template>
  <div class="dataset-management">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h2>数据资源管理</h2>
      </div>
      <div class="header-right">
        <el-button class="header-btn">
          <el-icon><Download /></el-icon>
          导入数据
        </el-button>
        <el-button type="primary" class="header-btn">
          <el-icon><Plus /></el-icon>
          新建数据集
        </el-button>
      </div>
    </header>

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
            <el-button type="primary" icon="Plus" @click="handleCreateDataset">
              新建数据集
            </el-button>
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
            <el-table-column label="操作" width="150">
              <template #default="scope">
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, Plus, Download,
  OfficeBuilding, Folder, FolderOpened,
  Monitor, TrendCharts, DataAnalysis
} from '@element-plus/icons-vue'

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
    id: 'org-1',
    label: '比亚迪集团',
    icon: 'office',
    datasetCount: 0,
    children: [
      {
        id: 'dept-1-1',
        label: '集团总部',
        icon: 'folder',
        datasetCount: 0,
        children: [
          {
            id: 'team-1-1-1',
            label: '总经办',
            icon: 'folder',
            datasetCount: 0,
            children: [
              {
                id: 'project-1-1-1-1',
                label: '董事长驾驶舱',
                icon: 'chart',
                datasetCount: 3,
                datasets: [
                  {
                    id: 'ds-1001',
                    name: '全年_营收总额_KPI',
                    key: 'gmv_total_year',
                    type: 'sql',
                    source: 'MySQL_BYD_Main',
                    status: 'active',
                    statusText: '正常',
                    updatedAt: '2小时前'
                  },
                  {
                    id: 'ds-1002',
                    name: '实时_车辆下线计数',
                    key: 'car_production_realtime',
                    type: 'api',
                    source: 'MES_Interface',
                    status: 'active',
                    statusText: '2s刷新',
                    updatedAt: '实时'
                  },
                  {
                    id: 'ds-1003',
                    name: '大屏_底部滚动公告',
                    key: 'marquee_text',
                    type: 'sql',
                    source: 'MySQL_BYD_Main',
                    status: 'active',
                    statusText: '正常',
                    updatedAt: '1天前'
                  }
                ]
              }
            ]
          },
          {
            id: 'team-1-1-2',
            label: '财务部',
            icon: 'folder',
            datasetCount: 2,
            children: [
              {
                id: 'project-1-1-2-1',
                label: '月度财务报表',
                icon: 'chart',
                datasetCount: 2,
                datasets: [
                  {
                    id: 'ds-1004',
                    name: '收入支出汇总',
                    key: 'finance_summary_month',
                    type: 'sql',
                    source: 'Oracle_Finance',
                    status: 'active',
                    statusText: '正常',
                    updatedAt: '3小时前'
                  },
                  {
                    id: 'ds-1005',
                    name: '成本分析明细',
                    key: 'cost_analysis_detail',
                    type: 'excel',
                    source: 'finance_2024_q4.xlsx',
                    status: 'active',
                    statusText: '正常',
                    updatedAt: '1天前'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'dept-1-2',
        label: '深圳工厂',
        icon: 'folder',
        datasetCount: 1,
        children: [
          {
            id: 'team-1-2-1',
            label: '生产线监控',
            icon: 'chart',
            datasetCount: 1,
            datasets: [
              {
                id: 'ds-2001',
                name: '产线实时状态',
                key: 'production_line_status',
                type: 'api',
                source: 'IoT_Gateway',
                status: 'active',
                statusText: '1s刷新',
                updatedAt: '实时'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'org-2',
    label: '腾讯科技',
    icon: 'office',
    datasetCount: 0,
    children: [
      {
        id: 'dept-2-1',
        label: '数据中心',
        icon: 'folder',
        datasetCount: 0,
        children: [
          {
            id: 'team-2-1-1',
            label: '服务器监控',
            icon: 'chart',
            datasetCount: 0,
            datasets: []
          }
        ]
      }
    ]
  },
  {
    id: 'org-3',
    label: '演示Demo',
    icon: 'office',
    datasetCount: 0,
    children: [
      {
        id: 'project-3-1',
        label: '电商大屏',
        icon: 'chart',
        datasetCount: 0,
        datasets: []
      }
    ]
  }
])

// 计算节点数据集总数
const calculateDatasetCount = (node) => {
  let count = node.datasets?.length || 0
  if (node.children) {
    node.children.forEach(child => {
      count += calculateDatasetCount(child)
    })
  }
  node.datasetCount = count
  return count
}

// 初始化时计算所有节点的数据集数量
treeData.value.forEach(node => calculateDatasetCount(node))

// 获取节点图标
const getNodeIcon = (data) => {
  if (data.icon === 'office') return OfficeBuilding
  if (data.icon === 'chart') return Monitor
  return Folder
}

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (data) => {
  currentNode.value = data
}

// 初始选中第一个有数据集的节点
const findFirstNodeWithDatasets = (nodes) => {
  for (const node of nodes) {
    if (node.datasets && node.datasets.length > 0) {
      return node
    }
    if (node.children) {
      const found = findFirstNodeWithDatasets(node.children)
      if (found) return found
    }
  }
  return null
}

const initialNode = findFirstNodeWithDatasets(treeData.value)
if (initialNode) {
  currentNode.value = initialNode
}

// ==================== 面包屑导航 ====================
const breadcrumbs = computed(() => {
  if (!currentNode.value) return []

  const findPath = (nodes, targetId, currentPath = []) => {
    for (const node of nodes) {
      const newPath = [...currentPath, { id: node.id, label: node.label }]
      if (node.id === targetId) {
        return newPath
      }
      if (node.children) {
        const found = findPath(node.children, targetId, newPath)
        if (found) return found
      }
    }
    return null
  }

  return findPath(treeData.value, currentNode.value.id) || []
})

// ==================== 数据集列表 ====================
const searchDataset = ref('')

const currentDatasets = computed(() => {
  return currentNode.value?.datasets || []
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
  if (!currentNode.value) {
    ElMessage.warning('请先选择组织节点')
    return
  }
  ElMessage.info(`为"${currentNode.value.label}"新建数据集`)
}

const editDataset = (dataset) => {
  ElMessage.info(`编辑数据集: ${dataset.name}`)
}

const viewDataset = (dataset) => {
  ElMessage.info(`查看数据集: ${dataset.name}`)
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
  background-color: #0a0b0d;
  color: #ffffff;
  overflow: hidden;
}

/* =========================================
   Header
   ========================================= */
.page-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid #2d2e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 21, 25, 0.9);
  flex-shrink: 0;
}

.header-left h2 {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* =========================================
   Content Body
   ========================================= */
.content-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 24px;
  gap: 24px;
}

/* --- Left: Org Tree Panel --- */
.org-tree-panel {
  width: 300px;
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid #2d2e33;
}

.tree-search :deep(.el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.tree-search :deep(.el-input__inner) {
  color: #fff;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.tree-content :deep(.el-tree) {
  background: transparent;
  color: #9ca3af;
}

.tree-content :deep(.el-tree-node__content:hover) {
  background-color: #26272c;
  color: #fff;
}

.tree-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
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
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 6px;
  border-radius: 10px;
  color: #9ca3af;
}

/* --- Right: Dataset Panel --- */
.dataset-panel {
  flex: 1;
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid #2d2e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.crumb-item {
  color: #9ca3af;
}

.crumb-item:last-of-type {
  color: #fff;
}

.separator {
  color: #555;
  font-weight: 300;
}

.crumb-meta {
  color: #9ca3af;
  font-weight: 400;
  font-size: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.toolbar-actions :deep(.el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.toolbar-actions :deep(.el-input__inner) {
  color: #fff;
}

/* Table Container */
.table-container {
  flex: 1;
  overflow-y: auto;
}

.table-container :deep(.el-table) {
  background-color: transparent;
  --el-table-border-color: #2d2e33;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(0, 0, 0, 0.2);
  --el-table-row-hover-bg-color: #26272c;
  --el-table-text-color: #fff;
  --el-table-header-text-color: #9ca3af;
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
  color: #fff;
}

.dataset-key {
  font-size: 11px;
  color: #666;
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
</style>
