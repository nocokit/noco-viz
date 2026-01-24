<template>
  <div class="recycle-bin-page">
    <!-- Header -->
    <header class="page-header">
      <h2>回收站</h2>
      <el-button type="danger" plain @click="openEmptyModal">
        <el-icon><Delete /></el-icon>
        清空回收站
      </el-button>
    </header>

    <!-- Policy Alert -->
    <div class="banner-alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
      <span>系统保留策略：所有放入回收站的项目将在 <strong>30 天</strong> 后自动永久删除。</span>
    </div>

    <div class="content-body">
      <!-- Filter Tabs -->
      <div class="tabs-container">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
          <span class="count-badge">{{ getTabCount(tab.id) }}</span>
        </div>
      </div>

      <!-- List Toolbar -->
      <div class="list-toolbar">
        <div style="font-size:14px; color:var(--text-secondary)">
          {{ currentTab === 'project' ? '大屏项目' : currentTab === 'datasource' ? '数据源' : currentTab === 'media' ? '媒体资源' : '组件包' }}
          <span style="margin-left: 8px">共 {{ filteredItems.length }} 项</span>
        </div>
        <div v-if="selectedIds.length > 0" style="display: flex; gap: 12px">
          <el-button size="small" @click="batchRestore">
            <el-icon><RefreshRight /></el-icon>
            批量还原 ({{ selectedIds.length }})
          </el-button>
          <el-button size="small" type="danger" @click="openDeleteModal">
            <el-icon><Delete /></el-icon>
            彻底删除
          </el-button>
        </div>
      </div>

      <!-- 备份列表 -->
      <div v-if="filteredItems.length > 0">
        <table class="data-table">
          <thead>
            <tr>
              <th width="5%">
                <label class="checkbox-wrapper">
                  <input type="checkbox" :checked="isAllSelected" @click="toggleSelectAll">
                  <span class="checkbox-box"></span>
                </label>
              </th>
              <th width="35%">名称 / 原位置</th>
              <th width="20%">删除人</th>
              <th width="20%">删除时间</th>
              <th width="10%">剩余天数</th>
              <th width="10%">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>
                <label class="checkbox-wrapper">
                  <input type="checkbox" class="row-checkbox" v-model="selectedIds" :value="item.id">
                  <span class="checkbox-box"></span>
                </label>
              </td>
              <td>
                <div class="item-cell">
                  <div class="item-icon" :style="item.iconStyle">
                    <!-- Render SVG icon based on type or just generic -->
                    <svg v-if="item.type === 'project'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                    </svg>
                     <svg v-else-if="item.type === 'datasource'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z"/>
                    </svg>
                     <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                    </svg>
                  </div>
                  <div class="item-text">
                    <div>{{ item.name }}</div>
                    <div>{{ item.location }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="item-text">
                  <div>{{ item.deletedBy }}</div>
                  <div>{{ item.deletedById }}</div>
                </div>
              </td>
              <td style="color:var(--text-secondary)">{{ item.deletedAt }}</td>
              <td>
                <span class="time-badge" :class="{ urgent: item.daysLeft <= 3 }">{{ item.daysLeft }} 天</span>
              </td>
              <td>
                <span class="btn-text" @click="restoreItem(item)">还原</span>
                <span class="btn-text danger" @click="handleDeleteSingle(item)">删除</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state-container">
        <div class="empty-state-content">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: #4b5563; margin-bottom: 24px;">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
          <div class="empty-title">回收站为空</div>
          <div class="empty-desc">暂无已删除的{{ currentTab === 'project' ? '大屏项目' : currentTab === 'datasource' ? '数据源' : currentTab === 'media' ? '媒体资源' : '组件包' }}</div>
        </div>
      </div>
    </div>

    <!-- Modal: Delete/Empty Confirmation -->
    <div class="modal-overlay" :class="{ open: showDeleteModal }" @click.self="closeDeleteModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ isEmptying ? '清空回收站' : '彻底删除' }}</h3>
          <div class="close-btn" @click="closeDeleteModal">✕</div>
        </div>
        <div class="modal-body">
          <div style="text-align: center; padding: 20px 0">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"
              style="color:var(--danger); margin-bottom:16px">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <h3 style="margin-bottom:8px; color: var(--text-main)">{{ isEmptying ? '确定要清空回收站吗？' : '确定要彻底删除吗？' }}</h3>
            <p style="color:var(--text-secondary); font-size:13px; line-height:1.5">
              此操作将无法撤销。<br>{{ isEmptying ? '回收站中所有项目' : '选中的项目' }}将被永久清除，无法找回。
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDeleteModal">取消</button>
          <button class="btn-primary" style="background: var(--danger)" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Delete, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRecycleList,
  getRecycleStats,
  restoreItem as restoreItemApi,
  batchRestore as batchRestoreApi,
  deleteItem as deleteItemApi,
  batchDelete as batchDeleteApi,
  emptyRecycleBin
} from '@/api/recycle'

// --- Tabs Data ---
const tabs = [
  { id: 'project', label: '大屏项目' },
  { id: 'datasource', label: '数据源' },
  { id: 'media', label: '媒体资源' },
  { id: 'component', label: '组件包' }
]
const currentTab = ref('project')

// --- Mock Data ---
const items = ref([])
const stats = ref({
  project: 0,
  datasource: 0,
  media: 0,
  component: 0,
  total: 0
})

// 加载回收站列表
const loadRecycleList = async () => {
  try {
    const list = await getRecycleList(currentTab.value)
    items.value = list
  } catch (error) {
    console.error('加载回收站列表失败:', error)
    ElMessage.error('加载回收站列表失败')
  }
}

// 加载统计信息
const loadStats = async () => {
  try {
    const data = await getRecycleStats()
    stats.value = data
  } catch (error) {
    console.error('加载统计信息失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadRecycleList()
  loadStats()
})

// 监听 tab 切换
watch(currentTab, () => {
  loadRecycleList()
  selectedIds.value = []
})

// --- State ---
const selectedIds = ref([])
const showDeleteModal = ref(false)
const isEmptying = ref(false) // Distinguish between delete selection vs empty all

// --- Computed ---
const filteredItems = computed(() => {
  return items.value.filter(item => item.type === currentTab.value)
})

const isAllSelected = computed(() => {
  return filteredItems.value.length > 0 && selectedIds.value.length === filteredItems.value.length
})

// --- Methods ---
function getTabCount(type) {
  return stats.value[type] || 0
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredItems.value.map(i => i.id)
  }
}

function openDeleteModal() {
  isEmptying.value = false
  showDeleteModal.value = true
}

function openEmptyModal() {
  isEmptying.value = true
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
}

async function confirmDelete() {
  try {
    if (isEmptying.value) {
      // Empty everything
      await emptyRecycleBin(currentTab.value)
      ElMessage.success('回收站已清空')
    } else {
      // Delete selected
      await batchDeleteApi(selectedIds.value)
      ElMessage.success(`已彻底删除 ${selectedIds.value.length} 个项目`)
    }
    selectedIds.value = []
    loadRecycleList()
    loadStats()
    closeDeleteModal()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

async function restoreItem(item) {
  try {
    await restoreItemApi(item.id)
    ElMessage.success('项目已成功还原')
    loadRecycleList()
    loadStats()
  } catch (error) {
    console.error('还原失败:', error)
    ElMessage.error('还原失败')
  }
}

async function batchRestore() {
  try {
    await batchRestoreApi(selectedIds.value)
    ElMessage.success(`已成功还原 ${selectedIds.value.length} 个项目`)
    selectedIds.value = []
    loadRecycleList()
    loadStats()
  } catch (error) {
    console.error('批量还原失败:', error)
    ElMessage.error('批量还原失败')
  }
}

function handleDeleteSingle(item) {
  selectedIds.value = [item.id]
  openDeleteModal()
}
</script>

<style scoped>
/* =========================================
   全局变量
   ========================================= */
.recycle-bin-page {
  --bg-body: #0a0b0d;
  --bg-sidebar: #141519;
  --bg-card: #1c1d21;
  --bg-input: #0f1012;
  --bg-hover: #26272c;

  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;

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
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
}

/* Warning Banner */
.banner-alert {
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  padding: 12px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #fbbf24;
}

/* Content Body */
.content-body {
  padding: 32px;
  flex: 1;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

/* Filter Tabs */
.tabs-container {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.tab-item {
  padding-bottom: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.tab-item:hover {
  color: var(--text-main);
}

.tab-item.active {
  color: var(--text-main);
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary);
}

.count-badge {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
}

/* List Toolbar */
.list-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* Table */
.data-table {
  width: 100%;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  table-layout: fixed;
}

.data-table th {
  text-align: left;
  padding: 12px 20px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  font-weight: 500;
  background: var(--bg-card);
}

.data-table th:first-child {
  border-top-left-radius: 8px;
}

.data-table th:last-child {
  border-top-right-radius: 8px;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--text-main);
  background: var(--bg-card);
  vertical-align: middle;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background: var(--bg-hover);
}

/* Checkbox */
.checkbox-wrapper { display: flex; align-items: center; cursor: pointer; }
.checkbox-wrapper input { display: none; }
.checkbox-box {
  width: 16px; height: 16px; border: 1px solid var(--border); border-radius: 3px;
  display: flex; align-items: center; justify-content: center; background: #000; transition: 0.2s;
}
.checkbox-wrapper input:checked + .checkbox-box {
  background: var(--primary); border-color: var(--primary);
}
.checkbox-wrapper input:checked + .checkbox-box::after {
  content: "✓"; color: #fff; font-size: 12px; font-weight: bold;
}

/* Item Info */
.item-cell { display: flex; align-items: center; gap: 12px; }
.item-icon {
  width: 36px; height: 36px; border-radius: 6px; background: #2a2d35;
  display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
}
.item-text div:first-child { font-weight: 500; margin-bottom: 2px; }
.item-text div:last-child { font-size: 12px; color: var(--text-muted); }

/* Time Left Badge */
.time-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
}

.time-badge.urgent {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Empty State */
.empty-state-container {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.btn-text {
  color: var(--primary);
  cursor: pointer;
  margin-right: 12px;
}

.btn-text:hover {
  text-decoration: underline;
}

.btn-text.danger {
  color: var(--danger);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.modal {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 12px;
  width: 480px;
  transform: scale(0.9);
  transition: transform 0.3s;
}

.modal-overlay.open .modal {
  transform: scale(1);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #303033;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0;
}

.close-btn {
  color: #909399;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition: 0.2s;
  padding: 4px;
}

.close-btn:hover {
  color: #e5e5e5;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #303033;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background-color: #1c1d21;
  border: 1px solid #2d2e33;
  color: #9ca3af;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-cancel:hover {
  border-color: #fff;
  color: #fff;
}

.btn-primary {
  background-color: #3b82f6;
  border: 1px solid #3b82f6;
  color: #fff;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>