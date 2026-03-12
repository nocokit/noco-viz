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

