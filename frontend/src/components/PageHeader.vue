<template>
  <header class="page-header">
    <div class="page-header-content">
      <div class="header-title-row">
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="description || subtitle" class="header-description">{{ description || subtitle }}</p>
      </div>
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
/* 页面头部基础样式在 page-layout.css 中定义 */

/* 组件特有样式 */
.header-title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.header-title-row h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-description {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
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
