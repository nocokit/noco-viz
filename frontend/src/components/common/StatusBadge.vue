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

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-success {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.status-warning {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.status-danger {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.status-info {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.status-default {
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
