<!--
  编辑器数字输入框组件
  基于 Ant Design Vue
-->
<template>
  <a-input-number
    :value="modelValue"
    @update:value="handleUpdate"
    v-bind="$attrs"
    style="width: 100%"
  />
</template>

<script setup>
defineProps({
  modelValue: [Number, String]
})

const emit = defineEmits(['update:modelValue'])

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>
