<!--
  边框01 - 四角科技切角
  科技感边框装饰组件
-->
<template>
  <div class="border-01" :style="containerStyle">
    <svg class="border-svg" :width="width" :height="height">
      <!-- 四个角的切角装饰 -->
      <g class="corner top-left">
        <path :d="`M 0,${cornerSize} L 0,0 L ${cornerSize},0`" :stroke="color" stroke-width="2" fill="none" />
        <line :x1="cornerSize" y1="0" :x2="cornerSize" :y2="cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.5" />
        <line x1="0" :y1="cornerSize" :x2="cornerSize * 0.6" :y2="cornerSize" :stroke="color" stroke-width="1" opacity="0.5" />
        <circle :cx="cornerSize * 0.3" :cy="cornerSize * 0.3" r="2" :fill="color" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="corner top-right" :transform="`translate(${width}, 0)`">
        <path :d="`M 0,0 L ${-cornerSize},0 M 0,0 L 0,${cornerSize}`" :stroke="color" stroke-width="2" fill="none" />
        <line :x1="-cornerSize" y1="0" :x2="-cornerSize" :y2="cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.5" />
        <line x1="0" :y1="cornerSize" :x2="-cornerSize * 0.6" :y2="cornerSize" :stroke="color" stroke-width="1" opacity="0.5" />
        <circle :cx="-cornerSize * 0.3" :cy="cornerSize * 0.3" r="2" :fill="color" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="corner bottom-right" :transform="`translate(${width}, ${height})`">
        <path :d="`M 0,0 L ${-cornerSize},0 M 0,0 L 0,${-cornerSize}`" :stroke="color" stroke-width="2" fill="none" />
        <line :x1="-cornerSize" y1="0" :x2="-cornerSize" :y2="-cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.5" />
        <line x1="0" :y1="-cornerSize" :x2="-cornerSize * 0.6" :y2="-cornerSize" :stroke="color" stroke-width="1" opacity="0.5" />
        <circle :cx="-cornerSize * 0.3" :cy="-cornerSize * 0.3" r="2" :fill="color" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="corner bottom-left" :transform="`translate(0, ${height})`">
        <path :d="`M 0,0 L ${cornerSize},0 M 0,0 L 0,${-cornerSize}`" :stroke="color" stroke-width="2" fill="none" />
        <line :x1="cornerSize" y1="0" :x2="cornerSize" :y2="-cornerSize * 0.6" :stroke="color" stroke-width="1" opacity="0.5" />
        <line x1="0" :y1="-cornerSize" :x2="cornerSize * 0.6" :y2="-cornerSize" :stroke="color" stroke-width="1" opacity="0.5" />
        <circle :cx="cornerSize * 0.3" :cy="-cornerSize * 0.3" r="2" :fill="color" opacity="0.8">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 边框线条 -->
      <line :x1="cornerSize * 1.5" y1="0" :x2="width - cornerSize * 1.5" y2="0" :stroke="color" stroke-width="1" opacity="0.3" />
      <line :x1="width" :y1="cornerSize * 1.5" :x2="width" :y2="height - cornerSize * 1.5" :stroke="color" stroke-width="1" opacity="0.3" />
      <line :x1="cornerSize * 1.5" :y1="height" :x2="width - cornerSize * 1.5" :y2="height" :stroke="color" stroke-width="1" opacity="0.3" />
      <line x1="0" :y1="cornerSize * 1.5" x2="0" :y2="height - cornerSize * 1.5" :stroke="color" stroke-width="1" opacity="0.3" />
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
  }
})

const width = computed(() => props.config.width || 400)
const height = computed(() => props.config.height || 300)
const color = computed(() => props.config.color || '#00f2f2')
const cornerSize = computed(() => props.config.cornerSize || 20)

const containerStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`
}))
</script>

