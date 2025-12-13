<!--
  KPI指标卡组件
  关键指标展示卡片
-->
<template>
  <div class="kpi-card-component">
    <div class="kpi-header">
      <div class="kpi-title">{{ title }}</div>
      <div class="kpi-trend" :class="trendClass">
        {{ trend }}
      </div>
    </div>
    <div class="kpi-body">
      <div class="kpi-value">{{ formattedValue }}</div>
      <div class="kpi-unit">{{ unit }}</div>
    </div>
    <div class="kpi-footer">
      <span class="kpi-subtitle">{{ subtitle }}</span>
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

const title = computed(() => props.data?.title || props.config.title || 'KPI指标')
const value = computed(() => props.data?.value || props.config.value || 8520)
const unit = computed(() => props.data?.unit || props.config.unit || '单位')
const trend = computed(() => props.data?.trend || props.config.trend || '+12.5%')
const subtitle = computed(() => props.data?.subtitle || props.config.subtitle || '较上月')

const formattedValue = computed(() => {
  return value.value.toLocaleString()
})

const trendClass = computed(() => {
  const trendValue = trend.value
  if (trendValue.startsWith('+')) return 'trend-up'
  if (trendValue.startsWith('-')) return 'trend-down'
  return 'trend-neutral'
})
</script>

<style scoped>
.kpi-card-component {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 16px 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

.kpi-trend {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.trend-up {
  background: rgba(16, 185, 129, 0.3);
  color: #d1fae5;
}

.trend-down {
  background: rgba(239, 68, 68, 0.3);
  color: #fecaca;
}

.trend-neutral {
  background: rgba(156, 163, 175, 0.3);
  color: #e5e7eb;
}

.kpi-body {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 8px 0;
}

.kpi-value {
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.kpi-unit {
  font-size: 14px;
  opacity: 0.8;
}

.kpi-footer {
  font-size: 12px;
  opacity: 0.7;
}
</style>
