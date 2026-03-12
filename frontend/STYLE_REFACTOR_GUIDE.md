# 样式重构指南

本文档说明如何将现有组件重构为基于 Ant Design Vue 的无自定义样式组件。

## 重构原则

### 1. 零自定义 CSS
- 删除所有 `<style>` 标签
- 使用 Ant Design Vue 组件替代自定义 HTML + CSS
- 使用 inline style 处理极少数必要的样式

### 2. 使用 Ant Design 组件

#### 布局组件
```vue
<!-- 旧方式 -->
<div class="container">
  <div class="header">...</div>
  <div class="content">...</div>
</div>

<!-- 新方式 -->
<a-layout>
  <a-layout-header>...</a-layout-header>
  <a-layout-content>...</a-layout-content>
</a-layout>
```

#### 间距和对齐
```vue
<!-- 旧方式 -->
<div class="flex-row">
  <div class="item">...</div>
  <div class="item">...</div>
</div>

<!-- 新方式 -->
<a-space>
  <div>...</div>
  <div>...</div>
</a-space>

<!-- 或使用 Flex -->
<a-flex justify="space-between" align="center">
  <div>...</div>
  <div>...</div>
</a-flex>
```

#### 文字样式
```vue
<!-- 旧方式 -->
<h1 class="title">标题</h1>
<p class="description">描述</p>

<!-- 新方式 -->
<a-typography-title :level="1">标题</a-typography-title>
<a-typography-text type="secondary">描述</a-typography-text>
```

### 3. 使用 Design Token

通过 CSS 变量引用主题色，自动支持主题切换：

```vue
<template>
  <div :style="containerStyle">...</div>
</template>

<script setup>
import { computed } from 'vue'

const containerStyle = computed(() => ({
  background: 'var(--ant-color-bg-container)',
  color: 'var(--ant-color-text)',
  border: '1px solid var(--ant-color-border)',
  borderRadius: 'var(--ant-border-radius)',
  padding: 'var(--ant-padding)'
}))
</script>
```

### 4. 常用组件映射

| 旧组件 | 新组件 |
|--------|--------|
| `<div class="card">` | `<a-card>` |
| `<div class="modal">` | `<a-modal>` |
| `<div class="tabs">` | `<a-tabs>` |
| `<button class="btn">` | `<a-button>` |
| `<input class="input">` | `<a-input>` |
| `<div class="table">` | `<a-table>` |
| `<div class="form">` | `<a-form>` |
| `<div class="menu">` | `<a-menu>` |
| `<div class="dropdown">` | `<a-dropdown>` |
| `<div class="tooltip">` | `<a-tooltip>` |

## 重构示例

### 示例 1: FilterBar 组件

**重构前：**
```vue
<template>
  <div class="filter-bar">
    <div class="filter-tabs">
      <button class="tab">全部</button>
      <button class="tab active">进行中</button>
    </div>
    <div class="filter-controls">
      <input class="search" placeholder="搜索..." />
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.tab.active {
  color: #1677ff;
}
</style>
```

**重构后：**
```vue
<template>
  <a-flex justify="space-between" align="center" :style="{ marginBottom: '16px' }">
    <a-space>
      <a-button type="default">全部</a-button>
      <a-button type="primary">进行中</a-button>
    </a-space>
    <a-input-search placeholder="搜索..." style="width: 240px" />
  </a-flex>
</template>
```

### 示例 2: PageHeader 组件

**重构前：**
```vue
<template>
  <header class="page-header">
    <h2>{{ title }}</h2>
    <div class="actions">
      <button>操作</button>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: white;
}
</style>
```

**重构后：**
```vue
<template>
  <a-page-header :title="title">
    <template #extra>
      <a-button>操作</a-button>
    </template>
  </a-page-header>
</template>
```

## 工具函数

使用 `src/utils/style.js` 中的预定义样式：

```javascript
import { pageContainerStyle, cardStyle } from '@/utils/style'

const containerStyle = computed(() => ({
  ...pageContainerStyle,
  // 可以添加额外样式
  minHeight: '500px'
}))
```

## 主题系统

### 使用主题 Store

```javascript
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()

// 切换主题
themeStore.toggleTheme()

// 获取当前主题
console.log(themeStore.currentTheme) // 'light' 或 'dark'
```

### 主题配置

在 `src/config/theme.js` 中修改主题配置：

```javascript
export const lightTheme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    // ... 更多配置
  }
}
```

## 检查清单

重构组件时，请确保：

- [ ] 删除所有 `<style>` 标签
- [ ] 使用 Ant Design Vue 组件替代自定义 HTML
- [ ] 使用 `a-space`、`a-flex` 控制布局
- [ ] 使用 `a-typography` 替代自定义文字样式
- [ ] 使用 CSS 变量引用主题色
- [ ] 测试亮色和暗色主题切换
- [ ] 确保响应式布局正常工作

## 常见问题

### Q: 如何处理复杂的自定义样式？
A: 优先考虑是否可以用 Ant Design 组件实现。如果确实需要，使用 inline style 和 CSS 变量。

### Q: 如何处理动画效果？
A: 使用 Ant Design 内置的过渡效果，或使用 Vue 的 `<transition>` 组件。

### Q: 如何确保主题切换正常？
A: 使用 CSS 变量（`var(--ant-color-*)`）而不是硬编码颜色值。

## 参考资源

- [Ant Design Vue 官方文档](https://antdv.com/)
- [Design Token 文档](https://antdv.com/docs/vue/customize-theme-cn)
- [主题配置示例](./src/config/theme.js)
