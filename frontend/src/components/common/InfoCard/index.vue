<template>
  <div :class="['info-card', `info-card--${variant}`, { 'info-card--hoverable': hoverable }]" @click="handleClick">
    <div class="info-card__header">
      <!-- 图标 -->
      <div v-if="icon" :class="['info-card__icon', `info-card__icon--${iconColor}`]">
        
          <component :is="icon" />
        
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
        
          <component :is="trendIcon" />
        
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
      <Loading />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LoadingOutlined, LineChartOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue'

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

