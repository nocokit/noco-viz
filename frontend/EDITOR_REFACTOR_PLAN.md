# ScreenEditor 重构计划

## 当前状态
- 文件: `src/views/ScreenEditor.vue`
- 大小: 6123行, 164KB
- 问题: 单文件过大,难以维护

## 已完成
- ✅ 创建 `EditorHeader.vue` 组件 (src/views/editor/components/EditorHeader.vue)

## 下一步计划

### 1. 替换Header (高优先级)
在 ScreenEditor.vue 中:
- 导入 EditorHeader 组件
- 替换 template 中的 `<header class="editor-header">...</header>` 为 `<EditorHeader .../>`
- 传递必要的 props 和事件

### 2. 创建 Composables (高优先级)
创建目录: `src/composables/editor/`

#### useCanvas.js (~500行)
- canvasScale, canvasPanX, canvasPanY
- zoomIn, zoomOut, fitToScreen
- 画布拖拽逻辑
- 鼠标位置跟踪

#### useHistory.js (~100行)
- history, historyIndex
- canUndo, canRedo
- handleUndo, handleRedo
- 历史记录管理

#### useComponents.js (~300行)
- canvasComponents
- selectedComponentIds
- handleCopy, handlePaste, handleDuplicate
- 组件添加/删除逻辑

#### useAlignment.js (~200行)
- alignSelectedComponents
- 对齐和分布算法
- 吸附逻辑

### 3. 创建子组件 (中优先级)
- ComponentPanel.vue - 左侧组件面板
- ConfigPanel.vue - 右侧配置面板
- LayerPanel.vue - 图层面板
- Canvas.vue - 画布区域

### 4. 样式优化 (低优先级)
- 保持在主文件或提取到单独的 .css 文件

## 预期效果
- 主文件从 6123行 减少到 < 1500行
- 代码模块化,职责清晰
- 更易维护和测试
- 性能优化(按需加载)

## 注意事项
- 保持功能完整性
- 确保所有事件和状态正确传递
- 测试每个重构步骤
- 保持向后兼容
