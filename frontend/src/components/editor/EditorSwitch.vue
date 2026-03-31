<!--
  编辑器开关组件
  基于 Ant Design Vue
-->
<template>
  <a-switch
    :checked="modelValue"
    @update:checked="handleUpdate"
    v-bind="$attrs"
  />
</template>

<script setup>
defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}
</script>
