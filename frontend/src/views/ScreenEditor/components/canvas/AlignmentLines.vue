<!--
  对齐辅助线组件
  显示组件对齐时的辅助线
-->
<template>
  <div class="alignment-lines">
    <!-- 垂直对齐线 -->
    <div
      v-for="(line, index) in verticalLines"
      :key="'v-' + index"
      class="alignment-line alignment-line-vertical"
      :style="{
        left: line.position + 'px',
        top: (line.top || 0) + 'px',
        height: (line.height || '100%')
      }"
    >
      <div class="line-label" v-if="line.type">
        {{ getLineLabel(line.type) }}
      </div>
    </div>

    <!-- 水平对齐线 -->
    <div
      v-for="(line, index) in horizontalLines"
      :key="'h-' + index"
      class="alignment-line alignment-line-horizontal"
      :style="{
        top: line.position + 'px',
        left: (line.left || 0) + 'px',
        width: (line.width || '100%')
      }"
    >
      <div class="line-label" v-if="line.type">
        {{ getLineLabel(line.type) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  verticalLines: {
    type: Array,
    default: () => []
  },
  horizontalLines: {
    type: Array,
    default: () => []
  },
  lineColor: {
    type: String,
    default: '#ff4757'
  },
  labelColor: {
    type: String,
    default: '#fff'
  }
})

/**
 * 获取对齐线标签
 */
const getLineLabel = (type) => {
  const labels = {
    left: '左',
    right: '右',
    center: '中',
    top: '上',
    bottom: '下',
    middle: '中'
  }
  return labels[type] || ''
}
</script>

<style scoped>
.alignment-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.alignment-line {
  position: absolute;
  background: v-bind(lineColor);
  pointer-events: none;
}

.alignment-line-vertical {
  width: 1px;
}

.alignment-line-horizontal {
  height: 1px;
}

.line-label {
  position: absolute;
  padding: 2px 6px;
  background: v-bind(lineColor);
  color: v-bind(labelColor);
  font-size: 10px;
  border-radius: 2px;
  white-space: nowrap;
  transform: translateY(-100%);
  margin-top: -4px;
}

.alignment-line-vertical .line-label {
  top: 0;
  left: 4px;
}

.alignment-line-horizontal .line-label {
  left: 0;
  top: 4px;
  transform: translateX(-100%);
  margin-left: -4px;
}
</style>
