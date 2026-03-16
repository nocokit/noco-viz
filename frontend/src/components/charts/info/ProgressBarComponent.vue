<template>
  <div class="progress-bar-component">
    <div class="pb-header">
      <span class="pb-label">{{ label }}</span>
      <span class="pb-value">
        <span class="pb-num">{{ percentage }}</span>
        <span class="pb-pct">%</span>
      </span>
    </div>
    <div class="pb-track">
      <div class="pb-fill" :style="{ width: percentage + '%', background: fillColor }">
        <div class="pb-glow"></div>
      </div>
      <div class="pb-markers">
        <span v-for="n in 4" :key="n" class="pb-mark" :style="{ left: (n * 25) + '%' }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Object, default: null }
})

const percentage = computed(() => {
  const v = props.data?.percentage ?? props.config.percentage ?? 65
  return Math.min(100, Math.max(0, v))
})

const label = computed(() => props.data?.label || props.config.label || '任务进度')

const fillColor = computed(() => {
  const p = percentage.value
  if (p >= 80) return 'linear-gradient(90deg, #00cc99, #00f2f2)'
  if (p >= 50) return 'linear-gradient(90deg, #0099cc, #00f2f2)'
  return 'linear-gradient(90deg, #ffaa00, #ff6600)'
})
</script>

<style scoped>
.progress-bar-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(0, 10, 24, 0.6);
  border: 1px solid rgba(0, 242, 242, 0.12);
}

.pb-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.pb-label {
  font-size: 13px;
  color: rgba(188, 208, 227, 0.8);
  letter-spacing: 0.5px;
}

.pb-value {
  display: flex;
  align-items: baseline;
  gap: 1px;
}

.pb-num {
  font-size: 22px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #00f2f2;
  line-height: 1;
  text-shadow: 0 0 12px rgba(0, 242, 242, 0.6);
}

.pb-pct {
  font-size: 12px;
  color: rgba(0, 242, 242, 0.5);
}

.pb-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.pb-fill {
  height: 100%;
  border-radius: 4px;
  position: relative;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.pb-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 8px 3px rgba(0, 242, 242, 0.6);
}

.pb-markers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.pb-mark {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(-50%);
}
</style>
