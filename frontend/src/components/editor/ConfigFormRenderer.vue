<!--
  动态配置表单渲染器
  根据 JSON Schema 自动渲染配置表单
-->
<template>
  <div class="config-form-renderer">
    <template v-for="(sectionSchema, sectionKey) in schema" :key="sectionKey">
      <!-- 分组折叠区域 -->
      <div :class="['group-section', { open: openSections[sectionKey] }]">
        <div class="group-header" @click="toggleSection(sectionKey)">
          <div class="group-arrow"></div>
          <div class="group-title">{{ getSectionLabel(sectionKey) }}</div>
        </div>

        <div class="group-body" v-show="openSections[sectionKey]">
          <template v-if="sectionSchema.properties">
            <template v-for="(propSchema, propKey) in sectionSchema.properties" :key="propKey">
              <component
                :is="getFormControl(propSchema)"
                :label="propSchema.label"
                :modelValue="getNestedValue(modelValue, sectionKey, propKey)"
                @update:modelValue="updateNestedValue(sectionKey, propKey, $event)"
                :schema="propSchema"
              />
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BooleanControl from './controls/BooleanControl.vue'
import NumberControl from './controls/NumberControl.vue'
import StringControl from './controls/StringControl.vue'
import ColorControl from './controls/ColorControl.vue'
import SelectControl from './controls/SelectControl.vue'
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

// 默认展开所有分组
const openSections = reactive({})

// 初始化展开状态
watch(() => props.schema, (newSchema) => {
  Object.keys(newSchema).forEach(key => {
    if (openSections[key] === undefined) {
      openSections[key] = true
    }
  })
}, { immediate: true })

const toggleSection = (key) => {
  openSections[key] = !openSections[key]
}

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
      return BooleanControl
    case 'number':
      return NumberControl
    case 'string':
      return StringControl
    case 'color':
      return ColorControl
    case 'select':
      return SelectControl
    default:
      return StringControl
  }
}

const getNestedValue = (obj, ...keys) => {
  return keys.reduce((acc, key) => acc?.[key], obj)
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
  width: 100%;
}

/* 优化后的分组样式 - 参考模板设计 */
.group-section {
  border: 1px solid #303033;
  border-radius: 3px;
  background: #202024;
  margin-bottom: 10px;
  overflow: hidden;
}

.group-section:last-child {
  margin-bottom: 0;
}

.group-header {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  cursor: pointer;
  user-select: none;
  background: #252529;
  transition: background 0.2s;
}

.group-header:hover {
  background: #2a2a2e;
}

.group-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #909399;
  transition: transform 0.2s;
  margin-right: 6px;
}

.group-section.open .group-arrow {
  transform: rotate(0deg);
}

.group-section:not(.open) .group-arrow {
  transform: rotate(-90deg);
}

.group-title {
  font-size: 12px;
  font-weight: 500;
  color: #e5e5e5;
  flex: 1;
  display: flex;
  align-items: center;
}

.group-body {
  padding: 10px;
  border-top: 1px solid #303033;
  background: #18181c;
}
</style>
