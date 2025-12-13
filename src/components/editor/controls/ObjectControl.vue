<!--
  对象嵌套控件 (递归渲染子属性)
-->
<template>
  <div class="object-control">
    <template v-for="(propSchema, propKey) in schema.properties" :key="propKey">
      <component
        :is="getFormControl(propSchema)"
        :label="propSchema.label"
        :modelValue="modelValue?.[propKey]"
        @update:modelValue="updateValue(propKey, $event)"
        :schema="propSchema"
      />
    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import BooleanControl from './BooleanControl.vue'
import NumberControl from './NumberControl.vue'
import StringControl from './StringControl.vue'
import ColorControl from './ColorControl.vue'
import SelectControl from './SelectControl.vue'

// 使用异步组件解决递归引用问题
const ObjectControl = defineAsyncComponent(() => import('./ObjectControl.vue'))

const props = defineProps({
  label: String,
  modelValue: Object,
  schema: Object
})

const emit = defineEmits(['update:modelValue'])

const getFormControl = (propSchema) => {
  // 递归处理
  if (propSchema.type === 'object' && propSchema.properties) {
    return ObjectControl
  }

  switch (propSchema.type) {
    case 'boolean':
      return BooleanControl
    case 'number':
      return NumberControl
    case 'string':
      return StringControl
    case 'color':
      return ColorControl
    case 'select':
      return SelectControl
    default:
      return StringControl
  }
}

const updateValue = (key, value) => {
  const newValue = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.object-control {
  width: 100%;
}
</style>
