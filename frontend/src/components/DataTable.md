# DataTable 组件使用文档

统一的表格组件，基于组件库的样式设计，支持多种主题变体。

## 基础用法

```vue
<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
  />
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/DataTable.vue'

const loading = ref(false)
const tableData = ref([
  { id: 1, name: '张三', age: 25, status: '在职' },
  { id: 2, name: '李四', age: 30, status: '离职' }
])

const columns = [
  { label: '姓名', prop: 'name', width: '30%' },
  { label: '年龄', prop: 'age', width: '20%' },
  { label: '状态', prop: 'status', width: '20%', align: 'center' }
]
</script>
```

## 自定义列内容（插槽）

```vue
<template>
  <DataTable
    :data="tableData"
    :columns="columns"
  >
    <!-- 自定义名称列 -->
    <template #name="{ row }">
      <div class="name-cell">
        <div class="name">{{ row.name }}</div>
        <div class="desc">{{ row.description }}</div>
      </div>
    </template>

    <!-- 自定义状态列 -->
    <template #status="{ row }">
      <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
        {{ row.status === 'active' ? '激活' : '禁用' }}
      </el-tag>
    </template>

    <!-- 自定义操作列 -->
    <template #actions="{ row }">
      <el-button link type="primary" size="small" @click="handleEdit(row)">
        编辑
      </el-button>
      <el-button link type="danger" size="small" @click="handleDelete(row)">
        删除
      </el-button>
    </template>
  </DataTable>
</template>

<script setup>
import DataTable from '@/components/DataTable.vue'

const columns = [
  { label: '名称', prop: 'name', width: '30%', slot: 'name' },
  { label: '状态', prop: 'status', width: '20%', align: 'center', slot: 'status' },
  { label: '操作', prop: 'actions', width: '20%', align: 'center', slot: 'actions' }
]
</script>
```

## 主题变体

### Default 主题（默认）
使用 Element Plus CSS 变量，自动适配系统主题。

```vue
<DataTable
  :data="tableData"
  :columns="columns"
  variant="default"
/>
```

### Dark 主题
深色主题，适用于深色背景页面。

```vue
<DataTable
  :data="tableData"
  :columns="columns"
  variant="dark"
/>
```

### Light 主题
浅色主题，适用于浅色背景页面。

```vue
<DataTable
  :data="tableData"
  :columns="columns"
  variant="light"
/>
```

## 加载状态

```vue
<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :loading="loading"
    loading-text="正在加载数据..."
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const tableData = ref([])

onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchData()
    tableData.value = data
  } finally {
    loading.value = false
  }
})
</script>
```

## 空状态

### 默认空状态
```vue
<DataTable
  :data="[]"
  :columns="columns"
  empty-text="暂无数据"
/>
```

### 自定义空状态
```vue
<DataTable
  :data="[]"
  :columns="columns"
>
  <template #empty>
    <div class="custom-empty">
      <el-icon :size="48"><FolderOpened /></el-icon>
      <div>暂无数据，请先添加</div>
      <el-button type="primary" @click="handleAdd">添加数据</el-button>
    </div>
  </template>
</DataTable>
```

## Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 表格数据 | Array | - | [] |
| columns | 列配置 | Array | - | - |
| variant | 主题变体 | String | default / dark / light | default |
| loading | 加载状态 | Boolean | - | false |
| emptyText | 空数据文本 | String | - | 暂无数据 |
| loadingText | 加载文本 | String | - | 加载中... |

## Columns 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| label | 列标题 | String | - | - |
| prop | 列字段名 | String | - | - |
| width | 列宽度 | String | - | - |
| align | 对齐方式 | String | left / center / right | left |
| slot | 自定义插槽名 | String | - | - |

## Slots

| 名称 | 说明 | 参数 |
|------|------|------|
| [column.slot] | 自定义列内容 | { row, column, index } |
| empty | 自定义空状态 | - |

## 完整示例

```vue
<template>
  <div class="page">
    <DataTable
      :data="components"
      :columns="columns"
      :loading="loading"
      variant="dark"
      empty-text="暂无组件数据"
    >
      <!-- 组件名称列 -->
      <template #name="{ row }">
        <div class="component-name-cell">
          <div class="component-name">{{ row.name }}</div>
          <div class="component-desc">{{ row.description }}</div>
        </div>
      </template>

      <!-- 分类列 -->
      <template #category="{ row }">
        <el-tag size="small">{{ row.category }}</el-tag>
      </template>

      <!-- 可见性列 -->
      <template #visibility="{ row }">
        <el-tag :type="row.isPublic ? 'success' : 'info'" size="small">
          {{ row.isPublic ? '公开' : '私有' }}
        </el-tag>
      </template>

      <!-- 时间列 -->
      <template #time="{ row }">
        <span class="time-text">{{ formatDate(row.createdAt) }}</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import { getComponents } from '@/api/component'

const loading = ref(false)
const components = ref([])

const columns = [
  { label: '组件名称', prop: 'name', width: '25%', slot: 'name' },
  { label: '分类', prop: 'category', width: '12%', slot: 'category' },
  { label: '可见性', prop: 'isPublic', width: '10%', align: 'center', slot: 'visibility' },
  { label: '创建时间', prop: 'createdAt', width: '15%', slot: 'time' },
  { label: '操作', prop: 'actions', width: '16%', align: 'center', slot: 'actions' }
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await getComponents()
    components.value = res.data || []
  } finally {
    loading.value = false
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const handleView = (row) => {
  console.log('查看', row)
}

const handleEdit = (row) => {
  console.log('编辑', row)
}

const handleDelete = (row) => {
  console.log('删除', row)
}
</script>

<style scoped>
.component-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.component-name {
  font-weight: 500;
  color: var(--text-main);
}

.component-desc {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time-text {
  font-size: 13px;
  color: var(--text-tertiary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
```

## 样式自定义

组件使用 CSS 变量，可以通过覆盖变量来自定义样式：

```css
.data-table--dark {
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --border: #2d2e33;
  --bg-hover: #26272c;
}
```

## 迁移指南

### 从 el-table 迁移

**之前：**
```vue
<el-table
  :data="tableData"
  :header-cell-style="{ background: 'rgba(0,0,0,0.2)', color: '#9ca3af' }"
  :cell-style="{ background: 'transparent', color: '#fff' }"
>
  <el-table-column label="名称" prop="name" />
  <el-table-column label="状态" prop="status" align="center" />
</el-table>
```

**之后：**
```vue
<DataTable
  :data="tableData"
  :columns="[
    { label: '名称', prop: 'name' },
    { label: '状态', prop: 'status', align: 'center' }
  ]"
  variant="dark"
/>
```

### 从原生 table 迁移

**之前：**
```vue
<table class="data-table">
  <thead>
    <tr>
      <th>名称</th>
      <th>状态</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in data" :key="item.id">
      <td>{{ item.name }}</td>
      <td>{{ item.status }}</td>
    </tr>
  </tbody>
</table>
```

**之后：**
```vue
<DataTable
  :data="data"
  :columns="[
    { label: '名称', prop: 'name' },
    { label: '状态', prop: 'status' }
  ]"
/>
```
