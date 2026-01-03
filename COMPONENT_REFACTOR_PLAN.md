# 组件重构开发计划

## 📊 项目概览

**分析范围**: 47个Vue文件
**识别的公共组件**: 15个
**识别的Composables**: 7个
**识别的Utils工具**: 7个
**预期代码复用率提升**: 40-50%

---

## 🎯 第一阶段：核心基础组件（第1-2周）

### 1. DataTable 数据表格组件
**优先级**: ⭐⭐⭐⭐⭐
**影响范围**: 11个页面
**开发工时**: 3天

**功能特性**:
- 暗色主题支持
- 分页、排序、搜索
- 多选功能
- 自定义列渲染（插槽）
- 操作按钮列
- 空状态提示
- Loading状态

**涉及文件**:
- `src/views/RoleList.vue`
- `src/views/OrganizationManagement.vue`
- `src/views/MediaLibrary.vue`
- `src/views/IPWhitelist.vue`
- `src/views/BackupRestore.vue`
- `src/views/AuditLog.vue`
- `src/views/RecycleBin.vue`
- `src/views/DataCenter.vue`
- `src/views/DatasetManagement.vue`
- `src/views/DatasourceManagement.vue`
- `src/views/PlaylistManagement.vue`

**API设计**:
```vue
<DataTable
  :columns="columns"
  :data="data"
  :loading="loading"
  :pagination="pagination"
  :selection="true"
  :actions="rowActions"
  @row-click="handleRowClick"
  @selection-change="handleSelectionChange"
  @page-change="handlePageChange"
>
  <template #column-name="{ row }">
    <div class="name-cell">
      <div class="name">{{ row.name }}</div>
      <div class="description">{{ row.description }}</div>
    </div>
  </template>
</DataTable>
```

---

### 2. FormModal 表单弹窗组件
**优先级**: ⭐⭐⭐⭐⭐
**影响范围**: 13个页面
**开发工时**: 2天

**功能特性**:
- el-dialog + el-form 组合
- 新增/编辑模式切换
- 表单验证
- 提交loading状态
- 统一的footer按钮
- 自定义表单内容（插槽）

**涉及文件**:
- `src/views/DataCenter.vue`
- `src/views/DatasetManagement.vue`
- `src/views/DatasourceManagement.vue`
- `src/views/RolePermission.vue`
- `src/views/OrganizationManagement.vue`
- `src/views/ProjectList.vue`
- `src/views/MediaLibrary.vue`
- `src/views/PlaylistManagement.vue`
- `src/views/ConnectionManagement.vue`

**API设计**:
```vue
<FormModal
  v-model:visible="modalVisible"
  :title="isEdit ? '编辑' : '新建'"
  :loading="submitting"
  @submit="handleSubmit"
  @cancel="handleCancel"
>
  <template #form>
    <el-form :model="formData" :rules="formRules" ref="formRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
    </el-form>
  </template>
</FormModal>
```

---

### 3. useTableData Composable
**优先级**: ⭐⭐⭐⭐⭐
**影响范围**: 11个页面
**开发工时**: 1天

**功能特性**:
- 统一的数据加载逻辑
- 分页管理
- 搜索/筛选
- Loading状态管理
- 错误处理

**文件路径**: `src/composables/useTableData.js`

**使用示例**:
```javascript
const {
  loading,
  data,
  total,
  pagination,
  searchQuery,
  loadData,
  handleSearch,
  handlePageChange
} = useTableData(fetchRoleListAPI)

onMounted(() => {
  loadData()
})
```

---

### 4. useFormModal Composable
**优先级**: ⭐⭐⭐⭐⭐
**影响范围**: 13个页面
**开发工时**: 1天

**功能特性**:
- 弹窗显示/隐藏管理
- 新增/编辑模式切换
- 表单数据重置
- 提交状态管理

**文件路径**: `src/composables/useFormModal.js`

**使用示例**:
```javascript
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
  defaultFormData: { name: '', description: '' }
})
```

---

### 5. formatters.js 工具函数
**优先级**: ⭐⭐⭐⭐⭐
**影响范围**: 全局
**开发工时**: 0.5天

**功能函数**:
- `formatFileSize(bytes)` - 文件大小格式化
- `formatDateTime(timestamp, format)` - 日期时间格式化
- `formatRelativeTime(timestamp)` - 相对时间
- `formatNumber(num)` - 数字千分位

**文件路径**: `src/utils/formatters.js`

---

## 🚀 第二阶段：视图组件（第3-4周）

### 6. CardGrid 卡片网格组件
**优先级**: ⭐⭐⭐⭐
**影响范围**: 7个页面
**开发工时**: 2天

**功能特性**:
- 响应式网格布局
- 卡片悬停效果
- 自定义卡片内容
- 操作菜单
- 状态标识

**涉及文件**:
- `src/views/DatasetManagement.vue`
- `src/views/DatasourceManagement.vue`
- `src/views/TemplateLibrary.vue`
- `src/views/ProjectList.vue`
- `src/views/MediaLibrary.vue`
- `src/views/DataCenter.vue`
- `src/views/ConnectionManagement.vue`

**API设计**:
```vue
<CardGrid
  :items="items"
  :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
  @card-click="handleCardClick"
>
  <template #card="{ item }">
    <div class="card-header">
      <el-icon :size="40">
        <component :is="item.icon" />
      </el-icon>
    </div>
    <div class="card-body">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
    <div class="card-footer">
      <span>{{ formatDateTime(item.updatedAt) }}</span>
    </div>
  </template>
  <template #actions="{ item }">
    <el-button @click.stop="handleEdit(item)">编辑</el-button>
    <el-button @click.stop="handleDelete(item)">删除</el-button>
  </template>
</CardGrid>
```

---

### 7. SearchBar 搜索工具栏组件
**优先级**: ⭐⭐⭐⭐
**影响范围**: 10个页面
**开发工时**: 2天

**功能特性**:
- 搜索输入框
- 筛选器（下拉/标签）
- 统计信息显示
- 右侧操作按钮区域

**涉及文件**:
- `src/views/DataCenter.vue`
- `src/views/DatasetManagement.vue`
- `src/views/DatasourceManagement.vue`
- `src/views/TemplateLibrary.vue`
- `src/views/RoleList.vue`
- `src/views/OrganizationManagement.vue`
- `src/views/ProjectList.vue`
- `src/views/MediaLibrary.vue`
- `src/views/AuditLog.vue`
- `src/views/PlaylistManagement.vue`

**API设计**:
```vue
<SearchBar
  v-model:keyword="searchQuery"
  :filters="[
    { key: 'type', label: '类型', options: typeOptions },
    { key: 'status', label: '状态', options: statusOptions }
  ]"
  :stats="{ total: 100, active: 50 }"
  @search="handleSearch"
>
  <template #actions>
    <el-button type="primary" @click="handleCreate">新建</el-button>
  </template>
</SearchBar>
```

---

### 8. StatusBadge 状态标签组件
**优先级**: ⭐⭐⭐⭐
**影响范围**: 15个页面
**开发工时**: 0.5天

**功能特性**:
- 预定义状态类型（success/error/warning/info）
- 带圆点指示器
- 自定义颜色

**API设计**:
```vue
<StatusBadge
  :type="'success'"
  :text="'连接正常'"
  :with-dot="true"
/>
```

---

### 9. useSearch Composable
**优先级**: ⭐⭐⭐⭐
**影响范围**: 10个页面
**开发工时**: 1天

**功能特性**:
- 关键词搜索
- 多字段筛选
- 实时过滤
- 重置筛选

**文件路径**: `src/composables/useSearch.js`

---

### 10. useFileUpload Composable
**优先级**: ⭐⭐⭐⭐
**影响范围**: 5个页面
**开发工时**: 1天

**功能特性**:
- 文件选择/移除
- 文件大小验证
- 文件类型验证
- 上传进度
- 错误处理

**文件路径**: `src/composables/useFileUpload.js`

**涉及文件**:
- `src/views/DataCenter.vue`
- `src/views/DatasetManagement.vue`
- `src/views/MediaLibrary.vue`
- `src/views/RolePermission.vue`
- `src/views/DatasourceManagement.vue`

---

## 🎨 第三阶段：辅助组件与工具（第5周）

### 11. PageHeader 页面头部组件
**优先级**: ⭐⭐⭐
**影响范围**: 15个页面
**开发工时**: 1天

**功能特性**:
- 标题 + 副标题
- 面包屑导航
- 右侧操作按钮区域

**API设计**:
```vue
<PageHeader
  title="数据集管理"
  subtitle="管理所有数据集和数据源"
  :breadcrumb="['首页', '数据中心', '数据集管理']"
>
  <template #actions>
    <el-button type="primary">新建数据集</el-button>
  </template>
</PageHeader>
```

---

### 12. TabFilter 标签筛选器组件
**优先级**: ⭐⭐⭐
**影响范围**: 6个页面
**开发工时**: 1天

**功能特性**:
- 标签式筛选
- 下划线高亮
- 计数显示

**涉及文件**:
- `src/views/DataCenter.vue`
- `src/views/DatasourceManagement.vue`
- `src/views/TemplateLibrary.vue`
- `src/views/ProjectList.vue`
- `src/views/RecycleBin.vue`
- `src/views/DatasetManagement.vue`

**API设计**:
```vue
<TabFilter
  v-model="activeTab"
  :tabs="[
    { key: 'all', label: '全部', count: 100 },
    { key: 'database', label: '数据库', count: 50 },
    { key: 'api', label: 'API', count: 30 }
  ]"
/>
```

---

### 13. ConfirmDialog 确认对话框组件
**优先级**: ⭐⭐⭐
**影响范围**: 12个页面
**开发工时**: 1天

**功能特性**:
- 危险操作确认
- 二次确认输入
- 自定义确认文本

---

### 14. useConfirm Composable
**优先级**: ⭐⭐⭐
**影响范围**: 12个页面
**开发工时**: 0.5天

**文件路径**: `src/composables/useConfirm.js`

---

### 15. 其他工具函数
**优先级**: ⭐⭐⭐
**开发工时**: 2天

**工具列表**:
- `validators.js` - 表单验证工具
- `download.js` - 文件下载/导出工具
- `clipboard.js` - 剪贴板工具
- `color.js` - 颜色工具
- `permission.js` - 权限判断工具
- `debounce.js` - 防抖节流工具

---

## 🗂️ 目录结构规划

```
src/
├── components/
│   ├── common/
│   │   ├── DataTable/
│   │   │   ├── index.vue
│   │   │   ├── TableColumn.vue
│   │   │   └── style.css
│   │   ├── FormModal/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── CardGrid/
│   │   │   ├── index.vue
│   │   │   ├── CardItem.vue
│   │   │   └── style.css
│   │   ├── SearchBar/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── StatusBadge/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── PageHeader/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── TabFilter/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── ConfirmDialog/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── UploadFile/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── FolderTree/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   ├── DetailPanel/
│   │   │   ├── index.vue
│   │   │   └── style.css
│   │   └── EmptyState/
│   │       ├── index.vue
│   │       └── style.css
│   └── index.js (统一导出)
├── composables/
│   ├── useTableData.js
│   ├── useFormModal.js
│   ├── useFileUpload.js
│   ├── useSearch.js
│   ├── useConfirm.js
│   ├── useSelection.js
│   └── useConnectionTest.js
└── utils/
    ├── formatters.js
    ├── validators.js
    ├── download.js
    ├── clipboard.js
    ├── color.js
    ├── permission.js
    └── debounce.js
```

---

## 📅 开发时间表

| 阶段 | 时间 | 任务 | 负责人 |
|------|------|------|--------|
| 第1周 | 1-3天 | DataTable组件开发 | - |
| 第1周 | 4-5天 | FormModal组件开发 | - |
| 第2周 | 1-2天 | useTableData + useFormModal开发 | - |
| 第2周 | 3天 | 工具函数开发 (formatters.js等) | - |
| 第2周 | 4-5天 | 组件迁移测试 (重点页面) | - |
| 第3周 | 1-2天 | CardGrid组件开发 | - |
| 第3周 | 3-4天 | SearchBar组件开发 | - |
| 第3周 | 5天 | StatusBadge + useSearch开发 | - |
| 第4周 | 1-2天 | useFileUpload开发 | - |
| 第4周 | 3-5天 | 全面迁移测试 | - |
| 第5周 | 1-2天 | PageHeader + TabFilter开发 | - |
| 第5周 | 3天 | ConfirmDialog + useConfirm开发 | - |
| 第5周 | 4-5天 | 其他工具函数 + 最终优化 | - |

---

## ✅ 迁移检查清单

### 组件迁移
- [ ] DataTable组件 (11个页面)
- [ ] FormModal组件 (13个页面)
- [ ] CardGrid组件 (7个页面)
- [ ] SearchBar组件 (10个页面)
- [ ] StatusBadge组件 (15个页面)
- [ ] PageHeader组件 (15个页面)
- [ ] TabFilter组件 (6个页面)
- [ ] ConfirmDialog组件 (12个页面)
- [ ] UploadFile组件 (5个页面)
- [ ] FolderTree组件 (3个页面)
- [ ] DetailPanel组件 (3个页面)
- [ ] EmptyState组件 (8个页面)

### Composables迁移
- [ ] useTableData (11个页面)
- [ ] useFormModal (13个页面)
- [ ] useFileUpload (5个页面)
- [ ] useSearch (10个页面)
- [ ] useConfirm (12个页面)
- [ ] useSelection (7个页面)
- [ ] useConnectionTest (3个页面)

### Utils迁移
- [ ] formatters.js (全局)
- [ ] validators.js (13个页面)
- [ ] download.js (7个页面)
- [ ] clipboard.js (3个页面)
- [ ] color.js (7个页面)
- [ ] permission.js (全局)
- [ ] debounce.js (全局)

---

## 📈 预期收益

### 代码质量
- **代码复用率**: 提升 40-50%
- **代码行数减少**: 预计减少 3000-5000 行重复代码
- **一致性**: 100% 统一的UI风格和交互逻辑

### 开发效率
- **新页面开发**: 时间减少 30-40%
- **Bug修复**: 修复一次即可解决所有页面问题
- **功能迭代**: 统一组件便于批量升级

### 维护成本
- **样式修改**: 一处修改，全局生效
- **业务逻辑**: 集中管理，易于维护
- **测试覆盖**: 组件级测试覆盖率提升

---

## 🔄 持续优化

### 后续迭代方向
1. **性能优化**: 虚拟滚动、懒加载
2. **可访问性**: ARIA标签、键盘导航
3. **主题系统**: 完善的主题定制能力
4. **国际化**: i18n支持
5. **文档完善**: 组件文档、Storybook
6. **单元测试**: Jest/Vitest测试覆盖

### 监控指标
- 组件复用率统计
- 页面加载性能对比
- 开发时间对比
- Bug数量对比

---

## 📝 注意事项

1. **向后兼容**: 保留旧组件，逐步迁移
2. **渐进式迁移**: 一个页面一个页面迁移测试
3. **文档先行**: 每个组件必须有使用文档
4. **Code Review**: 所有组件必须经过Review
5. **测试覆盖**: 核心组件必须有单元测试
6. **性能监控**: 迁移后监控页面性能变化

---

## 🎯 成功标准

### 技术标准
- [ ] 所有组件通过单元测试
- [ ] 所有组件有完整文档
- [ ] 代码复用率达到 40% 以上
- [ ] 页面性能无明显下降

### 业务标准
- [ ] 所有功能正常运行
- [ ] 用户体验保持一致或提升
- [ ] 无新增严重Bug
- [ ] 迁移过程不影响线上服务

---

**最后更新时间**: 2026-01-03
**文档版本**: v1.0
**状态**: 待执行
