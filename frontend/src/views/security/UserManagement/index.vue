<template>
  <div class="user-management-page">
    <!-- Header -->
    <PageHeader
      title="用户管理"
      subtitle="管理系统用户账号及角色分配"
      :stats="[
        { label: '总用户数', value: users.length },
        { label: '活跃用户', value: activeUsersCount },
        { label: '禁用用户', value: inactiveUsersCount }
      ]"
    />

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
          <a-select
            v-model:value="statusFilter"
            placeholder="用户状态"
            clearable
            style="width: 140px; margin-left: 12px;"
            @change="handleFilterChange"
          >
            <a-select-option label="全部" value="" />
            <a-select-option label="活跃" value="active" />
            <a-select-option label="禁用" value="inactive" />
          </a-select>
          <a-select
            v-model:value="roleFilter"
            placeholder="用户角色"
            clearable
            style="width: 160px; margin-left: 12px;"
            @change="handleFilterChange"
          >
            <a-select-option label="全部角色" value="" />
            <a-select-option
              v-for="role in availableRoles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </a-select>
        </template>

        <!-- 自定义列 -->
        <template #column-username="{ row }">
          <div class="user-cell">
            <a-avatar :size="32" class="user-avatar">
              {{ row.username.charAt(0).toUpperCase() }}
            </a-avatar>
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
          <a-tag :type="getRoleTagType(row.role)" size="small">
            {{ getRoleText(row.role) }}
          </a-tag>
        </template>

        <template #column-isActive="{ row }">
          <a-switch
            v-model:value="row.isActive"
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
          <a-button
            link
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </a-button>
          <a-button
            link
            type="warning"
            size="small"
            @click="handleResetPassword(row)"
          >
            重置密码
          </a-button>
          <a-button
            link
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </a-button>
        </template>
      </CrudTable>
    </div>

    <!-- 创建用户对话框 -->
    <a-modal
      v-model:open="createDialogVisible"
      title="新建用户"
      width="600px"
      @cancel="resetUserForm"
    >
      <a-form
        ref="createFormRef"
        :model="userForm"
        :rules="userFormRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="userForm.username"
            placeholder="请输入用户名"
            :maxlength="50"
          />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input
            v-model:value="userForm.email"
            placeholder="请输入邮箱地址"
            :maxlength="100"
          />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input
            v-model:value="userForm.phone"
            placeholder="请输入手机号（可选）"
            :maxlength="20"
          />
        </a-form-item>

        <a-form-item label="角色" name="roleId">
          <a-select
            v-model:value="userForm.roleId"
            placeholder="请选择用户角色"
          >
            <a-select-option
              v-for="role in availableRoles"
              :key="role.id"
              :value="role.id"
            >
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="初始密码" name="password">
          <a-input-password
            v-model:value="userForm.password"
            placeholder="请输入初始密码（至少6位）"
            :maxlength="50"
          />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">用户首次登录后应修改密码</div>
        </a-form-item>

        <a-form-item label="用户状态" name="isActive">
          <a-radio-group v-model:value="userForm.isActive">
            <a-radio :value="true">启用</a-radio>
            <a-radio :value="false">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="createDialogVisible = false">取消</a-button>
        <a-button
          type="primary"
          @click="handleCreateSubmit"
          :loading="userSubmitting"
        >
          创建
        </a-button>
      </template>
    </a-modal>

    <!-- 编辑用户抽屉 -->
    <a-drawer
      v-model:open="userDrawerVisible"
      title="用户详情"
      width="720"
      :body-style="{ paddingBottom: '80px' }"
      @close="resetUserForm"
    >
      <a-tabs v-model:activeKey="activeTab">
        <!-- 基本信息 Tab -->
        <a-tab-pane key="info" tab="基本信息">
          <a-form
            ref="userFormRef"
            :model="userForm"
            :rules="editFormRules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="用户名">
              <a-input
                :value="userForm.username"
                disabled
              />
            </a-form-item>

            <a-form-item label="邮箱" name="email">
              <a-input
                v-model:value="userForm.email"
                placeholder="请输入邮箱地址"
                :maxlength="100"
              />
            </a-form-item>

            <a-form-item label="手机号" name="phone">
              <a-input
                v-model:value="userForm.phone"
                placeholder="请输入手机号（可选）"
                :maxlength="20"
              />
            </a-form-item>

            <a-form-item label="用户状态" name="isActive">
              <a-radio-group v-model:value="userForm.isActive">
                <a-radio :value="true">启用</a-radio>
                <a-radio :value="false">禁用</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="创建时间">
              <span>{{ currentUser?.createdAt || '-' }}</span>
            </a-form-item>

            <a-form-item label="最后登录">
              <span>{{ currentUser?.lastLoginAt || '从未登录' }}</span>
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 角色权限 Tab -->
        <a-tab-pane key="role" tab="角色权限">
          <a-form
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="当前角色">
              <a-select
                v-model:value="userForm.roleId"
                placeholder="请选择用户角色"
              >
                <a-select-option
                  v-for="role in availableRoles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-divider />

            <div v-if="currentUserRole" style="padding: 16px; background: #f5f5f5; border-radius: 4px;">
              <h4 style="margin-bottom: 12px;">角色信息</h4>
              <p><strong>角色名称：</strong>{{ currentUserRole.name }}</p>
              <p><strong>角色描述：</strong>{{ currentUserRole.description || '无' }}</p>
              <p><strong>权限数量：</strong>{{ currentUserRole.permissions?.length || 0 }}</p>

              <a-divider style="margin: 16px 0;" />

              <h4 style="margin-bottom: 12px;">权限列表</h4>
              <div v-if="currentUserRole.permissions && currentUserRole.permissions.length > 0">
                <a-tag
                  v-for="permission in currentUserRole.permissions"
                  :key="permission.id"
                  style="margin-bottom: 8px;"
                >
                  {{ permission.name }}
                </a-tag>
              </div>
              <div v-else style="color: #999;">
                该角色暂无权限
              </div>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>

      <div
        style="
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          border-top: 1px solid #e9e9e9;
          padding: 10px 16px;
          background: #fff;
          text-align: right;
        "
      >
        <a-button style="margin-right: 8px" @click="userDrawerVisible = false">
          取消
        </a-button>
        <a-button
          type="primary"
          @click="handleEditSubmit"
          :loading="userSubmitting"
        >
          保存
        </a-button>
      </div>
    </a-drawer>

    <!-- 重置密码对话框 -->
    <a-modal
      v-model:value="resetPasswordDialogVisible"
      title="重置用户密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <a-form
        ref="resetPasswordFormRef"
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        label-position="top"
      >
        <a-alert
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
        </a-alert>

        <a-form-item label="新密码" prop="newPassword">
          <a-input
            v-model:value="resetPasswordForm.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            show-password
            maxlength="50"
          />
        </a-form-item>

        <a-form-item label="确认密码" prop="confirmPassword">
          <a-input
            v-model:value="resetPasswordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            maxlength="50"
          />
        </a-form-item>
      </a-form>

      <template #footer>
        <span class="dialog-footer">
          <a-button @click="resetPasswordDialogVisible = false">取消</a-button>
          <a-button
            type="primary"
            @click="handleResetPasswordSubmit"
            :loading="resetPasswordSubmitting"
          >
            确认重置
          </a-button>
        </span>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons-vue'

// 组件导入
import CrudTable from '@/components/business/CrudTable.vue'
import PageHeader from '@/components/PageHeader.vue'

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
const createDialogVisible = ref(false)
const userDrawerVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const activeTab = ref('info')
const currentUser = ref(null)
const userSubmitting = ref(false)
const resetPasswordSubmitting = ref(false)

// 表单引用
const createFormRef = ref(null)
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

const editFormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
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

    // 处理返回的数据
    users.value = (Array.isArray(data) ? data : []).map(user => ({
      ...user,
      statusChanging: false,
      isActive: user.isActive !== false,
      createdAt: formatTime(user.createdAt),
      lastLoginAt: formatTime(user.lastLoginAt)
    }))
  } catch (error) {
    console.error('加载用户列表失败:', error)
    message.error('加载用户列表失败')
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
    message.error('加载角色列表失败')
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

const currentUserRole = computed(() => {
  if (!userForm.roleId) return null
  return availableRoles.value.find(role => role.id === userForm.roleId)
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
  resetUserForm()
  createDialogVisible.value = true
}

const handleEdit = async (user) => {
  try {
    currentUser.value = user
    activeTab.value = 'info'

    // 获取用户详情
    const detail = await getUserDetail(user.id)

    // 填充表单
    userForm.username = detail.username
    userForm.email = detail.email
    userForm.phone = detail.phone || ''
    userForm.roleId = detail.roleId
    userForm.isActive = detail.isActive !== false

    userDrawerVisible.value = true
  } catch (error) {
    console.error('加载用户详情失败:', error)
    message.error('加载用户详情失败')
  }
}

const handleCreateSubmit = async () => {
  if (!createFormRef.value) return

  try {
    await createFormRef.value.validate()
    userSubmitting.value = true

    const submitData = {
      username: userForm.username,
      email: userForm.email,
      phone: userForm.phone,
      password: userForm.password,
      roleId: userForm.roleId,
      isActive: userForm.isActive
    }

    await createUser(submitData)
    message.success(`用户 "${userForm.username}" 创建成功`)

    // 重新加载列表
    await loadUsers()
    createDialogVisible.value = false
  } catch (error) {
    if (error.errorFields) {
      // 表单验证错误
      return
    }
    console.error('创建用户失败:', error)
    message.error('创建用户失败')
  } finally {
    userSubmitting.value = false
  }
}

const handleEditSubmit = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()
    userSubmitting.value = true

    const submitData = {
      email: userForm.email,
      phone: userForm.phone,
      roleId: userForm.roleId,
      isActive: userForm.isActive
    }

    await updateUser(currentUser.value.id, submitData)
    message.success(`用户 "${currentUser.value.username}" 更新成功`)

    // 重新加载列表
    await loadUsers()
    userDrawerVisible.value = false
  } catch (error) {
    if (error.errorFields) {
      // 表单验证错误
      return
    }
    console.error('更新用户失败:', error)
    message.error('更新用户失败')
  } finally {
    userSubmitting.value = false
  }
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
    await Modal.confirm(
      `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteUser(user.id)
    message.success(`已删除用户 "${user.username}"`)

    // 重新加载列表
    await loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      message.error('删除用户失败')
    }
  }
}

const handleBatchAction = async (command) => {
  if (command === 'delete') {
    // 获取选中的用户
    const selectedUsers = users.value.filter(user => user.selected)
    if (selectedUsers.length === 0) {
      message.warning('请先选择要删除的用户')
      return
    }

    try {
      await Modal.confirm(
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
      message.success(`已删除 ${selectedUsers.length} 个用户`)

      // 重新加载列表
      await loadUsers()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('批量删除失败:', error)
        message.error('批量删除失败')
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
      message.success(`已重置用户 "${currentUser.value.username}" 的密码`)
      resetPasswordDialogVisible.value = false
    } catch (error) {
      console.error('重置密码失败:', error)
      message.error('重置密码失败')
    } finally {
      resetPasswordSubmitting.value = false
    }
  })
}

const handleToggleStatus = async (user) => {
  user.statusChanging = true

  try {
    await toggleUserStatus(user.id, user.isActive)
    message.success(`已${user.isActive ? '启用' : '禁用'}用户 "${user.username}"`)
  } catch (error) {
    console.error('切换用户状态失败:', error)
    message.error('切换用户状态失败')
    // 恢复状态
    user.isActive = !user.isActive
  } finally {
    user.statusChanging = false
  }
}
</script>

