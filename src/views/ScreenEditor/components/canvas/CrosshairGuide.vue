<!--
  十字游标线组件
  跟随鼠标显示十字辅助线
-->
<template>
  <div
    v-if="visible"
    class="crosshair-guide"
    @mousemove="handleMouseMove"
    @mouseleave="hide"
  >
    <!-- 垂直线 -->
    <div
      v-if="mouseX !== null"
      class="crosshair-vertical"
      :style="{ left: mouseX + 'px' }"
    ></div>

    <!-- 水平线 -->
    <div
      v-if="mouseY !== null"
      class="crosshair-horizontal"
      :style="{ top: mouseY + 'px' }"
    ></div>

    <!-- 坐标提示 -->
    <div
      v-if="mouseX !== null && mouseY !== null"
      class="coordinate-label"
      :style="{ left: mouseX + 10 + 'px', top: mouseY + 10 + 'px' }"
    >
      {{ canvasX }}, {{ canvasY }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

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
  lineColor: {
    type: String,
    default: 'rgba(64, 158, 255, 0.5)'
  }
})

const visible = ref(false)
const mouseX = ref(null)
const mouseY = ref(null)

// 计算画布坐标
const canvasX = computed(() => {
  if (mouseX.value === null) return 0
  return Math.round((mouseX.value - props.panX) / props.scale)
})

const canvasY = computed(() => {
  if (mouseY.value === null) return 0
  return Math.round((mouseY.value - props.panY) / props.scale)
})

/**
 * 处理鼠标移动
 */
const handleMouseMove = (event) => {
  visible.value = true
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

/**
 * 隐藏十字线
 */
const hide = () => {
  visible.value = false
  mouseX.value = null
  mouseY.value = null
}

/**
 * 显示十字线
 */
const show = () => {
  visible.value = true
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.crosshair-guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9;
}

.crosshair-vertical,
.crosshair-horizontal {
  position: fixed;
  background: v-bind(lineColor);
  pointer-events: none;
}

.crosshair-vertical {
  width: 1px;
  height: 100vh;
  top: 0;
}

.crosshair-horizontal {
  width: 100vw;
  height: 1px;
  left: 0;
}

.coordinate-label {
  position: fixed;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}
</style>
