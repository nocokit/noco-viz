<template>
  <div class="role-list-page">
    <!-- 页面头部 -->
    <PageHeader
      title="角色管理"
      subtitle="管理系统角色及权限分配"
    >
      <template #actions>
        <el-button type="primary" :icon="Plus" @click="handleCreate">
          新建角色
        </el-button>
      </template>
    </PageHeader>

    <!-- 搜索栏 -->
    <SearchBar
      v-model="searchQuery"
      placeholder="搜索角色名称或描述..."
      :stats="{
        总角色数: roles.length,
        自定义角色: customRolesCount
      }"
      @search="handleSearch"
    >
      <template #actions>
        <el-button :icon="Download" @click="handleExport">导出</el-button>
        <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
      </template>
    </SearchBar>

    <!-- 数据表格 -->
    <div class="table-container">
      <DataTable
        :data="filteredRoles"
        :loading="loading"
        :columns="tableColumns"
        :actions="tableActions"
        :show-index="true"
        @row-click="handleRowClick"
      >
        <!-- 自定义角色名称列 -->
        <template #column-name="{ row }">
          <div class="role-name-cell">
            <div class="role-name">
              {{ row.name }}
              <StatusBadge
                v-if="row.isSystem"
                type="info"
                text="系统内置"
                :with-dot="false"
              />
            </div>
            <div class="role-desc">{{ row.description }}</div>
          </div>
        </template>

        <!-- 自定义权限范围列 -->
        <template #column-scope="{ row }">
          <StatusBadge
            :type="getScopeType(row.scope)"
            :text="getScopeText(row.scope)"
          />
        </template>

        <!-- 自定义用户数列 -->
        <template #column-userCount="{ row }">
          <span class="user-count">{{ row.userCount || 0 }}</span>
        </template>

        <!-- 自定义时间列 -->
        <template #column-createdAt="{ row }">
          <span class="time-text">{{ formatDateTime(row.createdAt) }}</span>
        </template>

        <template #column-updatedAt="{ row }">
          <span class="time-text">{{ formatRelativeTime(row.updatedAt) }}</span>
        </template>
      </DataTable>
    </div>

    <!-- 新建/编辑角色弹窗 -->
    <FormModal
      v-model="modalVisible"
      :title="isEditMode ? '编辑角色' : '新建角色'"
      :form-data="formData"
      :form-rules="formRules"
      :loading="submitting"
      @submit="handleSubmit"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入角色名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="角色描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入角色描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="数据权限" prop="scope">
        <el-select v-model="formData.scope" placeholder="请选择数据权限范围">
          <el-option label="全部数据" value="all" />
          <el-option label="本部门" value="dept" />
          <el-option label="仅本人" value="self" />
          <el-option label="自定义" value="custom" />
        </el-select>
      </el-form-item>
    </FormModal>

    <!-- 权限详情面板 -->
    <DetailPanel
      v-model="detailPanelVisible"
      title="角色权限详情"
      :data="selectedRole"
      :show-edit="!selectedRole?.isSystem"
      @edit="handleEdit(selectedRole)"
    >
      <div v-if="selectedRole" class="role-detail">
        <div class="detail-item">
          <label>角色名称</label>
          <div>{{ selectedRole.name }}</div>
        </div>
        <div class="detail-item">
          <label>角色描述</label>
          <div>{{ selectedRole.description }}</div>
        </div>
        <div class="detail-item">
          <label>数据权限</label>
          <div>
            <StatusBadge
              :type="getScopeType(selectedRole.scope)"
              :text="getScopeText(selectedRole.scope)"
            />
          </div>
        </div>
        <div class="detail-item">
          <label>关联用户数</label>
          <div class="user-count">{{ selectedRole.userCount || 0 }}</div>
        </div>
        <div class="detail-item">
          <label>创建时间</label>
          <div>{{ formatDateTime(selectedRole.createdAt) }}</div>
        </div>
        <div class="detail-item">
          <label>最后修改</label>
          <div>{{ formatDateTime(selectedRole.updatedAt) }}</div>
        </div>
      </div>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Download, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

// 导入公共组件
import {
  PageHeader,
  SearchBar,
  DataTable,
  FormModal,
  StatusBadge,
  DetailPanel
} from '@/components/common'

// 导入Composables
import { useFormModal } from '@/composables/useFormModal'
import { useConfirm } from '@/composables/useConfirm'

// 导入工具函数
import { formatDateTime, formatRelativeTime } from '@/utils/formatters'
import { requiredValidator } from '@/utils/validators'
import { exportToCSV } from '@/utils/download'

const router = useRouter()
const { confirmDelete } = useConfirm()

// 状态
const loading = ref(false)
const searchQuery = ref('')
const detailPanelVisible = ref(false)
const selectedRole = ref(null)

// 表单弹窗
const {
  modalVisible,
  isEditMode,
  submitting,
  formData,
  openCreate,
  openEdit,
  handleSubmit: submitForm
} = useFormModal({
  defaultFormData: {
    name: '',
    description: '',
    scope: 'dept'
  },
  onSuccess: () => {
    ElMessage.success(isEditMode.value ? '更新成功' : '创建成功')
    loadRoles()
  }
})

// 表单验证规则
const formRules = {
  name: [
    requiredValidator('请输入角色名称'),
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    requiredValidator('请输入角色描述')
  ],
  scope: [
    requiredValidator('请选择数据权限范围')
  ]
}

// 角色数据 (实际应从API获取)
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
  if (!searchQuery.value) return roles.value
  const keyword = searchQuery.value.toLowerCase()
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(keyword) ||
    role.description.toLowerCase().includes(keyword)
  )
})

const customRolesCount = computed(() => {
  return roles.value.filter(role => !role.isSystem).length
})

// 表格列配置
const tableColumns = [
  { prop: 'name', label: '角色名称', minWidth: 200 },
  { prop: 'scope', label: '数据权限范围', width: 150 },
  { prop: 'userCount', label: '关联用户数', width: 120, align: 'center' },
  { prop: 'createdAt', label: '创建时间', width: 180 },
  { prop: 'updatedAt', label: '最后修改', width: 150 }
]

// 表格操作按钮
const tableActions = [
  {
    label: '查看',
    handler: (row) => handleViewDetail(row)
  },
  {
    label: '编辑',
    handler: (row) => handleEdit(row),
    visible: (row) => !row.isSystem
  },
  {
    label: '复制',
    handler: (row) => handleDuplicate(row)
  },
  {
    label: '删除',
    type: 'danger',
    handler: (row) => handleDelete(row),
    visible: (row) => !row.isSystem
  }
]

// 方法
const loadRoles = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 实际应调用: await getRoleListAPI()
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
  console.log('搜索:', searchQuery.value)
}

const handleCreate = () => {
  openCreate()
}

const handleEdit = (row) => {
  if (row.isSystem) {
    ElMessage.warning('系统内置角色不可编辑')
    return
  }
  openEdit(row)
}

const handleDelete = async (row) => {
  await confirmDelete(row.name, async () => {
    const index = roles.value.findIndex(r => r.id === row.id)
    if (index > -1) {
      roles.value.splice(index, 1)
    }
  })
}

const handleDuplicate = (row) => {
  const newRole = {
    id: Date.now(),
    name: `${row.name}（副本）`,
    description: row.description,
    isSystem: false,
    scope: row.scope,
    userCount: 0,
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN')
  }
  roles.value.unshift(newRole)
  ElMessage.success(`已复制角色 "${row.name}"`)
}

const handleViewDetail = (row) => {
  selectedRole.value = row
  detailPanelVisible.value = true
}

const handleRowClick = (row) => {
  handleViewDetail(row)
}

const handleSubmit = () => {
  submitForm({
    create: async (data) => {
      // 模拟API调用
      const newRole = {
        id: Date.now(),
        ...data,
        isSystem: false,
        userCount: 0,
        createdAt: new Date().toLocaleString('zh-CN'),
        updatedAt: new Date().toLocaleString('zh-CN')
      }
      roles.value.unshift(newRole)
      return { code: 200, data: newRole }
    },
    update: async (id, data) => {
      // 模拟API调用
      const index = roles.value.findIndex(r => r.id === id)
      if (index > -1) {
        roles.value[index] = {
          ...roles.value[index],
          ...data,
          updatedAt: new Date().toLocaleString('zh-CN')
        }
      }
      return { code: 200, data: roles.value[index] }
    }
  })
}

const handleExport = () => {
  const exportData = roles.value.map(role => ({
    角色名称: role.name,
    角色描述: role.description,
    数据权限: getScopeText(role.scope),
    关联用户数: role.userCount,
    创建时间: role.createdAt
  }))
  exportToCSV(exportData, '角色列表', Object.keys(exportData[0]))
}

const handleRefresh = () => {
  loadRoles()
}

// 工具函数
const getScopeText = (scope) => {
  const map = {
    all: '全部数据',
    dept: '本部门',
    self: '仅本人',
    custom: '自定义'
  }
  return map[scope] || scope
}

const getScopeType = (scope) => {
  const map = {
    all: 'error',
    dept: 'warning',
    self: 'info',
    custom: 'default'
  }
  return map[scope] || 'default'
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
  padding: 0 24px 24px;
}

/* 角色名称单元格 */
.role-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #e8eaed);
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-desc {
  font-size: 12px;
  color: var(--text-secondary, #9aa0a6);
  line-height: 1.4;
}

.user-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.time-text {
  font-size: 12px;
  color: var(--text-secondary, #9aa0a6);
  font-family: monospace;
}

/* 详情面板 */
.role-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item label {
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
  font-weight: 500;
}

.detail-item > div {
  font-size: 14px;
  color: var(--text-primary, #e8eaed);
}
</style>
