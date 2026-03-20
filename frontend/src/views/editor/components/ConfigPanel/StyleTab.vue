<template>
  <div class="style-tab">
    <!-- 使用 EditorFormRenderer 渲染完整配置 -->
    <EditorFormRenderer
      :schema="fullComponentSchema"
      v-model="componentData"
    />

    <!-- 图表配置面板 (仅图表组件，排除动画) -->
    <ChartConfigPanel
      v-if="isChartComponent(modelValue.type)"
      :schema="chartSchemaWithoutAnimation"
      v-model="componentConfig"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EditorFormRenderer from '@/components/editor/EditorFormRenderer.vue'
import ChartConfigPanel from '@/components/editor/ChartConfigPanel.vue'
import { fullComponentSchema } from '@/components/editor/formSchemas'
import { isChartComponent as checkIsChart, getComponentSchema } from '@/config/componentSchema'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 组件数据的双向绑定
const componentData = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// 组件配置的双向绑定
const componentConfig = computed({
  get: () => props.modelValue?.config || {},
  set: (value) => {
    if (props.modelValue) {
      emit('update:modelValue', { ...props.modelValue, config: value })
    }
  }
})

// 判断是否为图表组件
const isChartComponent = (type) => {
  return checkIsChart(type)
}

// 图表配置 Schema（排除动画）
const chartSchemaWithoutAnimation = computed(() => {
  if (!props.modelValue?.type) return {}
  const schema = getComponentSchema(props.modelValue.type)
  if (!schema) return {}
  const { animation, ...rest } = schema
  return rest
})
</script>

<style scoped>
.style-tab {
  /* 样式继承自父组件 */
}
</style>
