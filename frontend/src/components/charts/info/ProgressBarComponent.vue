<!--
  进度条组件
  展示任务完成进度
-->
<template>
  <div class="progress-bar-component">
    <div class="progress-header">
      <span class="progress-label">{{ label }}</span>
      <span class="progress-percent">{{ percentage }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  }
})

const percentage = computed(() => {
  const value = props.data?.percentage || props.config.percentage || 65
  return Math.min(100, Math.max(0, value))
})

const label = computed(() => {
  return props.data?.label || props.config.label || '任务进度'
})
</script>

