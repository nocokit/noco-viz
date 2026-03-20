<template>
  <div>
    <!-- 图表动画配置 (仅图表组件) -->
    <ConfigFormRenderer
      v-if="isChartComponent(modelValue.type) && chartAnimationSchema"
      :schema="chartAnimationSchema"
      v-model="componentConfig"
    />

    <!-- 非图表组件的空状态 -->
    <div v-if="!isChartComponent(modelValue.type)" class="empty-state">
      <svg viewBox="0 0 1024 1024" width="40" height="40" fill="rgba(255,255,255,0.2)">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
        <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"/>
      </svg>
      <div style="margin-top: 16px; color: #666;">此组件暂无动画配置</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ConfigFormRenderer from '@/components/editor/ConfigFormRenderer.vue'
import { getComponentSchema, isChartComponent as checkIsChart } from '@/config/componentSchema'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 判断是否为图表组件
const isChartComponent = (type) => {
  return checkIsChart(type)
}

// 获取仅动画的图表配置 Schema
const chartAnimationSchema = computed(() => {
  if (!props.modelValue) return null
  const schema = getComponentSchema(props.modelValue.type)
  return schema.animation ? { animation: schema.animation } : null
})

// 组件配置的双向绑定
const componentConfig = computed({
  get: () => props.modelValue.config || {},
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, config: value })
  }
})
</script>
