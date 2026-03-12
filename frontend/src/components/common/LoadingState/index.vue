<template>
  <div :class="['loading-state', `loading-state--${size}`, { 'loading-state--fullscreen': fullscreen }]">
    <div class="loading-state__content">
      <!-- 自定义加载动画 -->
      <div v-if="type === 'spinner'" class="loading-spinner">
        <Loading />
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
        <a-progress :percentage="progress" :stroke-width="4" :show-text="false" />
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div v-if="overlay" class="loading-state__overlay"></div>
  </div>
</template>

<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue'

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

