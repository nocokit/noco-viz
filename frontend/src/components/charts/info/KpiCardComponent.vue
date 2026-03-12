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

