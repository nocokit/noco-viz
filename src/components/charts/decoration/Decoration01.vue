<!--
  装饰01 - 中心扩散装饰
  标题装饰线,中心向外扩散效果
-->
<template>
  <div class="decoration-01" :style="containerStyle">
    <svg class="decoration-svg" :width="width" :height="height">
      <defs>
        <!-- 脉冲动画 -->
        <radialGradient id="pulse-gradient">
          <stop offset="0%" :stop-color="color" stop-opacity="0.8" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g :transform="`translate(${width / 2}, ${height / 2})`">
        <!-- 中心点 -->
        <circle cx="0" cy="0" r="4" :fill="color">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>

        <!-- 脉冲圆环 -->
        <circle cx="0" cy="0" r="8" :stroke="color" stroke-width="1" fill="none" opacity="0.6">
          <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        <circle cx="0" cy="0" r="8" :stroke="color" stroke-width="1" fill="none" opacity="0.6">
          <animate attributeName="r" values="8;16;8" dur="2s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>

        <!-- 四向扩散线 -->
        <g class="expand-lines">
          <!-- 左侧 -->
          <line :x1="-lineLength / 2" y1="0" x2="-10" y2="0" :stroke="color" stroke-width="2" />
          <line :x1="-lineLength / 2 - 5" y1="0" :x2="-lineLength / 2" y2="0" :stroke="color" stroke-width="1" opacity="0.5">
            <animate attributeName="x1" :values="`${-lineLength / 2 - 10};${-lineLength / 2 - 5}`" dur="1.5s" repeatCount="indefinite" />
          </line>

          <!-- 右侧 -->
          <line x1="10" y1="0" :x2="lineLength / 2" y2="0" :stroke="color" stroke-width="2" />
          <line :x1="lineLength / 2" y1="0" :x2="lineLength / 2 + 5" y2="0" :stroke="color" stroke-width="1" opacity="0.5">
            <animate attributeName="x2" :values="`${lineLength / 2 + 5};${lineLength / 2 + 10}`" dur="1.5s" repeatCount="indefinite" />
          </line>

          <!-- 上侧 -->
          <line x1="0" :y1="-lineLength / 4" x2="0" y2="-10" :stroke="color" stroke-width="1" opacity="0.6" />

          <!-- 下侧 -->
          <line x1="0" y1="10" x2="0" :y2="lineLength / 4" :stroke="color" stroke-width="1" opacity="0.6" />
        </g>

        <!-- 装饰小点 -->
        <g class="decoration-dots">
          <circle :cx="-lineLength / 2 - 8" cy="0" r="2" :fill="color" opacity="0.7">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle :cx="lineLength / 2 + 8" cy="0" r="2" :fill="color" opacity="0.7">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- 斜向装饰线 -->
        <g class="diagonal-lines" opacity="0.4">
          <line x1="-15" y1="-15" x2="-8" y2="-8" :stroke="color" stroke-width="1" />
          <line x1="15" y1="-15" x2="8" y2="-8" :stroke="color" stroke-width="1" />
          <line x1="15" y1="15" x2="8" y2="8" :stroke="color" stroke-width="1" />
          <line x1="-15" y1="15" x2="-8" y2="8" :stroke="color" stroke-width="1" />
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

const width = computed(() => props.config.width || 200)
const height = computed(() => props.config.height || 50)
const color = computed(() => props.config.color || '#00f2f2')
const lineLength = computed(() => Math.min(width.value - 40, 180))

const containerStyle = computed(() => ({
  width: `${width.value}px`,
  height: `${height.value}px`
}))
</script>

<style scoped>
.decoration-01 {
  position: relative;
  display: inline-block;
}

.decoration-svg {
  filter: drop-shadow(0 0 3px currentColor);
}
</style>
