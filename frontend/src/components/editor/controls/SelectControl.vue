<!--
  下拉选择控件
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <div class="select-wrap">
        <select
          class="dv-select"
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
        >
          <option
            v-for="option in schema.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <svg class="select-arrow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  schema: Object
})

defineEmits(['update:modelValue'])
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

.select-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

/* 优化后的选择框样式 */
.dv-select {
  width: 100%;
  background: #111113;
  border: 1px solid #333;
  border-radius: 3px;
  padding: 0 28px 0 6px;
  height: 24px;
  color: #e5e5e5;
  font-size: 12px;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: border 0.2s;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dv-select:hover {
  border-color: #444;
}

.dv-select:focus {
  border-color: #409eff;
}

.select-arrow {
  position: absolute;
  right: 6px;
  width: 12px;
  height: 12px;
  color: #666;
  pointer-events: none;
  transition: color 0.2s;
}

.dv-select option {
  background: #202024;
  color: #e5e5e5;
  padding: 4px;
}
</style>
