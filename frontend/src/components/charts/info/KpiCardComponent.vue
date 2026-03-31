<template>
  <div class="kpi-card-component">
    <div class="kpi-corner kpi-corner-tl"></div>
    <div class="kpi-corner kpi-corner-br"></div>
    <div class="kpi-top">
      <span class="kpi-title">{{ title }}</span>
      <span class="kpi-trend" :class="trendClass">
        <span class="trend-arrow">{{ trendArrow }}</span>{{ trend }}
      </span>
    </div>
    <div class="kpi-main">
      <span class="kpi-value">{{ formattedValue }}</span>
      <span class="kpi-unit">{{ unit }}</span>
    </div>
    <div class="kpi-bottom">
      <span class="kpi-subtitle">{{ subtitle }}</span>
      <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: barWidth }"></div></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Object, default: null }
})

const title = computed(() => props.data?.title || props.config.title || 'KPI 指标')
const value = computed(() => props.data?.value ?? props.config.value ?? 8520)
const unit = computed(() => props.data?.unit || props.config.unit || '')
const trend = computed(() => props.data?.trend || props.config.trend || '+12.5%')
const subtitle = computed(() => props.data?.subtitle || props.config.subtitle || '较上月')

const formattedValue = computed(() => value.value.toLocaleString())

const trendClass = computed(() => {
  if (trend.value.startsWith('+')) return 'trend-up'
  if (trend.value.startsWith('-')) return 'trend-down'
  return 'trend-neutral'
})

const trendArrow = computed(() => {
  if (trend.value.startsWith('+')) return '▲ '
  if (trend.value.startsWith('-')) return '▼ '
  return ''
})

const barWidth = computed(() => {
  const num = parseFloat(trend.value.replace(/[^0-9.]/g, ''))
  return Math.min(100, Math.abs(num) * 4) + '%'
})
</script>

<style scoped>
.kpi-card-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(0, 10, 24, 0.7);
  border: 1px solid rgba(0, 153, 204, 0.25);
  position: relative;
  overflow: hidden;
}

.kpi-card-component::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 153, 204, 0.04) 0%, transparent 60%);
  pointer-events: none;
}

.kpi-corner {
  position: absolute;
  width: 10px;
  height: 10px;
}

.kpi-corner-tl {
  top: 0; left: 0;
  border-top: 2px solid #00f2f2;
  border-left: 2px solid #00f2f2;
}

.kpi-corner-br {
  bottom: 0; right: 0;
  border-bottom: 2px solid rgba(0, 242, 242, 0.4);
  border-right: 2px solid rgba(0, 242, 242, 0.4);
}

.kpi-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kpi-title {
  font-size: 12px;
  color: rgba(188, 208, 227, 0.7);
  letter-spacing: 0.5px;
}

.kpi-trend {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.trend-up { color: #00cc99; }
.trend-down { color: #ff4466; }
.trend-neutral { color: rgba(255, 255, 255, 0.4); }

.trend-arrow {
  font-size: 9px;
}

.kpi-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #e8f4ff;
  line-height: 1;
  text-shadow: 0 0 20px rgba(0, 153, 204, 0.5);
}

.kpi-unit {
  font-size: 12px;
  color: rgba(0, 242, 242, 0.5);
}

.kpi-bottom {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kpi-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

.kpi-bar {
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1px;
  overflow: hidden;
}

.kpi-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f2f2, #0099cc);
  border-radius: 1px;
  transition: width 0.6s ease;
  box-shadow: 0 0 6px rgba(0, 242, 242, 0.5);
}
</style>
