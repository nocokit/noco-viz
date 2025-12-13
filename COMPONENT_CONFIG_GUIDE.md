# 组件配置系统使用指南

## 📋 概述

本项目实现了一套完整的大屏组件配置系统,支持 20 个图表组件和信息组件的可视化配置。所有配置基于 JSON Schema 规范,支持动态表单渲染。

---

## 🏗️ 架构设计

### 1. 核心文件结构

```
src/
├── config/
│   ├── componentSchema.js          # JSON Schema 配置规范
│   └── chartComponents.js          # 图表组件定义
├── components/
│   ├── editor/
│   │   ├── ConfigFormRenderer.vue  # 动态表单渲染器
│   │   └── controls/              # 表单控件组件
│   │       ├── BooleanControl.vue
│   │       ├── NumberControl.vue
│   │       ├── StringControl.vue
│   │       ├── ColorControl.vue
│   │       ├── SelectControl.vue
│   │       └── ObjectControl.vue
│   └── charts/                    # 图表组件
└── views/
    └── ScreenEditor.vue           # 编辑器主界面
```

---

## 📊 配置层级

### 组件配置分为 3 大层级:

#### 1. **基础配置** (所有组件通用)
- 位置和尺寸: `x`, `y`, `w`, `h`, `rotation`
- 视觉样式: 背景色、透明度、边框、圆角、阴影

#### 2. **图表配置** (仅图表组件)
根据 Schema 动态生成,包括:
- 标题 (title)
- 图例 (legend)
- 提示框 (tooltip)
- 坐标轴 (xAxis/yAxis)
- 系列 (series)
- 动画 (animation)

#### 3. **信息组件配置** (仅信息组件)
- 文本组件: 字体、颜色、对齐
- 数字翻牌器: 数值、动画时长
- KPI 卡片: 标题、趋势
- 进度条: 进度值、样式
- 数据表格: 表头、行样式

---

## 🎯 配置属性完整清单

### 基础属性 (所有组件)

| 属性 | 类型 | 默认值 | 说明 | UI 控件 |
|------|------|--------|------|---------|
| `x` | number | 0 | X 坐标 | 数字输入 |
| `y` | number | 0 | Y 坐标 | 数字输入 |
| `w` | number | 400 | 宽度 | 数字输入 |
| `h` | number | 300 | 高度 | 数字输入 |
| `rotation` | number | 0 | 旋转角度 (0-360°) | 滑块 + 输入 |

### 视觉样式 (所有组件)

| 属性 | 类型 | 默认值 | 说明 | UI 控件 |
|------|------|--------|------|---------|
| `bgColor` | color | transparent | 背景色 | 颜色选择器 |
| `opacity` | number | 100 | 透明度 (0-100%) | 滑块 + 输入 |
| `borderWidth` | number | 0 | 边框宽度 (0-20px) | 数字输入 |
| `borderColor` | color | #3b82f6 | 边框颜色 | 颜色选择器 |
| `borderRadius` | number | 0 | 圆角半径 (0-100px) | 数字输入 |

### 图表配置 - 标题 (title)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | boolean | true | 显示标题 |
| `text` | string | "图表标题" | 主标题文本 |
| `subtext` | string | "" | 副标题文本 |
| `textStyle.fontSize` | number | 16 | 字体大小 (12-48px) |
| `textStyle.fontWeight` | select | normal | 字体粗细 |
| `textStyle.color` | color | #fff | 字体颜色 |
| `left` | select | center | 水平位置 (left/center/right) |
| `top` | number | 10 | 上边距 (0-200px) |

### 图表配置 - 图例 (legend)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | boolean | true | 显示图例 |
| `orient` | select | horizontal | 布局方向 (horizontal/vertical) |
| `top` | select | bottom | 垂直位置 (top/middle/bottom) |
| `left` | select | center | 水平位置 (left/center/right) |
| `textStyle.color` | color | #999 | 文字颜色 |
| `textStyle.fontSize` | number | 12 | 字体大小 (10-24px) |
| `icon` | select | circle | 图标形状 |

### 图表配置 - 提示框 (tooltip)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | boolean | true | 显示提示框 |
| `trigger` | select | item | 触发类型 (item/axis/none) |
| `backgroundColor` | color | rgba(50,50,50,0.9) | 背景色 |
| `borderColor` | color | #333 | 边框颜色 |
| `borderWidth` | number | 0 | 边框宽度 (0-5px) |
| `textStyle.color` | color | #fff | 文字颜色 |
| `textStyle.fontSize` | number | 12 | 字体大小 (10-20px) |

### 图表配置 - 坐标轴 (xAxis/yAxis)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `show` | boolean | true | 显示轴 |
| `name` | string | "" | 轴名称 |
| `axisLine.show` | boolean | true | 显示轴线 |
| `axisLine.lineStyle.color` | color | #666 | 轴线颜色 |
| `axisLine.lineStyle.width` | number | 1 | 轴线宽度 (0-5px) |
| `axisLabel.show` | boolean | true | 显示标签 |
| `axisLabel.color` | color | #999 | 标签颜色 |
| `axisLabel.fontSize` | number | 12 | 字体大小 (10-20px) |
| `axisLabel.rotate` | number | 0 | 旋转角度 (-90~90°) |
| `splitLine.show` | boolean | true/false | 显示网格线 |
| `splitLine.lineStyle.color` | color | #333 | 网格线颜色 |
| `splitLine.lineStyle.type` | select | solid | 线条类型 |

### 图表配置 - 系列 (series)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `barWidth` | number | null | 柱宽度 (0-100px) |
| `barGap` | string | 30% | 柱间距 |
| `lineWidth` | number | 2 | 线宽度 (1-10px) |
| `smooth` | boolean | false | 平滑曲线 |
| `showLabel` | boolean | false | 显示数值标签 |
| `labelPosition` | select | top | 标签位置 (top/inside/bottom) |
| `labelColor` | color | #fff | 标签颜色 |
| `colorType` | select | single | 颜色类型 (single/gradient/multi) |
| `color` | color | #3b82f6 | 颜色 |
| `gradientStart` | color | #3b82f6 | 渐变起始色 |
| `gradientEnd` | color | #1d4ed8 | 渐变结束色 |

### 图表配置 - 动画 (animation)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | true | 启用动画 |
| `duration` | number | 1000 | 动画时长 (0-5000ms) |
| `easing` | select | cubicOut | 缓动函数 |
| `delay` | number | 0 | 延迟时间 (0-2000ms) |

### 信息组件配置

#### 文本组件 (text)
- `text`: 文本内容
- `fontSize`: 字体大小 (12-72px)
- `fontWeight`: 字体粗细
- `color`: 文字颜色
- `textAlign`: 对齐方式 (left/center/right)
- `lineHeight`: 行高 (1-3)
- `letterSpacing`: 字间距 (-5~20px)
- `textShadow`: 文字阴影 (boolean)

#### 数字翻牌器 (number-flip)
- `value`: 数值
- `prefix`: 前缀
- `suffix`: 后缀
- `duration`: 翻转时长 (500-5000ms)
- `decimals`: 小数位数 (0-4)
- `fontSize`: 字体大小 (24-100px)
- `color`: 数字颜色

#### KPI 指标卡 (kpi-card)
- `title`: 标题
- `value`: 数值
- `unit`: 单位
- `trend`: 趋势 (up/down/flat)
- `trendValue`: 趋势值
- `icon`: 图标
- `bgColor`: 背景色

#### 进度条 (progress-bar)
- `value`: 进度值 (0-100)
- `showText`: 显示文字
- `height`: 高度 (10-50px)
- `color`: 进度条颜色
- `bgColor`: 背景色
- `borderRadius`: 圆角 (0-25px)
- `striped`: 条纹样式
- `animated`: 动画效果

#### 数据表格 (table)
- `headerBgColor`: 表头背景色
- `headerTextColor`: 表头文字颜色
- `rowBgColor`: 行背景色
- `rowHoverColor`: 行悬停色
- `borderColor`: 边框颜色
- `fontSize`: 字体大小 (10-18px)
- `stripe`: 斑马纹
- `showHeader`: 显示表头

---

## 🛠️ 使用方法

### 1. 为新组件添加配置 Schema

编辑 `src/config/componentSchema.js`:

```javascript
// 在 getComponentSchema 函数中添加新组件类型
export function getComponentSchema(componentType) {
  const schemas = {
    // ... 现有配置
    'new-chart': ['title', 'legend', 'tooltip', 'animation'],
  }
  // ...
}
```

### 2. 在编辑器中使用

配置面板会根据组件类型自动渲染对应的配置项:

```vue
<ConfigFormRenderer
  v-if="isChartComponent(selectedComponent.type)"
  :schema="currentComponentSchema"
  v-model="selectedComponent.config"
/>
```

### 3. 在图表组件中应用配置

图表组件通过 `config` prop 接收配置:

```vue
<script setup>
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const chartOption = computed(() => {
  return {
    ...defaultBarConfig,
    ...props.config  // 合并用户配置
  }
})
</script>
```

---

## 📝 配置数据结构示例

### 柱状图完整配置示例

```javascript
{
  // 基础属性
  id: 1234567890,
  type: 'bar',
  name: '销售数据柱状图',
  x: 100,
  y: 100,
  w: 400,
  h: 300,
  rotation: 0,

  // 视觉样式
  bgColor: 'rgba(0,0,0,0.5)',
  opacity: 100,
  borderWidth: 1,
  borderColor: '#3b82f6',
  borderRadius: 8,

  // 图表配置
  config: {
    title: {
      show: true,
      text: '月度销售统计',
      subtext: '2024年',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
      },
      left: 'center',
      top: 10
    },
    legend: {
      show: true,
      orient: 'horizontal',
      top: 'bottom',
      left: 'center',
      textStyle: {
        color: '#999',
        fontSize: 12
      }
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      backgroundColor: 'rgba(50,50,50,0.9)',
      borderWidth: 0
    },
    xAxis: {
      show: true,
      axisLabel: {
        show: true,
        color: '#999',
        rotate: 0
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      show: true,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#333',
          type: 'dashed'
        }
      }
    },
    series: {
      barWidth: 30,
      showLabel: true,
      labelPosition: 'top',
      colorType: 'gradient',
      gradientStart: '#3b82f6',
      gradientEnd: '#1d4ed8'
    },
    animation: {
      enabled: true,
      duration: 1000,
      easing: 'cubicOut',
      delay: 0
    }
  },

  // 数据绑定
  data: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
    values: [120, 200, 150, 80, 70, 110]
  }
}
```

---

## 🎨 UI 控件类型

| 控件类型 | 文件 | 适用属性类型 | 说明 |
|---------|------|-------------|------|
| BooleanControl | BooleanControl.vue | boolean | 开关控件 |
| NumberControl | NumberControl.vue | number | 数字输入,支持滑块 |
| StringControl | StringControl.vue | string | 文本输入 |
| ColorControl | ColorControl.vue | color | 颜色选择器 |
| SelectControl | SelectControl.vue | select | 下拉选择 |
| ObjectControl | ObjectControl.vue | object | 嵌套对象(递归) |

---

## 🔄 配置响应式更新流程

```
用户操作控件
    ↓
控件 emit update:modelValue
    ↓
ConfigFormRenderer 更新 component.config
    ↓
Vue 响应式系统触发更新
    ↓
图表组件 computed 重新计算 chartOption
    ↓
ECharts setOption 更新图表
```

---

## ✅ 已实现功能

- ✅ 20 个组件的 JSON Schema 定义
- ✅ 6 种表单控件组件
- ✅ 动态表单渲染器
- ✅ 基础属性配置 (位置、尺寸、旋转)
- ✅ 视觉样式配置 (背景、边框、透明度)
- ✅ 图表配置动态渲染
- ✅ 配置响应式更新
- ✅ 配置面板分组折叠

---

## 🚀 待扩展功能

- ⏳ 数据源配置 (API、静态数据、实时数据)
- ⏳ 交互事件配置 (点击、悬停、联动)
- ⏳ 阴影配置
- ⏳ 背景渐变/图片配置
- ⏳ 配置模板/预设
- ⏳ 配置导入/导出
- ⏳ 撤销/重做历史记录

---

## 📖 参考文档

- [ECharts 配置项手册](https://echarts.apache.org/zh/option.html)
- [JSON Schema 规范](https://json-schema.org/)
- [Vue 3 组件通信](https://vuejs.org/guide/components/events.html)

---

## 🐛 常见问题

### Q: 如何添加新的配置项?

A: 在 `componentSchema.js` 中对应的 Schema 添加新属性,系统会自动渲染对应控件。

### Q: 如何自定义控件?

A: 在 `src/components/editor/controls/` 目录下创建新的 Vue 组件,并在 `ConfigFormRenderer` 中注册。

### Q: 配置不生效?

A: 检查:
1. Schema 定义是否正确
2. 图表组件是否正确读取 `props.config`
3. 默认配置是否覆盖了用户配置

---

## 👨‍💻 开发者

配置系统版本: v1.0.0
最后更新: 2025-12-10
