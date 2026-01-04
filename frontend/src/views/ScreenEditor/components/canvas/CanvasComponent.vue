<!--
  画布组件包装器
  为画布上的每个组件提供选中状态、拖拽、调整大小等功能
-->
<template>
  <div
    class="canvas-component"
    :class="{
      selected: isSelected,
      locked: component.locked,
      hidden: component.hidden
    }"
    :style="componentStyle"
    @click.stop="handleClick"
    @mousedown.stop="handleMouseDown"
  >
    <!-- 组件内容插槽 -->
    <slot></slot>

    <!-- 选中状态的边框和控制点 -->
    <template v-if="isSelected && !component.locked">
      <div class="selection-border"></div>

      <!-- 调整大小控制点 -->
      <div
        v-for="direction in resizeDirections"
        :key="direction"
        class="resize-handle"
        :class="`resize-handle-${direction}`"
        :data-direction="direction"
        @mousedown.stop="handleResizeStart($event, direction)"
      ></div>

      <!-- 尺寸标签 -->
      <div v-if="showSizeLabel" class="size-label">
        {{ Math.round(component.w) }} × {{ Math.round(component.h) }}
      </div>
    </template>

    <!-- 锁定图标 -->
    <div v-if="component.locked" class="lock-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a3 3 0 0 0-3 3v2H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V4a3 3 0 0 0-3-3zm1.732 7.732A1 1 0 0 1 10 9.5v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 .268-.732A1.5 1.5 0 1 1 9.732 8.732z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  component: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showSizeLabel: {
    type: Boolean,
    default: true
  },
  selectedColor: {
    type: String,
    default: '#409eff'
  }
})

const emit = defineEmits([
  'click',
  'drag-start',
  'resize-start'
])

const resizeDirections = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

// 组件样式
const componentStyle = computed(() => ({
  position: 'absolute',
  left: props.component.x + 'px',
  top: props.component.y + 'px',
  width: props.component.w + 'px',
  height: props.component.h + 'px',
  zIndex: props.component.zIndex || 1,
  opacity: props.component.hidden ? 0.3 : 1
}))

/**
 * 处理点击事件
 */
const handleClick = (event) => {
  emit('click', event, props.component)
}

/**
 * 处理鼠标按下（拖拽）
 */
const handleMouseDown = (event) => {
  if (event.target.classList.contains('resize-handle')) {
    return // 调整大小时不触发拖拽
  }
  emit('drag-start', event, props.component)
}

/**
 * 处理调整大小开始
 */
const handleResizeStart = (event, direction) => {
  emit('resize-start', event, props.component, direction)
}
</script>

<style scoped>
.canvas-component {
  cursor: move;
  user-select: none;
  transition: opacity 0.2s;
}

.canvas-component.locked {
  cursor: not-allowed;
}

.canvas-component.hidden {
  pointer-events: none;
}

.selection-border {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid v-bind(selectedColor);
  pointer-events: none;
  z-index: 1;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 2px solid v-bind(selectedColor);
  border-radius: 50%;
  z-index: 2;
}

.resize-handle-n {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.resize-handle-ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle-e {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  cursor: e-resize;
}

.resize-handle-se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.resize-handle-s {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.resize-handle-sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle-w {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  cursor: w-resize;
}

.resize-handle-nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.size-label {
  position: absolute;
  top: -24px;
  right: 0;
  padding: 2px 8px;
  background: v-bind(selectedColor);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
}

.lock-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
  pointer-events: none;
}
</style>
