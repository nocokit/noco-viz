<!--
  颜色选择控件 - 复用 EditorColorPicker
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <EditorColorPicker
        :modelValue="modelValue"
        :placeholder="schema?.default || '#000000'"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import EditorColorPicker from '../EditorColorPicker.vue'

defineProps({
  label: String,
  modelValue: String,
  schema: Object
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.prop-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.prop-label {
  min-width: 70px;
  max-width: 70px;
  flex-shrink: 0;
  font-size: 12px;
  color: #e5e5e5;
}

.prop-control {
  flex: 1;
  min-width: 0;
}

.prop-control :deep(.editor-color-picker) {
  width: 100%;
}
</style>
