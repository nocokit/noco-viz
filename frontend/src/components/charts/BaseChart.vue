<!--
  ECharts 基础包装器组件
  所有图表组件都继承自此组件
  使用 useECharts composable 简化代码
-->
<template>
  <div ref="chartRef" :style="chartStyle"></div>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { useECharts } from '@/composables/useECharts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  width: {
    type: [Number, String],
    default: '100%'
  },
  height: {
    type: [Number, String],
    default: '100%'
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

// 计算样式
const chartStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

// 使用 ECharts composable
const { chartRef, chartInstance, resize } = useECharts({
  option: toRef(props, 'option'),
  theme: toRef(props, 'theme'),
  autoResize: true
})

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance.value,
  resize
})
</script>

