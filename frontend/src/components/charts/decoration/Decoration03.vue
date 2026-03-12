<!--
  装饰03 - 箭头分隔线
  带箭头的分隔线装饰
-->
<template>
  <div class="decoration-03" :style="containerStyle">
    <svg class="decoration-svg" :width="width" :height="height">
      <defs>
        <!-- 箭头标记 -->
        <marker
          id="arrow-left"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M 8,2 L 2,5 L 8,8" :stroke="color" stroke-width="1.5" fill="none" />
        </marker>

        <marker
          id="arrow-right"
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
        >
          <path d="M 2,2 L 8,5 L 2,8" :stroke="color" stroke-width="1.5" fill="none" />
        </marker>
      </defs>

      <g :transform="`translate(0, ${height / 2})`">
        <!-- 主线 - 上层 -->
        <line
          x1="0"
          y1="-1"
          :x2="width"
          y2="-1"
          :stroke="color"
          stroke-width="2"
        />

        <!-- 主线 - 下层 -->
        <line
          x1="0"
          y1="1"
          :x2="width"
          y2="1"
          :stroke="color"
          stroke-width="1"
          opacity="0.4"
        />

        <!-- 中间装饰线 -->
        <line
          x1="0"
          y1="0"
          :x2="width"
          y2="0"
          :stroke="color"
          stroke-width="1"
          opacity="0.2"
          stroke-dasharray="10,5"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite" />
        </line>

        <!-- 左侧箭头组 -->
        <g class="left-arrows">
          <line
            :x1="arrowSpacing"
            y1="-8"
            :x2="arrowSpacing"
            y2="8"
            :stroke="color"
            stroke-width="1"
            marker-start="url(#arrow-left)"
            opacity="0.8"
          />
          <circle :cx="arrowSpacing" cy="0" r="2" :fill="color" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- 右侧箭头组 -->
        <g class="right-arrows">
          <line
            :x1="width - arrowSpacing"
            y1="-8"
            :x2="width - arrowSpacing"
            y2="8"
            :stroke="color"
            stroke-width="1"
            marker-end="url(#arrow-right)"
            opacity="0.8"
          />
          <circle :cx="width - arrowSpacing" cy="0" r="2" :fill="color" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- 中间装饰箭头 -->
        <g class="center-decoration" :transform="`translate(${width / 2}, 0)`">
          <!-- 上箭头 -->
          <path
            d="M 0,-8 L -4,-4 L -2,-4 L -2,0 L 2,0 L 2,-4 L 4,-4 Z"
            :fill="color"
            opacity="0.6"
          >
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </path>

          <!-- 下箭头 -->
          <path
            d="M 0,8 L -4,4 L -2,4 L -2,0 L 2,0 L 2,4 L 4,4 Z"
            :fill="color"
            opacity="0.6"
          >
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
          </path>

          <!-- 中心点 -->
          <circle cx="0" cy="0" r="3" :fill="color" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- 装饰小点 -->
        <g class="decoration-dots">
          <circle :cx="width * 0.25" cy="-12" r="1.5" :fill="color" opacity="0.5" />
          <circle :cx="width * 0.25" cy="12" r="1.5" :fill="color" opacity="0.5" />
          <circle :cx="width * 0.75" cy="-12" r="1.5" :fill="color" opacity="0.5" />
          <circle :cx="width * 0.75" cy="12" r="1.5" :fill="color" opacity="0.5" />
        </g>

        <!-- 边缘光点 -->
        <g class="edge-glow">
          <circle cx="0" cy="0" r="4" :fill="color" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle :cx="width" cy="0" r="4" :fill="color" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
    </svg>
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

const width = computed(() => props.config.width || 300)
const height = computed(() => props.config.height || 100)
const color = computed(() => props.config.color || '#0099cc')
const arrowSpacing = computed(() => props.config.arrowSpacing || 40)

const containerStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`
}))
</script>

