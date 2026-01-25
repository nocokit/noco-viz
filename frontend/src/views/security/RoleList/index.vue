<template>
  <div class="page-container role-list-page">
    <!-- Header -->
    <PageHeader
      title="角色管理"
      description="管理系统角色及权限分配"
      :actions="[
        { text: '导出角色', icon: 'Download', handler: handleExportRoles },
        { text: '新建角色', icon: 'Plus', type: 'primary', handler: handleCreateRole }
      ]"
    />

    <!-- Toolbar -->
    <Toolbar
      v-model:search-value="searchKeyword"
      search-placeholder="搜索角色名称或描述..."
      :show-view-toggle="true"
      v-model:view-mode="viewMode"
      :refresh-loading="loading"
      @refresh="handleRefresh"
    />

    <!-- Card Grid / List View -->
    <div class="content-area">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <el-icon class="loading-icon" :size="32">
          <Loading />
        </el-icon>
        <span>加载中...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredRoles.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" style="color: var(--el-text-color-placeholder);">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        <div class="empty-title">暂无角色数据</div>
        <div class="empty-desc">点击右上角"新建角色"按钮创建第一个角色</div>
      </div>

      <!-- Card View -->
      <div v-else-if="viewMode === 'card'" class="grid-layout">
        <!-- Role Cards -->
        <div
          v-for="role in filteredRoles"
          :key="role.id"
          class="role-card"
        >
          <div class="card-header">
            <div class="role-icon" :style="{ background: getRoleColor(role) }">
              {{ getRoleIcon(role) }}
            </div>
            <span v-if="role.isSystem" class="system-badge">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              系统内置
            </span>
          </div>

          <div class="card-body">
            <h3 class="role-name">{{ role.name }}</h3>
            <p class="role-desc">{{ role.description }}</p>
          </div>

          <div class="card-meta">
            <div class="meta-item">
              <span class="meta-label">数据权限</span>
              <el-tag :type="getScopeTagType(role.scope)" size="small">
                {{ getScopeText(role.scope) }}
              </el-tag>
            </div>
            <div class="meta-item">
              <span class="meta-label">关联用户</span>
              <span class="meta-value">{{ role.userCount || 0 }} 人</span>
            </div>
          </div>

          <div class="card-footer">
            <el-button size="small" @click="handleViewPermissions(role)">
              查看权限
            </el-button>
            <el-button size="small" @click="handleEdit(role)" :disabled="role.isSystem">
              编辑
            </el-button>
            <el-button size="small" @click="handleDuplicate(role)">
              复制
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(role)" :disabled="role.isSystem">
              删除
            </el-button>
          </div>
        </div>

        <!-- New Role Card -->
        <div class="role-card role-card-new" @click="handleCreateRole">
          <div class="new-icon">
            <el-icon :size="32">
              <Plus />
            </el-icon>
          </div>
          <div class="new-text">新建角色</div>
        </div>
      </div>

      <!-- List View -->
      <div v-else>
        <DataTable
          :data="filteredRoles"
          :columns="tableColumns"
          :loading="loading"
          variant="default"
          empty-text="暂无角色数据"
        >
          <!-- 角色名称列 -->
          <template #name="{ row }">
            <div class="role-name-cell">
              <div class="role-name-text">
                {{ row.name }}
                <el-tag v-if="row.isSystem" size="small" type="info">系统内置</el-tag>
              </div>
              <div class="role-desc-text">{{ row.description }}</div>
            </div>
          </template>

          <!-- 数据权限范围列 -->
          <template #scope="{ row }">
            <el-tag :type="getScopeTagType(row.scope)" size="small">
              {{ getScopeText(row.scope) }}
            </el-tag>
          </template>

          <!-- 关联用户数列 -->
          <template #userCount="{ row }">
            <span class="user-count">{{ row.userCount || 0 }}</span>
          </template>

          <!-- 创建时间列 -->
          <template #createdAt="{ row }">
            <span class="time-text">{{ row.createdAt }}</span>
          </template>

          <!-- 最后修改列 -->
          <template #updatedAt="{ row }">
            <span class="time-text">{{ row.updatedAt }}</span>
          </template>

          <!-- 操作列 -->
          <template #actions="{ row }">
            <div class="action-buttons">
              <el-button link type="primary" size="small" @click="handleViewPermissions(row)">
                查看权限
              </el-button>
              <el-button link type="primary" size="small" @click="handleEdit(row)" :disabled="row.isSystem">
                编辑
              </el-button>
              <el-button link type="primary" size="small" @click="handleDuplicate(row)">
                复制
              </el-button>
              <el-button link type="danger" size="small" @click="handleDelete(row)" :disabled="row.isSystem">
                删除
              </el-button>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
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
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import Toolbar from '@/components/Toolbar.vue'
import DataTable from '@/components/DataTable.vue'

// API导入
import {
  getRoles,
  createRole,
  updateRole,
  cloneRole,
  deleteRole,
  exportRoles
} from '@/api/role'

const router = useRouter()

// 状态
const loading = ref(false)
const searchKeyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新建角色')
const submitting = ref(false)
const formRef = ref(null)
const editingId = ref(null)
const viewMode = ref('list') // 'card' or 'list'

// 表格列配置
const tableColumns = [
  { label: '角色名称', prop: 'name', width: '25%', slot: 'name' },
  { label: '数据权限范围', prop: 'scope', width: '15%', slot: 'scope' },
  { label: '关联用户数', prop: 'userCount', width: '12%', align: 'center', slot: 'userCount' },
  { label: '创建时间', prop: 'createdAt', width: '15%', slot: 'createdAt' },
  { label: '最后修改', prop: 'updatedAt', width: '15%', slot: 'updatedAt' },
  { label: '操作', prop: 'actions', width: '18%', align: 'center', slot: 'actions' }
]

// 表单数据
const formData = ref({
  name: '',
  description: '',
  scope: 'self'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ],
  scope: [
    { required: true, message: '请选择数据权限范围', trigger: 'change' }
  ]
}

// 角色数据
const roles = ref([])

// 加载角色列表
const loadRoles = async () => {
  try {
    loading.value = true
    const data = await getRoles()
    roles.value = data.map(role => ({
      ...role,
      isSystem: role.isSystem || false,
      userCount: role.userCount || 0,
      createdAt: formatTime(role.createdAt),
      updatedAt: formatTime(role.updatedAt)
    }))
  } catch (error) {
    console.error('加载角色列表失败:', error)
    ElMessage.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

// 组件挂载时加载数据
onMounted(() => {
  loadRoles()
})

// 筛选后的角色列表
const filteredRoles = computed(() => {
  if (!searchKeyword.value) return roles.value

  const keyword = searchKeyword.value.toLowerCase()
  return roles.value.filter(role => {
    return (
      role.name.toLowerCase().includes(keyword) ||
      (role.description && role.description.toLowerCase().includes(keyword))
    )
  })
})

// 方法
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
    dept: 'primary',
    self: 'success',
    custom: 'warning'
  }
  return map[scope] || ''
}

const getRoleIcon = (role) => {
  if (role.isSystem) return '🔒'
  const icons = {
    all: '👑',
    dept: '👥',
    self: '👤',
    custom: '⚙️'
  }
  return icons[role.scope] || '📋'
}

const getRoleColor = (role) => {
  if (role.isSystem) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  const colors = {
    all: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    dept: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    self: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    custom: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
  return colors[role.scope] || 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
}

// 新建角色
const handleCreateRole = () => {
  dialogTitle.value = '新建角色'
  editingId.value = null
  formData.value = {
    name: '',
    description: '',
    scope: 'self'
  }
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (role) => {
  if (role.isSystem) {
    ElMessage.warning('系统内置角色不可编辑')
    return
  }
  dialogTitle.value = '编辑角色'
  editingId.value = role.id
  formData.value = {
    name: role.name,
    description: role.description,
    scope: role.scope
  }
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      submitting.value = true

      if (editingId.value) {
        await updateRole(editingId.value, formData.value)
        ElMessage.success('角色更新成功')
      } else {
        await createRole(formData.value)
        ElMessage.success('角色创建成功')
      }

      dialogVisible.value = false
      await loadRoles()
    } catch (error) {
      console.error('保存角色失败:', error)
      ElMessage.error(error.response?.data?.message || '保存角色失败')
    } finally {
      submitting.value = false
    }
  })
}

// 删除角色
const handleDelete = async (role) => {
  if (role.isSystem) {
    ElMessage.warning('系统内置角色不可删除')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${role.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteRole(role.id)
    ElMessage.success('角色删除成功')
    await loadRoles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error(error.response?.data?.message || '删除角色失败')
    }
  }
}

// 复制角色
const handleDuplicate = async (role) => {
  try {
    await cloneRole(role.id, { name: `${role.name}（副本）` })
    ElMessage.success(`已复制角色 "${role.name}"`)
    await loadRoles()
  } catch (error) {
    console.error('复制角色失败:', error)
    ElMessage.error('复制角色失败')
  }
}

// 查看权限
const handleViewPermissions = (role) => {
  router.push({
    path: '/role-permission',
    query: { roleId: role.id }
  })
}

// 刷新
const handleRefresh = () => {
  loadRoles()
}

// 导出角色
const handleExportRoles = async () => {
  try {
    const blob = await exportRoles()

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `roles-export-${new Date().getTime()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('角色导出成功')
  } catch (error) {
    console.error('导出角色失败:', error)
    ElMessage.error('导出角色失败')
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

/* 页面头部 */
/* Content Area */
.content-area {
  padding: 12px 0px;
  overflow-y: auto;
}

/* Loading & Empty State */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-icon {
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state svg {
  margin-bottom: 12px;
  color: #666;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Role Card */
.role-card {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 8px;
  padding: 24px;
  transition: all 0.2s;
  position: relative;
}

.role-card:hover {
  border-color: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.role-card.role-system {
  border-color: rgba(102, 126, 234, 0.3);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.role-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.system-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  height: fit-content;
}

.card-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.role-desc {
  margin: 0;
  font-size: 13px;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #333;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.meta-label {
  color: #888;
}

.meta-value {
  color: #ccc;
  font-weight: 500;
}

.card-actions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.card-actions .btn {
  padding: 8px 12px;
  font-size: 12px;
  justify-content: center;
}

/* New Role Card */
.role-card-new {
  border-style: dashed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 280px;
}

.role-card-new:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.new-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 12px;
}

.new-text {
  font-size: 14px;
  color: #888;
}

/* Dialog Styles */
:deep(.el-dialog) {
  background: #1e1e20;
  border: 1px solid #303033;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #303033;
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  color: #e5e5e5;
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-form-item__label) {
  color: #ccc;
}

:deep(.el-input__inner) {
  background: #0f1014;
  border-color: #303033;
  color: #e5e5e5;
}

:deep(.el-input__inner:focus) {
  border-color: #409eff;
}

:deep(.el-textarea__inner) {
  background: #0f1014;
  border-color: #303033;
  color: #e5e5e5;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__inner) {
  background: #0f1014;
  border-color: #303033;
  color: #e5e5e5;
}

/* Table Cell Styles - 保留自定义单元格样式 */

.role-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #e5e5e5;
}

.system-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-weight: normal;
}

.role-desc-list {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.user-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 4px 10px;
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.2);
  color: #409eff;
  border-radius: 12px;
  font-weight: 500;
}

.time-text {
  color: #888;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.btn-link {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  transition: all 0.2s;
}

.btn-link:hover:not(:disabled) {
  color: #66b1ff;
  text-decoration: underline;
}

.btn-link:disabled {
  color: #666;
  cursor: not-allowed;
}

.btn-link-danger {
  color: #ef4444;
}

.btn-link-danger:hover:not(:disabled) {
  color: #f87171;
}
</style>
