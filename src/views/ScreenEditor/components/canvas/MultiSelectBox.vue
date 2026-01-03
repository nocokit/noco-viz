<!--
  多选包围盒组件
  显示多个组件选中时的包围盒
-->
<template>
  <div
    v-if="visible"
    class="multi-select-box"
    :style="boxStyle"
  >
    <!-- 包围盒边框 -->
    <div class="box-border"></div>

    <!-- 尺寸信息 -->
    <div class="size-info">
      {{ Math.round(width) }} × {{ Math.round(height) }}
    </div>

    <!-- 调整大小控制点（如果启用） -->
    <template v-if="showResizeHandles">
      <div class="resize-handle resize-handle-n" data-direction="n"></div>
      <div class="resize-handle resize-handle-ne" data-direction="ne"></div>
      <div class="resize-handle resize-handle-e" data-direction="e"></div>
      <div class="resize-handle resize-handle-se" data-direction="se"></div>
      <div class="resize-handle resize-handle-s" data-direction="s"></div>
      <div class="resize-handle resize-handle-sw" data-direction="sw"></div>
      <div class="resize-handle resize-handle-w" data-direction="w"></div>
      <div class="resize-handle resize-handle-nw" data-direction="nw"></div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  showResizeHandles: {
    type: Boolean,
    default: false
  },
  borderColor: {
    type: String,
    default: '#409eff'
  },
  backgroundColor: {
    type: String,
    default: 'rgba(64, 158, 255, 0.03)'
  }
})

const boxStyle = computed(() => ({
  left: props.x + 'px',
  top: props.y + 'px',
  width: props.width + 'px',
  height: props.height + 'px'
}))
</script>

<style scoped>
.multi-select-box {
  position: absolute;
  pointer-events: none;
  z-index: 4;
}

.box-border {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px dashed v-bind(borderColor);
  background: v-bind(backgroundColor);
}

.size-info {
  position: absolute;
  top: -24px;
  right: 0;
  padding: 2px 8px;
  background: v-bind(borderColor);
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 2px solid v-bind(borderColor);
  border-radius: 50%;
  pointer-events: auto;
  z-index: 1;
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
</style>
