<template>
  <div class="error-state">
    <div class="error-icon">
      <el-icon>
        <CircleClose />
      </el-icon>
    </div>
    <div class="error-title">{{ title }}</div>
    <div v-if="message" class="error-message">{{ message }}</div>
    <div v-if="showRetry" class="error-actions">
      <el-button type="primary" @click="handleRetry">
        {{ retryText }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { CircleClose } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '加载失败'
  },
  message: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  retryText: {
    type: String,
    default: '重试'
  }
})

const emit = defineEmits(['retry'])

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--el-text-color-secondary);
}

.error-icon {
  margin-bottom: 16px;
  font-size: 64px;
  color: var(--el-color-danger);
}

.error-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.error-message {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  text-align: center;
  margin-bottom: 16px;
  max-width: 400px;
}

.error-actions {
  margin-top: 8px;
}
</style>
