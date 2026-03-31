<!--
  编辑器输入框组件
  基于 Ant Design Vue
-->
<template>
  <a-input
    :value="modelValue"
    @update:value="handleUpdate"
    v-bind="$attrs"
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Number]
})

const emit = defineEmits(['update:modelValue'])

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>
