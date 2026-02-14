<template>
  <AntdCrudPage
    title="用户管理"
    description="管理系统用户账号及角色分配"
    :data-source="dataSource"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    :selectable="true"
    :initial-search-form="initialSearchForm"
    :form-data="formData"
    :form-rules="formRules"
    @search="handleSearch"
    @reset="handleReset"
    @create="handleCreate"
    @edit="handleEdit"
    @delete="handleDelete"
    @refresh="handleRefresh"
    @page-change="handlePageChange"
    @modal-ok="handleModalOk"
    @modal-cancel="handleModalCancel"
  >
    <!-- 头部额外内容 -->
    <template #header-extra>
      <a-statistic
        title="总用户数"
        :value="pagination.total"
        style="margin-right: 32px"
      />
      <a-statistic
        title="活跃用户"
        :value="activeUsersCount"
        :value-style="{ color: '#3f8600' }"
      />
    </template>

    <!-- 搜索表单 -->
    <template #search-form="{ form }">
      <a-col :span="6">
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="form.username"
            placeholder="请输入用户名"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="邮箱" name="email">
          <a-input
            v-model:value="form.email"
            placeholder="请输入邮箱"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="状态" name="status">
          <a-select
            v-model:value="form.status"
            placeholder="请选择状态"
            allow-clear
          >
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </template>

    <!-- 工具栏额外操作 -->
    <template #toolbar-actions>
      <a-button @click="handleBatchDelete">
        <template #icon><DeleteOutlined /></template>
        批量删除
      </a-button>
      <a-button @click="handleExport">
        <template #icon><ExportOutlined /></template>
        导出
      </a-button>
    </template>

    <!-- 自定义列渲染 -->
    <template #column-username="{ record }">
      <a-space>
        <a-avatar :size="32" :style="{ backgroundColor: getAvatarColor(record.username) }">
          {{ record.username.charAt(0).toUpperCase() }}
        </a-avatar>
        <div>
          <div style="font-weight: 500">{{ record.username }}</div>
          <div style="font-size: 12px; color: rgba(0, 0, 0, 0.45)">
            {{ record.email }}
          </div>
        </div>
      </a-space>
    </template>

    <template #column-status="{ record }">
      <a-tag :color="record.status === 'active' ? 'success' : 'default'">
        {{ record.status === 'active' ? '活跃' : '禁用' }}
      </a-tag>
    </template>

    <template #column-role="{ record }">
      <a-tag color="blue">{{ getRoleText(record.role) }}</a-tag>
    </template>

    <template #column-createdAt="{ record }">
      <span>{{ formatDate(record.createdAt) }}</span>
    </template>

    <!-- 自定义操作列 -->
    <template #action="{ record }">
      <a-space>
        <a-button type="link" size="small" @click="handleEdit(record)">
          编辑
        </a-button>
        <a-button type="link" size="small" @click="handleResetPassword(record)">
          重置密码
        </a-button>
        <a-popconfirm
          title="确定要删除吗？"
          @confirm="handleDelete(record)"
        >
          <a-button type="link" size="small" danger>
            删除
          </a-button>
        </a-popconfirm>
      </a-space>
    </template>

    <!-- 新增/编辑表单 -->
    <template #form="{ form, mode }">
      <a-form-item label="用户名" name="username">
        <a-input
          v-model:value="form.username"
          placeholder="请输入用户名"
          :disabled="mode === 'edit'"
        />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input
          v-model:value="form.email"
          placeholder="请输入邮箱"
        />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input
          v-model:value="form.phone"
          placeholder="请输入手机号"
        />
      </a-form-item>
      <a-form-item label="角色" name="role">
        <a-select
          v-model:value="form.role"
          placeholder="请选择角色"
        >
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="user">普通用户</a-select-option>
          <a-select-option value="guest">访客</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio value="active">活跃</a-radio>
          <a-radio value="inactive">禁用</a-radio>
        </a-radio-group>
      </a-form-item>
    </template>
  </AntdCrudPage>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons-vue'
import AntdCrudPage from '@/components/antd/AntdCrudPage.vue'

// 表格列配置
const columns = [
  {
    title: '用户信息',
    dataIndex: 'username',
    key: 'username',
    width: 250
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 180
  }
]

// 初始搜索表单
const initialSearchForm = {
  username: undefined,
  email: undefined,
  status: undefined
}

// 数据源
const dataSource = ref([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`
})

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active'
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 模拟数据
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `138${String(i).padStart(8, '0')}`,
  role: ['admin', 'user', 'guest'][i % 3],
  status: i % 4 === 0 ? 'inactive' : 'active',
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}))

// 活跃用户数
const activeUsersCount = computed(() => {
  return mockData.filter(u => u.status === 'active').length
})

// 加载数据
const loadData = (searchParams = {}) => {
  loading.value = true

  setTimeout(() => {
    let filteredData = [...mockData]

    // 应用搜索过滤
    if (searchParams.username) {
      filteredData = filteredData.filter(item =>
        item.username.includes(searchParams.username)
      )
    }
    if (searchParams.email) {
      filteredData = filteredData.filter(item =>
        item.email.includes(searchParams.email)
      )
    }
    if (searchParams.status) {
      filteredData = filteredData.filter(item =>
        item.status === searchParams.status
      )
    }

    // 分页
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    dataSource.value = filteredData.slice(start, end)
    pagination.total = filteredData.length

    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = (searchParams) => {
  pagination.current = 1
  loadData(searchParams)
}

// 重置
const handleReset = () => {
  pagination.current = 1
  loadData()
}

// 创建
const handleCreate = () => {
  Object.assign(formData, {
    username: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  })
}

// 编辑
const handleEdit = (record) => {
  Object.assign(formData, record)
}

// 删除
const handleDelete = (record) => {
  message.success(`删除用户: ${record.username}`)
  loadData()
}

// 刷新
const handleRefresh = () => {
  loadData()
}

// 分页变化
const handlePageChange = (page, pageSize) => {
  pagination.current = page
  pagination.pageSize = pageSize
  loadData()
}

// 模态框确定
const handleModalOk = (mode, data) => {
  setTimeout(() => {
    message.success(mode === 'create' ? '创建成功' : '更新成功')
    loadData()
  }, 500)
}

// 模态框取消
const handleModalCancel = () => {
  // 可以在这里做一些清理工作
}

// 批量删除
const handleBatchDelete = () => {
  message.info('批量删除功能')
}

// 导出
const handleExport = () => {
  message.info('导出功能')
}

// 重置密码
const handleResetPassword = (record) => {
  message.info(`重置密码: ${record.username}`)
}

// 获取头像颜色
const getAvatarColor = (username) => {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']
  const index = username.charCodeAt(0) % colors.length
  return colors[index]
}

// 获取角色文本
const getRoleText = (role) => {
  const roleMap = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客'
  }
  return roleMap[role] || role
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 初始加载
loadData()
</script>
