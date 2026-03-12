<template>
  <span :class="['status-tag', `status-${type}`, { 'tag-style': style === 'tag', 'dot-style': style === 'dot' }]">
    <span v-if="showDot" class="status-dot">●</span>
    <span class="status-text">{{ text }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 状态类型：success, error, warning, info, default
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['success', 'error', 'warning', 'info', 'default'].includes(value)
  },
  // 显示文本
  text: {
    type: String,
    required: true
  },
  // 是否显示圆点
  showDot: {
    type: Boolean,
    default: true
  },
  // 样式风格：tag（标签样式）或 dot（圆点样式）
  style: {
    type: String,
    default: 'tag',
    validator: (value) => ['tag', 'dot'].includes(value)
  }
})
</script>

