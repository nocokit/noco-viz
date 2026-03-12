# 图表配置重构指南

## 问题
之前所有图表配置文件中的标题、tooltip、坐标轴等配置都是重复的，没有复用，导致：
- 代码冗余
- 维护困难
- 样式不一致

## 解决方案
创建了 `commonConfig.js` 统一管理所有通用配置。

## 通用配置说明

### 1. 标题配置
```javascript
import { createTitleConfig } from './commonConfig'

// 使用默认标题
title: createTitleConfig('图表标题')

// 自定义标题配置
title: createTitleConfig('图表标题', {
  left: 'left',  // 覆盖默认的 center
  textStyle: {
    fontSize: 18  // 覆盖默认的 16
  }
})
```

### 2. Tooltip 配置
```javascript
import { commonAxisTooltip, commonItemTooltip } from './commonConfig'

// 坐标轴触发（用于折线图、柱状图等）
tooltip: commonAxisTooltip

// 数据项触发（用于饼图、散点图等）
tooltip: commonItemTooltip

// 自定义 tooltip
tooltip: {
  ...commonAxisTooltip,
  formatter: '{b}: {c}'  // 添加自定义格式化
}
```

### 3. 图例配置
```javascript
import { commonLegend } from './commonConfig'

legend: {
  ...commonLegend,
  data: ['系列1', '系列2']
}
```

### 4. 网格配置
```javascript
import { commonGrid } from './commonConfig'

grid: commonGrid

// 或自定义
grid: {
  ...commonGrid,
  top: '10%'  // 覆盖默认的 15%
}
```

### 5. 坐标轴配置
```javascript
import { commonCategoryXAxis, commonValueYAxis } from './commonConfig'

xAxis: {
  ...commonCategoryXAxis,
  data: ['周一', '周二', '周三']
}

yAxis: commonValueYAxis
```

### 6. 颜色配置
```javascript
import { cyberpunkColors } from './commonConfig'

itemStyle: {
  color: cyberpunkColors.cyan    // #00f0ff
  // 可用颜色: cyan, purple, green, pink, yellow, blue, red
}
```

## 已重构的配置文件
- ✅ pieConfig.js
- ✅ lineConfig.js
- ✅ barConfig.js
- ✅ areaConfig.js
- ✅ gaugeConfig.js

## 待重构的配置文件
- ⏳ radarConfig.js
- ⏳ scatterConfig.js
- ⏳ funnelConfig.js
- ⏳ liquidConfig.js
- ⏳ sankeyConfig.js
- ⏳ sunburstConfig.js
- ⏳ treemapConfig.js
- ⏳ chinaMapConfig.js
- ⏳ heatmapConfig.js

## 重构步骤

1. 在配置文件顶部导入需要的通用配置：
```javascript
import {
  createTitleConfig,
  commonAxisTooltip,
  commonLegend,
  cyberpunkColors
} from './commonConfig'
```

2. 替换 title 配置：
```javascript
// 之前
title: {
  text: '图表名称',
  left: 'center',
  textStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600
  }
}

// 之后
title: createTitleConfig('图表名称')
```

3. 替换 tooltip 配置：
```javascript
// 之前
tooltip: {
  trigger: 'axis',
  backgroundColor: 'rgba(10, 11, 13, 0.95)',
  borderColor: 'rgba(0, 240, 255, 0.3)',
  // ... 更多配置
}

// 之后
tooltip: commonAxisTooltip
// 或
tooltip: {
  ...commonAxisTooltip,
  formatter: '{b}: {c}'  // 添加特定配置
}
```

4. 替换颜色值：
```javascript
// 之前
color: '#00f0ff'

// 之后
color: cyberpunkColors.cyan
```

## 优势
- ✅ 代码量减少 50%+
- ✅ 统一样式风格
- ✅ 易于维护和修改
- ✅ 支持灵活定制
