<template>
  <div :class="['info-card', `info-card--${variant}`, { 'info-card--hoverable': hoverable }]" @click="handleClick">
    <div class="info-card__header">
      <!-- 图标 -->
      <div v-if="icon" :class="['info-card__icon', `info-card__icon--${iconColor}`]">
        <el-icon :size="iconSize">
          <component :is="icon" />
        </el-icon>
      </div>

      <!-- 标题和副标题 -->
      <div class="info-card__titles">
        <h3 class="info-card__title">
          <slot name="title">{{ title }}</slot>
        </h3>
        <p v-if="subtitle || $slots.subtitle" class="info-card__subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>
      </div>

      <!-- 右侧操作 -->
      <div v-if="$slots.extra" class="info-card__extra">
        <slot name="extra"></slot>
      </div>
    </div>

    <div class="info-card__body">
      <!-- 主要数值 -->
      <div v-if="value !== undefined" class="info-card__value">
        <span :class="['info-card__number', { 'info-card__number--animated': animated }]">
          {{ formattedValue }}
        </span>
        <span v-if="unit" class="info-card__unit">{{ unit }}</span>
      </div>

      <!-- 趋势指示器 -->
      <div v-if="trend !== undefined" :class="['info-card__trend', `info-card__trend--${trendType}`]">
        <el-icon>
          <component :is="trendIcon" />
        </el-icon>
        <span>{{ trendText }}</span>
      </div>

      <!-- 自定义内容 -->
      <div v-if="$slots.default" class="info-card__content">
        <slot></slot>
      </div>
    </div>

    <!-- 底部 -->
    <div v-if="$slots.footer" class="info-card__footer">
      <slot name="footer"></slot>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="info-card__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading, TrendCharts, CaretTop, CaretBottom } from '@element-plus/icons-vue'

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 副标题
  subtitle: {
    type: String,
    default: ''
  },
  // 图标
  icon: {
    type: Object,
    default: null
  },
  // 图标颜色
  iconColor: {
    type: String,
    default: 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info'
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  // 图标大小
  iconSize: {
    type: Number,
    default: 24
  },
  // 数值
  value: {
    type: [Number, String],
    default: undefined
  },
  // 单位
  unit: {
    type: String,
    default: ''
  },
  // 格式化函数
  formatter: {
    type: Function,
    default: null
  },
  // 趋势（百分比）
  trend: {
    type: Number,
    default: undefined
  },
  // 趋势文本
  trendText: {
    type: String,
    default: ''
  },
  // 卡片样式
  variant: {
    type: String,
    default: 'default', // 'default' | 'bordered' | 'shadow'
    validator: (value) => ['default', 'bordered', 'shadow'].includes(value)
  },
  // 是否可悬停
  hoverable: {
    type: Boolean,
    default: false
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 数字动画
  animated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const formattedValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.value)
  }
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const trendType = computed(() => {
  if (props.trend === undefined) return 'neutral'
  return props.trend > 0 ? 'up' : props.trend < 0 ? 'down' : 'neutral'
})

const trendIcon = computed(() => {
  if (trendType.value === 'up') return CaretTop
  if (trendType.value === 'down') return CaretBottom
  return TrendCharts
})

const handleClick = (event) => {
  if (props.hoverable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.info-card {
  position: relative;
  background: var(--bg-card, #1a1b1e);
  border-radius: 8px;
  padding: 20px;
  overflow: hidden;
  transition: all 0.3s;
}

.info-card--bordered {
  border: 1px solid var(--border, #35363a);
}

.info-card--shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card--hoverable {
  cursor: pointer;
}

.info-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.info-card__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.info-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
}

.info-card__icon--primary {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.info-card__icon--success {
  background: rgba(103, 194, 58, 0.1);
  color: var(--el-color-success);
}

.info-card__icon--warning {
  background: rgba(230, 162, 60, 0.1);
  color: var(--el-color-warning);
}

.info-card__icon--danger {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}

.info-card__icon--info {
  background: rgba(144, 147, 153, 0.1);
  color: var(--el-color-info);
}

.info-card__titles {
  flex: 1;
  min-width: 0;
}

.info-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary, #9aa0a6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-card__subtitle {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
}

.info-card__extra {
  flex-shrink: 0;
}

.info-card__body {
  margin-bottom: 12px;
}

.info-card__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.info-card__number {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary, #e8eaed);
  line-height: 1;
}

.info-card__number--animated {
  transition: all 0.3s ease-out;
}

.info-card__unit {
  font-size: 16px;
  color: var(--text-secondary, #9aa0a6);
}

.info-card__trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.info-card__trend--up {
  background: rgba(103, 194, 58, 0.1);
  color: var(--el-color-success);
}

.info-card__trend--down {
  background: rgba(245, 108, 108, 0.1);
  color: var(--el-color-danger);
}

.info-card__trend--neutral {
  background: rgba(144, 147, 153, 0.1);
  color: var(--text-secondary, #9aa0a6);
}

.info-card__content {
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-secondary, #9aa0a6);
}

.info-card__footer {
  padding-top: 12px;
  border-top: 1px solid var(--border, #35363a);
  font-size: 12px;
  color: var(--text-tertiary, #5f6368);
}

.info-card__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  font-size: 24px;
  color: var(--el-color-primary);
}

@media (max-width: 768px) {
  .info-card {
    padding: 16px;
  }

  .info-card__number {
    font-size: 24px;
  }

  .info-card__unit {
    font-size: 14px;
  }
}
</style>
