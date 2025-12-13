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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const activeFolder = ref('all')
const searchQuery = ref('')

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

// 方法
const handleCreateDataset = () => {
  ElMessage.info('新建数据集功能开发中...')
}

const handleEdit = (id) => {
  ElMessage.info(`编辑数据集 ${id}`)
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
  background: #f59e0b;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.btn-create:hover {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
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
</style>
