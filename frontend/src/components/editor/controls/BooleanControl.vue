<!--
  布尔值控件 (开关) - Ant Design Vue
-->
<template>
  <div class="prop-row">
    <div class="prop-label">{{ label }}</div>
    <div class="prop-control">
      <a-switch
        :checked="modelValue"
        @change="$emit('update:modelValue', $event)"
        size="small"
      />
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

