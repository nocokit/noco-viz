<!--
  字符串输入控件
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <div class="input-group">
        <input
          type="text"
          class="dv-input"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="schema.placeholder || ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: String,
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

.dv-input {
  background: transparent;
  border: none;
  color: #e5e5e5;
  width: 100%;
  height: 100%;
  font-size: 12px;
  outline: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
