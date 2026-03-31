<!--
  边框03 - 四角强调断线边框
  断线边框,四角强调装饰
-->
<template>
  <div class="border-03" :style="containerStyle">
    <svg class="border-svg" width="100%" height="100%" :viewBox="`0 0 ${width} ${height}`">
      <!-- 顶边 - 断线 -->
      <line x1="0" y1="0" :x2="cornerSize" y2="0" :stroke="color" stroke-width="2" />
      <line :x1="width - cornerSize" y1="0" :x2="width" y2="0" :stroke="color" stroke-width="2" />

      <!-- 右边 - 断线 -->
      <line :x1="width" y1="0" :x2="width" :y2="cornerSize" :stroke="color" stroke-width="2" />
      <line :x1="width" :y1="height - cornerSize" :x2="width" :y2="height" :stroke="color" stroke-width="2" />

      <!-- 底边 - 断线 -->
      <line :x1="width" :y1="height" :x2="width - cornerSize" :y2="height" :stroke="color" stroke-width="2" />
      <line :x1="cornerSize" :y1="height" x2="0" :y2="height" :stroke="color" stroke-width="2" />

      <!-- 左边 - 断线 -->
      <line x1="0" :y1="height" x2="0" :y2="height - cornerSize" :stroke="color" stroke-width="2" />
      <line x1="0" :y1="cornerSize" x2="0" y2="0" :stroke="color" stroke-width="2" />

      <!-- 四角装饰 -->
      <g class="corner-decoration">
        <!-- 左上角 -->
        <line x1="0" y1="0" :x2="cornerSize * 0.6" :y2="cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.6" />
        <circle :cx="cornerSize * 0.4" :cy="cornerSize * 0.4" r="2" :fill="color">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <line :x1="cornerSize * 0.3" y1="0" :x2="cornerSize * 0.3" :y2="cornerSize * 0.5" :stroke="color" stroke-width="1" opacity="0.4" />
        <line x1="0" :y1="cornerSize * 0.3" :x2="cornerSize * 0.5" :y2="cornerSize * 0.3" :stroke="color" stroke-width="1" opacity="0.4" />

        <!-- 右上角 -->
        <line :x1="width" y1="0" :x2="width - cornerSize * 0.6" :y2="cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.6" />
        <circle :cx="width - cornerSize * 0.4" :cy="cornerSize * 0.4" r="2" :fill="color">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <line :x1="width - cornerSize * 0.3" y1="0" :x2="width - cornerSize * 0.3" :y2="cornerSize * 0.5" :stroke="color" stroke-width="1" opacity="0.4" />
        <line :x1="width" :y1="cornerSize * 0.3" :x2="width - cornerSize * 0.5" :y2="cornerSize * 0.3" :stroke="color" stroke-width="1" opacity="0.4" />

        <!-- 右下角 -->
        <line :x1="width" :y1="height" :x2="width - cornerSize * 0.6" :y2="height - cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.6" />
        <circle :cx="width - cornerSize * 0.4" :cy="height - cornerSize * 0.4" r="2" :fill="color">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
        <line :x1="width - cornerSize * 0.3" :y1="height" :x2="width - cornerSize * 0.3" :y2="height - cornerSize * 0.5" :stroke="color" stroke-width="1" opacity="0.4" />
        <line :x1="width" :y1="height - cornerSize * 0.3" :x2="width - cornerSize * 0.5" :y2="height - cornerSize * 0.3" :stroke="color" stroke-width="1" opacity="0.4" />

        <!-- 左下角 -->
        <line x1="0" :y1="height" :x2="cornerSize * 0.6" :y2="height - cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.6" />
        <circle :cx="cornerSize * 0.4" :cy="height - cornerSize * 0.4" r="2" :fill="color">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
        <line :x1="cornerSize * 0.3" :y1="height" :x2="cornerSize * 0.3" :y2="height - cornerSize * 0.5" :stroke="color" stroke-width="1" opacity="0.4" />
        <line x1="0" :y1="height - cornerSize * 0.3" :x2="cornerSize * 0.5" :y2="height - cornerSize * 0.3" :stroke="color" stroke-width="1" opacity="0.4" />
      </g>

      <!-- 中间虚线装饰 -->
      <line :x1="cornerSize * 1.5" y1="0" :x2="width - cornerSize * 1.5" y2="0" :stroke="color" stroke-width="1" opacity="0.2" stroke-dasharray="5,5" />
      <line :x1="width" :y1="cornerSize * 1.5" :x2="width" :y2="height - cornerSize * 1.5" :stroke="color" stroke-width="1" opacity="0.2" stroke-dasharray="5,5" />
      <line :x1="cornerSize * 1.5" :y1="height" :x2="width - cornerSize * 1.5" :y2="height" :stroke="color" stroke-width="1" opacity="0.2" stroke-dasharray="5,5" />
      <line x1="0" :y1="cornerSize * 1.5" x2="0" :y2="height - cornerSize * 1.5" :stroke="color" stroke-width="1" opacity="0.2" stroke-dasharray="5,5" />
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
  config: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 300
  }
})

const color = computed(() => props.config.color || '#ffaa00')
const cornerSize = computed(() => props.config.cornerSize || 30)

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%'
}))
</script>

