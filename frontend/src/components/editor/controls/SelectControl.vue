<!--
  下拉选择控件 - Ant Design Vue
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <a-select
        :value="modelValue"
        @change="$emit('update:modelValue', $event)"
        :options="schema.options"
        size="small"
        style="width: 100%"
      />
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

