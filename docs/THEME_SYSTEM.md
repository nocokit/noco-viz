# 大屏编辑器主题系统文档

## 概述

本项目实现了完整的多主题适配系统，支持动态切换主题，所有UI组件都会自动适应当前主题。

## 系统架构

### 1. 主题配置文件
位置：`src/config/themes.js`

包含 5 个预设主题：
- **DataV 科技蓝**（默认）- 经典大屏主题，科技感十足
- **紫色梦幻** - 神秘优雅的紫色系主题
- **绿色科技** - 清新的绿色科技感主题
- **红色警戒** - 醒目的红色系监控主题
- **金色奢华** - 高端大气的金色主题

### 2. 主题变量系统
位置：`src/assets/styles/theme-variables.css`

定义了完整的 CSS 变量体系：

#### 颜色变量
```css
--theme-primary          /* 主色调 */
--theme-secondary        /* 次要色 */
--theme-accent           /* 强调色 */
--theme-bg-body          /* 页面背景 */
--theme-bg-sidebar       /* 侧边栏背景 */
--theme-bg-card          /* 卡片背景 */
--theme-border           /* 边框色 */
--theme-text-main        /* 主文字 */
...
```

#### 渐变变量
```css
--theme-gradient-primary     /* 主渐变 */
--theme-gradient-secondary   /* 次渐变 */
--theme-gradient-accent      /* 强调渐变 */
```

#### 阴影变量
```css
--theme-shadow-sm    /* 小阴影 */
--theme-shadow-md    /* 中阴影 */
--theme-shadow-lg    /* 大阴影 */
--theme-shadow-glow  /* 发光效果 */
```

### 3. 主题切换组件
位置：`src/components/ThemeSwitcher.vue`

提供可视化的主题选择界面，支持：
- 预览主题配色
- 查看主题描述
- 实时切换主题
- 主题状态持久化

## 使用方法

### 在组件中使用主题

#### 方式1：使用 CSS 变量（推荐）

```vue
<style scoped>
.my-component {
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  color: var(--theme-text-main);
  box-shadow: var(--theme-shadow-md);
}

.my-button {
  background: var(--theme-gradient-primary);
  border-radius: var(--theme-radius-md);
}

.my-button:hover {
  box-shadow: var(--theme-shadow-glow);
}
</style>
```

#### 方式2：在 JavaScript 中获取主题

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getTheme, getCurrentThemeId } from '@/config/themes'

const currentTheme = ref(null)

onMounted(() => {
  const themeId = getCurrentThemeId()
  currentTheme.value = getTheme(themeId)

  // 访问主题配置
  console.log(currentTheme.value.colors.primary)
  console.log(currentTheme.value.gradients.primary)
})
</script>
```

#### 方式3：监听主题切换事件

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

const handleThemeChange = (event) => {
  const { themeId } = event.detail
  console.log('主题已切换为:', themeId)
  // 执行主题切换后的操作
}

onMounted(() => {
  window.addEventListener('theme-changed', handleThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('theme-changed', handleThemeChange)
})
</script>
```

### ECharts 图表主题适配

```javascript
import { getTheme } from '@/config/themes'

const theme = getTheme(getCurrentThemeId())

const option = {
  color: theme.colors.chartColors, // 使用主题配色
  backgroundColor: theme.colors.bgCanvas,
  textStyle: {
    color: theme.colors.textSecondary
  },
  // 其他配置...
}
```

## 主题配置结构

每个主题包含以下配置：

```javascript
{
  id: 'theme-id',
  name: '主题名称',
  description: '主题描述',

  colors: {
    // 颜色定义
  },

  gradients: {
    // 渐变定义
  },

  shadows: {
    // 阴影定义
  },

  sizes: {
    borderRadius: { /* 圆角尺寸 */ },
    spacing: { /* 间距尺寸 */ }
  }
}
```

## 创建自定义主题

1. 在 `src/config/themes.js` 中定义新主题：

```javascript
export const myCustomTheme = {
  id: 'my-custom',
  name: '我的自定义主题',
  description: '这是我的自定义主题',

  colors: {
    primary: '#ff0000',
    secondary: '#cc0000',
    // ... 其他颜色
  },

  gradients: {
    primary: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
    // ... 其他渐变
  },

  shadows: {
    sm: '0 2px 8px rgba(255, 0, 0, 0.1)',
    // ... 其他阴影
  },

  sizes: dataVTheme.sizes, // 继承默认尺寸
}
```

2. 将主题添加到主题列表：

```javascript
export const themes = {
  // ... 现有主题
  'my-custom': myCustomTheme,
}

export const themeList = [
  // ... 现有主题
  myCustomTheme,
]
```

## 主题变量命名规范

### 前缀规则
- 所有主题变量以 `--theme-` 开头
- 颜色变量：`--theme-{category}-{variant}`
- 渐变变量：`--theme-gradient-{type}`
- 阴影变量：`--theme-shadow-{size}`
- 尺寸变量：`--theme-{type}-{size}`

### 示例
```css
--theme-primary              /* 主色 */
--theme-bg-card              /* 背景-卡片 */
--theme-text-secondary       /* 文字-次要 */
--theme-gradient-primary     /* 渐变-主色 */
--theme-shadow-md            /* 阴影-中等 */
--theme-radius-lg            /* 圆角-大 */
```

## 最佳实践

### 1. 优先使用 CSS 变量
```css
/* ✓ 推荐 */
background: var(--theme-bg-card);

/* ✗ 避免硬编码颜色 */
background: #0f1f3a;
```

### 2. 使用语义化变量名
```css
/* ✓ 推荐 */
color: var(--theme-text-secondary);

/* ✗ 避免 */
color: var(--theme-gray-500);
```

### 3. 响应主题切换
对于需要重新初始化的组件（如 ECharts），监听 `theme-changed` 事件并重新渲染。

### 4. 保持一致性
所有颜色、阴影、圆角等样式都应使用主题变量，确保主题切换时所有元素都能正确更新。

## 技术细节

### 主题应用流程
1. 应用启动时，`main.js` 调用 `initTheme()` 初始化主题
2. `initTheme()` 从 localStorage 读取上次选择的主题
3. `applyTheme()` 将主题配置转换为 CSS 变量并注入到 `:root`
4. 所有组件通过 CSS 变量获取主题样式
5. 用户切换主题时，重新调用 `applyTheme()` 并触发 `theme-changed` 事件

### 性能优化
- 使用 CSS 变量实现主题切换，无需重新加载页面
- 主题配置保存在 localStorage，减少服务器请求
- HMR 支持，开发时修改主题配置可实时预览

## 故障排查

### 主题变量不生效
检查是否：
1. 正确导入了 `theme-variables.css`
2. 使用了正确的 CSS 变量名
3. CSS 变量前缀是 `--theme-` 而不是其他

### 主题切换后部分元素未更新
可能原因：
1. 元素使用了硬编码颜色
2. 组件需要重新初始化（监听 `theme-changed` 事件）
3. 使用了内联样式而非 CSS 类

### 自定义主题显示异常
检查：
1. 所有必需的颜色字段是否都已定义
2. 颜色值格式是否正确（hex、rgb、rgba等）
3. 主题是否已正确添加到 `themes` 和 `themeList`

## 更新日志

### v1.0.0 (2025-12-14)
- ✅ 实现基础主题系统
- ✅ 创建 5 个预设主题
- ✅ 开发主题切换组件
- ✅ 完成 Element Plus 组件适配
- ✅ 添加主题持久化功能
- ✅ 支持主题切换事件通知

## 未来计划

- [ ] 支持用户自定义主题颜色
- [ ] 主题配置导入/导出功能
- [ ] 暗色/亮色主题切换
- [ ] 主题预览模式
- [ ] 更多预设主题
