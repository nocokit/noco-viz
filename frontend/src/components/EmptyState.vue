<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <slot name="icon">
        <svg v-if="icon === 'default'" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        </svg>
        <svg v-else-if="icon === 'playlist'" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
        </svg>
        <svg v-else-if="icon === 'search'" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <component v-else-if="icon" :is="icon" style="width: 64px; height: 64px;" />
      </slot>
    </div>

    <div class="empty-state-title">
      <slot name="title">{{ title }}</slot>
    </div>

    <div v-if="description || $slots.description" class="empty-state-desc">
      <slot name="description">{{ description }}</slot>
    </div>

    <div v-if="actionText || $slots.action" class="empty-state-action">
      <slot name="action">
        <el-button v-if="actionText" type="primary" @click="handleAction">
          {{ actionText }}
        </el-button>
      </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: [String, Object],
    default: 'default'
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])

const handleAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--el-text-color-secondary);
}

.empty-state-icon {
  margin-bottom: 16px;
  color: var(--el-text-color-placeholder);
}

.empty-state-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.empty-state-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  text-align: center;
  margin-bottom: 16px;
}

.empty-state-action {
  margin-top: 8px;
}
</style>
