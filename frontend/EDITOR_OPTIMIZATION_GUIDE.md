# ScreenEditor 进一步优化指南

## 已完成的优化 ✅

### 1. 组件提取
- ✅ **EditorHeader** - 顶部导航栏 (减少 279 行)
- ✅ **ActivityBar** - 一级侧边栏 (减少 26 行)

### 2. 代码分离
- ✅ **样式提取** - 将 3063 行样式提取到 `ScreenEditor.css` (减少 55%)
- ✅ **Composables 应用** - 使用 useHistory, useCanvas, useClipboard, useAlignment, useComponents

### 3. 代码清理
- ✅ 删除注释掉的旧代码 (减少 81 行)
- ✅ 移除调试日志 (减少 8 行)

### 总体成果
- **原始行数**: 5508 行
- **当前行数**: 2320 行
- **减少比例**: 57.9%

---

## 待优化项目 🔧

### 高优先级

#### 1. 重构超长函数 (initChartPreviews - 539行)
**问题**: `initChartPreviews` 函数包含所有图表类型的预览配置，代码重复且难以维护

**建议方案**:
```javascript
// 方案 A: 提取配置到独立文件
// src/views/editor/config/chartPreviewOptions.js
export const chartPreviewOptions = {
  bar: { /* 配置 */ },
  line: { /* 配置 */ },
  pie: { /* 配置 */ },
  // ...
}

// 方案 B: 使用配置工厂函数
export function createChartPreviewOption(type, data) {
  const baseConfig = {
    backgroundColor: 'transparent',
    grid: { top: 10, bottom: 10, left: 15, right: 10 }
  }

  return {
    ...baseConfig,
    ...getTypeSpecificConfig(type, data)
  }
}
```

**预期收益**: 减少 400+ 行，提高可维护性

#### 2. 提取 SidePanel 组件
**当前状态**: 137 行内联代码，包含三个子面板

**建议方案**:
```vue
<!-- src/views/editor/components/SidePanel.vue -->
<template>
  <aside :class="['side-panel', { collapsed: !isOpen }]">
    <ComponentsPanel v-if="currentTab === 'components'" />
    <LayersPanel v-if="currentTab === 'layers'" />
    <AssetsPanel v-if="currentTab === 'assets'" />
  </aside>
</template>
```

**子组件**:
- `ComponentsPanel.vue` - 组件库面板
- `LayersPanel.vue` - 图层管理面板
- `AssetsPanel.vue` - 资源中心面板

**预期收益**: 减少 100+ 行，提高模块化

#### 3. 提取 ConfigPanel 组件
**当前状态**: 265 行内联代码，包含样式/数据/事件三个tab

**建议方案**:
```vue
<!-- src/views/editor/components/ConfigPanel.vue -->
<template>
  <aside class="config-panel" v-if="selectedComponent">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="style" tab="样式">
        <StyleConfig v-model="selectedComponent" />
      </a-tab-pane>
      <a-tab-pane key="data" tab="数据">
        <DataConfig v-model="selectedComponent" />
      </a-tab-pane>
      <a-tab-pane key="event" tab="事件">
        <EventConfig v-model="selectedComponent" />
      </a-tab-pane>
    </a-tabs>
  </aside>
</template>
```

**预期收益**: 减少 200+ 行，提高可读性

### 中优先级

#### 4. 优化长函数
- `drawRuler` (108行) - 标尺绘制逻辑
- `handleKeyDown` (84行) - 键盘事件处理
- `updateCrosshair` (53行) - 游标更新

**建议**: 拆分为多个小函数，每个函数职责单一

#### 5. 提取 Canvas 组件
**当前状态**: 画布区域代码分散在主文件中

**建议方案**:
```vue
<!-- src/views/editor/components/EditorCanvas.vue -->
<template>
  <main class="canvas-area">
    <RulerSystem />
    <CanvasViewport>
      <ComponentRenderer
        v-for="comp in components"
        :key="comp.id"
        :component="comp"
      />
    </CanvasViewport>
  </main>
</template>
```

#### 6. 数据源配置模块化
**当前状态**: 数据源配置逻辑分散

**建议**: 创建独立的数据源管理模块
```javascript
// src/views/editor/composables/useDataSource.js
export function useDataSource() {
  const dataMode = ref('ref')
  const selectedDatasetId = ref('')

  const switchMode = (mode) => { /* ... */ }
  const loadDataset = (id) => { /* ... */ }

  return {
    dataMode,
    selectedDatasetId,
    switchMode,
    loadDataset
  }
}
```

### 低优先级

#### 7. TypeScript 迁移
**建议**: 逐步将关键模块迁移到 TypeScript
- 先迁移 composables
- 再迁移独立组件
- 最后迁移主文件

#### 8. 性能优化
- 使用 `v-memo` 优化列表渲染
- 使用 `shallowRef` 优化大对象
- 添加虚拟滚动到组件列表

#### 9. 测试覆盖
- 为 composables 添加单元测试
- 为独立组件添加组件测试
- 添加 E2E 测试覆盖关键流程

---

## 重构原则

### 1. 渐进式重构
- 不要一次性重构所有代码
- 每次重构后确保功能正常
- 保持代码可运行状态

### 2. 单一职责
- 每个组件只负责一个功能
- 每个函数只做一件事
- 避免过度耦合

### 3. 可测试性
- 提取的函数应该易于测试
- 避免副作用
- 使用依赖注入

### 4. 向后兼容
- 保持 API 稳定
- 添加废弃警告而不是直接删除
- 提供迁移指南

---

## 实施建议

### 阶段 1: 组件提取 (1-2周)
1. 提取 SidePanel 及其子组件
2. 提取 ConfigPanel 及其子组件
3. 提取 Canvas 组件

### 阶段 2: 函数重构 (1周)
1. 重构 initChartPreviews
2. 优化其他长函数
3. 提取通用工具函数

### 阶段 3: 架构优化 (1-2周)
1. 数据源模块化
2. 状态管理优化
3. 事件系统重构

### 阶段 4: 质量提升 (持续)
1. 添加测试
2. 性能优化
3. TypeScript 迁移

---

## 参考资料

- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 性能优化](https://cn.vuejs.org/guide/best-practices/performance.html)
- [代码重构最佳实践](https://refactoring.guru/)
