# 组件快速查询表

## 🔍 按使用场景查找组件

### 我想要...创建一个新页面
→ 使用 `PageLayout` 组件

### 我想要...添加页面头部
→ 使用 `PageHeader` 组件

### 我想要...添加面包屑导航
→ 使用 `Breadcrumb` 组件

### 我想要...添加Tab筛选
→ 使用 `TabFilter` 或 `FilterBar` 组件

### 我想要...添加搜索框
→ 使用 `SearchBar` 组件

### 我想要...展示数据表格
→ 使用 `DataTable` 组件

### 我想要...展示统计卡片
→ 使用 `InfoCard` 组件

### 我想要...创建多步骤向导
→ 使用 `StepModal` 组件

### 我想要...添加表单弹窗
→ 使用 `FormModal` 组件

### 我想要...添加删除确认
→ 使用 `ConfirmDialog` 组件

### 我想要...添加操作菜单
→ 使用 `ActionDropdown` 组件

### 我想要...上传文件
→ 使用 `ResourceUploader` 组件

### 我想要...显示加载状态
→ 使用 `LoadingState` 组件

### 我想要...显示空状态
→ 使用 `EmptyState` 组件

### 我想要...显示状态徽章
→ 使用 `StatusBadge` 组件

---

## 📋 组件对比速查表

### 筛选组件对比

| 特性 | TabFilter | FilterBar |
|------|----------|-----------|
| 基础Tab | ✅ | ✅ |
| 数量徽章 | ✅ | ✅ |
| 自定义徽章 | ❌ | ✅ |
| 图标支持 | ❌ | ✅ |
| 多种风格 | ❌ | ✅ (3种) |
| 推荐场景 | 简单筛选 | 复杂筛选 |

**建议:** 优先使用 FilterBar

---

### 上传组件对比

| 特性 | UploadFile | ResourceUploader |
|------|-----------|-----------------|
| 基础上传 | ✅ | ✅ |
| 拖拽上传 | ✅ | ✅ |
| 文件预览 | ❌ | ✅ |
| 自定义文件名 | ❌ | ✅ |
| 自定义字段 | ❌ | ✅ |
| 文件大小验证 | 部分 | ✅ |
| 推荐场景 | 简单上传 | 复杂上传 |

**建议:** 优先使用 ResourceUploader

---

### 弹窗组件对比

| 特性 | FormModal | StepModal | ConfirmDialog |
|------|----------|-----------|--------------|
| 单步表单 | ✅ | ❌ | ❌ |
| 多步向导 | ❌ | ✅ | ❌ |
| 确认操作 | ❌ | ❌ | ✅ |
| 表单验证 | ✅ | 部分 | 部分 |
| 步骤指示器 | ❌ | ✅ | ❌ |
| 二次确认 | ❌ | ❌ | ✅ |

**选择建议:**
- 单步表单 → `FormModal`
- 多步流程 → `StepModal`
- 删除确认 → `ConfirmDialog`

---

## 🎨 组件样式变体

### FilterBar 风格

```vue
<!-- Tab风格（默认） -->
<FilterBar style="tabs" />

<!-- 圆角胶囊风格 -->
<FilterBar style="pills" />

<!-- 按钮风格 -->
<FilterBar style="buttons" />
```

### InfoCard 风格

```vue
<!-- 默认风格 -->
<InfoCard variant="default" />

<!-- 带边框 -->
<InfoCard variant="bordered" />

<!-- 带阴影 -->
<InfoCard variant="shadow" />
```

### LoadingState 类型

```vue
<!-- Spinner加载 -->
<LoadingState type="spinner" />

<!-- 点点加载 -->
<LoadingState type="dots" />

<!-- 脉冲加载 -->
<LoadingState type="pulse" />

<!-- 骨架屏 -->
<LoadingState type="skeleton" />
```

---

## 📏 组件尺寸

大部分组件支持 3 种尺寸:

```vue
<!-- 小号 -->
<Component size="small" />

<!-- 默认 -->
<Component size="default" />

<!-- 大号 -->
<Component size="large" />
```

支持尺寸的组件:
- FilterBar
- Breadcrumb
- LoadingState
- ActionButton

---

## 🎯 常见问题快速解决

### Q: 如何让页面有侧边栏？
A: 使用 PageLayout 组件
```vue
<PageLayout :show-sidebar="true">
  <template #sidebar>侧边栏内容</template>
  主内容
</PageLayout>
```

### Q: 如何实现多步骤创建流程？
A: 使用 StepModal 组件
```vue
<StepModal :steps="[{title: '步骤1'}, {title: '步骤2'}]">
  <template #step-0>第一步内容</template>
  <template #step-1>第二步内容</template>
</StepModal>
```

### Q: 如何添加操作菜单？
A: 使用 ActionDropdown 组件
```vue
<ActionDropdown
  :actions="[
    { label: '编辑', value: 'edit' },
    { label: '删除', value: 'delete', type: 'danger' }
  ]"
  @select="handleAction"
/>
```

### Q: 如何显示加载进度？
A: 使用 LoadingState 组件
```vue
<LoadingState
  type="spinner"
  :show-progress="true"
  :progress="50"
/>
```

### Q: 如何自定义表格样式？
A: 使用 DataTable 的 rowClassName
```vue
<DataTable
  :data="data"
  :columns="columns"
  :row-class-name="({row}) => row.status === 'error' ? 'error-row' : ''"
/>
```

### Q: 如何获取表格选中的行？
A: 监听 selection-change 事件
```vue
<DataTable
  :selection="true"
  @selection-change="handleSelectionChange"
/>

<script setup>
const handleSelectionChange = (selection) => {
  console.log('选中的行:', selection)
}
</script>
```

---

## 🔗 组件组合示例

### 标准列表页组合

```vue
<PageLayout>
  <template #header>
    <PageHeader title="列表页">
      <template #actions>
        <SearchBar v-model="search" />
        <el-button type="primary">新建</el-button>
      </template>
    </PageHeader>
    <FilterBar v-model="filter" :filters="filters" />
  </template>

  <DataTable :data="data" :columns="columns" />
</PageLayout>
```

### Dashboard 组合

```vue
<PageLayout>
  <template #header>
    <PageHeader title="数据概览" />
  </template>

  <div class="dashboard-grid">
    <InfoCard
      title="总用户数"
      :value="12345"
      :trend="15.8"
      icon="User"
    />
    <InfoCard
      title="活跃用户"
      :value="8901"
      :trend="-2.3"
      icon="UserActivity"
    />
    <!-- 更多卡片... -->
  </div>
</PageLayout>
```

### 详情页组合

```vue
<PageLayout :show-sidebar="true">
  <template #header>
    <Breadcrumb :items="breadcrumbs" />
    <PageHeader :title="detail.name">
      <template #actions>
        <ActionDropdown :actions="actions" />
      </template>
    </PageHeader>
  </template>

  <template #sidebar>
    <DetailPanel />
  </template>

  <!-- 详情内容 -->
</PageLayout>
```

---

## 📱 响应式支持

所有组件都支持响应式设计:

- ✅ 桌面端完整功能
- ✅ 平板端自适应
- ✅ 移动端优化显示

特别优化的组件:
- `PageLayout` - 移动端侧边栏折叠
- `FilterBar` - 移动端横向滚动
- `Breadcrumb` - 移动端横向滚动
- `DataTable` - 移动端固定列支持

---

## 🎨 主题定制

所有组件使用 CSS 变量,可以全局定制:

```css
:root {
  /* 背景色 */
  --bg-page: #141517;
  --bg-card: #1a1b1e;
  --bg-elevated: #202124;
  --bg-hover: #2d2e30;

  /* 边框色 */
  --border: #35363a;

  /* 文字色 */
  --text-primary: #e8eaed;
  --text-secondary: #9aa0a6;
  --text-tertiary: #5f6368;
}
```

---

## 🚀 性能优化建议

### 1. 懒加载大组件
```javascript
const StepModal = defineAsyncComponent(() =>
  import('@/components/common/StepModal')
)
```

### 2. 虚拟滚动
DataTable 支持虚拟滚动（大数据量时推荐）:
```vue
<DataTable :height="600" virtual />
```

### 3. 按需加载
只导入需要的组件:
```javascript
import { FilterBar, ActionDropdown } from '@/components/common'
```

---

## 📞 获取帮助

- 查看完整文档: [QUICK_START.md](./QUICK_START.md)
- 查看使用示例: [COMPONENT_USAGE_EXAMPLE.vue](./COMPONENT_USAGE_EXAMPLE.vue)
- 查看重构对比: [REFACTOR_COMPARISON.md](./REFACTOR_COMPARISON.md)
- 查看优化总结: [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md)

---

**最后更新:** 2026-01-04
**组件总数:** 24 个
**覆盖场景:** 100%
