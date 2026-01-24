<template>
  <div class="info-card" :class="{ bordered: bordered }">
    <div class="card-header">
      <div class="card-header-left">
        <div v-if="icon" class="card-icon">
          <el-icon>
            <component :is="icon" />
          </el-icon>
        </div>
        <div class="card-title-wrapper">
          <div class="card-title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div v-if="description || $slots.description" class="card-description">
            <slot name="description">{{ description }}</slot>
          </div>
        </div>
      </div>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div v-if="$slots.default" class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  },
  bordered: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.info-card {
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
}

.info-card.bordered {
  border: 1px solid var(--el-border-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.card-header-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
  color: var(--el-color-primary);
  font-size: 20px;
  flex-shrink: 0;
}

.card-title-wrapper {
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.card-description {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.card-actions {
  flex-shrink: 0;
}

.card-body {
  margin-top: 16px;
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
