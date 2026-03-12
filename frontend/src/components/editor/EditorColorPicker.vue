<!--
  编辑器颜色选择器组件
  使用原生 HTML5 color input
-->
<template>
  <div class="editor-color-picker">
    <div class="color-picker-wrapper">
      <input
        type="color"
        :value="colorValue"
        @input="handleColorChange"
        class="color-input"
      />
      <input
        type="text"
        :value="colorValue"
        @input="handleTextChange"
        @blur="handleTextBlur"
        class="color-text"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: '#ffffff'
  }
})

const emit = defineEmits(['update:modelValue'])

const colorValue = ref(props.modelValue || props.placeholder)

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    colorValue.value = newValue
  }
}, { immediate: true })

const handleColorChange = (e) => {
  const value = e.target.value
  colorValue.value = value
  emit('update:modelValue', value)
}

const handleTextChange = (e) => {
  colorValue.value = e.target.value
}

const handleTextBlur = (e) => {
  const value = e.target.value
  // 验证颜色格式
  if (/^#[0-9A-Fa-f]{6}$/.test(value) || /^#[0-9A-Fa-f]{3}$/.test(value)) {
    emit('update:modelValue', value)
  } else if (/^[0-9A-Fa-f]{6}$/.test(value)) {
    const hexValue = '#' + value
    colorValue.value = hexValue
    emit('update:modelValue', hexValue)
  } else {
    // 恢复原值
    colorValue.value = props.modelValue || props.placeholder
  }
}
</script>

<style scoped>
.editor-color-picker {
  width: 100%;
  min-width: 0;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 1px;
  transition: all 0.2s;
  width: 100%;
}

.color-picker-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
}

.color-input {
  width: 32px;
  height: 24px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background: transparent;
  flex-shrink: 0; /* 防止被 flex 布局压缩 */
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.color-text {
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-family: 'Consolas', 'Monaco', monospace;
  outline: none;
  padding: 2px 4px;
}

.color-text::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
</style>
