<!--
  框选工具组件
  鼠标拖拽框选组件
-->
<template>
  <div
    v-if="visible"
    class="selection-box"
    :style="boxStyle"
  >
    <div class="selection-info">
      {{ width }} × {{ height }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  startX: {
    type: Number,
    default: 0
  },
  startY: {
    type: Number,
    default: 0
  },
  currentX: {
    type: Number,
    default: 0
  },
  currentY: {
    type: Number,
    default: 0
  },
  borderColor: {
    type: String,
    default: '#409eff'
  },
  backgroundColor: {
    type: String,
    default: 'rgba(64, 158, 255, 0.1)'
  }
})

// 计算框选框位置和大小
const boxStyle = computed(() => {
  const minX = Math.min(props.startX, props.currentX)
  const minY = Math.min(props.startY, props.currentY)
  const width = Math.abs(props.currentX - props.startX)
  const height = Math.abs(props.currentY - props.startY)

  return {
    left: minX + 'px',
    top: minY + 'px',
    width: width + 'px',
    height: height + 'px'
  }
})

const width = computed(() => Math.abs(props.currentX - props.startX))
const height = computed(() => Math.abs(props.currentY - props.startY))
</script>

<style scoped>
.selection-box {
  position: absolute;
  border: 2px solid v-bind(borderColor);
  background: v-bind(backgroundColor);
  pointer-events: none;
  z-index: 6;
}

.selection-info {
  position: absolute;
  bottom: -24px;
  right: 0;
  padding: 2px 8px;
  background: v-bind(borderColor);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
