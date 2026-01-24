<template>
  <div class="split-view" :style="splitStyle">
    <div class="split-left" :style="leftStyle">
      <slot name="left"></slot>
    </div>

    <div v-if="resizable" class="split-resizer" @mousedown="startResize"></div>

    <div class="split-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  leftWidth: {
    type: String,
    default: '350px'
  },
  gap: {
    type: String,
    default: '20px'
  },
  resizable: {
    type: Boolean,
    default: false
  },
  minLeftWidth: {
    type: Number,
    default: 200
  },
  maxLeftWidth: {
    type: Number,
    default: 600
  }
})

const currentLeftWidth = ref(parseInt(props.leftWidth))

const splitStyle = computed(() => ({
  gap: props.gap
}))

const leftStyle = computed(() => ({
  width: `${currentLeftWidth.value}px`,
  flexShrink: 0
}))

let isResizing = false
let startX = 0
let startWidth = 0

const startResize = (e) => {
  isResizing = true
  startX = e.clientX
  startWidth = currentLeftWidth.value

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const handleResize = (e) => {
  if (!isResizing) return

  const diff = e.clientX - startX
  let newWidth = startWidth + diff

  // 限制宽度范围
  newWidth = Math.max(props.minLeftWidth, Math.min(props.maxLeftWidth, newWidth))

  currentLeftWidth.value = newWidth
}

const stopResize = () => {
  isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}
</script>

<style scoped>
.split-view {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.split-left {
  overflow-y: auto;
  overflow-x: hidden;
}

.split-right {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
}

.split-resizer {
  width: 4px;
  background: var(--el-border-color);
  cursor: col-resize;
  transition: background 0.2s;
  flex-shrink: 0;
}

.split-resizer:hover {
  background: var(--el-color-primary);
}

@media (max-width: 768px) {
  .split-view {
    flex-direction: column;
  }

  .split-left {
    width: 100% !important;
    max-height: 40%;
  }

  .split-resizer {
    display: none;
  }
}
</style>
