<!--
  数字输入控件 - Ant Design Vue
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <div class="number-control-wrap">
        <!-- 数字输入框 -->
        <a-input-number
          :min="schema.min"
          :max="schema.max"
          :step="schema.step || 1"
          :value="modelValue"
          @change="handleChange"
          size="small"
          style="width: 100%"
        >
          <template v-if="schema.unit" #addonAfter>{{ schema.unit }}</template>
        </a-input-number>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: [Number, String],
  schema: Object
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (value) => {
  emit('update:modelValue', value ?? 0)
}
</script>

<style scoped>
.number-control-wrap {
  display: flex;
  align-items: center;
  width: 100%;
}

/* 输入框样式优化 - 无边框设计 */
.number-control-wrap :deep(.ant-input-number) {
  background: rgba(255, 255, 255, 0.06);
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.number-control-wrap :deep(.ant-input-number:hover) {
  background: rgba(255, 255, 255, 0.1);
}

.number-control-wrap :deep(.ant-input-number:focus-within) {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.15);
}

.number-control-wrap :deep(.ant-input-number-input) {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.number-control-wrap :deep(.ant-input-number-group-addon) {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  padding-left: 4px;
}

/* 滑动条容器 */
.number-control-wrap :deep(.ant-slider) {
  padding: 8px 0;
  margin: 0;
}

/* 滑动条轨道背景 */
.number-control-wrap :deep(.ant-slider-rail) {
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  height: 6px;
  border-radius: 3px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 滑动条已选中轨道 */
.number-control-wrap :deep(.ant-slider-track) {
  background: linear-gradient(90deg,
    #1890ff 0%,
    #40a9ff 50%,
    #69c0ff 100%
  );
  height: 6px;
  border-radius: 3px;
  box-shadow:
    0 0 8px rgba(24, 144, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
}

/* 滑动条轨道光泽效果 */
.number-control-wrap :deep(.ant-slider-track)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 100%
  );
  border-radius: 3px 3px 0 0;
}

/* 滑块手柄 */
.number-control-wrap :deep(.ant-slider-handle) {
  width: 18px;
  height: 18px;
  margin-top: -6px;
  background: linear-gradient(135deg,
    #ffffff 0%,
    #f0f9ff 50%,
    #e6f7ff 100%
  );
  border: 2.5px solid #1890ff;
  box-shadow:
    0 2px 8px rgba(24, 144, 255, 0.4),
    0 0 0 3px rgba(24, 144, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: grab;
}

/* 滑块手柄悬停效果 */
.number-control-wrap :deep(.ant-slider-handle:hover) {
  width: 20px;
  height: 20px;
  margin-top: -7px;
  border-color: #40a9ff;
  border-width: 3px;
  box-shadow:
    0 4px 12px rgba(24, 144, 255, 0.6),
    0 0 0 5px rgba(24, 144, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: scale(1.05);
}

/* 滑块手柄激活效果 */
.number-control-wrap :deep(.ant-slider-handle:active) {
  border-color: #096dd9;
  box-shadow:
    0 2px 8px rgba(24, 144, 255, 0.8),
    0 0 0 6px rgba(24, 144, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  cursor: grabbing;
  transform: scale(0.98);
}

/* 移除默认的 after 阴影 */
.number-control-wrap :deep(.ant-slider-handle::after) {
  box-shadow: none;
}

/* 滑块手柄内部高光 */
.number-control-wrap :deep(.ant-slider-handle)::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 6px;
  background: linear-gradient(180deg,
    rgba(255, 255, 255, 0.6) 0%,
    transparent 100%
  );
  border-radius: 50% 50% 0 0;
  pointer-events: none;
}

/* 整体悬停时的轨道效果 */
.number-control-wrap :deep(.ant-slider:hover .ant-slider-rail) {
  background: linear-gradient(90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

/* 整体悬停时的已选中轨道效果 */
.number-control-wrap :deep(.ant-slider:hover .ant-slider-track) {
  background: linear-gradient(90deg,
    #40a9ff 0%,
    #69c0ff 50%,
    #91d5ff 100%
  );
  box-shadow:
    0 0 12px rgba(24, 144, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

/* 禁用状态 */
.number-control-wrap :deep(.ant-slider-disabled .ant-slider-rail) {
  background: rgba(255, 255, 255, 0.04) !important;
}

.number-control-wrap :deep(.ant-slider-disabled .ant-slider-track) {
  background: rgba(255, 255, 255, 0.15) !important;
  box-shadow: none !important;
}

.number-control-wrap :deep(.ant-slider-disabled .ant-slider-handle) {
  border-color: rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  cursor: not-allowed;
}
</style>
