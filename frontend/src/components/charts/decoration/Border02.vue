<!--
  边框02 - 双层边框
  双线科技感边框
-->
<template>
  <div class="border-02" :style="containerStyle">
    <svg class="border-svg" width="100%" height="100%" :viewBox="`0 0 ${width} ${height}`">
      <!-- 外层边框 -->
      <rect
        x="2"
        y="2"
        :width="width - 4"
        :height="height - 4"
        :stroke="color"
        stroke-width="1"
        fill="none"
        opacity="0.6"
      />

      <!-- 内层边框 -->
      <rect
        x="6"
        y="6"
        :width="width - 12"
        :height="height - 12"
        :stroke="color"
        stroke-width="1"
        fill="none"
        opacity="0.8"
      />

      <!-- 四个角的连接线 -->
      <line x1="2" y1="2" x2="6" y2="6" :stroke="color" stroke-width="1" opacity="0.6" />
      <line :x1="width - 2" y1="2" :x2="width - 6" y2="6" :stroke="color" stroke-width="1" opacity="0.6" />
      <line :x1="width - 2" :y1="height - 2" :x2="width - 6" :y2="height - 6" :stroke="color" stroke-width="1" opacity="0.6" />
      <line x1="2" :y1="height - 2" x2="6" :y2="height - 6" :stroke="color" stroke-width="1" opacity="0.6" />

      <!-- 中间装饰点 -->
      <g class="decoration-dots">
        <!-- 顶部 -->
        <circle :cx="width / 2" cy="2" r="2" :fill="color" opacity="0.8">
          <animate attributeName="r" values="2;3;2" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <line :x1="width / 2" y1="2" :x2="width / 2" y2="6" :stroke="color" stroke-width="1" opacity="0.4" />

        <!-- 右侧 -->
        <circle :cx="width - 2" :cy="height / 2" r="2" :fill="color" opacity="0.8">
          <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.375s" repeatCount="indefinite" />
        </circle>
        <line :x1="width - 2" :y1="height / 2" :x2="width - 6" :y2="height / 2" :stroke="color" stroke-width="1" opacity="0.4" />

        <!-- 底部 -->
        <circle :cx="width / 2" :cy="height - 2" r="2" :fill="color" opacity="0.8">
          <animate attributeName="r" values="2;3;2" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
        </circle>
        <line :x1="width / 2" :y1="height - 2" :x2="width / 2" :y2="height - 6" :stroke="color" stroke-width="1" opacity="0.4" />

        <!-- 左侧 -->
        <circle cx="2" :cy="height / 2" r="2" :fill="color" opacity="0.8">
          <animate attributeName="r" values="2;3;2" dur="1.5s" begin="1.125s" repeatCount="indefinite" />
        </circle>
        <line x1="2" :y1="height / 2" x2="6" :y2="height / 2" :stroke="color" stroke-width="1" opacity="0.4" />
      </g>

      <!-- 角部装饰 -->
      <g class="corner-decoration">
        <circle cx="6" cy="6" r="1.5" :fill="color" opacity="0.6" />
        <circle :cx="width - 6" cy="6" r="1.5" :fill="color" opacity="0.6" />
        <circle :cx="width - 6" :cy="height - 6" r="1.5" :fill="color" opacity="0.6" />
        <circle cx="6" :cy="height - 6" r="1.5" :fill="color" opacity="0.6" />
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

const color = computed(() => props.config.color || '#0099cc')

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%'
}))
</script>

