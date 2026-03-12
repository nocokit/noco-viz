# 组件重构计划 - Ant Design Vue 标准化

## 📊 现状分析

### 组件使用对比

| 组件类型 | 原生HTML | Ant Design | 覆盖率 | 优先级 |
|---------|---------|-----------|--------|--------|
| 按钮 | 106 | 225 | 68% | 🔴 P0 |
| 输入框 | 53 | 115 | 68% | 🔴 P0 |
| 下拉选择 | 16 | 143 | 90% | 🟡 P1 |
| 表格 | 13 | 29 | 69% | 🟡 P1 |
| 复选框 | 8 | 58 | 88% | 🟢 P2 |
| 文本域 | 6 | 11 | 65% | 🟢 P2 |
| 单选框 | 0 | 19 | 100% | ✅ 完成 |
| 模态框 | 0 | 27 | 100% | ✅ 完成 |

**总结**: 已有 68% 的按钮和输入框使用了 Ant Design，但仍有 32% 使用原生组件，导致样式不统一。

---

## 🎯 重构目标

1. **统一组件体系** - 所有交互组件使用 Ant Design Vue
2. **支持多主题** - 通过 ConfigProvider 统一管理主题
3. **降低维护成本** - 移除自定义 CSS，使用 Design Token
4. **提升用户体验** - 统一的交互反馈和视觉效果

---

## 📋 问题文件清单（24个）

### 🔴 P0 - 通用组件（影响面大，必须优先）

#### Simple 系列组件（4个）
- `components/simple/SimpleCrudModal.vue` - CRUD 模态框
- `components/simple/SimpleSearchForm.vue` - 搜索表单
- `components/simple/SimpleTable.vue` - 简单表格
- `components/simple/SimpleToolbar.vue` - 工具栏

**影响**: 这些是基础组件，被多个业务页面引用，改完后其他页面自动生效

#### 卡片组件（5个）
- `components/MediaCard.vue` - 媒体卡片
- `components/TemplateCard.vue` - 模板卡片
- `components/common/ProjectCard/index.vue` - 项目卡片
- `components/workspace/PlaylistCard.vue` - 播放列表卡片
- `components/workspace/ProjectCard.vue` - 工作区项目卡片

**影响**: 卡片是主要展示形式，样式统一性很重要

---

### 🟡 P1 - 核心业务页面（8个）

#### 工作台模块
- `views/workspace/ProjectList/index.vue` - 项目列表
- `views/workspace/PlaylistManagement/index.vue` - 轮播管理
- `views/workspace/PlaylistManagement/PlaylistConfig.vue` - 轮播配置
- `views/workspace/TemplateLibrary/index.vue` - 模板库
- `views/workspace/TemplateLibrary/components/TemplateCard.vue` - 模板卡片

#### 数据中心模块
- `views/datasource/DataCenter/index.vue` - 数据中心
- `views/datasource/ExcelDataDetail/index.vue` - Excel详情

#### 安全模块
- `views/security/OrganizationManagement/index.vue` - 组织管理

---

### 🟢 P2 - 特殊场景页面（7个）

#### 编辑器（可能需要保留部分原生组件）
- `views/ScreenEditor.vue` - 大屏编辑器
- `views/editor/ReportEditor/index.vue` - 报表编辑器
- `components/data/MockDataEditor.vue` - 数据编辑器

**建议**: 编辑器内的控制按钮可能需要特殊样式，评估后决定

#### 预览/展示页面
- `views/preview/PreviewScreen/index.vue` - 大屏预览
- `views/assets/MediaLibrary/index.vue` - 媒体库

#### 系统设置
- `views/settings/BackupRestore/index.vue` - 备份恢复

#### 其他
- `components/Toolbar.vue` - 通用工具栏

---

## 🔧 重构策略

### 1. 必须替换的场景

```vue
<!-- ❌ 错误：原生按钮 -->
<button class="btn btn-primary" @click="handleSubmit">提交</button>

<!-- ✅ 正确：Ant Design 按钮 -->
<a-button type="primary" @click="handleSubmit">提交</a-button>
```

**适用场景**:
- 表单提交/取消按钮
- 工具栏操作按钮
- 列表/卡片的操作按钮
- 所有需要跟随主题的按钮

### 2. 可以保留的场景

```vue
<!-- ✅ 可以保留：特殊交互的自定义按钮 -->
<button class="chart-control-btn" @click="zoomIn">
  <svg>...</svg>
</button>
```

**适用场景**:
- 图表编辑器内的控制按钮（缩放、拖拽等）
- 大屏展示的装饰性按钮（特殊视觉效果）
- 性能敏感的高频操作（如画布拖拽）

### 3. 需要封装的场景

如果某个场景需要特殊样式，应该封装成组件：

```vue
<!-- components/ChartControlButton.vue -->
<template>
  <a-button :class="['chart-control', type]" v-bind="$attrs">
    <slot />
  </a-button>
</template>
```

---

## 📝 重构规范

### 按钮替换对照表

| 原生写法 | Ant Design 写法 | 说明 |
|---------|----------------|------|
| `<button class="btn-primary">` | `<a-button type="primary">` | 主按钮 |
| `<button class="btn-default">` | `<a-button>` | 默认按钮 |
| `<button class="btn-danger">` | `<a-button danger>` | 危险按钮 |
| `<button class="btn-link">` | `<a-button type="link">` | 链接按钮 |
| `<button class="btn-text">` | `<a-button type="text">` | 文本按钮 |
| `<button class="btn-sm">` | `<a-button size="small">` | 小按钮 |
| `<button class="btn-lg">` | `<a-button size="large">` | 大按钮 |
| `<button disabled>` | `<a-button :disabled="true">` | 禁用状态 |
| `<button class="btn-loading">` | `<a-button :loading="true">` | 加载状态 |

### 输入框替换对照表

| 原生写法 | Ant Design 写法 | 说明 |
|---------|----------------|------|
| `<input type="text">` | `<a-input>` | 文本输入 |
| `<input type="password">` | `<a-input-password>` | 密码输入 |
| `<input type="number">` | `<a-input-number>` | 数字输入 |
| `<input placeholder="搜索">` | `<a-input placeholder="搜索">` | 占位符 |
| `<textarea>` | `<a-textarea>` | 多行文本 |

### 其他组件替换

| 原生写法 | Ant Design 写法 |
|---------|----------------|
| `<select>` | `<a-select>` |
| `<input type="checkbox">` | `<a-checkbox>` |
| `<table>` | `<a-table>` |

---

## 🚀 执行计划

### Phase 1: 通用组件重构（预计 2-3 天）

1. **Simple 系列组件**（4个文件）
   - SimpleCrudModal.vue
   - SimpleSearchForm.vue
   - SimpleTable.vue
   - SimpleToolbar.vue

   **验证**: 运行所有使用这些组件的页面，确保功能正常

2. **卡片组件**（5个文件）
   - MediaCard.vue
   - TemplateCard.vue
   - ProjectCard/index.vue
   - PlaylistCard.vue
   - ProjectCard.vue

   **验证**: 检查卡片展示、hover效果、点击交互

### Phase 2: 核心业务页面（预计 3-4 天）

按模块逐个重构，每个模块改完后完整测试：

1. 工作台模块（5个文件）
2. 数据中心模块（2个文件）
3. 安全模块（1个文件）

### Phase 3: 特殊场景评估（预计 2 天）

1. 评估编辑器页面（3个）- 确定哪些需要保留原生组件
2. 重构预览/展示页面（2个）
3. 重构系统设置页面（1个）
4. 重构通用工具栏（1个）

### Phase 4: 清理与优化（预计 1 天）

1. 删除不再使用的自定义 CSS
2. 统一主题配置
3. 编写组件使用文档
4. Code Review

---

## ✅ 验收标准

1. **功能完整性** - 所有功能正常，无回归bug
2. **样式一致性** - 所有按钮、输入框样式统一
3. **主题支持** - 可通过 ConfigProvider 切换主题
4. **代码质量** - 无冗余 CSS，代码简洁
5. **文档完善** - 有明确的组件使用规范

---

## 📌 注意事项

1. **不要一次性全改** - 分批重构，每批改完测试一批
2. **保留 Git 历史** - 每个 Phase 提交一次，方便回滚
3. **关注性能** - 如果某些场景性能下降，考虑保留原生组件
4. **团队沟通** - 重构期间通知团队，避免冲突

---

## 🎓 最佳实践

### 1. 使用 ConfigProvider 统一配置

```vue
<!-- App.vue -->
<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'

const themeStore = useThemeStore()
const themeConfig = computed(() => ({
  token: {
    colorPrimary: themeStore.primaryColor,
    borderRadius: 4,
    // ... 其他主题配置
  }
}))
</script>
```

### 2. 统一按钮尺寸

```vue
<!-- 推荐：使用统一的尺寸规范 -->
<a-button size="small">小按钮</a-button>
<a-button>默认按钮</a-button>
<a-button size="large">大按钮</a-button>

<!-- 避免：自定义尺寸 -->
<button style="width: 80px; height: 32px">自定义</button>
```

### 3. 统一图标使用

```vue
<!-- 推荐：使用 Ant Design Icons -->
<a-button>
  <template #icon><PlusOutlined /></template>
  新建
</a-button>

<!-- 避免：混用不同图标库 -->
<button><i class="custom-icon"></i>新建</button>
```

---

## 📊 预期收益

1. **开发效率提升 30%** - 不再需要写自定义样式
2. **维护成本降低 50%** - 统一组件体系，易于维护
3. **主题切换成本降低 90%** - 通过 Design Token 统一管理
4. **用户体验提升** - 统一的交互反馈和视觉效果

---

**创建时间**: 2026-03-01
**预计完成时间**: 2026-03-08（7个工作日）
**负责人**: 待定
**审核人**: 待定
