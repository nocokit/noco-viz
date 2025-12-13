<!--
  颜色选择控件
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <div class="color-picker-wrap">
        <div
          class="color-preview"
          :style="{ background: modelValue || 'transparent' }"
          @click="showPicker = !showPicker"
        ></div>
        <input
          type="text"
          class="dv-input"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          placeholder="#ffffff"
        />
        <input
          type="color"
          class="color-input-hidden"
          :value="normalizeColor(modelValue)"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  label: String,
  modelValue: String,
  schema: Object
})

defineEmits(['update:modelValue'])

const showPicker = ref(false)

const normalizeColor = (color) => {
  // 简单处理，确保返回有效的颜色值
  if (!color) return '#000000'
  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    return '#000000' // 默认值,因为 input[type=color] 不支持 rgba
  }
  return color
}
</script>

<style scoped>
/* 水平布局 - 标签在左，控件在右 */
.prop-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.prop-row:last-child {
  margin-bottom: 0;
}

.prop-label {
  font-size: 12px;
  color: #909399;
  width: 70px;
  flex-shrink: 0;
}

.prop-control {
  flex: 1;
  display: flex;
  align-items: center;
}

/* 优化后的颜色选择器样式 */
.color-picker-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  background: #111113;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 2px;
  height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  transition: border 0.2s;
  position: relative;
}

.color-picker-wrap:hover {
  border-color: #444;
}

.color-picker-wrap:focus-within {
  border-color: #409eff;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 2px;
  border: 1px solid #444;
}

.dv-input {
  background: transparent;
  border: none;
  color: #e5e5e5;
  width: 100%;
  height: 20px;
  padding: 0;
  font-size: 12px;
  outline: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.color-input-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}
</style>
