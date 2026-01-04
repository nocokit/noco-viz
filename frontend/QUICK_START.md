# 公共组件库使用指南

## 🚀 快速开始

### 1. 全局注册（推荐）

在 `main.js` 中全局注册所有公共组件：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import CommonComponents from '@/components/common'

const app = createApp(App)

// 全局注册所有公共组件
app.use(CommonComponents)

app.mount('#app')
```

### 2. 按需导入

如果不想全局注册，也可以按需导入：

```vue
<script setup>
import { PageHeader, FilterBar, ActionDropdown } from '@/components/common'
</script>
```

---

## 📦 组件分类

### 布局组件

#### PageLayout - 页面布局
标准页面布局，支持侧边栏、头部、内容区

```vue
<PageLayout :show-sidebar="true" sidebar-width="300px">
  <template #sidebar>侧边栏内容</template>
  <template #header>头部内容</template>
  主内容区
</PageLayout>
```

#### PageHeader - 页面头部
统一的页面头部，支持标题、副标题、面包屑、操作按钮

```vue
<PageHeader title="项目列表" subtitle="管理所有项目">
  <template #actions>
    <el-button type="primary">新建</el-button>
  </template>
</PageHeader>
```

---

### 筛选和导航

#### FilterBar - 增强筛选栏 ⭐ 新组件
支持 3 种风格（tabs/pills/buttons），数量徽章，图标

```vue
<FilterBar
  v-model="activeFilter"
  :filters="[
    { id: 'all', label: '全部', count: 10 },
    { id: 'published', label: '已发布', count: 5, badge: 'Hot' }
  ]"
  style="tabs"
/>
```

**风格对比：**
- `tabs`: Tab 风格，下划线高亮（默认）
- `pills`: 圆角胶囊风格
- `buttons`: 按钮风格

#### TabFilter - 简单 Tab 筛选
基础 Tab 筛选组件

```vue
<TabFilter
  v-model="activeTab"
  :tabs="[
    { value: 'all', label: '全部', count: 10 }
  ]"
/>
```

#### SearchBar - 搜索框
统一的搜索框组件

```vue
<SearchBar v-model="keyword" placeholder="搜索..." />
```

---

### 弹窗组件

#### StepModal - 多步骤弹窗 ⭐ 新组件
适用于复杂的多步骤流程（如创建向导）

```vue
<StepModal
  v-model="visible"
  title="新建项目"
  :steps="[
    { title: '选择类型' },
    { title: '基本信息' },
    { title: '高级配置' }
  ]"
  :step-validator="validateStep"
  @finish="handleFinish"
>
  <template #step-0="{ formData }">
    <!-- 第一步内容 -->
  </template>
  <template #step-1="{ formData }">
    <!-- 第二步内容 -->
  </template>
  <template #step-2="{ formData }">
    <!-- 第三步内容 -->
  </template>
</StepModal>

<script setup>
const validateStep = (stepIndex, formData) => {
  // 返回 true 允许进入下一步，false 禁用下一步按钮
  if (stepIndex === 0) {
    return !!formData.type
  }
  return true
}
</script>
```

#### FormModal - 表单弹窗
带表单验证的弹窗

```vue
<FormModal
  v-model="visible"
  title="编辑信息"
  :form-data="formData"
  :form-rules="rules"
  :loading="submitting"
  @submit="handleSubmit"
>
  <el-form-item label="名称" prop="name">
    <el-input v-model="formData.name" />
  </el-form-item>
</FormModal>
```

#### ConfirmDialog - 确认对话框
替代 `ElMessageBox.confirm`，功能更强大

```vue
<ConfirmDialog
  v-model="visible"
  title="删除确认"
  message="确定要删除吗？此操作不可恢复。"
  type="danger"
  confirm-text="删除"
  @confirm="handleDelete"
/>
```

**支持二次输入确认：**

```vue
<ConfirmDialog
  v-model="visible"
  title="删除确认"
  message="请输入项目名称以确认删除"
  type="danger"
  :require-input="true"
  input-placeholder="请输入项目名称"
  :input-validator="(value) => value === projectName"
  @confirm="handleDelete"
/>
```

---

### 操作组件

#### ActionDropdown - 操作下拉菜单 ⭐ 新组件
统一的操作菜单，支持图标、分隔线、危险操作高亮

```vue
<ActionDropdown
  :actions="[
    { label: '编辑', value: 'edit', icon: Edit },
    { label: '复制', value: 'duplicate', icon: Copy },
    { label: '删除', value: 'delete', type: 'danger', icon: Delete, divided: true }
  ]"
  @select="handleAction"
/>
```

**自定义触发器：**

```vue
<ActionDropdown :actions="actions" @select="handleAction">
  <template #trigger>
    <el-button>操作</el-button>
  </template>
</ActionDropdown>
```

#### ActionButton - 操作按钮
快捷操作按钮组件

---

### 文件和上传

#### ResourceUploader - 资源上传 ⭐ 新组件
功能完整的上传组件，支持预览、重命名、自定义字段

```vue
<ResourceUploader
  v-model="uploadVisible"
  title="上传文件"
  accept="image/*,video/*"
  :max-size="50 * 1024 * 1024"
  :allow-rename="true"
  :custom-fields="[
    {
      name: 'tags',
      label: '标签',
      type: 'select',
      multiple: true,
      filterable: true,
      allowCreate: true,
      options: [
        { label: '背景', value: '背景' },
        { label: '装饰', value: '装饰' }
      ]
    },
    {
      name: 'folderId',
      label: '所属文件夹',
      type: 'select',
      options: folderOptions
    }
  ]"
  @upload="handleUpload"
/>

<script setup>
const handleUpload = (uploadData) => {
  // uploadData 是一个数组，包含所有上传的文件信息
  uploadData.forEach(item => {
    console.log('文件:', item.file)
    console.log('自定义名称:', item.name)
    console.log('标签:', item.tags)
    console.log('文件夹:', item.folderId)
  })
}
</script>
```

#### UploadFile - 简单上传
基础文件上传组件

#### FolderTree - 文件夹树
左侧文件夹树组件

---

### 数据展示

#### DataTable - 数据表格
统一样式的数据表格

#### CardGrid - 卡片网格
卡片网格布局

#### ProjectCard - 项目卡片
专用的项目卡片组件

#### EmptyState - 空状态
空状态展示

```vue
<EmptyState description="暂无数据">
  <el-button type="primary">创建第一个</el-button>
</EmptyState>
```

#### StatusBadge - 状态徽章
状态标签组件

#### DetailPanel - 详情面板
右侧详情面板

---

## 🎯 最佳实践

### 1. 优先使用现有组件

❌ **不推荐：**
```vue
<!-- 自己实现页面头部 -->
<div class="page-header">
  <div class="header-left">
    <h1>项目列表</h1>
    <p>管理所有项目</p>
  </div>
  <div class="header-right">
    <el-button>新建</el-button>
  </div>
</div>
```

✅ **推荐：**
```vue
<!-- 使用 PageHeader 组件 -->
<PageHeader title="项目列表" subtitle="管理所有项目">
  <template #actions>
    <el-button>新建</el-button>
  </template>
</PageHeader>
```

### 2. 使用 StepModal 处理多步骤流程

❌ **不推荐：**
```vue
<!-- 手动管理步骤状态 -->
<el-dialog v-model="visible">
  <div v-if="step === 1">...</div>
  <div v-else-if="step === 2">...</div>
  <div v-else>...</div>

  <template #footer>
    <el-button v-if="step > 1" @click="step--">上一步</el-button>
    <el-button v-if="step < 3" @click="step++">下一步</el-button>
    <el-button v-else @click="submit">完成</el-button>
  </template>
</el-dialog>
```

✅ **推荐：**
```vue
<!-- 使用 StepModal 自动管理 -->
<StepModal
  v-model="visible"
  :steps="steps"
  @finish="submit"
>
  <template #step-0>...</template>
  <template #step-1>...</template>
  <template #step-2>...</template>
</StepModal>
```

### 3. 使用 ConfirmDialog 替代 ElMessageBox

❌ **不推荐：**
```javascript
ElMessageBox.confirm(
  '确定要删除吗？',
  '删除确认',
  { type: 'warning' }
).then(() => {
  handleDelete()
})
```

✅ **推荐：**
```vue
<ConfirmDialog
  v-model="deleteVisible"
  title="删除确认"
  message="确定要删除吗？"
  type="danger"
  @confirm="handleDelete"
/>
```

### 4. 使用 ActionDropdown 统一操作菜单

❌ **不推荐：**
```vue
<el-dropdown @command="handleCommand">
  <span>操作</span>
  <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item command="edit">编辑</el-dropdown-item>
      <el-dropdown-item command="delete">删除</el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>
```

✅ **推荐：**
```vue
<ActionDropdown
  :actions="[
    { label: '编辑', value: 'edit', icon: Edit },
    { label: '删除', value: 'delete', type: 'danger', icon: Delete }
  ]"
  @select="handleCommand"
/>
```

---

## 📝 组件速查表

| 功能 | 组件 | 优势 |
|------|------|------|
| 页面布局 | `PageLayout` | 统一布局结构 |
| 页面头部 | `PageHeader` | 支持面包屑、操作按钮 |
| Tab 筛选 | `FilterBar` | 3 种风格，支持徽章 |
| 多步骤流程 | `StepModal` | 自动管理步骤 |
| 表单弹窗 | `FormModal` | 自动验证 |
| 确认对话框 | `ConfirmDialog` | 支持二次确认 |
| 操作菜单 | `ActionDropdown` | 统一样式 |
| 文件上传 | `ResourceUploader` | 功能完整 |
| 空状态 | `EmptyState` | 统一样式 |

---

## 🎨 主题定制

所有组件都使用 CSS 变量，可以全局定制：

```css
:root {
  --bg-page: #141517;
  --bg-card: #1a1b1e;
  --border: #35363a;
  --text-primary: #e8eaed;
  --text-secondary: #9aa0a6;
  --text-tertiary: #5f6368;
}
```

---

## 💡 开发新页面流程

1. **使用 PageLayout 搭建骨架**
```vue
<PageLayout>
  <template #header>...</template>
  主内容
</PageLayout>
```

2. **添加页面头部**
```vue
<PageHeader title="..." subtitle="...">
  <template #actions>...</template>
</PageHeader>
```

3. **添加筛选和搜索**
```vue
<FilterBar v-model="filter" :filters="..." />
```

4. **展示数据列表**
```vue
<div class="grid">
  <!-- 卡片或表格 -->
</div>

<EmptyState v-if="empty" />
```

5. **添加操作菜单**
```vue
<ActionDropdown :actions="..." @select="..." />
```

6. **添加弹窗**
```vue
<StepModal v-model="..." :steps="..." />
<ConfirmDialog v-model="..." />
```

---

## 📞 获取帮助

- 查看组件源码：`frontend/src/components/common/`
- 查看使用示例：`frontend/COMPONENT_USAGE_EXAMPLE.vue`
- 查看完整报告：`frontend/COMPONENT_ENCAPSULATION_REPORT.md`

---

**最后更新：** 2026-01-04
**组件总数：** 17+ 个
**覆盖场景：** 页面布局、筛选、弹窗、上传、操作等
