<template>
  <div class="antd-crud-example-page">
    <AntdCrudTable
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      :selectable="true"
      :initial-search-form="initialSearchForm"
      @search="handleSearch"
      @reset="handleReset"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
      @refresh="handleRefresh"
      @page-change="handlePageChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 自定义搜索表单 -->
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

      <!-- 自定义工具栏操作 -->
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
          <a-avatar :size="32">
            {{ record.username.charAt(0).toUpperCase() }}
          </a-avatar>
          <span>{{ record.username }}</span>
        </a-space>
      </template>

      <template #column-email="{ record }">
        <a-typography-text copyable>
          {{ record.email }}
        </a-typography-text>
      </template>

      <template #column-status="{ record }">
        <a-tag :color="record.status === 'active' ? 'success' : 'default'">
          {{ record.status === 'active' ? '活跃' : '禁用' }}
        </a-tag>
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
          <a-button type="link" size="small" @click="handleView(record)">
            查看
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
    </AntdCrudTable>

    <!-- 创建/编辑对话框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalMode === 'create' ? '新建用户' : '编辑用户'"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input
            v-model:value="formData.email"
            placeholder="请输入邮箱"
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formData.status" placeholder="请选择状态">
            <a-select-option value="active">活跃</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons-vue'
import AntdCrudTable from '@/components/antd/AntdCrudTable.vue'

// 表格列配置
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 200
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 250
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

// 模拟数据
const mockData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: i % 3 === 0 ? 'inactive' : 'active',
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}))

// 对话框
const modalVisible = ref(false)
const modalMode = ref('create')
const modalLoading = ref(false)
const formRef = ref(null)
const formData = reactive({
  username: '',
  email: '',
  status: 'active'
})

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 加载数据
const loadData = (searchParams = {}) => {
  loading.value = true

  // 模拟 API 请求
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
  modalMode.value = 'create'
  modalVisible.value = true
  Object.assign(formData, {
    username: '',
    email: '',
    status: 'active'
  })
}

// 编辑
const handleEdit = (record) => {
  modalMode.value = 'edit'
  modalVisible.value = true
  Object.assign(formData, record)
}

// 查看
const handleView = (record) => {
  message.info(`查看用户: ${record.username}`)
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

// 选择变化
const handleSelectionChange = (keys, rows) => {
  console.log('选中的行:', keys, rows)
}

// 批量删除
const handleBatchDelete = () => {
  message.info('批量删除功能')
}

// 导出
const handleExport = () => {
  message.info('导出功能')
}

// 对话框确定
const handleModalOk = async () => {
  try {
    await formRef.value.validate()
    modalLoading.value = true

    // 模拟 API 请求
    setTimeout(() => {
      message.success(modalMode.value === 'create' ? '创建成功' : '更新成功')
      modalVisible.value = false
      modalLoading.value = false
      loadData()
    }, 500)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 对话框取消
const handleModalCancel = () => {
  formRef.value?.resetFields()
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 初始加载
loadData()
</script>

