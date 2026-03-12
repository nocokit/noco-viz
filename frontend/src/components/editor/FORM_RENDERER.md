# 基于 JSON 配置的表单渲染方案

## 使用方式

### 1. 在 ScreenEditor.vue 中使用

```vue
<template>
  <div class="config-panel">
    <!-- 使用表单渲染器 -->
    <EditorFormRenderer
      :schema="componentFormSchemaFlat"
      v-model="selectedComponent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EditorFormRenderer from '@/components/editor/EditorFormRenderer.vue'
import { componentFormSchemaFlat } from '@/components/editor/formSchemas.js'

const selectedComponent = ref({
  id: '1772698092840',
  name: '饼图',
  w: 400,
  h: 300,
  x: 197,
  y: 77,
  rotation: 0,
  bgColor: 'transparent',
  opacity: 100,
  borderWidth: 0,
  borderRadius: 4,
  borderColor: '#3b82f6'
})
</script>
```

## JSON Schema 结构

### 基础结构

```javascript
[
  {
    title: '分组标题',           // 可选，分组标题
    divider: true,              // 可选，是否显示分隔线
    collapsible: false,         // 可选，是否可折叠
    defaultCollapsed: false,    // 可选，默认是否折叠
    grid: {                     // 可选，网格布局配置
      columns: 2                // 列数
    },
    fields: [                   // 字段列表
      {
        label: '字段标签',
        key: 'fieldKey',        // 对应 modelValue 的 key
        type: 'input',          // 控件类型
        props: {                // 传递给控件的 props
          size: 'small',
          placeholder: '提示文字'
        },
        inline: false,          // 可选，是否内联布局
        labelSuffix: {          // 可选，标签后缀组件
          component: 'CopyButton',
          props: {}
        }
      }
    ]
  }
]
```

### 支持的控件类型

- `input`: 文本输入框 (a-input)
- `number`: 数字输入框 (a-input-number)
- `color`: 颜色选择器 (EditorColorPicker)
- `slider`: 滑块 (EditorSlider)

## 配置示例

### 示例 1: 基础信息

```javascript
{
  title: '基础信息',
  divider: true,
  fields: [
    {
      label: '组件ID',
      key: 'id',
      type: 'input',
      props: { readonly: true, size: 'small' }
    },
    {
      label: '组件名称',
      key: 'name',
      type: 'input',
      props: { size: 'small', placeholder: '请输入组件名称' }
    }
  ]
}
```

### 示例 2: 网格布局 (W/H/X/Y)

```javascript
{
  title: '布局与变换',
  divider: true,
  grid: { columns: 2 },
  fields: [
    { label: 'W', key: 'w', type: 'number', props: { min: 1, step: 1, size: 'small' } },
    { label: 'H', key: 'h', type: 'number', props: { min: 1, step: 1, size: 'small' } },
    { label: 'X', key: 'x', type: 'number', props: { step: 1, size: 'small' } },
    { label: 'Y', key: 'y', type: 'number', props: { step: 1, size: 'small' } }
  ]
}
```

### 示例 3: 滑块控件

```javascript
{
  title: '',
  divider: true,
  fields: [
    {
      label: '旋转角度',
      key: 'rotation',
      type: 'slider',
      props: { min: 0, max: 360, step: 1, suffix: '°' }
    },
    {
      label: '透明度',
      key: 'opacity',
      type: 'slider',
      props: { min: 0, max: 100, step: 1, suffix: '%' }
    }
  ]
}
```

### 示例 4: 颜色选择器

```javascript
{
  title: '视觉样式',
  divider: true,
  fields: [
    {
      label: '背景色',
      key: 'bgColor',
      type: 'color',
      props: { placeholder: 'transparent' }
    },
    {
      label: '边框颜色',
      key: 'borderColor',
      type: 'color',
      props: { placeholder: '#3b82f6' }
    }
  ]
}
```

## 优势

1. **声明式配置**: 表单结构清晰，易于理解和维护
2. **高度复用**: 同一套配置可用于多个组件
3. **易于扩展**: 添加新字段只需修改 JSON 配置
4. **类型安全**: 可以使用 TypeScript 定义 schema 类型
5. **动态表单**: 可以根据条件动态生成不同的表单配置

## 扩展建议

### 1. 添加条件渲染

```javascript
{
  label: '边框颜色',
  key: 'borderColor',
  type: 'color',
  visible: (model) => model.borderWidth > 0  // 只在边框宽度 > 0 时显示
}
```

### 2. 添加字段验证

```javascript
{
  label: '组件名称',
  key: 'name',
  type: 'input',
  rules: [
    { required: true, message: '请输入组件名称' },
    { max: 20, message: '名称不能超过20个字符' }
  ]
}
```

### 3. 添加自定义控件

```javascript
// 在 EditorFormRenderer.vue 中注册
const controlComponents = {
  input: AInput,
  number: AInputNumber,
  color: EditorColorPicker,
  slider: EditorSlider,
  select: ASelect,        // 下拉选择
  switch: ASwitch,        // 开关
  textarea: ATextarea,    // 多行文本
  // ... 更多自定义控件
}
```

### 4. 添加字段分组

```javascript
{
  title: '边框样式',
  collapsible: true,
  defaultCollapsed: false,
  fields: [...]
}
```

## 完整示例

参见 `formSchemas.js` 中的 `componentFormSchemaFlat` 配置。
