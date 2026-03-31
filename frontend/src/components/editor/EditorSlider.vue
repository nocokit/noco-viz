<!--
  编辑器滑块组件
  基于 Ant Design Vue
-->
<template>
  <div class="editor-slider">
    <a-slider
      :value="modelValue"
      @update:value="handleUpdate"
      :min="min"
      :max="max"
      :step="step"
      class="slider-control"
    />
    <a-input-number
      :value="modelValue"
      @update:value="handleUpdate"
      :min="min"
      :max="max"
      :step="step"
      class="slider-input"
    >
      <template v-if="suffix" #addonAfter>{{ suffix }}</template>
    </a-input-number>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [Number, String],
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  suffix: String
})

const emit = defineEmits(['update:modelValue'])

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.editor-slider {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-control {
  flex: 1;
  margin: 0;
}

.slider-input {
  width: 72px;
  flex-shrink: 0;
}

/* 输入框样式 */
.slider-input :deep(.ant-input-number) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.slider-input :deep(.ant-input-number:hover) {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
}

.slider-input :deep(.ant-input-number-input) {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  text-align: center;
}

.slider-input :deep(.ant-input-number-group-addon) {
  background: transparent;
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  padding: 0 6px;
}

/* 滑轨 */
.slider-control :deep(.ant-slider-rail) {
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
}

/* 已选中轨道 */
.slider-control :deep(.ant-slider-track) {
  height: 4px;
  background: #1677ff;
  border-radius: 2px;
}

/* 滑块手柄 */
.slider-control :deep(.ant-slider-handle) {
  width: 14px;
  height: 14px;
  margin-top: -5px;
  background: #fff;
  border: 2px solid #1677ff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.slider-control :deep(.ant-slider-handle:hover),
.slider-control :deep(.ant-slider-handle:focus) {
  border-color: #4096ff;
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.2);
}

.slider-control :deep(.ant-slider-handle::after) {
  display: none;
}

/* hover 轨道高亮 */
.slider-control :deep(.ant-slider:hover .ant-slider-rail) {
  background: rgba(255, 255, 255, 0.18);
}

.slider-control :deep(.ant-slider:hover .ant-slider-track) {
  background: #4096ff;
}
</style>
