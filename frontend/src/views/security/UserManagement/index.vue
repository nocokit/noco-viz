<template>
  <div class="user-management-page">
    <!-- Header -->
    <PageHeader
      title="用户管理"
      subtitle="管理系统用户账号及角色分配"
    >
      <template #actions>
        <div class="header-actions">
          <div class="toolbar-stats">
            <span class="stat-item">
              <span class="stat-label">总用户数：</span>
              <span class="stat-value">{{ users.length }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">活跃用户：</span>
              <span class="stat-value">{{ activeUsersCount }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">禁用用户：</span>
              <span class="stat-value">{{ inactiveUsersCount }}</span>
            </span>
          </div>
        </div>
      </template>
    </PageHeader>

    <!-- CRUD Table -->
    <div class="table-container">
      <CrudTable
        :data="filteredUsers"
        :columns="columns"
        :loading="loading"
        search-placeholder="搜索用户名、邮箱或手机号..."
        :creatable="true"
        create-button-text="新建用户"
        :selectable="true"
        :batch-actions="batchActions"
        @search="handleSearch"
        @create="handleCreate"
        @batch-action="handleBatchAction"
      >
        <!-- 自定义筛选器 -->
        <template #filters>
          <el-select
            v-model="statusFilter"
            placeholder="用户状态"
            clearable
            style="width: 140px; margin-left: 12px;"
            @change="handleFilterChange"
          >
            <el-option label="全部" value="" />
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
          <el-select
            v-model="roleFilter"
            placeholder="用户角色"
            clearable
            style="width: 160px; margin-left: 12px;"
            @change="handleFilterChange"
          >
            <el-option label="全部角色" value="" />
            <el-option
              v-for="role in availableRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </template>

        <!-- 自定义列 -->
        <template #column-username="{ row }">
          <div class="user-cell">
            <el-avatar :size="32" class="user-avatar">
              {{ row.username.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="user-info">
              <div class="user-name">{{ row.username }}</div>
              <div class="user-email">{{ row.email }}</div>
            </div>
          </div>
        </template>

        <template #column-phone="{ row }">
          <span class="phone-text">{{ row.phone || '-' }}</span>
        </template>

        <template #column-role="{ row }">
          <el-tag :type="getRoleTagType(row.role)" size="small">
            {{ getRoleText(row.role) }}
          </el-tag>
        </template>

        <template #column-isActive="{ row }">
          <el-switch
            v-model="row.isActive"
            :loading="row.statusChanging"
            @change="handleToggleStatus(row)"
          />
        </template>

        <template #column-createdAt="{ row }">
          <span class="time-text">{{ row.createdAt }}</span>
        </template>

        <template #column-lastLoginAt="{ row }">
          <span class="time-text">{{ row.lastLoginAt || '从未登录' }}</span>
        </template>

        <!-- 自定义操作列 -->
        <template #row-actions="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="warning"
            size="small"
            @click="handleResetPassword(row)"
          >
            重置密码
          </el-button>
          <el-button
            link
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </CrudTable>
    </div>

    <!-- 创建/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="dialogMode === 'create' ? '新建用户' : '编辑用户'"
      width="600px"
      :close-on-click-modal="false"
      @close="resetUserForm"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名（仅创建时可设置）"
            :disabled="dialogMode === 'edit'"
            maxlength="50"
            show-word-limit
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱地址"
            maxlength="100"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入手机号（可选）"
            maxlength="20"
          >
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="角色" prop="roleId">
          <el-select
            v-model="userForm.roleId"
            placeholder="请选择用户角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in availableRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            >
              <div style="display: flex; flex-direction: column;">
                <span>{{ role.name }}</span>
                <span style="font-size: 12px; color: #9ca3af;">{{ role.description }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogMode === 'create'"
          label="初始密码"
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入初始密码（至少6位）"
            show-password
            maxlength="50"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
          <div class="form-tip">用户首次登录后应修改密码</div>
        </el-form-item>

        <el-form-item label="用户状态" prop="isActive">
          <el-radio-group v-model="userForm.isActive">
            <el-radio :value="true">启用</el-radio>
            <el-radio :value="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleUserSubmit"
            :loading="userSubmitting"
          >
            {{ dialogMode === 'create' ? '创建' : '保存' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置用户密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="resetPasswordFormRef"
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        label-position="top"
      >
        <el-alert
          title="提示"
          type="warning"
          :closable="false"
          style="margin-bottom: 20px;"
        >
          <template #default>
            <div style="font-size: 13px; line-height: 1.6;">
              <p>您正在为用户 <strong>{{ currentUser?.username }}</strong> 重置密码</p>
              <p>• 新密码将立即生效</p>
              <p>• 建议通知用户及时修改密码</p>
            </div>
          </template>
        </el-alert>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            show-password
            maxlength="50"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            maxlength="50"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleResetPasswordSubmit"
            :loading="resetPasswordSubmitting"
          >
            确认重置
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Message, Phone, Lock } from '@element-plus/icons-vue'

// 组件导入
import CrudTable from '@/components/business/CrudTable.vue'
import PageHeader from '@/components/common/PageHeader/index.vue'

// API导入
import {
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  resetUserPassword,
  toggleUserStatus
} from '@/api/user'
import { getRoles } from '@/api/role'

// Composables
import { useFilter } from '@/composables/useFilter'

// 状态
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

// 表格列配置
const columns = [
  {
    prop: 'username',
    label: '用户信息',
    minWidth: 220
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 140
  },
  {
    prop: 'role',
    label: '角色',
    width: 120
  },
  {
    prop: 'isActive',
    label: '状态',
    width: 100,
    align: 'center'
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 180
  },
  {
    prop: 'lastLoginAt',
    label: '最后登录',
    width: 180
  }
]

// 批量操作配置
const batchActions = [
  {
    command: 'delete',
    label: '批量删除',
    icon: 'Delete'
  }
]

// 用户数据
const users = ref([])
const availableRoles = ref([])

// 对话框状态
const userDialogVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const dialogMode = ref('create') // 'create' | 'edit'
const currentUser = ref(null)
const userSubmitting = ref(false)
const resetPasswordSubmitting = ref(false)

// 表单引用
const userFormRef = ref(null)
const resetPasswordFormRef = ref(null)

// 用户表单数据
const userForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  roleId: null,
  isActive: true
})

// 重置密码表单数据
const resetPasswordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const userFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 50, message: '密码长度至少6位', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
}

const resetPasswordRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 50, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetPasswordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 加载用户列表
const loadUsers = async () => {
  try {
    loading.value = true
    const data = await getUserList()
    users.value = data.map(user => ({
      ...user,
      statusChanging: false,
      isActive: user.isActive !== false,
      createdAt: formatTime(user.createdAt),
      lastLoginAt: formatTime(user.lastLoginAt)
    }))
  } catch (error) {
    console.error('加载用户列表失败:', error)
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

// 加载角色列表
const loadRoles = async () => {
  try {
    const data = await getRoles()
    availableRoles.value = data
  } catch (error) {
    console.error('加载角色列表失败:', error)
    ElMessage.error('加载角色列表失败')
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return null
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
  loadUsers()
  loadRoles()
})

// 使用 useFilter composable
const { filteredData: baseFilteredUsers } = useFilter(users, {
  searchFields: ['username', 'email', 'phone'],
  searchQuery: searchKeyword
})

// 应用筛选器
const filteredUsers = computed(() => {
  let result = baseFilteredUsers.value

  // 状态筛选
  if (statusFilter.value === 'active') {
    result = result.filter(user => user.isActive)
  } else if (statusFilter.value === 'inactive') {
    result = result.filter(user => !user.isActive)
  }

  // 角色筛选
  if (roleFilter.value) {
    result = result.filter(user => user.roleId === roleFilter.value)
  }

  return result
})

// 计算属性
const activeUsersCount = computed(() => {
  return users.value.filter(user => user.isActive).length
})

const inactiveUsersCount = computed(() => {
  return users.value.filter(user => !user.isActive).length
})

// 方法
const handleSearch = (query) => {
  searchKeyword.value = query
}

const handleFilterChange = () => {
  // 筛选器已通过computed自动响应
}

const getRoleText = (role) => {
  if (!role) return '未分配'
  const roleObj = availableRoles.value.find(r => r.id === role.id || r.id === role)
  return roleObj ? roleObj.name : '未知角色'
}

const getRoleTagType = (role) => {
  if (!role) return 'info'
  const roleObj = availableRoles.value.find(r => r.id === role.id || r.id === role)
  if (!roleObj) return 'info'

  // 根据角色名称返回不同类型
  if (roleObj.name.includes('管理员')) return 'danger'
  if (roleObj.name.includes('开发')) return 'warning'
  return 'primary'
}

const handleCreate = () => {
  dialogMode.value = 'create'
  currentUser.value = null
  userDialogVisible.value = true
}

const handleEdit = async (user) => {
  try {
    dialogMode.value = 'edit'
    currentUser.value = user

    // 获取用户详情
    const detail = await getUserDetail(user.id)

    // 填充表单
    userForm.username = detail.username
    userForm.email = detail.email
    userForm.phone = detail.phone || ''
    userForm.roleId = detail.roleId
    userForm.isActive = detail.isActive !== false

    userDialogVisible.value = true
  } catch (error) {
    console.error('加载用户详情失败:', error)
    ElMessage.error('加载用户详情失败')
  }
}

const handleUserSubmit = async () => {
  if (!userFormRef.value) return

  userFormRef.value.validate(async (valid) => {
    if (!valid) return

    userSubmitting.value = true

    try {
      const submitData = {
        email: userForm.email,
        phone: userForm.phone,
        roleId: userForm.roleId,
        isActive: userForm.isActive
      }

      if (dialogMode.value === 'create') {
        // 创建用户
        submitData.username = userForm.username
        submitData.password = userForm.password
        await createUser(submitData)
        ElMessage.success(`用户 "${userForm.username}" 创建成功`)
      } else {
        // 更新用户
        await updateUser(currentUser.value.id, submitData)
        ElMessage.success(`用户 "${currentUser.value.username}" 更新成功`)
      }

      // 重新加载列表
      await loadUsers()
      userDialogVisible.value = false
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error(dialogMode.value === 'create' ? '创建用户失败' : '更新用户失败')
    } finally {
      userSubmitting.value = false
    }
  })
}

const resetUserForm = () => {
  userForm.username = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.password = ''
  userForm.roleId = null
  userForm.isActive = true

  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
}

const handleDelete = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteUser(user.id)
    ElMessage.success(`已删除用户 "${user.username}"`)

    // 重新加载列表
    await loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

const handleBatchAction = async (command) => {
  if (command === 'delete') {
    // 获取选中的用户
    const selectedUsers = users.value.filter(user => user.selected)
    if (selectedUsers.length === 0) {
      ElMessage.warning('请先选择要删除的用户')
      return
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedUsers.length} 个用户吗？此操作不可恢复。`,
        '批量删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      const userIds = selectedUsers.map(user => user.id)
      await batchDeleteUsers(userIds)
      ElMessage.success(`已删除 ${selectedUsers.length} 个用户`)

      // 重新加载列表
      await loadUsers()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('批量删除失败:', error)
        ElMessage.error('批量删除失败')
      }
    }
  }
}

const handleResetPassword = (user) => {
  currentUser.value = user
  resetPasswordForm.newPassword = ''
  resetPasswordForm.confirmPassword = ''
  resetPasswordDialogVisible.value = true
}

const handleResetPasswordSubmit = async () => {
  if (!resetPasswordFormRef.value) return

  resetPasswordFormRef.value.validate(async (valid) => {
    if (!valid) return

    resetPasswordSubmitting.value = true

    try {
      await resetUserPassword(currentUser.value.id, resetPasswordForm.newPassword)
      ElMessage.success(`已重置用户 "${currentUser.value.username}" 的密码`)
      resetPasswordDialogVisible.value = false
    } catch (error) {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
    } finally {
      resetPasswordSubmitting.value = false
    }
  })
}

const handleToggleStatus = async (user) => {
  user.statusChanging = true

  try {
    await toggleUserStatus(user.id, user.isActive)
    ElMessage.success(`已${user.isActive ? '启用' : '禁用'}用户 "${user.username}"`)
  } catch (error) {
    console.error('切换用户状态失败:', error)
    ElMessage.error('切换用户状态失败')
    // 恢复状态
    user.isActive = !user.isActive
  } finally {
    user.statusChanging = false
  }
}
</script>

<style scoped>
.user-management-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #0a0b0d;
  color: #ffffff;
  overflow: hidden;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toolbar-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.stat-label {
  color: #9ca3af;
}

.stat-value {
  color: #3b82f6;
  font-weight: 600;
}

.table-container {
  flex: 1;
  overflow: hidden;
  padding: 24px;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.user-email {
  font-size: 12px;
  color: #9ca3af;
}

.phone-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #d1d5db;
}

.time-text {
  font-size: 12px;
  color: #9ca3af;
}

/* Form Tips */
.form-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
