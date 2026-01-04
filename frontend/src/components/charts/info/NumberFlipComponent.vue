<!--
  数字翻牌器组件
  动态数字展示
-->
<template>
  <div class="number-flip-component">
    <div class="number-container">
      <div class="number-value">{{ formattedNumber }}</div>
      <div class="number-label">{{ label }}</div>
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

const numberValue = computed(() => {
  return props.data?.value || props.config.value || 12345
})

const label = computed(() => {
  return props.data?.label || props.config.label || '总数'
})

const formattedNumber = computed(() => {
  return numberValue.value.toLocaleString()
})
</script>

<style scoped>
.number-flip-component {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  padding: 20px;
}

.number-container {
  text-align: center;
  color: #fff;
}

.number-value {
  font-size: 36px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.number-label {
  font-size: 14px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
