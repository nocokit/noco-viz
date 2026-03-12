<!--
  对象嵌套控件 (递归渲染子属性)
-->
<template>
  <div class="object-control">
    <template v-for="(propSchema, propKey) in properties" :key="propKey">
      <EditorFormField :label="propSchema.label" inline>
        <component
          :is="getFormControl(propSchema)"
          :modelValue="modelValue?.[propKey]"
          @update:modelValue="updateValue(propKey, $event)"
          v-bind="getControlPropsForChild(propSchema)"
        />
      </EditorFormField>
    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import EditorFormField from '../EditorFormField.vue'
import EditorSwitch from '../EditorSwitch.vue'
import EditorInputNumber from '../EditorInputNumber.vue'
import EditorInput from '../EditorInput.vue'
import EditorColorPicker from '../EditorColorPicker.vue'
import EditorSelect from '../EditorSelect.vue'

// 使用异步组件解决递归引用问题
const ObjectControl = defineAsyncComponent(() => import('./ObjectControl.vue'))

const props = defineProps({
  modelValue: Object,
  properties: Object
})

const emit = defineEmits(['update:modelValue'])

const getFormControl = (propSchema) => {
  // 递归处理
  if (propSchema.type === 'object' && propSchema.properties) {
    return ObjectControl
  }

  switch (propSchema.type) {
    case 'boolean':
      return EditorSwitch
    case 'number':
      return EditorInputNumber
    case 'string':
      return EditorInput
    case 'color':
      return EditorColorPicker
    case 'select':
      return EditorSelect
    default:
      return EditorInput
  }
}

const getControlPropsForChild = (propSchema) => {
  // 对于嵌套对象，只传递 properties
  if (propSchema.type === 'object' && propSchema.properties) {
    return { properties: propSchema.properties }
  }

  // 对于普通控件，过滤掉元数据
  const { label, type, properties, ...controlProps } = propSchema
  return controlProps
}

const updateValue = (key, value) => {
  const newValue = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newValue)
}
</script>

