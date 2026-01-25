<template>
  <div class="page-container recycle-bin">
    <PageHeader
      title="回收站"
      description="所有放入回收站的项目将在 30 天后自动永久删除。"
      :actions="[
        { text: '清空回收站', icon: 'Delete', type: 'danger', handler: () => openDeleteModal(true) }
      ]"
    />

    <div class="content-body">
      <!-- 筛选标签 -->
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="filter-tab"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
          <span class="tab-count">{{ getTabCount(tab.id) }}</span>
        </button>
      </div>

      <!-- 列表工具栏 -->
      <div class="toolbar">
        <div style="font-size:14px; color:var(--el-text-color-secondary)">
          {{ currentTabLabel }} ({{ filteredItems.length }})
        </div>
        <div style="display:flex; gap:12px">
          <button
            v-if="selectedRowKeys.length > 0"
            class="btn"
            @click="batchRestore"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            批量还原 ({{ selectedRowKeys.length }})
          </button>
          <button
            v-if="selectedRowKeys.length > 0"
            class="btn btn-danger"
            @click="openDeleteModal(false)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            彻底删除
          </button>
        </div>
      </div>

      <!-- 回收站列表 -->
      <table class="data-table">
        <thead>
          <tr>
            <th width="5%">
              <input
                type="checkbox"
                class="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              >
            </th>
            <th width="35%">名称 / 原位置</th>
            <th width="15%">删除人</th>
            <th width="20%">删除时间</th>
            <th width="10%">剩余天数</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody v-if="filteredItems.length > 0">
          <tr v-for="item in filteredItems" :key="item.id">
            <td>
              <input
                type="checkbox"
                class="checkbox"
                :checked="selectedRowKeys.includes(item.id)"
                @change="toggleSelect(item.id)"
              >
            </td>
            <td>
              <div class="item-cell">
                <div class="item-icon" :class="`icon-${item.type}`">
                  <svg v-if="item.type === 'project'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <svg v-else-if="item.type === 'datasource'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                  <svg v-else-if="item.type === 'media'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                  </svg>
                </div>
                <div class="item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-location">{{ item.location }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="user-info">
                <div class="user-name">{{ item.deletedBy }}</div>
                <div class="user-id">{{ item.deletedById }}</div>
              </div>
            </td>
            <td>{{ item.deletedAt }}</td>
            <td>
              <span class="days-badge" :class="{ 'days-warning': item.daysLeft <= 3 }">
                {{ item.daysLeft }} 天
              </span>
            </td>
            <td>
              <span class="action-link" style="color:var(--el-color-success)" @click="restoreItem(item)">还原</span>
              <span class="action-link danger" @click="handleDeleteSingle(item)">删除</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="empty-cell">
              <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="color: #9ca3af; margin-bottom: 12px;">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                <div class="empty-text">暂无数据</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Delete/Empty Confirmation -->
    <CommonModal
      v-model:visible="showDeleteModal"
      :title="isEmptying ? '⚠️ 清空回收站' : '⚠️ 彻底删除'"
      width="480px"
      :show-footer="true"
      @close="closeDeleteModal"
    >
      <div class="warning-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
        <div>
          <strong>警告：这是一个破坏性操作！</strong><br>
          此操作将无法撤销。{{ isEmptying ? '回收站中所有项目' : '选中的项目' }}将被永久清除，无法找回。
        </div>
      </div>

      <template #footer>
        <button class="btn" @click="closeDeleteModal">取消</button>
        <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
      </template>
    </CommonModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import CommonModal from '@/components/CommonModal.vue'
import {
  getRecycleList,
  getRecycleStats,
  restoreItem as restoreItemApi,
  deleteItem as deleteItemApi,
  emptyRecycleBin as emptyRecycleBinApi
} from '@/api/recycle'

// 标签页配置
const tabs = [
  { id: 'project', label: '大屏项目' },
  { id: 'datasource', label: '数据源' },
  { id: 'media', label: '媒体资源' },
  { id: 'component', label: '组件包' }
]

// 状态
const currentTab = ref('project')
const recycleItems = ref([])
const stats = ref({})
const selectedRowKeys = ref([])
const showDeleteModal = ref(false)
const isEmptying = ref(false)

// 计算属性
const currentTabLabel = computed(() => {
  const tab = tabs.find(t => t.id === currentTab.value)
  return tab ? tab.label : ''
})

const filteredItems = computed(() => {
  return recycleItems.value.filter(item => item.type === currentTab.value)
})

const isAllSelected = computed(() => {
  return filteredItems.value.length > 0 &&
         filteredItems.value.every(item => selectedRowKeys.value.includes(item.id))
})

// 获取标签数量
const getTabCount = (tabId) => {
  return stats.value[tabId] || 0
}

// 加载数据
const loadData = async () => {
  try {
    const [items, statistics] = await Promise.all([
      getRecycleList(),
      getRecycleStats()
    ])
    recycleItems.value = items
    stats.value = statistics
  } catch (error) {
    console.error('加载回收站数据失败:', error)
    ElMessage.error('加载回收站数据失败')
  }
}

// 选择操作
const toggleSelect = (id) => {
  const index = selectedRowKeys.value.indexOf(id)
  if (index > -1) {
    selectedRowKeys.value.splice(index, 1)
  } else {
    selectedRowKeys.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRowKeys.value = []
  } else {
    selectedRowKeys.value = filteredItems.value.map(item => item.id)
  }
}

// 还原操作
const restoreItem = async (item) => {
  try {
    await restoreItemApi(item.id)
    ElMessage.success(`已还原 "${item.name}"`)
    await loadData()
    selectedRowKeys.value = []
  } catch (error) {
    console.error('还原失败:', error)
    ElMessage.error('还原失败')
  }
}

const batchRestore = async () => {
  try {
    await Promise.all(selectedRowKeys.value.map(id => restoreItemApi(id)))
    ElMessage.success(`已还原 ${selectedRowKeys.value.length} 项`)
    await loadData()
    selectedRowKeys.value = []
  } catch (error) {
    console.error('批量还原失败:', error)
    ElMessage.error('批量还原失败')
  }
}

// 删除操作
const openDeleteModal = (empty) => {
  isEmptying.value = empty
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const handleDeleteSingle = (item) => {
  selectedRowKeys.value = [item.id]
  openDeleteModal(false)
}

const confirmDelete = async () => {
  try {
    if (isEmptying.value) {
      await emptyRecycleBinApi()
      ElMessage.success('回收站已清空')
    } else {
      await Promise.all(selectedRowKeys.value.map(id => deleteItemApi(id)))
      ElMessage.success(`已删除 ${selectedRowKeys.value.length} 项`)
    }
    await loadData()
    selectedRowKeys.value = []
    closeDeleteModal()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.recycle-bin {
  padding: 24px;
}

.content-body {
  margin-top: 20px;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-tab {
  padding: 8px 16px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.filter-tab:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.filter-tab.active {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  background: var(--el-fill-color);
  border-color: var(--el-border-color-hover);
}

.btn-danger {
  color: var(--el-color-danger);
  border-color: var(--el-color-danger);
}

.btn-danger:hover {
  background: var(--el-color-danger);
  color: #fff;
}

/* Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

.data-table thead {
  background: rgba(59, 130, 246, 0.1);
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  border-bottom: 1px solid var(--el-border-color);
}

.data-table tbody tr {
  border-bottom: 1px solid var(--el-border-color);
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: var(--el-fill-color-light);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--el-text-color-primary);
}

/* Checkbox */
.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Item Cell */
.item-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon.icon-project {
  background: rgba(59, 130, 246, 0.1);
  color: var(--el-color-primary);
}

.item-icon.icon-datasource {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.item-icon.icon-media {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.item-icon.icon-component {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.item-location {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* User Info */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-id {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

/* Days Badge */
.days-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.days-badge.days-warning {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}

/* Action Links */
.action-link {
  color: var(--el-color-primary);
  cursor: pointer;
  font-size: 13px;
  margin-right: 16px;
  transition: opacity 0.2s;
}

.action-link:hover {
  opacity: 0.8;
}

.action-link.danger {
  color: var(--el-color-danger);
}

/* Empty Cell */
.empty-cell {
  padding: 0 !important;
  border: none !important;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--el-text-color-secondary);
}

.empty-text {
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}

/* Warning Box */
.warning-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(245, 108, 108, 0.1);
  border: 1px solid rgba(245, 108, 108, 0.3);
  border-radius: 8px;
  color: var(--el-color-danger);
  margin-bottom: 16px;
}

.warning-box strong {
  display: block;
  margin-bottom: 8px;
}
</style>
