# 公共组件使用指南

## 📚 目录

- [工具函数 Utils](#工具函数-utils)
- [Composables](#composables)
- [UI组件](#ui组件)

---

## 工具函数 Utils

### formatters.js - 数据格式化

```javascript
import {
  formatFileSize,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatPercentage
} from '@/utils/formatters'

// 文件大小
formatFileSize(1048576) // '1.0 MB'

// 日期时间
formatDateTime(Date.now()) // '2026-01-03 10:30:00'
formatDateTime(Date.now(), 'YYYY-MM-DD') // '2026-01-03'

// 相对时间
formatRelativeTime(Date.now() - 60000) // '1分钟前'

// 数字千分位
formatNumber(1234567) // '1,234,567'

// 百分比
formatPercentage(0.1234) // '12.3%'
```

### validators.js - 表单验证

```javascript
import {
  emailValidator,
  ipValidator,
  requiredValidator,
  commonRules
} from '@/utils/validators'

// 在表单中使用
const formRules = {
  email: commonRules.email,
  ip: commonRules.ip,
  port: commonRules.port,
  name: [
    requiredValidator('请输入名称'),
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ]
}
```

### color.js - 颜色工具

```javascript
import {
  stringToColor,
  getUserInitials,
  getDbColor,
  getStatusColor
} from '@/utils/color'

// 根据字符串生成颜色
stringToColor('张三') // '#3b82f6'

// 获取用户首字母
getUserInitials('张三') // '张三'
getUserInitials('John Doe') // 'JD'

// 数据库颜色
getDbColor('mysql') // '#409eff'

// 状态颜色
getStatusColor('success') // '#67c23a'
```

### download.js - 文件下载

```javascript
import { exportToCSV, exportToJSON, downloadBlob } from '@/utils/download'

// 导出CSV
exportToCSV(data, 'users', ['name', 'email', 'age'])

// 导出JSON
exportToJSON(data, 'config', true)

// 导出Excel (需安装 xlsx)
await exportToExcel(data, 'report', 'Sheet1')
```

### clipboard.js - 剪贴板

```javascript
import { copyToClipboard, copyLink, copyObjectAsJSON } from '@/utils/clipboard'

// 复制文本
await copyToClipboard('Hello World')

// 复制链接
await copyLink('https://example.com')

// 复制JSON对象
await copyObjectAsJSON({ name: 'test' })
```

---

## Composables

### useTableData - 表格数据管理

```vue
<script setup>
import { useTableData } from '@/composables/useTableData'
import { getRoleListAPI } from '@/api/role'

const {
  loading,
  data,
  total,
  pagination,
  searchQuery,
  filters,
  loadData,
  handleSearch,
  handlePageChange
} = useTableData(getRoleListAPI, {
  pageSize: 20,
  defaultFilters: { status: 'active' }
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <el-input v-model="searchQuery" @change="handleSearch" />
    <DataTable
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
    />
  </div>
</template>
```

### useFormModal - 表单弹窗管理

```vue
<script setup>
import { useFormModal } from '@/composables/useFormModal'
import { createRoleAPI, updateRoleAPI } from '@/api/role'

const {
  modalVisible,
  isEditMode,
  submitting,
  formRef,
  formData,
  openCreate,
  openEdit,
  closeModal,
  handleSubmit
} = useFormModal({
  defaultFormData: { name: '', description: '' },
  onSuccess: (data) => {
    console.log('提交成功', data)
    loadData() // 刷新列表
  }
})

const onSubmit = () => {
  handleSubmit({ create: createRoleAPI, update: updateRoleAPI })
}
</script>

<template>
  <div>
    <el-button @click="openCreate">新建</el-button>

    <FormModal
      v-model="modalVisible"
      :title="isEditMode ? '编辑角色' : '新建角色'"
      :form-data="formData"
      :form-rules="formRules"
      :loading="submitting"
      @submit="onSubmit"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </FormModal>
  </div>
</template>
```

### useSearch - 搜索筛选

```vue
<script setup>
import { ref } from 'vue'
import { useSearch } from '@/composables/useSearch'

const rawData = ref([
  { name: '张三', age: 20, status: 'active' },
  { name: '李四', age: 25, status: 'inactive' }
])

const { searchQuery, filters, filteredData, resetFilters } = useSearch(rawData, {
  searchFields: ['name'],
  defaultFilters: { status: '' }
})
</script>

<template>
  <div>
    <el-input v-model="searchQuery" placeholder="搜索名称" />
    <el-select v-model="filters.status">
      <el-option label="全部" value="" />
      <el-option label="激活" value="active" />
    </el-select>

    <DataTable :data="filteredData" />
  </div>
</template>
```

### useConfirm - 确认对话框

```vue
<script setup>
import { useConfirm } from '@/composables/useConfirm'
import { deleteRoleAPI } from '@/api/role'

const { confirmDelete, confirmAction } = useConfirm()

const handleDelete = async (row) => {
  const confirmed = await confirmDelete(row.name, async () => {
    await deleteRoleAPI(row.id)
  })
  if (confirmed) {
    loadData() // 刷新列表
  }
}
</script>
```

### useFileUpload - 文件上传

```vue
<script setup>
import { useFileUpload } from '@/composables/useFileUpload'
import { uploadFileAPI } from '@/api/upload'

const {
  fileList,
  uploading,
  uploadProgress,
  handleFileChange,
  uploadFile
} = useFileUpload({
  maxSize: 5 * 1024 * 1024, // 5MB
  accept: '.xlsx,.xls,.csv'
})

const handleUpload = async () => {
  const result = await uploadFile(uploadFileAPI)
  if (result) {
    console.log('上传成功', result)
  }
}
</script>

<template>
  <el-upload
    :file-list="fileList"
    :auto-upload="false"
    @change="handleFileChange"
  >
    <el-button>选择文件</el-button>
  </el-upload>
  <el-button @click="handleUpload" :loading="uploading">上传</el-button>
  <el-progress v-if="uploading" :percentage="uploadProgress" />
</template>
```

---

## UI组件

### DataTable - 数据表格

```vue
<template>
  <DataTable
    :data="tableData"
    :loading="loading"
    :columns="columns"
    :pagination="pagination"
    :selection="true"
    :show-index="true"
    :actions="actions"
    @selection-change="handleSelectionChange"
    @page-change="handlePageChange"
  >
    <!-- 自定义列 -->
    <template #column-name="{ row }">
      <div>
        <div class="name">{{ row.name }}</div>
        <div class="description">{{ row.description }}</div>
      </div>
    </template>

    <!-- 自定义操作列 -->
    <template #actions="{ row }">
      <el-button link @click="handleEdit(row)">编辑</el-button>
      <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
    </template>
  </DataTable>
</template>

<script setup>
import { ref } from 'vue'
import { DataTable } from '@/components/common'

const columns = [
  { prop: 'name', label: '名称', width: 200 },
  { prop: 'type', label: '类型', width: 120 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', sortable: true }
]

const actions = [
  {
    label: '编辑',
    type: 'primary',
    handler: (row) => console.log('编辑', row),
    visible: (row) => row.editable // 条件显示
  },
  {
    label: '删除',
    type: 'danger',
    handler: (row) => console.log('删除', row)
  }
]
</script>
```

### FormModal - 表单弹窗

```vue
<template>
  <FormModal
    v-model="visible"
    title="新建角色"
    :form-data="formData"
    :form-rules="formRules"
    :loading="submitting"
    @submit="handleSubmit"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入角色名称" />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="formData.description"
        type="textarea"
        :rows="4"
        placeholder="请输入描述"
      />
    </el-form-item>
  </FormModal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { FormModal } from '@/components/common'
import { requiredValidator } from '@/utils/validators'

const visible = ref(false)
const submitting = ref(false)

const formData = reactive({
  name: '',
  description: ''
})

const formRules = {
  name: [requiredValidator('请输入角色名称')],
  description: [requiredValidator('请输入描述')]
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    // API调用
    await createRoleAPI(formData)
    visible.value = false
  } finally {
    submitting.value = false
  }
}
</script>
```

### StatusBadge - 状态标签

```vue
<template>
  <!-- 使用预定义类型 -->
  <StatusBadge type="success" text="成功" />
  <StatusBadge type="error" text="失败" />
  <StatusBadge type="warning" text="警告" />

  <!-- 使用状态自动推断 -->
  <StatusBadge status="online" />  <!-- 显示"在线" -->
  <StatusBadge status="offline" /> <!-- 显示"离线" -->

  <!-- 自定义颜色 -->
  <StatusBadge color="#ff6b6b" text="自定义" />

  <!-- 不显示圆点 -->
  <StatusBadge type="info" text="信息" :with-dot="false" />
</template>

<script setup>
import { StatusBadge } from '@/components/common'
</script>
```

### EmptyState - 空状态

```vue
<template>
  <!-- 基础用法 -->
  <EmptyState description="暂无数据" />

  <!-- 带操作按钮 -->
  <EmptyState
    description="还没有任何项目"
    action-text="创建项目"
    @action="handleCreate"
  />

  <!-- 自定义图标 -->
  <EmptyState icon="folder" description="文件夹为空" />

  <!-- 完全自定义 -->
  <EmptyState>
    <template #icon>
      <img src="/custom-icon.svg" />
    </template>
    <template #default>
      <div>自定义内容</div>
    </template>
    <template #action>
      <el-button type="primary">自定义按钮</el-button>
    </template>
  </EmptyState>
</template>

<script setup>
import { EmptyState } from '@/components/common'

const handleCreate = () => {
  console.log('创建项目')
}
</script>
```

---

## 完整示例

### 角色管理页面示例

```vue
<template>
  <div class="role-management">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索角色名称"
        @change="handleSearch"
        style="width: 300px"
      />
      <el-button type="primary" @click="openCreate">新建角色</el-button>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="data"
      :loading="loading"
      :columns="columns"
      :pagination="pagination"
      :selection="true"
      :actions="tableActions"
      @selection-change="handleSelectionChange"
      @page-change="handlePageChange"
    >
      <template #column-status="{ row }">
        <StatusBadge :status="row.status" />
      </template>

      <template #column-createdAt="{ row }">
        {{ formatDateTime(row.createdAt) }}
      </template>
    </DataTable>

    <!-- 表单弹窗 -->
    <FormModal
      v-model="modalVisible"
      :title="isEditMode ? '编辑角色' : '新建角色'"
      :form-data="formData"
      :form-rules="formRules"
      :loading="submitting"
      @submit="onSubmit"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="formData.description" type="textarea" />
      </el-form-item>
    </FormModal>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { DataTable, FormModal, StatusBadge } from '@/components/common'
import { useTableData } from '@/composables/useTableData'
import { useFormModal } from '@/composables/useFormModal'
import { useConfirm } from '@/composables/useConfirm'
import { formatDateTime } from '@/utils/formatters'
import { requiredValidator } from '@/utils/validators'
import { getRoleListAPI, createRoleAPI, updateRoleAPI, deleteRoleAPI } from '@/api/role'

// 表格数据管理
const {
  loading,
  data,
  pagination,
  searchQuery,
  loadData,
  handleSearch,
  handlePageChange
} = useTableData(getRoleListAPI, { pageSize: 20 })

// 表单弹窗管理
const {
  modalVisible,
  isEditMode,
  submitting,
  formData,
  openCreate,
  openEdit,
  handleSubmit
} = useFormModal({
  defaultFormData: { name: '', description: '' },
  onSuccess: () => loadData()
})

// 确认对话框
const { confirmDelete } = useConfirm()

// 表格列配置
const columns = [
  { prop: 'name', label: '角色名称', minWidth: 150 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { prop: 'status', label: '状态', width: 100 },
  { prop: 'createdAt', label: '创建时间', width: 180 }
]

// 表格操作
const tableActions = [
  {
    label: '编辑',
    handler: (row) => openEdit(row)
  },
  {
    label: '删除',
    type: 'danger',
    handler: async (row) => {
      await confirmDelete(row.name, async () => {
        await deleteRoleAPI(row.id)
        loadData()
      })
    }
  }
]

// 表单验证
const formRules = {
  name: [requiredValidator('请输入角色名称')],
  description: [requiredValidator('请输入描述')]
}

// 提交表单
const onSubmit = () => {
  handleSubmit({ create: createRoleAPI, update: updateRoleAPI })
}

const handleSelectionChange = (selection) => {
  console.log('选中的数据:', selection)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
```

---

## 全局注册组件（可选）

在 `main.js` 中全局注册:

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import CommonComponents from '@/components/common'

const app = createApp(App)
app.use(CommonComponents) // 全局注册所有公共组件
app.mount('#app')
```

---

## 注意事项

1. **按需引入**: 只引入需要的工具函数和组件,减少打包体积
2. **类型提示**: 建议配合TypeScript使用,获得更好的开发体验
3. **样式覆盖**: 组件样式支持CSS变量覆盖,可在全局样式中自定义
4. **性能优化**: 大数据量表格建议开启虚拟滚动
5. **错误处理**: 所有异步操作都有错误处理,无需额外try-catch

---

## 下一步

查看 `COMPONENT_REFACTOR_PLAN.md` 了解更多组件规划和开发进度。
