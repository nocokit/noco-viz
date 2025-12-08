<template>
  <div class="organization-management">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h2>组织架构 (Organization)</h2>
      </div>
      <div class="header-right">
        <div class="sync-status">
          <el-icon><Refresh /></el-icon>
          数据来源: LDAP 同步
        </div>
        <el-button class="header-btn">
          <el-icon><Sort /></el-icon>
          导入/导出
        </el-button>
        <el-button type="primary" class="header-btn">
          <el-icon><RefreshRight /></el-icon>
          立即同步
        </el-button>
      </div>
    </header>

    <div class="content-body">
      <!-- Left: Org Tree -->
      <aside class="org-tree-panel">
        <div class="tree-header">
          <el-input
            v-model="filterText"
            placeholder="搜索部门..."
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
                <el-icon class="node-icon" v-if="data.children && data.children.length"><OfficeBuilding /></el-icon>
                <el-icon class="node-icon" v-else><Folder /></el-icon>
                <span class="node-name">{{ node.label }}</span>
                <span class="node-count">{{ data.count }}</span>
              </div>
            </template>
          </el-tree>
        </div>
      </aside>

      <!-- Right: Members -->
      <aside class="member-panel">
        <div class="panel-toolbar">
          <div class="breadcrumb">
            {{ currentDept.label || '集团总部' }} <span>/ 成员列表 ({{ currentDept.count || 1204 }})</span>
          </div>
          <div class="toolbar-actions">
            <el-input
              v-model="searchMember"
              placeholder="搜索成员姓名/工号"
              prefix-icon="Search"
              style="width: 200px"
            />
            <el-button type="primary" icon="Plus">
              添加成员
            </el-button>
          </div>
        </div>

        <div class="table-container">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: 'rgba(0,0,0,0.2)', color: '#9ca3af', borderBottom: '1px solid #2d2e33' }" :cell-style="{ background: 'transparent', color: '#fff', borderBottom: '1px solid #2d2e33' }" row-class-name="table-row">
            <el-table-column label="姓名 / 工号" width="250">
              <template #default="scope">
                <div class="user-cell">
                  <div class="avatar" :style="{ background: scope.row.avatarColor }">
                    {{ scope.row.initials }}
                  </div>
                  <div>
                    <div class="user-name">{{ scope.row.name }}</div>
                    <div class="user-no">{{ scope.row.no }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="dept" label="所属部门" />
            <el-table-column label="系统角色">
              <template #default="scope">
                <span :class="['role-badge', scope.row.roleClass]">{{ scope.row.role }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" />
            <el-table-column label="状态">
              <template #default="scope">
                <span class="status-cell">
                  <span :class="['status-dot', scope.row.status === 'active' ? 'status-active' : 'status-disabled']"></span>
                  {{ scope.row.status === 'active' ? '正常' : '禁用' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { Search, Refresh, RefreshRight, Sort, Plus, OfficeBuilding, Folder } from '@element-plus/icons-vue'

// --- Tree Logic ---
const filterText = ref('')
const treeRef = ref(null)
const currentDept = ref({ label: '集团总部', count: 1204 })

const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeData = [
  {
    id: 1,
    label: '集团总部',
    count: 1204,
    children: [
      {
        id: 2,
        label: '研发中心',
        count: 450,
        children: [
          { id: 21, label: '前端架构组', count: 32 },
          { id: 22, label: '后端服务组', count: 85 },
        ],
      },
      {
        id: 3,
        label: '市场营销部',
        count: 210,
      },
      {
        id: 4,
        label: '财务部',
        count: 45,
      },
    ],
  },
]

watch(filterText, (val) => {
  treeRef.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (data) => {
  currentDept.value = data
}

// --- Table Logic ---
const searchMember = ref('')
const tableData = reactive([
  {
    name: 'David Miller',
    no: 'NO.1001',
    initials: 'DM',
    avatarColor: '#3b82f6',
    dept: '集团总部',
    role: '超级管理员',
    roleClass: 'admin',
    email: 'david@company.com',
    status: 'active',
  },
  {
    name: 'Sarah Jen',
    no: 'NO.1024',
    initials: 'SJ',
    avatarColor: '#f59e0b',
    dept: '研发中心',
    role: '普通用户',
    roleClass: '',
    email: 'sarah@company.com',
    status: 'active',
  },
  {
    name: 'Mike Ross',
    no: 'NO.8821',
    initials: 'MR',
    avatarColor: '#333',
    dept: '市场营销部',
    role: '普通用户',
    roleClass: '',
    email: 'mike@company.com',
    status: 'disabled',
  },
])
</script>

<style scoped>
/* =========================================
   Global Variables & Reset
   ========================================= */
.organization-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0a0b0d; /* var(--bg-body) */
  color: #ffffff; /* var(--text-main) */
  overflow: hidden;
}

/* =========================================
   Header
   ========================================= */
.page-header {
  height: 64px;
  padding: 0 32px;
  border-bottom: 1px solid #2d2e33; /* var(--border) */
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

.sync-status {
  font-size: 12px;
  color: #9ca3af; /* var(--text-secondary) */
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #2d2e33;
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
  background: #1c1d21; /* var(--bg-card) */
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
  background-color: #26272c; /* var(--bg-hover) */
  color: #fff;
}

.tree-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6; /* var(--primary) */
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

/* --- Right: Member Panel --- */
.member-panel {
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

.breadcrumb span {
  color: #9ca3af; /* var(--text-muted) */
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

.table-container {
  flex: 1;
  overflow-y: auto;
}

/* Table Styles Override */
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

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.user-name {
  font-weight: 600;
  font-size: 13px;
  color: #fff;
}

.user-no {
  font-size: 12px;
  color: #9ca3af;
}

.role-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  display: inline-block;
}

.role-badge.admin {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

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

.status-active {
  background: #10b981; /* var(--success) */
}

.status-disabled {
  background: #9ca3af; /* var(--text-muted) */
}
</style>
