# NocoViz 公共组件设计文档

## 目标
1. **减少模板代码** - 减少重复代码 70%+
2. **统一样式风格** - 所有页面视觉一致
3. **提高可维护性** - 修改一处，全局生效
4. **提升开发效率** - 快速搭建新页面

---

## 组件体系架构

### 一、布局容器组件 (Layout Components)

#### 1. PageContainer 页面容器
**路径**: `components/layout/PageContainer.vue`

**用途**: 所有管理页面的最外层容器

**Props**:
```javascript
{
  padding: String,        // 内边距 '24px' | '16px' | 'none'
  background: String,     // 背景色，默认 var(--el-bg-color)
  fullHeight: Boolean     // 是否占满高度，默认 true
}
```

**Slots**:
- `default`: 页面内容

**使用场景**: 所有管理页面

---

#### 2. PageHeader 页面头部
**路径**: `components/layout/PageHeader.vue`

**用途**: 页面标题、描述、操作按钮区域

**Props**:
```javascript
{
  title: String,          // 页面标题
  subtitle: String,       // 副标题/描述
  showBorder: Boolean,    // 是否显示底部边框，默认 true
  showActions: Boolean    // 是否显示操作区域，默认 true
}
```

**Slots**:
- `title`: 自定义标题区域
- `subtitle`: 自定义描述区域
- `actions`: 右侧操作按钮区域
- `extra`: 标题下方额外内容（如统计信息）

**使用场景**:
- 用户管理 ✓
- 轮播管理 ✓
- 企业模板库 ✓
- IP白名单 ✓
- 审计日志 ✓

---

#### 3. ContentArea 内容区域
**路径**: `components/layout/ContentArea.vue`

**用途**: 页面主内容区域，处理滚动

**Props**:
```javascript
{
  padding: String,        // 内边距
  scrollable: Boolean,    // 是否可滚动，默认 true
  loading: Boolean        // 加载状态
}
```

**Slots**:
- `default`: 内容

---

### 二、筛选和搜索组件 (Filter Components)

#### 4. FilterBar 筛选栏
**路径**: `components/filter/FilterBar.vue`

**用途**: 标签筛选 + 搜索 + 视图切换

**Props**:
```javascript
{
  filters: Array,         // 筛选标签 [{id, label, count}]
  modelValue: String,     // 当前激活的筛选
  showSearch: Boolean,    // 是否显示搜索框
  searchValue: String,    // 搜索值
  searchPlaceholder: String,
  viewModes: Array,       // 视图模式 [{id, label, icon, tooltip}]
  currentView: String     // 当前视图
}
```

**Events**:
- `update:modelValue`: 筛选变化
- `search`: 搜索
- `view-change`: 视图切换

**Slots**:
- `extra`: 额外的筛选控件（如下拉框）

**使用场景**:
- 轮播管理 ✓
- 企业模板库 ✓
- 项目列表 ✓
- 媒体资源库 ✓

---

#### 5. SearchBar 搜索栏
**路径**: `components/filter/SearchBar.vue`

**用途**: 独立的搜索框组件

**Props**:
```javascript
{
  modelValue: String,
  placeholder: String,
  width: String,          // 宽度 '240px'
  clearable: Boolean,
  prefixIcon: String
}
```

**Events**:
- `update:modelValue`
- `search`
- `clear`

**使用场景**:
- 审计日志 ✓
- IP白名单 ✓

---

#### 6. Toolbar 工具栏
**路径**: `components/filter/Toolbar.vue`

**用途**: 表格上方的工具栏（搜索+筛选+操作按钮）

**Props**:
```javascript
{
  title: String,          // 标题（如"白名单规则 (10)"）
  showSearch: Boolean,
  searchPlaceholder: String,
  showCreate: Boolean,    // 是否显示新建按钮
  createText: String      // 新建按钮文字
}
```

**Slots**:
- `left`: 左侧内容
- `filters`: 筛选器区域
- `actions`: 右侧操作按钮

**Events**:
- `search`
- `create`

**使用场景**:
- IP白名单 ✓
- 备份管理 ✓
- 回收站 ✓

---

### 三、表格组件 (Table Components)

#### 7. DataTable 数据表格
**路径**: `components/table/DataTable.vue`

**用途**: 统一样式的数据表格

**Props**:
```javascript
{
  data: Array,            // 表格数据
  columns: Array,         // 列配置
  loading: Boolean,       // 加载状态
  stripe: Boolean,        // 斑马纹
  border: Boolean,        // 边框
  emptyText: String,      // 空数据文本
  rowKey: String,         // 行key
  selectable: Boolean,    // 是否可选择
  pagination: Object      // 分页配置
}
```

**列配置**:
```javascript
{
  prop: String,           // 字段名
  label: String,          // 列标题
  width: String,          // 宽度
  minWidth: String,
  align: String,          // 对齐方式
  fixed: String,          // 固定列
  sortable: Boolean,      // 是否可排序
  formatter: Function,    // 格式化函数
  slot: String            // 自定义插槽名
}
```

**Slots**:
- `column-{prop}`: 自定义列内容
- `empty`: 空状态

**Events**:
- `selection-change`: 选择变化
- `row-click`: 行点击
- `sort-change`: 排序变化

**使用场景**:
- IP白名单 ✓
- 审计日志 ✓
- 用户管理 ✓

---

#### 8. CrudTable CRUD表格
**路径**: `components/table/CrudTable.vue`

**用途**: 带增删改查功能的完整表格

**Props**:
```javascript
{
  data: Array,
  columns: Array,
  loading: Boolean,
  searchPlaceholder: String,
  creatable: Boolean,     // 是否可新建
  createButtonText: String,
  editable: Boolean,      // 是否可编辑
  deletable: Boolean,     // 是否可删除
  selectable: Boolean,    // 是否可批量选择
  batchActions: Array     // 批量操作 [{label, value, type}]
}
```

**Events**:
- `search`
- `create`
- `edit`
- `delete`
- `batch-action`

**Slots**:
- `filters`: 筛选器
- `column-{prop}`: 自定义列
- `actions`: 操作列

**使用场景**:
- 用户管理 ✓

---

### 四、表单组件 (Form Components)

#### 9. FormDialog 表单对话框
**路径**: `components/form/FormDialog.vue`

**用途**: 统一的表单弹窗

**Props**:
```javascript
{
  visible: Boolean,
  title: String,
  width: String,          // 宽度 '600px'
  loading: Boolean,       // 提交加载状态
  confirmText: String,    // 确认按钮文字
  cancelText: String,     // 取消按钮文字
  showFooter: Boolean,    // 是否显示底部
  closeOnClickModal: Boolean
}
```

**Slots**:
- `default`: 表单内容
- `footer`: 自定义底部

**Events**:
- `update:visible`
- `confirm`
- `cancel`

**使用场景**:
- 所有新建/编辑弹窗

---

#### 10. FormBuilder 表单构建器
**路径**: `components/form/FormBuilder.vue`

**用途**: 快速构建表单

**Props**:
```javascript
{
  modelValue: Object,     // 表单数据
  fields: Array,          // 字段配置
  labelPosition: String,  // 标签位置
  labelWidth: String,     // 标签宽度
  rules: Object           // 验证规则
}
```

**字段配置**:
```javascript
{
  prop: String,           // 字段名
  label: String,          // 标签
  type: String,           // 类型: input/select/date/switch/textarea
  placeholder: String,
  options: Array,         // select选项
  required: Boolean,
  disabled: Boolean,
  span: Number            // 栅格占位
}
```

**使用场景**:
- 快速构建简单表单

---

### 五、视图组件 (View Components)

#### 11. GridView 网格视图
**路径**: `components/view/GridView.vue`

**用途**: 响应式网格布局

**Props**:
```javascript
{
  data: Array,
  columns: Number,        // 列数，默认 auto-fill
  minWidth: String,       // 最小宽度 '320px'
  gap: String,            // 间距 '20px'
  loading: Boolean
}
```

**Slots**:
- `item`: 卡片内容
- `empty`: 空状态

**使用场景**:
- 项目列表 ✓
- 企业模板库 ✓
- 轮播管理（网格模式）✓

---

#### 12. SplitView 分栏视图
**路径**: `components/view/SplitView.vue`

**用途**: 左右分栏布局

**Props**:
```javascript
{
  leftWidth: String,      // 左侧宽度 '350px'
  gap: String,            // 间距 '20px'
  resizable: Boolean      // 是否可调整大小
}
```

**Slots**:
- `left`: 左侧内容
- `right`: 右侧内容

**使用场景**:
- 轮播管理（分栏模式）✓
- 媒体资源库 ✓
- 组织架构 ✓

---

### 六、状态组件 (State Components)

#### 13. EmptyState 空状态
**路径**: `components/state/EmptyState.vue`

**用途**: 空数据展示

**Props**:
```javascript
{
  icon: String,           // 图标类型
  title: String,
  description: String,
  actionText: String,     // 操作按钮文字
  actionVisible: Boolean
}
```

**Slots**:
- `icon`: 自定义图标
- `action`: 自定义操作

**使用场景**: 所有空列表场景

---

#### 14. LoadingState 加载状态
**路径**: `components/state/LoadingState.vue`

**用途**: 加载中展示

**Props**:
```javascript
{
  text: String,           // 加载文字
  fullscreen: Boolean,    // 是否全屏
  background: String      // 背景色
}
```

---

#### 15. ErrorState 错误状态
**路径**: `components/state/ErrorState.vue`

**用途**: 错误信息展示

**Props**:
```javascript
{
  title: String,
  message: String,
  showRetry: Boolean,     // 是否显示重试按钮
  retryText: String
}
```

**Events**:
- `retry`

---

### 七、卡片组件 (Card Components)

#### 16. InfoCard 信息卡片
**路径**: `components/card/InfoCard.vue`

**用途**: 配置卡片（如IP白名单配置）

**Props**:
```javascript
{
  title: String,
  description: String,
  icon: String,
  bordered: Boolean
}
```

**Slots**:
- `title`: 标题区域
- `description`: 描述区域
- `actions`: 右侧操作区域
- `footer`: 底部区域

**使用场景**:
- IP白名单配置 ✓
- 系统设置 ✓

---

#### 17. StatCard 统计卡片
**路径**: `components/card/StatCard.vue`

**用途**: 数据统计展示

**Props**:
```javascript
{
  title: String,
  value: [String, Number],
  icon: String,
  trend: String,          // 趋势 'up' | 'down'
  trendValue: String,     // 趋势值
  color: String           // 主题色
}
```

**使用场景**:
- Dashboard
- 监控页面

---

### 八、其他通用组件

#### 18. StatusBadge 状态徽章
**路径**: `components/common/StatusBadge.vue`

**Props**:
```javascript
{
  status: String,         // success/warning/danger/info
  text: String,
  dot: Boolean            // 是否显示圆点
}
```

---

#### 19. ActionMenu 操作菜单
**路径**: `components/common/ActionMenu.vue`

**Props**:
```javascript
{
  actions: Array          // [{label, value, icon, type, divided}]
}
```

**Events**:
- `action`: 操作点击

---

#### 20. ConfirmButton 确认按钮
**路径**: `components/common/ConfirmButton.vue`

**Props**:
```javascript
{
  title: String,          // 确认标题
  message: String,        // 确认消息
  type: String,           // 按钮类型
  confirmText: String,
  cancelText: String
}
```

**Events**:
- `confirm`

---

## 样式规范

### 统一的CSS变量
```css
/* 间距 */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-xxl: 24px;

/* 圆角 */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;

/* 边框 */
--border-color: var(--el-border-color);
--border-color-light: var(--el-border-color-lighter);

/* 背景 */
--bg-page: var(--el-bg-color);
--bg-container: var(--el-bg-color-overlay);
--bg-hover: var(--el-fill-color);

/* 文字 */
--text-primary: var(--el-text-color-primary);
--text-secondary: var(--el-text-color-secondary);
--text-placeholder: var(--el-text-color-placeholder);
```

---

## 使用示例

### 典型页面结构
```vue
<template>
  <PageContainer>
    <!-- 页面头部 -->
    <PageHeader
      title="用户管理"
      subtitle="管理系统用户账号及角色分配"
    >
      <template #actions>
        <el-button type="primary" @click="handleCreate">
          新建用户
        </el-button>
      </template>
    </PageHeader>

    <!-- 筛选栏 -->
    <FilterBar
      v-model="activeFilter"
      :filters="filters"
      :search-value="searchKeyword"
      @search="handleSearch"
    >
      <template #extra>
        <el-select v-model="statusFilter">
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
        </el-select>
      </template>
    </FilterBar>

    <!-- 内容区域 -->
    <ContentArea>
      <DataTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
      >
        <template #column-status="{ row }">
          <StatusBadge :status="row.status" :text="row.statusText" />
        </template>
      </DataTable>
    </ContentArea>

    <!-- 表单弹窗 -->
    <FormDialog
      v-model:visible="dialogVisible"
      title="新建用户"
      @confirm="handleSubmit"
    >
      <el-form :model="formData">
        <!-- 表单内容 -->
      </el-form>
    </FormDialog>
  </PageContainer>
</template>
```

---

## 实施计划

### 第一阶段：基础布局组件（1-2天）
- [x] PageContainer
- [x] PageHeader
- [x] ContentArea
- [x] EmptyState

### 第二阶段：筛选和搜索（1天）
- [x] FilterBar
- [ ] SearchBar
- [ ] Toolbar

### 第三阶段：表格组件（2-3天）
- [ ] DataTable
- [ ] CrudTable

### 第四阶段：表单组件（1-2天）
- [ ] FormDialog
- [ ] FormBuilder

### 第五阶段：视图组件（1天）
- [ ] GridView
- [ ] SplitView

### 第六阶段：其他组件（1天）
- [ ] StatusBadge
- [ ] ActionMenu
- [ ] InfoCard
- [ ] StatCard

### 第七阶段：重构现有页面（3-5天）
- [ ] 轮播管理
- [ ] 企业模板库
- [ ] 用户管理
- [ ] IP白名单
- [ ] 审计日志

---

## 预期收益

1. **代码量减少**: 每个页面减少 300-500 行代码
2. **开发效率**: 新页面开发时间减少 50%
3. **维护成本**: 样式修改一处生效，减少 80% 维护工作
4. **一致性**: 100% 视觉和交互一致
5. **质量提升**: 组件经过充分测试，减少 bug

---

## 注意事项

1. 所有组件必须支持暗色主题
2. 所有组件必须响应式适配
3. 所有组件必须有完整的 TypeScript 类型定义
4. 所有组件必须有使用文档和示例
5. 保持向后兼容，逐步迁移现有页面
