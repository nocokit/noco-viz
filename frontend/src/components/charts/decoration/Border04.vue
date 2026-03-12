<!--
  边框04 - 动态流光边框
  带有流动光效的科技边框
-->
<template>
  <div class="border-04" :style="containerStyle">
    <svg class="border-svg" :width="width" :height="height">
      <defs>
        <!-- 流光渐变定义 -->
        <linearGradient id="flow-gradient-h" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="color" stop-opacity="0" />
          <stop offset="50%" :stop-color="color" stop-opacity="1" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
          <animate attributeName="x1" values="-100%;200%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0%;300%" dur="3s" repeatCount="indefinite" />
        </linearGradient>

        <linearGradient id="flow-gradient-v" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="color" stop-opacity="0" />
          <stop offset="50%" :stop-color="color" stop-opacity="1" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
          <animate attributeName="y1" values="-100%;200%" dur="3s" repeatCount="indefinite" />
          <animate attributeName="y2" values="0%;300%" dur="3s" repeatCount="indefinite" />
        </linearGradient>
      </defs>

      <!-- 外边框 -->
      <rect
        x="1"
        y="1"
        :width="width - 2"
        :height="height - 2"
        :stroke="color"
        stroke-width="1"
        fill="none"
        opacity="0.3"
      />

      <!-- 中线 - 水平和垂直 -->
      <line :x1="width / 2" y1="1" :x2="width / 2" :y2="height - 1" :stroke="color" stroke-width="1" opacity="0.15" />
      <line x1="1" :y1="height / 2" :x2="width - 1" :y2="height / 2" :stroke="color" stroke-width="1" opacity="0.15" />

      <!-- 流光效果线条 -->
      <g class="flow-lines">
        <!-- 顶部流光 -->
        <line x1="0" y1="0" :x2="width" y2="0" stroke="url(#flow-gradient-h)" stroke-width="2" />

        <!-- 右侧流光 -->
        <line :x1="width" y1="0" :x2="width" :y2="height" stroke="url(#flow-gradient-v)" stroke-width="2" />

        <!-- 底部流光 (反向) -->
        <line :x1="width" :y1="height" x2="0" :y2="height" stroke="url(#flow-gradient-h)" stroke-width="2">
          <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="3s" begin="1.5s" repeatCount="indefinite" />
        </line>

        <!-- 左侧流光 (反向) -->
        <line x1="0" :y1="height" x2="0" y2="0" stroke="url(#flow-gradient-v)" stroke-width="2">
          <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="3s" begin="1.5s" repeatCount="indefinite" />
        </line>
      </g>

      <!-- 角部增强点 -->
      <g class="corner-points">
        <circle cx="0" cy="0" r="3" :fill="color" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>

        <circle :cx="width" cy="0" r="3" :fill="color" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>

        <circle :cx="width" :cy="height" r="3" :fill="color" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>

        <circle cx="0" :cy="height" r="3" :fill="color" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 短线装饰 -->
      <g class="dash-decoration">
        <line :x1="width / 4" y1="0" :x2="width / 4" y2="8" :stroke="color" stroke-width="1" opacity="0.5" />
        <line :x1="width * 3 / 4" y1="0" :x2="width * 3 / 4" y2="8" :stroke="color" stroke-width="1" opacity="0.5" />

        <line :x1="width - 8" :y1="height / 4" :x2="width" :y2="height / 4" :stroke="color" stroke-width="1" opacity="0.5" />
        <line :x1="width - 8" :y1="height * 3 / 4" :x2="width" :y2="height * 3 / 4" :stroke="color" stroke-width="1" opacity="0.5" />

        <line :x1="width / 4" :y1="height - 8" :x2="width / 4" :y2="height" :stroke="color" stroke-width="1" opacity="0.5" />
        <line :x1="width * 3 / 4" :y1="height - 8" :x2="width * 3 / 4" :y2="height" :stroke="color" stroke-width="1" opacity="0.5" />

        <line x1="0" :y1="height / 4" x2="8" :y2="height / 4" :stroke="color" stroke-width="1" opacity="0.5" />
        <line x1="0" :y1="height * 3 / 4" x2="8" :y2="height * 3 / 4" :stroke="color" stroke-width="1" opacity="0.5" />
      </g>
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
const color = computed(() => props.config.color || '#66ffff')

const containerStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`
}))
</script>

