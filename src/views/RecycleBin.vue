<template>
  <div class="recycle-bin-view">
    <!-- Header -->
    <header class="header">
      <h2>回收站 (Recycle Bin)</h2>
      <button class="btn-danger-outline" @click="openEmptyModal">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
        清空回收站
      </button>
    </header>

    <!-- Policy Alert -->
    <div class="policy-alert">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
      <span>系统保留策略：所有放入回收站的项目将在 <strong>30 天</strong> 后自动永久删除。</span>
    </div>

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

    <div class="content-body">
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
            <td><span style="color:var(--primary); cursor:pointer" @click="restoreItem(item)">还原</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 底部悬浮操作栏 (批量操作) -->
    <div class="floating-bar" :class="{ show: selectedIds.length > 0 }">
      <div class="bar-info">已选择 <span>{{ selectedIds.length }}</span> 项</div>
      <div class="bar-btn" @click="batchRestore">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.35 0-2.52.78-3.1 1.9l2.6 1.6h-7v-7l1.97 3.03C7.57 7.34 9.63 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z" />
        </svg>
        批量还原
      </div>
      <div class="bar-btn" style="color: rgba(255,255,255,0.8)" @click="openDeleteModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
        彻底删除
      </div>
      <div class="bar-btn" style="margin-left:12px; font-size:16px" @click="selectedIds = []">✕</div>
    </div>

    <!-- Modal: Delete/Empty Confirmation -->
    <div class="modal-overlay" :class="{ open: showDeleteModal }">
      <div class="modal">
        <div class="modal-body">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"
            style="color:var(--danger); margin-bottom:16px">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h3 style="margin-bottom:8px">确定要彻底删除吗？</h3>
          <p style="color:var(--text-secondary); font-size:13px; line-height:1.5">
            此操作将无法撤销。<br>选中的项目将被永久清除，无法找回。
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDeleteModal">取消</button>
          <button class="btn-confirm" @click="confirmDelete">确认粉碎</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// --- Tabs Data ---
const tabs = [
  { id: 'project', label: '大屏项目' },
  { id: 'datasource', label: '数据源' },
  { id: 'media', label: '媒体资源' },
  { id: 'component', label: '组件包' }
]
const currentTab = ref('project')

// --- Mock Data ---
const items = ref([
  {
    id: 1,
    name: '旧版-Q3 销售报表',
    location: '/ 销售部 / 季度归档',
    type: 'project',
    deletedBy: 'David Miller',
    deletedById: 'admin',
    deletedAt: '2023-10-25 14:30',
    daysLeft: 29,
    iconStyle: 'background: linear-gradient(135deg, #3b82f6, #06b6d4); color:#fff'
  },
  {
    id: 2,
    name: '测试大屏_v2_副本',
    location: '/ 个人草稿箱',
    type: 'project', // Using 'project' to map to tab but visually different icon logic could be applied
    deletedBy: 'Sarah Jen',
    deletedById: 'user_1024',
    deletedAt: '2023-09-28 09:12',
    daysLeft: 1,
    iconStyle: 'background:#333'
  },
  {
    id: 3,
    name: '财务数据_临时',
    location: '/ 财务部',
    type: 'datasource',
    deletedBy: 'Mike Ross',
    deletedById: 'user_8821',
    deletedAt: '2023-10-20 11:00',
    daysLeft: 24,
    iconStyle: 'background:#333'
  },
   // Mocking more data to fill tabs
  {
    id: 4,
    name: 'Logo_v1.png',
    location: '/ 资源库 / 图片',
    type: 'media',
    deletedBy: 'Alice',
    deletedById: 'user_001',
    deletedAt: '2023-10-22 09:00',
    daysLeft: 26,
    iconStyle: 'background:#333'
  }
])

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
  return items.value.filter(i => i.type === type).length
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

function confirmDelete() {
  if (isEmptying.value) {
    // Empty everything
    items.value = []
    selectedIds.value = []
  } else {
    // Delete selected
    items.value = items.value.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []
  }
  closeDeleteModal()
}

function restoreItem(item) {
  items.value = items.value.filter(i => i.id !== item.id)
  // In real app, would call API to restore
}

function batchRestore() {
  items.value = items.value.filter(item => !selectedIds.value.includes(item.id))
  selectedIds.value = []
}
</script>

<style scoped>
/* =========================================
    1. 全局变量 (Scoped to this view)
    ========================================= */
.recycle-bin-view {
  --bg-body: #0a0b0d;
  --bg-sidebar: #141519;
  --bg-card: #1c1d21;
  --bg-hover: #26272c;
  
  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #6366f1;
  
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border: #2d2e33;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* =========================================
    Header
    ========================================= */
.header {
  height: 64px; padding: 0 32px; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(20, 21, 25, 0.9);
  flex-shrink: 0;
}
.header h2 { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 10px; margin: 0; color: #fff; }

.btn-danger-outline {
  border: 1px solid var(--danger); color: var(--danger); background: transparent;
  padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: 0.2s;
}
.btn-danger-outline:hover { background: rgba(239, 68, 68, 0.1); }

/* Policy Alert */
.policy-alert {
  background: rgba(99, 102, 241, 0.1); border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  padding: 10px 32px; font-size: 12px; color: #a5b4fc; display: flex; align-items: center; gap: 8px;
}

/* Filter Tabs */
.tabs-container {
  padding: 0 32px; border-bottom: 1px solid var(--border); display: flex; gap: 32px; margin-top: 20px;
}
.tab-item {
  padding-bottom: 12px; color: var(--text-secondary); cursor: pointer; font-size: 14px; position: relative; display: flex; align-items: center; gap: 6px;
}
.tab-item:hover { color: #fff; }
.tab-item.active { color: #fff; font-weight: 500; }
.tab-item.active::after {
  content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary);
}
.count-badge {
  background: #333; color: #aaa; font-size: 10px; padding: 1px 6px; border-radius: 10px;
}

/* Table */
.content-body { flex: 1; overflow-y: auto; padding: 0 32px 32px; }

.data-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; margin-top: 20px; }
.data-table th {
  text-align: left; padding: 12px 16px; color: var(--text-muted);
  border-bottom: 1px solid var(--border); font-weight: 500;
}
.data-table td {
  padding: 16px; border-bottom: 1px solid var(--border); color: var(--text-main); vertical-align: middle;
}
.data-table tr:hover { background: var(--bg-hover); }

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
  font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.05); color: var(--text-secondary);
}
.time-badge.urgent { color: var(--danger); background: rgba(239, 68, 68, 0.1); }

/* Floating Action Bar */
.floating-bar {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%) translateY(100px);
  background: var(--primary); color: #fff; padding: 12px 24px; border-radius: 50px;
  display: flex; align-items: center; gap: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 50;
}
.floating-bar.show { transform: translateX(-50%) translateY(0); }
.bar-info { font-size: 13px; font-weight: 500; border-right: 1px solid rgba(255,255,255,0.2); padding-right: 24px; }
.bar-btn { cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; transition: 0.2s; opacity: 0.9; }
.bar-btn:hover { opacity: 1; transform: scale(1.05); }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(2px); z-index: 100;
  display: none; justify-content: center; align-items: center;
}
.modal-overlay.open { display: flex; }
.modal {
  background: var(--bg-card); width: 400px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}
.modal-body { padding: 24px; text-align: center; }
.modal-footer { padding: 16px; border-top: 1px solid var(--border); display: flex; gap: 12px; justify-content: center; }
.btn-cancel { padding: 8px 24px; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); border-radius: 6px; cursor: pointer; }
.btn-confirm { padding: 8px 24px; border: none; background: var(--danger); color: #fff; border-radius: 6px; cursor: pointer; }
</style>