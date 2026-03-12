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
    
      <component :is="icon" />
    
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

