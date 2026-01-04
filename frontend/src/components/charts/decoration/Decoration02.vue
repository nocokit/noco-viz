<!--
  装饰02 - 对角装饰块
  角标装饰,对角分布的科技块
-->
<template>
  <div class="decoration-02" :style="containerStyle">
    <svg class="decoration-svg" :width="width" :height="height">
      <!-- 左上角装饰块 -->
      <g class="corner-block top-left">
        <rect
          x="2"
          y="2"
          :width="blockSize"
          :height="blockSize"
          :stroke="color"
          stroke-width="2"
          fill="none"
        />
        <rect
          x="6"
          y="6"
          :width="blockSize - 8"
          :height="blockSize - 8"
          :stroke="color"
          stroke-width="1"
          fill="none"
          opacity="0.6"
        />
        <!-- 对角线 -->
        <line
          x1="2"
          y1="2"
          :x2="blockSize + 2"
          :y2="blockSize + 2"
          :stroke="color"
          stroke-width="1"
          opacity="0.4"
        />
        <!-- 动画点 -->
        <circle :cx="blockSize / 2 + 2" :cy="blockSize / 2 + 2" r="3" :fill="color" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 右下角装饰块 -->
      <g class="corner-block bottom-right" :transform="`translate(${width - blockSize - 2}, ${height - blockSize - 2})`">
        <rect
          x="0"
          y="0"
          :width="blockSize"
          :height="blockSize"
          :stroke="color"
          stroke-width="2"
          fill="none"
        />
        <rect
          x="4"
          y="4"
          :width="blockSize - 8"
          :height="blockSize - 8"
          :stroke="color"
          stroke-width="1"
          fill="none"
          opacity="0.6"
        />
        <!-- 对角线 -->
        <line
          x1="0"
          y1="0"
          :x2="blockSize"
          :y2="blockSize"
          :stroke="color"
          stroke-width="1"
          opacity="0.4"
        />
        <!-- 动画点 -->
        <circle :cx="blockSize / 2" :cy="blockSize / 2" r="3" :fill="color" opacity="0.8">
          <animate attributeName="r" values="3;5;3" dur="2s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 连接线 (可选) -->
      <line
        :x1="blockSize / 2 + 2"
        :y1="blockSize / 2 + 2"
        :x2="width - blockSize / 2 - 2"
        :y2="height - blockSize / 2 - 2"
        :stroke="color"
        stroke-width="1"
        opacity="0.15"
        stroke-dasharray="5,5"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
      </line>

      <!-- 装饰线 -->
      <g class="decoration-lines" opacity="0.5">
        <!-- 左上角延伸线 -->
        <line
          :x1="blockSize + 4"
          y1="2"
          :x2="blockSize + 20"
          y2="2"
          :stroke="color"
          stroke-width="1"
        />
        <line
          x1="2"
          :y1="blockSize + 4"
          x2="2"
          :y2="blockSize + 20"
          :stroke="color"
          stroke-width="1"
        />

        <!-- 右下角延伸线 -->
        <line
          :x1="width - blockSize - 4"
          :y1="height - 2"
          :x2="width - blockSize - 20"
          :y2="height - 2"
          :stroke="color"
          stroke-width="1"
        />
        <line
          :x1="width - 2"
          :y1="height - blockSize - 4"
          :x2="width - 2"
          :y2="height - blockSize - 20"
          :stroke="color"
          stroke-width="1"
        />
      </g>

      <!-- 小装饰点 -->
      <g class="small-dots">
        <circle :cx="blockSize + 22" cy="2" r="1.5" :fill="color" opacity="0.6" />
        <circle cx="2" :cy="blockSize + 22" r="1.5" :fill="color" opacity="0.6" />
        <circle :cx="width - blockSize - 22" :cy="height - 2" r="1.5" :fill="color" opacity="0.6" />
        <circle :cx="width - 2" :cy="height - blockSize - 22" r="1.5" :fill="color" opacity="0.6" />
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

const width = computed(() => props.config.width || 150)
const height = computed(() => props.config.height || 150)
const color = computed(() => props.config.color || '#ffaa00')
const blockSize = computed(() => props.config.blockSize || 40)

const containerStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`
}))
</script>

<style scoped>
.decoration-02 {
  position: relative;
  display: inline-block;
}

.decoration-svg {
  filter: drop-shadow(0 0 3px currentColor);
}
</style>
