<!--
  动态配置表单渲染器 - 使用 EditorFormSection
  根据 JSON Schema 自动渲染配置表单

  用途：专门用于渲染嵌套对象结构的配置（如 ECharts 配置）
  Schema 格式：{ sectionKey: { properties: { propKey: propSchema } } }

  如果需要更高级的功能（分段控制、网格布局等），请使用 EditorFormRenderer.vue
-->
<template>
  <div class="config-form-renderer">
    <EditorFormSection
      v-for="(sectionSchema, sectionKey) in schema"
      :key="sectionKey"
      :title="getSectionLabel(sectionKey)"
      :collapsible="true"
      :defaultCollapsed="false"
      :divider="sectionKey !== Object.keys(schema)[Object.keys(schema).length - 1]"
    >
      <template v-if="sectionSchema.properties">
        <template v-for="(propSchema, propKey) in sectionSchema.properties" :key="propKey">
          <EditorFormField :label="propSchema.label" inline>
            <component
              :is="getFormControl(propSchema)"
              :modelValue="getNestedValue(modelValue, sectionKey, propKey)"
              @update:modelValue="updateNestedValue(sectionKey, propKey, $event)"
              v-bind="getControlProps(propSchema)"
            />
          </EditorFormField>
        </template>
      </template>
    </EditorFormSection>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import EditorFormSection from './EditorFormSection.vue'
import EditorFormField from './EditorFormField.vue'
import EditorSwitch from './EditorSwitch.vue'
import EditorInputNumber from './EditorInputNumber.vue'
import EditorInput from './EditorInput.vue'
import EditorColorPicker from './EditorColorPicker.vue'
import EditorSelect from './EditorSelect.vue'
import ObjectControl from './controls/ObjectControl.vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const getSectionLabel = (key) => {
  const labels = {
    title: '标题配置',
    legend: '图例配置',
    tooltip: '提示框',
    grid: '内边距',
    xAxis: 'X轴配置',
    yAxis: 'Y轴配置',
    series: '系列配置',
    animation: '动画效果',
    text: '文本配置',
    numberFlip: '数字配置',
    kpiCard: 'KPI配置',
    progressBar: '进度条配置',
    table: '表格配置'
  }
  return labels[key] || key
}

const getFormControl = (propSchema) => {
  if (propSchema.type === 'object' && propSchema.properties) {
    return ObjectControl
  }

  switch (propSchema.type) {
    case 'boolean':
      return EditorSwitch
    case 'number':
      return EditorInputNumber
    case 'string':
      return EditorInput
    case 'color':
      return EditorColorPicker
    case 'select':
      return EditorSelect
    default:
      return EditorInput
  }
}

const getNestedValue = (obj, ...keys) => {
  return keys.reduce((acc, key) => acc?.[key], obj)
}

const getControlProps = (propSchema) => {
  const { label, type, ...controlProps } = propSchema
  return controlProps
}

const updateNestedValue = (sectionKey, propKey, value) => {
  const newValue = { ...props.modelValue }

  if (!newValue[sectionKey]) {
    newValue[sectionKey] = {}
  }

  newValue[sectionKey][propKey] = value
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.config-form-renderer {
  /* 样式由 EditorFormSection 组件提供 */
}
</style>

