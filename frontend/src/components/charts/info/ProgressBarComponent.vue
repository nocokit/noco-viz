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

<style scoped>
.progress-bar-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #fff;
}

.progress-label {
  font-size: 14px;
  font-weight: 500;
}

.progress-percent {
  font-size: 16px;
  font-weight: 600;
  color: #22c55e;
  font-variant-numeric: tabular-nums;
}

.progress-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e 0%, #10b981 100%);
  border-radius: 6px;
  transition: width 0.6s ease;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}
</style>
