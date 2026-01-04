<template>
  <div :class="['loading-state', `loading-state--${size}`, { 'loading-state--fullscreen': fullscreen }]">
    <div class="loading-state__content">
      <!-- 自定义加载动画 -->
      <div v-if="type === 'spinner'" class="loading-spinner">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
      </div>

      <div v-else-if="type === 'dots'" class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div v-else-if="type === 'pulse'" class="loading-pulse">
        <div class="pulse-circle"></div>
      </div>

      <div v-else-if="type === 'skeleton'" class="loading-skeleton">
        <slot name="skeleton">
          <div v-for="i in skeletonRows" :key="i" class="skeleton-row"></div>
        </slot>
      </div>

      <!-- 加载文字 -->
      <p v-if="text && type !== 'skeleton'" class="loading-state__text">{{ text }}</p>

      <!-- 进度条 -->
      <div v-if="showProgress" class="loading-state__progress">
        <el-progress :percentage="progress" :stroke-width="4" :show-text="false" />
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div v-if="overlay" class="loading-state__overlay"></div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

defineProps({
  // 加载类型
  type: {
    type: String,
    default: 'spinner', // 'spinner' | 'dots' | 'pulse' | 'skeleton'
    validator: (value) => ['spinner', 'dots', 'pulse', 'skeleton'].includes(value)
  },
  // 加载文字
  text: {
    type: String,
    default: '加载中...'
  },
  // 尺寸
  size: {
    type: String,
    default: 'default', // 'small' | 'default' | 'large'
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  // 全屏显示
  fullscreen: {
    type: Boolean,
    default: false
  },
  // 显示遮罩
  overlay: {
    type: Boolean,
    default: false
  },
  // 显示进度
  showProgress: {
    type: Boolean,
    default: false
  },
  // 进度百分比
  progress: {
    type: Number,
    default: 0
  },
  // 骨架屏行数
  skeletonRows: {
    type: Number,
    default: 5
  }
})
</script>

<style scoped>
.loading-state {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-state--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.loading-state__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-state__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* Spinner 加载 */
.loading-spinner {
  font-size: 32px;
  color: var(--el-color-primary);
}

.loading-state--small .loading-spinner {
  font-size: 24px;
}

.loading-state--large .loading-spinner {
  font-size: 48px;
}

/* Dots 加载 */
.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--el-color-primary);
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-state--small .loading-dots span {
  width: 8px;
  height: 8px;
}

.loading-state--large .loading-dots span {
  width: 16px;
  height: 16px;
}

/* Pulse 加载 */
.loading-pulse {
  position: relative;
  width: 60px;
  height: 60px;
}

.pulse-circle {
  position: absolute;
  inset: 0;
  border: 3px solid var(--el-color-primary);
  border-radius: 50%;
  animation: pulse-scale 1.5s infinite ease-in-out;
}

.pulse-circle::before,
.pulse-circle::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 3px solid var(--el-color-primary);
  border-radius: 50%;
  animation: pulse-scale 1.5s infinite ease-in-out;
}

.pulse-circle::before {
  animation-delay: -0.5s;
}

.pulse-circle::after {
  animation-delay: -1s;
}

@keyframes pulse-scale {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.loading-state--small .loading-pulse {
  width: 40px;
  height: 40px;
}

.loading-state--large .loading-pulse {
  width: 80px;
  height: 80px;
}

/* Skeleton 骨架屏 */
.loading-skeleton {
  width: 100%;
  max-width: 600px;
}

.skeleton-row {
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-row:last-child {
  margin-bottom: 0;
  width: 60%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 加载文字 */
.loading-state__text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
}

.loading-state--small .loading-state__text {
  font-size: 12px;
}

.loading-state--large .loading-state__text {
  font-size: 16px;
}

/* 进度条 */
.loading-state__progress {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary, #9aa0a6);
}

.loading-state--small .loading-state__progress {
  width: 200px;
}

.loading-state--large .loading-state__progress {
  width: 400px;
}
</style>
