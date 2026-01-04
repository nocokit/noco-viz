<!--
  数字输入控件 (支持滑块和输入框)
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <div class="number-control-wrap">
        <!-- 如果有 min/max，显示滑块 + 输入框 -->
        <template v-if="hasSlider">
          <input
            type="range"
            class="dv-slider"
            :min="schema.min"
            :max="schema.max"
            :step="schema.step || 1"
            :value="modelValue"
            @input="handleInput"
          />
        </template>

        <!-- 数字输入框 -->
        <div class="input-group" :class="{ 'slider-val': hasSlider }">
          <input
            type="number"
            class="dv-input"
            :min="schema.min"
            :max="schema.max"
            :step="schema.step || 1"
            :value="modelValue"
            @input="handleInput"
          />
          <span v-if="schema.unit" class="input-suffix">{{ schema.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [Number, String],
  schema: Object
})

const emit = defineEmits(['update:modelValue'])

const hasSlider = computed(() => {
  return props.schema.min !== undefined && props.schema.max !== undefined
})

const handleInput = (e) => {
  const value = parseFloat(e.target.value)
  emit('update:modelValue', isNaN(value) ? 0 : value)
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

.number-control-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

/* 优化后的输入框样式 */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: #111113;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 0 6px;
  height: 24px;
  width: 100%;
  transition: border 0.2s;
}

.input-group:hover {
  border-color: #444;
}

.input-group:focus-within {
  border-color: #409eff;
}

.slider-val {
  width: 50px;
  flex-shrink: 0;
}

.dv-input {
  background: transparent;
  border: none;
  color: #e5e5e5;
  width: 100%;
  height: 100%;
  font-size: 12px;
  outline: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  text-align: center;
  padding: 0;
}

.input-suffix {
  font-size: 10px;
  color: #666;
  margin-left: 4px;
  flex-shrink: 0;
}

/* 优化后的滑块样式 */
.dv-slider {
  -webkit-appearance: none;
  flex: 1;
  height: 4px;
  background: #333;
  border-radius: 2px;
  outline: none;
}

.dv-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e5e5e5;
  cursor: pointer;
  margin-top: -4px;
  transition: background 0.2s;
}

.dv-slider:hover::-webkit-slider-thumb {
  background: #409eff;
}
</style>
