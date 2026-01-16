<template>
  <div class="role-list-page">
    <!-- Header -->
    <PageHeader
      title="角色管理"
      subtitle="管理系统角色及权限分配"
    >
      <template #actions>
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
      </template>
    </PageHeader>

    <!-- CRUD Table -->
    <div class="table-container">
      <CrudTable
        :data="filteredRoles"
        :columns="columns"
        :loading="loading"
        search-placeholder="搜索角色名称或描述..."
        :creatable="false"
        :editable="false"
        :deletable="false"
        :view-switchable="false"
        @search="handleSearch"
      >
        <!-- 自定义列 -->
        <template #column-name="{ row }">
          <div class="role-name-cell">
            <div class="role-name">
              {{ row.name }}
              <el-tag v-if="row.isSystem" size="small" type="info">
                系统内置
              </el-tag>
            </div>
            <div class="role-desc">{{ row.description }}</div>
          </div>
        </template>

        <template #column-scope="{ row }">
          <el-tag :type="getScopeTagType(row.scope)" size="small">
            {{ getScopeText(row.scope) }}
          </el-tag>
        </template>

        <template #column-userCount="{ row }">
          <span class="user-count">{{ row.userCount || 0 }}</span>
        </template>

        <template #column-createdAt="{ row }">
          <span class="time-text">{{ row.createdAt }}</span>
        </template>

        <template #column-updatedAt="{ row }">
          <span class="time-text">{{ row.updatedAt }}</span>
        </template>

        <!-- 自定义操作列 -->
        <template #row-actions="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleViewPermissions(row)"
          >
            查看权限
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleEdit(row)"
            :disabled="row.isSystem"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleDuplicate(row)"
          >
            复制
          </el-button>
        </template>
      </CrudTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 组件导入
import CrudTable from '@/components/business/CrudTable.vue'
import PageHeader from '@/components/common/PageHeader/index.vue'

// Composables
import { useFilter } from '@/composables/useFilter'

const router = useRouter()

// 状态
const loading = ref(false)
const searchKeyword = ref('')

// 表格列配置
const columns = [
  {
    prop: 'name',
    label: '角色名称',
    minWidth: 200
  },
  {
    prop: 'scope',
    label: '数据权限范围',
    width: 150
  },
  {
    prop: 'userCount',
    label: '关联用户数',
    width: 120,
    align: 'center'
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 180
  },
  {
    prop: 'updatedAt',
    label: '最后修改',
    width: 180
  }
]

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

// 使用 useFilter composable
const { filteredData: filteredRoles } = useFilter(roles, {
  searchFields: ['name', 'description'],
  searchQuery: searchKeyword
})

// 计算属性
const customRolesCount = computed(() => {
  return roles.value.filter(role => !role.isSystem).length
})

// 方法
const handleSearch = (query) => {
  searchKeyword.value = query
}

const getScopeText = (scope) => {
  const map = {
    all: '全部数据',
    dept: '本部门',
    self: '仅本人',
    custom: '自定义'
  }
  return map[scope] || scope
}

const getScopeTagType = (scope) => {
  const map = {
    all: 'danger',
    dept: 'warning',
    self: 'info',
    custom: ''
  }
  return map[scope] || ''
}

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

const handleViewPermissions = (role) => {
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

.table-container {
  flex: 1;
  overflow: hidden;
  padding: 24px 32px;
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
