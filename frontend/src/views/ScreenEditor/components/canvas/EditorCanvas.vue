<!--
  画布容器组件
  负责渲染主画布、缩放变换、事件处理
-->
<template>
  <div
    ref="canvasViewport"
    class="editor-canvas"
    :style="{ cursor: cursorStyle }"
    @mousedown="handleMouseDown"
    @wheel="handleWheel"
    @contextmenu.prevent
  >
    <div
      class="canvas-transform"
      :style="transformStyle"
    >
      <div
        ref="screenContainer"
        class="screen-container"
        :style="screenStyle"
      >
        <slot></slot>
      </div>
    </div>

    <!-- 标尺系统 -->
    <RulerSystem
      v-if="showRuler"
      :scale="scale"
      :pan-x="panX"
      :pan-y="panY"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
    />

    <!-- 十字游标线 -->
    <CrosshairGuide
      v-if="showCrosshair"
      :scale="scale"
      :pan-x="panX"
      :pan-y="panY"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RulerSystem from './RulerSystem.vue'
import CrosshairGuide from './CrosshairGuide.vue'

const props = defineProps({
  // 画布尺寸
  canvasWidth: {
    type: Number,
    default: 1920
  },
  canvasHeight: {
    type: Number,
    default: 1080
  },
  // 缩放和平移
  scale: {
    type: Number,
    default: 0.4
  },
  panX: {
    type: Number,
    default: 0
  },
  panY: {
    type: Number,
    default: 0
  },
  // 状态
  isPanning: {
    type: Boolean,
    default: false
  },
  isSpacePressed: {
    type: Boolean,
    default: false
  },
  // 显示选项
  showRuler: {
    type: Boolean,
    default: true
  },
  showCrosshair: {
    type: Boolean,
    default: true
  },
  // 背景样式
  backgroundColor: {
    type: String,
    default: '#0a0b0d'
  },
  canvasBackground: {
    type: String,
    default: '#0f1115'
  },
  canvasBorderColor: {
    type: String,
    default: 'rgba(64, 158, 255, 0.2)'
  }
})

const emit = defineEmits([
  'mousedown',
  'wheel',
  'canvas-click'
])

const canvasViewport = ref(null)
const screenContainer = ref(null)

// 光标样式
const cursorStyle = computed(() => {
  if (props.isPanning) return 'grabbing'
  if (props.isSpacePressed) return 'grab'
  return 'default'
})

// 变换样式
const transformStyle = computed(() => ({
  transform: `translate(${props.panX}px, ${props.panY}px) scale(${props.scale})`,
  transformOrigin: '0 0',
  willChange: 'transform'
}))

// 画布容器样式
const screenStyle = computed(() => ({
  width: props.canvasWidth + 'px',
  height: props.canvasHeight + 'px',
  background: props.canvasBackground,
  border: `1px solid ${props.canvasBorderColor}`
}))

// 鼠标按下事件
const handleMouseDown = (event) => {
  emit('mousedown', event)
}

// 滚轮事件
const handleWheel = (event) => {
  emit('wheel', event)
}

// 获取画布区域信息（供父组件使用）
const getCanvasRect = () => {
  return canvasViewport.value?.getBoundingClientRect()
}

// 获取画布容器元素
const getCanvasViewport = () => {
  return canvasViewport.value
}

// 暴露方法给父组件
defineExpose({
  getCanvasRect,
  getCanvasViewport,
  canvasViewport,
  screenContainer
})
</script>

<style scoped>
.editor-canvas {
  width: 100%;
  height: 100%;
  background: v-bind(backgroundColor);
  overflow: hidden;
  position: relative;
  user-select: none;
}

.canvas-transform {
  position: relative;
}

.screen-container {
  position: relative;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}
</style>
