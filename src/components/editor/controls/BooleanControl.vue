<!--
  布尔值控件 (开关)
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <label class="switch">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span class="slider"></span>
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: Boolean,
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
  justify-content: flex-end;
}

/* 优化后的开关样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #444;
  transition: 0.4s;
  border-radius: 16px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #409eff;
}

input:checked + .slider:before {
  transform: translateX(12px);
}
</style>
