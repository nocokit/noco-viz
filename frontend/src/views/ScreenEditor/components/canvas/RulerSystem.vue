<!--
  标尺系统组件
  在画布边缘显示水平和垂直标尺
-->
<template>
  <div class="ruler-system">
    <!-- 左上角的空白区域 -->
    <div class="ruler-corner"></div>

    <!-- 水平标尺 -->
    <canvas
      ref="horizontalRuler"
      class="ruler-horizontal"
      :width="canvasWidth"
      :height="rulerSize"
    ></canvas>

    <!-- 垂直标尺 -->
    <canvas
      ref="verticalRuler"
      class="ruler-vertical"
      :width="rulerSize"
      :height="canvasHeight"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  scale: {
    type: Number,
    required: true
  },
  panX: {
    type: Number,
    required: true
  },
  panY: {
    type: Number,
    required: true
  },
  canvasWidth: {
    type: Number,
    default: 1920
  },
  canvasHeight: {
    type: Number,
    default: 1080
  },
  rulerSize: {
    type: Number,
    default: 20
  },
  backgroundColor: {
    type: String,
    default: '#1a1b1f'
  },
  textColor: {
    type: String,
    default: '#909399'
  },
  lineColor: {
    type: String,
    default: '#303133'
  }
})

const horizontalRuler = ref(null)
const verticalRuler = ref(null)
const rulerSize = props.rulerSize

/**
 * 绘制水平标尺
 */
const drawHorizontalRuler = () => {
  const canvas = horizontalRuler.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, width, height)

  // 计算起始位置
  const startX = -props.panX / props.scale
  const endX = startX + width / props.scale

  // 根据缩放比例调整刻度间隔
  let step = 100
  if (props.scale < 0.3) step = 200
  else if (props.scale < 0.5) step = 100
  else if (props.scale < 1) step = 50
  else step = 20

  // 绘制刻度
  ctx.strokeStyle = props.lineColor
  ctx.fillStyle = props.textColor
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'

  for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
    if (x < 0 || x > props.canvasWidth) continue

    const screenX = x * props.scale + props.panX

    // 绘制刻度线
    ctx.beginPath()
    ctx.moveTo(screenX, height - 8)
    ctx.lineTo(screenX, height)
    ctx.stroke()

    // 绘制数字
    if (x % (step * 2) === 0) {
      ctx.fillText(x.toString(), screenX, height - 10)
    }
  }
}

/**
 * 绘制垂直标尺
 */
const drawVerticalRuler = () => {
  const canvas = verticalRuler.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = props.backgroundColor
  ctx.fillRect(0, 0, width, height)

  // 计算起始位置
  const startY = -props.panY / props.scale
  const endY = startY + height / props.scale

  // 根据缩放比例调整刻度间隔
  let step = 100
  if (props.scale < 0.3) step = 200
  else if (props.scale < 0.5) step = 100
  else if (props.scale < 1) step = 50
  else step = 20

  // 绘制刻度
  ctx.strokeStyle = props.lineColor
  ctx.fillStyle = props.textColor
  ctx.font = '10px Arial'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'

  for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
    if (y < 0 || y > props.canvasHeight) continue

    const screenY = y * props.scale + props.panY

    // 绘制刻度线
    ctx.beginPath()
    ctx.moveTo(width - 8, screenY)
    ctx.lineTo(width, screenY)
    ctx.stroke()

    // 绘制数字
    if (y % (step * 2) === 0) {
      ctx.save()
      ctx.translate(width - 10, screenY)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(y.toString(), 0, 0)
      ctx.restore()
    }
  }
}

/**
 * 绘制所有标尺
 */
const drawRulers = () => {
  nextTick(() => {
    drawHorizontalRuler()
    drawVerticalRuler()
  })
}

// 监听变化重绘
watch([() => props.scale, () => props.panX, () => props.panY], drawRulers)

onMounted(() => {
  drawRulers()
})

// 暴露绘制方法
defineExpose({
  drawRulers
})
</script>

<style scoped>
.ruler-system {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

.ruler-corner {
  position: absolute;
  top: 0;
  left: 0;
  width: v-bind(rulerSize + 'px');
  height: v-bind(rulerSize + 'px');
  background: v-bind(backgroundColor);
  border-right: 1px solid v-bind(lineColor);
  border-bottom: 1px solid v-bind(lineColor);
  z-index: 12;
}

.ruler-horizontal {
  position: absolute;
  top: 0;
  left: v-bind(rulerSize + 'px');
  border-bottom: 1px solid v-bind(lineColor);
  z-index: 11;
}

.ruler-vertical {
  position: absolute;
  top: v-bind(rulerSize + 'px');
  left: 0;
  border-right: 1px solid v-bind(lineColor);
  z-index: 11;
}
</style>
