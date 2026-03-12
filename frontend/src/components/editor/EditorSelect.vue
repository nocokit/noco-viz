<!--
  编辑器选择框组件
  基于 Ant Design Vue
-->
<template>
  <a-select
    :value="modelValue"
    @update:value="handleUpdate"
    v-bind="$attrs"
    style="width: 100%"
  >
    <a-select-option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </a-select-option>
  </a-select>
</template>

<script setup>
defineProps({
  modelValue: [String, Number, Array],
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>
