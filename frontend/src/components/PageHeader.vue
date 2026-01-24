<template>
  <header class="page-header">
    <div class="page-header-content">
      <h2 v-if="title">{{ title }}</h2>
      <p v-if="description || subtitle">{{ description || subtitle }}</p>
      <slot name="content"></slot>
    </div>
    <div v-if="$slots.actions || actions.length > 0 || stats.length > 0" class="page-header-actions">
      <!-- 统计信息 -->
      <div v-if="stats.length > 0" class="header-stats">
        <span v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-label">{{ stat.label }}：</span>
          <span class="stat-value">{{ stat.value }}</span>
        </span>
      </div>

      <!-- 操作按钮 -->
      <slot name="actions">
        <el-button
          v-for="action in actions"
          :key="action.key || action.text"
          :type="action.type || 'default'"
          :icon="action.icon"
          :disabled="action.disabled"
          @click="handleAction(action)"
        >
          <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
          {{ action.text }}
        </el-button>
      </slot>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  actions: { type: Array, default: () => [] },
  stats: { type: Array, default: () => [] }
})

const emit = defineEmits(['action'])

const handleAction = (action) => {
  if (action.handler) {
    action.handler()
  }
  emit('action', action)
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.page-header-content {
  flex: 1;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--el-text-color-primary);
}

.page-header p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  color: var(--el-text-color-secondary);
}

.page-header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-stats {
  display: flex;
  gap: 16px;
  padding-right: 16px;
  border-right: 1px solid var(--el-border-color);
}

.stat-item {
  font-size: 14px;
}

.stat-label {
  color: var(--el-text-color-secondary);
}

.stat-value {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
