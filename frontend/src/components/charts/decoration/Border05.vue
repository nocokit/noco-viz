<!--
  边框05 - 不规则切角多边形边框
  左上斜切缺口 + 右下角标，双色设计
-->
<template>
  <div class="border-05" :style="containerStyle">
    <svg class="border-svg" width="100%" height="100%" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
      <!-- 主轮廓 -->
      <path
        fill="transparent"
        :d="mainPath"
        :stroke="color"
        :stroke-width="borderWidth"
      />
      <!-- 顶部虚线装饰段 -->
      <path
        fill="transparent"
        :stroke-width="borderWidth + 1"
        stroke-linecap="round"
        stroke-dasharray="10, 5"
        d="M 16 9 L 61 9"
        :stroke="color"
      />
      <!-- 左上角高亮 -->
      <path
        fill="transparent"
        :d="topLeftAccent"
        :stroke="accentColor"
        :stroke-width="borderWidth"
      />
      <!-- 右下角高亮 -->
      <path
        fill="transparent"
        :d="bottomRightAccent"
        :stroke="accentColor"
        :stroke-width="borderWidth"
      />
    </svg>

    <!-- 内容插槽 -->
    <div class="border-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  width: { type: Number, default: 540 },
  height: { type: Number, default: 310 }
})

const color = computed(() => props.config.color || '#6586ec')
const accentColor = computed(() => props.config.accentColor || '#2cf7fe')
const borderWidth = computed(() => props.config.borderWidth ?? 1)

// 主轮廓路径（自适应宽高）
const mainPath = computed(() => {
  const w = props.width
  const h = props.height
  return `M 5 20 L 5 10 L 12 3 L 60 3 L 68 10 L ${w - 20} 10 L ${w - 5} 25 L ${w - 5} ${h - 5} L 20 ${h - 5} L 5 ${h - 20} Z`
})

// 左上角高亮路径（固定缺口形状）
const topLeftAccent = computed(() => 'M 5 20 L 5 10 L 12 3 L 60 3 L 68 10')

// 右下角高亮路径（自适应）
const bottomRightAccent = computed(() => {
  const w = props.width
  const h = props.height
  return `M ${w - 5} ${h - 30} L ${w - 5} ${h - 5} L ${w - 30} ${h - 5}`
})

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  position: 'relative'
}))
</script>

<style scoped>
.border-05 {
  position: relative;
}

.border-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.border-content {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
