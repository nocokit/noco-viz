# StatusTag 组件

通用的状态标签组件，用于显示各种状态信息。支持两种样式：标签样式（tag）和圆点样式（dot）。

## 功能特性

- 5 种预设状态类型（success, error, warning, info, default）
- 2 种显示样式（tag 标签样式、dot 圆点样式）
- 自动显示状态圆点
- 统一的样式风格
- 支持自定义文本

## 使用方法

### 在 Vue 模板中使用

```vue
<template>
  <!-- 标签样式（默认） -->
  <StatusTag type="success" text="连接正常" />
  <StatusTag type="error" text="连接失败" />

  <!-- 圆点样式（带发光效果） -->
  <StatusTag type="success" text="正常" style="dot" />
  <StatusTag type="error" text="异常" style="dot" />
</template>

<script setup>
import StatusTag from '@/components/common/StatusTag/index.vue'
</script>
```

### 在 CRUD 配置中使用

```typescript
import { h } from 'vue'
import StatusTag from '@/components/common/StatusTag/index.vue'

export const crudConfig = {
  table: {
    columns: [
      {
        key: 'status',
        label: '状态',
        render: (row) => {
          return h(StatusTag, {
            type: row.status === 'active' ? 'success' : 'error',
            text: row.status === 'active' ? '正常' : '异常',
            style: 'dot' // 使用圆点样式
          })
        }
      }
    ]
  }
}
```

## Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 状态类型 | string | success / error / warning / info / default | default |
| text | 显示文本 | string | - | - |
| showDot | 是否显示圆点 | boolean | - | true |
| style | 样式风格 | string | tag / dot | tag |

## 状态类型说明

- **success**: 成功状态，绿色，适用于"正常"、"启用"、"成功"等
- **error**: 错误状态，红色，适用于"失败"、"异常"、"错误"等
- **warning**: 警告状态，橙色，适用于"警告"、"待处理"等
- **info**: 信息状态，蓝色，适用于"进行中"、"处理中"等
- **default**: 默认状态，灰色，适用于"禁用"、"未知"等

## 样式风格说明

### tag（标签样式）
- 带背景色和边框的标签样式
- 适用于需要突出显示的状态
- 圆点使用字符 "●"

### dot（圆点样式）
- 简洁的圆点 + 文本样式
- 圆点带发光效果（box-shadow）
- 适用于表格等需要紧凑显示的场景
- 参考 datasets 页面的状态显示

## 样式定制

组件使用 CSS 变量和 scoped 样式，可以通过覆盖 CSS 类来自定义样式：

```css
.status-tag {
  /* 自定义样式 */
}
```
