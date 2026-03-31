<template>
  <span class="status-badge" :class="[`status-${status}`, { 'with-dot': dot }]">
    <span v-if="dot" class="status-dot"></span>
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'danger', 'info', 'default'].includes(value)
  },
  text: {
    type: String,
    required: true
  },
  dot: {
    type: Boolean,
    default: false
  }
})
</script>

