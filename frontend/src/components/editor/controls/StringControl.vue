<!--
  字符串输入控件 - Ant Design Vue
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <a-input
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :placeholder="schema.placeholder || ''"
        size="small"
      />
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

