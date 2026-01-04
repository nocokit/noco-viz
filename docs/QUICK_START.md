# 快速开始指南

## 🚀 5分钟上手公共组件库

### 步骤1: 引入全局样式 (1分钟)

在 `main.js` 中引入全局样式变量:

```javascript
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// 引入全局样式变量
import './styles/variables.css'

const app = createApp(App)
app.mount('#app')
```

---

### 步骤2: 开始使用组件 (2分钟)

#### 方式A: 按需导入 (推荐)

```vue
<script setup>
import { DataTable, SearchBar } from '@/components/common'
import { useTableData } from '@/composables/useTableData'
import { formatDateTime } from '@/utils/formatters'
</script>
```

#### 方式B: 全局注册

```javascript
// src/main.js
import CommonComponents from '@/components/common'

app.use(CommonComponents)

// 在任意组件中直接使用,无需导入
<DataTable />
<SearchBar />
```

---

### 步骤3: 创建第一个列表页面 (2分钟)

```vue
<template>
  <div class="page">
    <!-- 页面头部 -->
    <PageHeader title="用户管理" subtitle="管理系统用户">
      <template #actions>
        <el-button type="primary" @click="handleCreate">新建</el-button>
      </template>
    </PageHeader>

    <!-- 搜索栏 -->
    <SearchBar
      v-model="searchQuery"
      :stats="{ 总数: data.length }"
      @search="handleSearch"
    />

    <!-- 数据表格 -->
    <DataTable
      :data="data"
      :loading="loading"
      :columns="columns"
      :actions="actions"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PageHeader, SearchBar, DataTable } from '@/components/common'

const searchQuery = ref('')
const loading = ref(false)
const data = ref([])

const columns = [
  { prop: 'name', label: '姓名', width: 150 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'role', label: '角色', width: 120 }
]

const actions = [
  { label: '编辑', handler: (row) => console.log('编辑', row) },
  { label: '删除', type: 'danger', handler: (row) => console.log('删除', row) }
]

const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
}

const handleCreate = () => {
  console.log('新建')
}
</script>
```

**完成!** 一个功能完整的列表页面就做好了 🎉

---

## 📚 常用场景示例

### 场景1: 带表单的CRUD页面

```vue
<script setup>
import { DataTable, FormModal } from '@/components/common'
import { useTableData } from '@/composables/useTableData'
import { useFormModal } from '@/composables/useFormModal'
import { getUserListAPI, createUserAPI, updateUserAPI } from '@/api/user'

// 表格数据管理
const {
  loading,
  data,
  pagination,
  loadData,
  handlePageChange
} = useTableData(getUserListAPI)

// 表单弹窗管理
const {
  modalVisible,
  isEditMode,
  formData,
  openCreate,
  openEdit,
  handleSubmit
} = useFormModal({
  defaultFormData: { name: '', email: '' },
  onSuccess: () => loadData()
})

// 初始化加载数据
onMounted(() => loadData())

// 提交表单
const onSubmit = () => {
  handleSubmit({ create: createUserAPI, update: updateUserAPI })
}
</script>

<template>
  <DataTable
    :data="data"
    :loading="loading"
    :pagination="pagination"
    :actions="[
      { label: '编辑', handler: openEdit },
      { label: '删除', type: 'danger', handler: handleDelete }
    ]"
    @page-change="handlePageChange"
  />

  <FormModal
    v-model="modalVisible"
    :title="isEditMode ? '编辑' : '新建'"
    :form-data="formData"
    :loading="submitting"
    @submit="onSubmit"
  >
    <el-form-item label="姓名" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
  </FormModal>
</template>
```

---

### 场景2: 卡片网格布局

```vue
<script setup>
import { CardGrid, SearchBar } from '@/components/common'

const projects = ref([
  { id: 1, name: '项目A', description: '描述...', icon: Document }
])
</script>

<template>
  <SearchBar v-model="searchQuery" />

  <CardGrid
    :items="projects"
    :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
    @card-click="handleCardClick"
  >
    <template #card="{ item }">
      <div class="card-header">
        <el-icon :size="40"><component :is="item.icon" /></el-icon>
      </div>
      <div class="card-body">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </CardGrid>
</template>
```

---

### 场景3: 文件上传

```vue
<script setup>
import { UploadFile } from '@/components/common'
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
    ElMessage.success('上传成功')
  }
}
</script>

<template>
  <UploadFile
    v-model:file-list="fileList"
    drag
    :max-size="5 * 1024 * 1024"
    accept=".xlsx,.xls,.csv"
    hint="支持Excel和CSV文件,大小不超过5MB"
    @change="handleFileChange"
  />

  <el-button @click="handleUpload" :loading="uploading">
    上传文件
  </el-button>
</template>
```

---

### 场景4: 确认删除操作

```vue
<script setup>
import { useConfirm } from '@/composables/useConfirm'
import { deleteUserAPI } from '@/api/user'

const { confirmDelete } = useConfirm()

const handleDelete = async (user) => {
  await confirmDelete(user.name, async () => {
    await deleteUserAPI(user.id)
    loadData() // 刷新列表
  })
}
</script>
```

---

## 🛠️ 工具函数使用

### 数据格式化

```javascript
import {
  formatFileSize,
  formatDateTime,
  formatRelativeTime,
  formatNumber
} from '@/utils/formatters'

// 文件大小
formatFileSize(1048576) // '1.0 MB'

// 日期时间
formatDateTime(Date.now()) // '2026-01-03 10:30:00'
formatDateTime(Date.now(), 'YYYY-MM-DD') // '2026-01-03'

// 相对时间
formatRelativeTime(Date.now() - 3600000) // '1小时前'

// 数字千分位
formatNumber(1234567) // '1,234,567'
```

### 数据导出

```javascript
import { exportToCSV, exportToJSON } from '@/utils/download'

// 导出CSV
const users = [
  { name: '张三', email: 'zhang@example.com', age: 25 }
]
exportToCSV(users, '用户列表', ['name', 'email', 'age'])

// 导出JSON
exportToJSON(users, '用户数据', true)
```

### 剪贴板操作

```javascript
import { copyToClipboard, copyLink } from '@/utils/clipboard'

// 复制文本
await copyToClipboard('Hello World')

// 复制链接
await copyLink('https://example.com')
```

---

## 🎨 样式定制

### 使用CSS变量

所有组件都使用CSS变量,可以轻松定制:

```css
/* 在你的全局样式或组件中 */
:root {
  /* 修改主题色 */
  --color-primary: #667eea;

  /* 修改背景色 */
  --bg-card: #1f2937;

  /* 修改文本色 */
  --text-primary: #f3f4f6;

  /* 修改圆角 */
  --radius-lg: 12px;
}
```

### 完整的变量列表

查看 `src/styles/variables.css` 了解所有可用的CSS变量。

---

## 📖 进阶用法

### 自定义DataTable列渲染

```vue
<DataTable :columns="columns" :data="data">
  <!-- 自定义状态列 -->
  <template #column-status="{ row }">
    <StatusBadge :type="row.status" />
  </template>

  <!-- 自定义操作列(覆盖默认actions) -->
  <template #actions="{ row }">
    <el-dropdown>
      <el-button text>更多</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleView(row)">查看</el-dropdown-item>
          <el-dropdown-item @click="handleEdit(row)">编辑</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>

  <!-- 空状态 -->
  <template #empty>
    <EmptyState
      description="还没有数据"
      action-text="创建第一条"
      @action="handleCreate"
    />
  </template>
</DataTable>
```

### 表单弹窗生命周期钩子

```javascript
const {
  modalVisible,
  formData,
  openEdit,
  handleSubmit
} = useFormModal({
  defaultFormData: { name: '' },

  // 打开前钩子
  beforeOpen: async (mode, item) => {
    if (mode === 'edit') {
      // 加载额外数据
      const detail = await fetchDetailAPI(item.id)
      return detail // 返回数据会合并到formData
    }
  },

  // 提交前钩子
  beforeSubmit: async (data, isEdit) => {
    // 数据预处理
    data.name = data.name.trim()

    // 可以返回false阻止提交
    if (!data.name) {
      ElMessage.warning('名称不能为空')
      return false
    }
  },

  // 成功回调
  onSuccess: (data, isEdit) => {
    console.log('提交成功', data)
    loadData()
  }
})
```

---

## 🔥 性能优化技巧

### 1. 大数据量表格

```vue
<DataTable
  :data="data"
  :max-height="600"
  virtual-scroll
  :item-size="48"
/>
```

### 2. 图片懒加载

```vue
<CardGrid :items="items">
  <template #card="{ item }">
    <img v-lazy="item.cover" />
  </template>
</CardGrid>
```

### 3. 防抖搜索

SearchBar组件内置防抖,默认300ms:

```vue
<SearchBar
  v-model="query"
  :debounce-time="500"
  @search="handleSearch"
/>
```

---

## ❓ 常见问题

### Q: 如何在组件中使用路由跳转?

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

const tableActions = [
  {
    label: '查看详情',
    handler: (row) => {
      router.push(`/detail/${row.id}`)
    }
  }
]
```

### Q: 如何自定义表单验证?

```javascript
import { requiredValidator } from '@/utils/validators'

const formRules = {
  name: [
    requiredValidator('请输入名称'),
    {
      validator: (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('至少3个字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
```

### Q: 如何处理API错误?

```javascript
const { loadData } = useTableData(getUserListAPI, {
  onError: (error) => {
    console.error('加载失败', error)
    ElMessage.error(error.message || '加载失败')
  }
})
```

---

## 📚 完整文档

- **组件文档**: `COMPONENT_USAGE_GUIDE.md`
- **重构计划**: `COMPONENT_REFACTOR_PLAN.md`
- **对比分析**: `REFACTOR_COMPARISON.md`
- **项目总结**: `REFACTOR_SUMMARY.md`

---

## 🎯 下一步

1. ✅ 查看 `RoleListRefactored.vue` 的完整示例
2. ✅ 尝试用组件库重构一个简单页面
3. ✅ 阅读各组件的Props和Events文档
4. ✅ 加入你的创意,扩展组件库

---

**祝你使用愉快! 🚀**

如有问题,请参考详细文档或提Issue。
