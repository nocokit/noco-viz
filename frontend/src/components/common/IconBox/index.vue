<template>
  <div
    :class="[
      'icon-box',
      `icon-box--${size}`,
      `icon-box--${type}`,
      { 'icon-box--circle': circle }
    ]"
    :style="customStyle"
  >
    <el-icon :size="iconSize">
      <component :is="icon" />
    </el-icon>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 图标组件
  icon: {
    type: [Object, String],
    required: true
  },
  // 尺寸
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  // 类型
  type: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  // 自定义颜色
  color: {
    type: String,
    default: ''
  },
  // 自定义背景色
  backgroundColor: {
    type: String,
    default: ''
  },
  // 是否圆形
  circle: {
    type: Boolean,
    default: false
  }
})

// 图标尺寸映射
const iconSizeMap = {
  small: 16,
  default: 20,
  large: 24
}

// 图标尺寸
const iconSize = computed(() => iconSizeMap[props.size])

// 自定义样式
const customStyle = computed(() => {
  const style = {}

  if (props.color) {
    style.color = props.color
  }

  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
  }

  return style
})
</script>

<style scoped>
.icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

/* 尺寸 */
.icon-box--small {
  width: 32px;
  height: 32px;
}

.icon-box--default {
  width: 40px;
  height: 40px;
}

.icon-box--large {
  width: 48px;
  height: 48px;
}

/* 圆形 */
.icon-box--circle {
  border-radius: var(--radius-circle);
}

/* 类型 */
.icon-box--default {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.icon-box--primary {
  background: rgba(64, 158, 255, 0.1);
  color: var(--color-primary);
}

.icon-box--success {
  background: rgba(103, 194, 58, 0.1);
  color: var(--color-success);
}

.icon-box--warning {
  background: rgba(230, 162, 60, 0.1);
  color: var(--color-warning);
}

.icon-box--danger {
  background: rgba(245, 108, 108, 0.1);
  color: var(--color-danger);
}

.icon-box--info {
  background: rgba(144, 147, 153, 0.1);
  color: var(--color-info);
}

/* 悬停效果 */
.icon-box:hover {
  transform: scale(1.05);
}
</style>
