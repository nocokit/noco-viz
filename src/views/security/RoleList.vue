<template>
  <div class="role-list-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h2>角色管理</h2>
        <span class="page-subtitle">管理系统角色及权限分配</span>
      </div>
    </header>

    <!-- Toolbar & Search -->
    <div class="toolbar">
      <div class="search-wrapper">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索角色名称或描述..."
          prefix-icon="Search"
          clearable
          style="width: 300px"
        />
      </div>
      <div class="toolbar-stats">
        <span class="stat-item">
          <span class="stat-label">总角色数：</span>
          <span class="stat-value">{{ roles.length }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">自定义角色：</span>
          <span class="stat-value">{{ customRolesCount }}</span>
        </span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <el-table
        :data="filteredRoles"
        style="width: 100%"
        :header-cell-style="{
          background: 'rgba(0,0,0,0.2)',
          color: '#9ca3af',
          borderBottom: '1px solid #2d2e33'
        }"
        :cell-style="{
          background: 'transparent',
          color: '#fff',
          borderBottom: '1px solid #2d2e33'
        }"
        row-class-name="table-row"
      >
        <el-table-column label="角色名称" min-width="200">
          <template #default="scope">
            <div class="role-name-cell">
              <div class="role-name">
                {{ scope.row.name }}
                <el-tag v-if="scope.row.isSystem" size="small" type="info" class="system-tag">
                  系统内置
                </el-tag>
              </div>
              <div class="role-desc">{{ scope.row.description }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="数据权限范围" width="150">
          <template #default="scope">
            <el-tag :type="getScopeTagType(scope.row.scope)" size="small">
              {{ getScopeText(scope.row.scope) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="关联用户数" width="120" align="center">
          <template #default="scope">
            <span class="user-count">{{ scope.row.userCount || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="180">
          <template #default="scope">
            <span class="time-text">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>

        <el-table-column label="最后修改" width="180">
          <template #default="scope">
            <span class="time-text">{{ scope.row.updatedAt }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleViewPermissions(scope.row)"
            >
              查看权限
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              :disabled="scope.row.isSystem"
            >
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click="handleDuplicate(scope.row)"
            >
              复制
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索关键词
const searchKeyword = ref('')

// 角色数据
const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有权限，可管理所有功能和数据',
    isSystem: true,
    scope: 'all',
    userCount: 3,
    createdAt: '2023-01-15 10:30:00',
    updatedAt: '2023-01-15 10:30:00'
  },
  {
    id: 2,
    name: '项目管理员',
    description: '管理所有项目及资源，负责项目的创建、编辑和删除',
    isSystem: false,
    scope: 'dept',
    userCount: 8,
    createdAt: '2023-02-20 14:20:00',
    updatedAt: '2023-10-15 09:45:00'
  },
  {
    id: 3,
    name: '开发工程师',
    description: '仅限编辑和开发大屏，具有项目创建和编辑权限',
    isSystem: false,
    scope: 'dept',
    userCount: 25,
    createdAt: '2023-03-10 11:00:00',
    updatedAt: '2023-09-20 16:30:00'
  },
  {
    id: 4,
    name: '普通访客',
    description: '仅具备查看权限，不能进行任何修改操作',
    isSystem: false,
    scope: 'self',
    userCount: 120,
    createdAt: '2023-01-15 10:35:00',
    updatedAt: '2023-01-15 10:35:00'
  },
  {
    id: 5,
    name: '数据分析师',
    description: '可查看和分析所有数据，但不能修改系统配置',
    isSystem: false,
    scope: 'all',
    userCount: 12,
    createdAt: '2023-05-18 15:20:00',
    updatedAt: '2023-08-25 10:15:00'
  }
])

// 计算属性
const filteredRoles = computed(() => {
  if (!searchKeyword.value) return roles.value
  const keyword = searchKeyword.value.toLowerCase()
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(keyword) ||
    role.description.toLowerCase().includes(keyword)
  )
})

const customRolesCount = computed(() => {
  return roles.value.filter(role => !role.isSystem).length
})

// 获取权限范围文本
const getScopeText = (scope) => {
  const map = {
    all: '全部数据',
    dept: '本部门',
    self: '仅本人',
    custom: '自定义'
  }
  return map[scope] || scope
}

// 获取权限范围标签类型
const getScopeTagType = (scope) => {
  const map = {
    all: 'danger',
    dept: 'warning',
    self: 'info',
    custom: ''
  }
  return map[scope] || ''
}

// 编辑角色 - 跳转到角色权限配置页面
const handleEdit = (role) => {
  if (role.isSystem) {
    ElMessage.warning('系统内置角色不可编辑')
    return
  }
  router.push({
    path: '/role-permission',
    query: { roleId: role.id }
  })
}

// 复制角色
const handleDuplicate = (role) => {
  const now = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')

  const newRole = {
    id: Date.now(),
    name: `${role.name}（副本）`,
    description: role.description,
    isSystem: false,
    scope: role.scope,
    userCount: 0,
    createdAt: now,
    updatedAt: now
  }
  roles.value.unshift(newRole)
  ElMessage.success(`已复制角色 "${role.name}"`)
}

// 查看权限配置
const handleViewPermissions = (role) => {
  // 跳转到角色权限配置页面
  router.push({
    path: '/role-permission',
    query: { roleId: role.id }
  })
}
</script>

<style scoped>
.role-list-page {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.page-subtitle {
  font-size: 13px;
  color: #9ca3af;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* =========================================
   Toolbar
   ========================================= */
.toolbar {
  padding: 20px 32px;
  border-bottom: 1px solid #2d2e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.search-wrapper :deep(.el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.search-wrapper :deep(.el-input__inner) {
  color: #fff;
}

.toolbar-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  font-size: 13px;
  color: #9ca3af;
}

.stat-label {
  color: #9ca3af;
}

.stat-value {
  color: #3b82f6;
  font-weight: 600;
  margin-left: 4px;
}

/* =========================================
   Table
   ========================================= */
.table-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
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

.role-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-name {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-desc {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}

.system-tag {
  font-size: 10px !important;
}

.user-count {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.time-text {
  font-size: 12px;
  color: #9ca3af;
  font-family: monospace;
}
</style>
