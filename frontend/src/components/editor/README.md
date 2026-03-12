# 编辑器表单组件封装方案

## 设计目标
为大屏编辑器右侧配置面板提供统一、一致的表单控件样式和布局。

## 组件架构

### 1. 基础组件

#### EditorFormField - 表单字段容器
统一的字段布局，包含标签和控件区域。

**Props:**
- `label`: 字段标签
- `inline`: 是否内联布局（标签和控件在同一行）
- `grid`: 是否网格布局（用于紧凑型字段）

**Slots:**
- `default`: 控件内容
- `label-suffix`: 标签后缀（如复制按钮）

#### EditorFormSection - 表单分组
用于组织和分隔不同的配置区域。

**Props:**
- `title`: 分组标题
- `collapsible`: 是否可折叠
- `defaultCollapsed`: 默认是否折叠
- `divider`: 是否显示底部分隔线

#### EditorFormGrid - 网格布局
用于 W/H/X/Y 这种多列布局。

**Props:**
- `columns`: 列数（默认 2）

### 2. 控件组件

#### EditorColorPicker - 颜色选择器
统一的颜色选择样式，包含预览色块和输入框。

**Props:**
- `modelValue`: 颜色值
- `placeholder`: 占位符

#### EditorSlider - 滑块组件
带数值输入框的滑块控件。

**Props:**
- `modelValue`: 当前值
- `min`: 最小值
- `max`: 最大值
- `step`: 步长
- `suffix`: 后缀（如 °、%）

## 使用示例

```vue
<template>
  <!-- 基础信息 -->
  <EditorFormSection title="基础信息">
    <EditorFormField label="组件ID">
      <template #label-suffix>
        <svg class="icon-copy" @click="copyId">...</svg>
      </template>
      <a-input prefix="组件ID" :value="component.id" readonly size="small" />
    </EditorFormField>

    <EditorFormField label="组件名称">
      <a-input v-model:value="component.name" size="small" />
    </EditorFormField>
  </EditorFormSection>

  <!-- 布局与变换 -->
  <EditorFormSection title="布局与变换">
    <EditorFormGrid :columns="2">
      <EditorFormField label="W" grid>
        <a-input-number v-model:value="component.w" size="small" />
      </EditorFormField>
      <EditorFormField label="H" grid>
        <a-input-number v-model:value="component.h" size="small" />
      </EditorFormField>
      <EditorFormField label="X" grid>
        <a-input-number v-model:value="component.x" size="small" />
      </EditorFormField>
      <EditorFormField label="Y" grid>
        <a-input-number v-model:value="component.y" size="small" />
      </EditorFormField>
    </EditorFormGrid>

    <EditorFormField label="旋转角度">
      <EditorSlider
        v-model="component.rotation"
        :min="0"
        :max="360"
        suffix="°"
      />
    </EditorFormField>
  </EditorFormSection>

  <!-- 视觉样式 -->
  <EditorFormSection title="视觉样式">
    <EditorFormField label="背景色">
      <EditorColorPicker v-model="component.bgColor" />
    </EditorFormField>

    <EditorFormField label="透明度">
      <EditorSlider
        v-model="component.opacity"
        :min="0"
        :max="100"
        suffix="%"
      />
    </EditorFormField>

    <EditorFormGrid :columns="2">
      <EditorFormField label="边框宽度" grid>
        <a-input-number v-model:value="component.borderWidth" size="small" />
      </EditorFormField>
      <EditorFormField label="边框颜色" grid>
        <EditorColorPicker v-model="component.borderColor" />
      </EditorFormField>
    </EditorFormGrid>
  </EditorFormSection>
</template>

<script setup>
import EditorFormField from '@/components/editor/EditorFormField.vue'
import EditorFormSection from '@/components/editor/EditorFormSection.vue'
import EditorFormGrid from '@/components/editor/EditorFormGrid.vue'
import EditorColorPicker from '@/components/editor/EditorColorPicker.vue'
import EditorSlider from '@/components/editor/EditorSlider.vue'
</script>
```

## 样式规范

### 颜色
- 背景色: `rgba(255, 255, 255, 0.04)`
- 边框色: `rgba(255, 255, 255, 0.08)`
- 文字色: `rgba(255, 255, 255, 0.85)`
- 标签色: `rgba(255, 255, 255, 0.65)`
- 主题色: `#1890ff`

### 尺寸
- 字段间距: `16px`
- 网格间距: `8px`
- 标签字号: `12px`
- 控件高度: `32px` (small)

### 圆角
- 输入框: `4px`
- 色块: `3px`

## 优势

1. **统一性**: 所有表单控件使用相同的样式规范
2. **可维护性**: 样式集中管理，易于调整
3. **可复用性**: 组件可在多个编辑器页面复用
4. **灵活性**: 支持多种布局模式（内联、网格、堆叠）
5. **扩展性**: 易于添加新的控件类型

## 下一步

1. 在 ScreenEditor.vue 中应用这些组件
2. 根据实际使用情况调整样式细节
3. 添加更多控件类型（如下拉选择、开关等）
4. 考虑添加表单验证功能
