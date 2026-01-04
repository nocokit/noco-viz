# 公共组件开发与优化计划

**生成时间**: 2026-01-03
**分析范围**: 28个模块化页面
**目标**: 提升代码复用率,减少重复开发

---

## 📊 现状分析

### ✅ 已开发组件 (12个)

#### 核心组件 (4个)
1. **DataTable** - 数据表格
2. **FormModal** - 表单弹窗
3. **StatusBadge** - 状态标签
4. **EmptyState** - 空状态

#### 视图组件 (4个)
5. **CardGrid** - 卡片网格
6. **SearchBar** - 搜索工具栏
7. **PageHeader** - 页面头部
8. **TabFilter** - 标签筛选器

#### 功能组件 (4个)
9. **UploadFile** - 文件上传
10. **FolderTree** - 文件夹树
11. **DetailPanel** - 详情侧边栏
12. **ConfirmDialog** - 确认对话框

### 📈 使用情况统计

#### Element Plus 原生组件使用频率
```
el-form-item      80次  ⭐⭐⭐⭐⭐ (极高频)
el-table-column   25次  ⭐⭐⭐⭐
el-form           18次  ⭐⭐⭐⭐
el-dialog         15次  ⭐⭐⭐ (8个文件)
el-table           4次  ⭐⭐ (4个文件)
el-tree            2次  ⭐ (2个文件)
el-drawer          1次  ⭐
```

#### 自定义组件使用模式
```
自定义卡片布局    7个文件  (ProjectList, TemplateLibrary等)
自定义表格       4个文件  (DataCenter, RoleList等)
文件上传功能     5个文件  (DataCenter, SystemSettings等)
自定义弹窗       8个文件  (各类编辑弹窗)
自定义Drawer     1个文件  (DataCenter)
```

#### 公共组件库使用情况
```
使用中:  1个文件 (RoleListRefactored.vue)
未使用: 27个文件 (待迁移)
使用率:  3.6% ❌ 极低!
```

---

## 🎯 待开发组件清单

### 优先级 P0 - 急需 (4个)

#### 1. ProjectCard (项目卡片) ⭐⭐⭐⭐⭐
**需求来源**: 7个文件使用卡片布局
**功能**: 统一的项目/模板卡片组件

**使用场景**:
- ProjectList - 项目卡片
- TemplateLibrary - 模板卡片
- MediaLibrary - 媒体文件卡片
- CustomComponents - 自定义组件卡片

**Props设计**:
```typescript
interface ProjectCardProps {
  title: string              // 标题
  description?: string       // 描述
  coverImage?: string        // 封面图
  type: 'screen' | 'report' | 'template' | 'media'
  status?: 'draft' | 'published' | 'archived'
  meta?: {                   // 元信息
    author?: string
    updatedAt?: Date
    views?: number
  }
  actions?: CardAction[]     // 操作按钮
}
```

**示例**:
```vue
<ProjectCard
  :title="project.title"
  :cover="project.cover"
  type="screen"
  status="published"
  @click="handleClick"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

---

#### 2. DataDrawer (数据抽屉) ⭐⭐⭐⭐⭐
**需求来源**: 1个使用,但可替换多个el-dialog
**功能**: 统一的侧边抽屉组件

**使用场景**:
- DataCenter - SQL编辑器抽屉
- 数据预览抽屉
- 详情查看抽屉
- 配置编辑抽屉

**Props设计**:
```typescript
interface DataDrawerProps {
  modelValue: boolean        // v-model
  title: string
  width?: string | number    // 宽度,默认600px
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
  showClose?: boolean
  maskClosable?: boolean
  showFooter?: boolean
  loading?: boolean
}
```

**特点**:
- 支持暗色主题
- 内置loading状态
- 统一的footer布局
- 支持嵌套抽屉

---

#### 3. TabNavigation (标签导航) ⭐⭐⭐⭐⭐
**需求来源**: DataCenter等多个页面使用自定义tab
**功能**: 统一的标签页导航组件

**使用场景**:
- DataCenter - 数据集/连接配置切换
- ProjectList - 全部项目/我创建的/协作项目
- SystemSettings - 设置分组导航

**Props设计**:
```typescript
interface TabNavigationProps {
  modelValue: string | number  // v-model
  tabs: TabItem[]
  type?: 'card' | 'border' | 'plain'
  closable?: boolean
  addable?: boolean
}

interface TabItem {
  name: string | number
  label: string
  icon?: Component
  badge?: string | number
  disabled?: boolean
}
```

**示例**:
```vue
<TabNavigation
  v-model="activeTab"
  :tabs="[
    { name: 'datasets', label: '数据集管理', badge: 12 },
    { name: 'connections', label: '连接配置', badge: 5 }
  ]"
  type="card"
/>
```

---

#### 4. ActionButton (操作按钮组) ⭐⭐⭐⭐
**需求来源**: 表格操作列大量重复
**功能**: 统一的操作按钮组

**使用场景**:
- 表格操作列
- 卡片操作区
- 工具栏按钮组

**Props设计**:
```typescript
interface ActionButtonProps {
  actions: ActionItem[]
  size?: 'small' | 'default' | 'large'
  type?: 'text' | 'button' | 'dropdown'
  max?: number  // 超过时显示为dropdown
}

interface ActionItem {
  label: string
  icon?: Component
  type?: 'primary' | 'success' | 'warning' | 'danger'
  disabled?: boolean | (() => boolean)
  visible?: boolean | (() => boolean)
  handler: () => void
}
```

**示例**:
```vue
<ActionButton
  :actions="[
    { label: '编辑', icon: Edit, handler: handleEdit },
    { label: '删除', type: 'danger', handler: handleDelete }
  ]"
  type="text"
  :max="2"
/>
```

---

### 优先级 P1 - 重要 (5个)

#### 5. DataPreview (数据预览) ⭐⭐⭐⭐
**需求来源**: DataCenter, DatasetManagement
**功能**: 统一的数据预览组件

**特点**:
- 支持表格预览
- 支持JSON预览
- 支持分页
- 支持导出

---

#### 6. QueryBuilder (查询构建器) ⭐⭐⭐⭐
**需求来源**: DataCenter SQL编辑
**功能**: SQL查询构建和编辑

**特点**:
- 代码高亮
- 语法提示
- 格式化
- 快捷操作

---

#### 7. ConnectionForm (连接配置表单) ⭐⭐⭐⭐
**需求来源**: ConnectionManagement, DataCenter
**功能**: 数据源连接配置表单

**特点**:
- 支持多种数据库类型
- 自动表单验证
- 连接测试
- 配置导入导出

---

#### 8. FilterBar (高级筛选栏) ⭐⭐⭐
**需求来源**: 多个列表页面
**功能**: 增强版搜索筛选

**特点**:
- 多条件组合
- 快速筛选预设
- 保存筛选方案
- 统计信息显示

---

#### 9. BreadcrumbNav (面包屑导航) ⭐⭐⭐
**需求来源**: 导航一致性需求
**功能**: 统一的面包屑导航

**特点**:
- 自动路由集成
- 自定义分隔符
- 支持下拉菜单
- 返回上一级

---

### 优先级 P2 - 优化 (6个)

#### 10. StatsCard (统计卡片) ⭐⭐⭐
**需求来源**: Dashboard, 监控页面
**功能**: 数据统计卡片

**特点**:
- 支持趋势图
- 支持图标
- 多种样式
- 响应式

---

#### 11. TimelineView (时间轴) ⭐⭐
**需求来源**: AuditLog, 操作记录
**功能**: 时间轴展示

---

#### 12. CodeEditor (代码编辑器) ⭐⭐⭐⭐
**需求来源**: DataCenter SQL编辑
**功能**: 集成Monaco Editor

---

#### 13. JSONViewer (JSON查看器) ⭐⭐⭐
**需求来源**: 数据预览,调试工具
**功能**: JSON格式化展示

---

#### 14. ImageUploader (图片上传) ⭐⭐⭐
**需求来源**: MediaLibrary, ProjectList封面
**功能**: 增强版图片上传

**特点**:
- 图片裁剪
- 批量上传
- 预览
- 拖拽排序

---

#### 15. PermissionTree (权限树) ⭐⭐⭐
**需求来源**: RolePermission
**功能**: 权限树选择器

---

---

## 🔄 现有组件优化计划

### 1. DataTable 优化 ⭐⭐⭐⭐⭐

**当前问题**:
- 未在实际页面中使用
- 可能与实际需求不匹配

**优化方向**:
```typescript
// 增强功能
- 虚拟滚动支持 (大数据量)
- 列冻结 (freeze columns)
- 列宽调整
- 列拖拽排序
- 行拖拽排序
- 行内编辑
- 多级表头
- 树形数据
- 汇总行
- 导出Excel
```

**优先增强**:
1. 虚拟滚动 - 支持10000+行数据
2. 列冻结 - 固定左右列
3. 导出功能 - 一键导出Excel/CSV

---

### 2. FormModal 优化 ⭐⭐⭐⭐

**当前问题**:
- 基础功能完善,但缺少高级特性

**优化方向**:
```typescript
// 增强功能
- 步骤式表单 (Wizard)
- 表单联动
- 动态表单项
- 自动保存草稿
- 表单模板
```

---

### 3. SearchBar 优化 ⭐⭐⭐⭐

**当前问题**:
- 功能单一,只支持简单搜索

**优化方向**:
```typescript
// 增强为 FilterBar
- 多字段搜索
- 高级筛选
- 筛选预设
- 保存筛选条件
- 导出筛选结果
```

---

### 4. CardGrid 优化 ⭐⭐⭐

**当前问题**:
- 未使用,需要结合ProjectCard

**优化方向**:
```typescript
// 与ProjectCard配合
- 响应式列数
- 虚拟滚动
- 懒加载
- 拖拽排序
- 多选模式
```

---

### 5. UploadFile 优化 ⭐⭐⭐⭐

**当前问题**:
- 5个文件有上传需求,但未使用此组件

**优化方向**:
```typescript
// 增强功能
- 大文件分片上传
- 断点续传
- 上传进度
- 文件预览
- 拖拽上传
- 粘贴上传
- 格式限制
- 大小限制
```

---

## 📋 开发优先级

### Phase 1: 紧急需求 (1-2周)
```
1. ProjectCard       - 统一卡片组件
2. TabNavigation     - 标签导航
3. DataTable优化     - 虚拟滚动+导出
4. ActionButton      - 操作按钮组
```

**目标**:
- 覆盖70%常见场景
- ProjectList/TemplateLibrary可迁移

---

### Phase 2: 核心功能 (2-3周)
```
5. DataDrawer        - 抽屉组件
6. DataPreview       - 数据预览
7. FilterBar         - 高级筛选
8. QueryBuilder      - SQL编辑器
9. ConnectionForm    - 连接配置
```

**目标**:
- DataCenter可完整迁移
- 覆盖90%常见场景

---

### Phase 3: 增强体验 (3-4周)
```
10. CodeEditor       - 代码编辑器
11. ImageUploader    - 图片上传
12. StatsCard        - 统计卡片
13. PermissionTree   - 权限树
14. JSONViewer       - JSON查看
15. BreadcrumbNav    - 面包屑
```

**目标**:
- 所有页面可迁移
- 开发效率提升60%

---

## 🎯 迁移路线图

### 阶段一: 简单页面 (使用现有组件)
```
✅ RoleList           - 已完成 (RoleListRefactored)
⏳ IPWhitelist        - 待迁移
⏳ BackupRestore      - 待迁移
⏳ RecycleBin         - 待迁移
⏳ AuditLog           - 待迁移
```

### 阶段二: 中等复杂页面 (需要新组件)
```
⏳ ProjectList        - 需要 ProjectCard + TabNavigation
⏳ TemplateLibrary    - 需要 ProjectCard + FilterBar
⏳ MediaLibrary       - 需要 ImageUploader + FolderTree
⏳ DatasourceManagement - 需要 ConnectionForm
```

### 阶段三: 复杂页面 (需要多个新组件)
```
⏳ DataCenter         - 需要 TabNavigation + DataDrawer + QueryBuilder + DataPreview
⏳ OrganizationManagement - 需要 TreeView + FormModal
⏳ SystemSettings     - 需要 TabNavigation + 各类表单
```

---

## 📊 预期收益

### 开发效率
| 指标 | 现状 | Phase 1 | Phase 2 | Phase 3 |
|------|------|---------|---------|---------|
| 组件覆盖率 | 3.6% | 40% | 70% | 95% |
| 代码复用率 | 15% | 35% | 55% | 75% |
| 新页面开发时间 | 4h | 3h | 2h | 1.5h |
| 使用公共组件页面 | 1个 | 8个 | 18个 | 28个 |

### 代码质量
```
重复代码减少:     15% → 70% → 85%
维护成本降低:     - → 30% → 60%
Bug修复效率提升:  - → 50% → 80%
UI一致性:        30% → 80% → 100%
```

---

## 🛠️ 技术要求

### 组件开发规范
```vue
<!-- 1. 完整的TypeScript类型定义 -->
<script setup lang="ts">
interface ProjectCardProps {
  title: string
  type: 'screen' | 'report'
}
const props = defineProps<ProjectCardProps>()
</script>

<!-- 2. 完整的事件定义 -->
<script setup lang="ts">
const emit = defineEmits<{
  click: [project: Project]
  edit: [project: Project]
  delete: [project: Project]
}>()
</script>

<!-- 3. Slot支持 -->
<template>
  <div class="project-card">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </div>
</template>

<!-- 4. CSS变量支持 -->
<style scoped>
.project-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}
</style>
```

### 文档要求
```markdown
每个组件必须包含:
1. README.md - 组件说明
2. 使用示例
3. Props API
4. Events API
5. Slots说明
6. 最佳实践
```

### 测试要求
```javascript
// 单元测试
import { mount } from '@vue/test-utils'
import ProjectCard from './index.vue'

describe('ProjectCard', () => {
  it('renders title correctly', () => {
    const wrapper = mount(ProjectCard, {
      props: { title: 'Test Project' }
    })
    expect(wrapper.text()).toContain('Test Project')
  })
})
```

---

## 📝 总结

### 当前状态
- ✅ 已开发: 12个基础组件
- ❌ 使用率: 仅3.6%
- ⚠️ 问题: 组件与实际需求脱节

### 核心任务
1. **优先开发4个P0组件** (ProjectCard, TabNavigation, DataDrawer, ActionButton)
2. **优化现有DataTable** (虚拟滚动+导出)
3. **迁移简单页面** (验证组件可用性)
4. **迭代改进** (根据反馈优化)

### 成功标准
- Phase 1后: 8个页面迁移成功
- Phase 2后: 18个页面迁移成功
- Phase 3后: 28个页面全部迁移
- 代码复用率达到75%+
- 开发效率提升60%+

---

**下一步行动**:
1. Review本计划,确认优先级
2. 开始Phase 1开发
3. 建立组件开发规范
4. 创建组件库文档站点

**预计完成时间**: 6-8周
**负责人**: 前端开发团队
**状态**: 📋 待启动
