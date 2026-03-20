<template>
  <div>
    <EditorFormRenderer
      :schema="pageConfigSchema"
      v-model="pageConfigData"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EditorFormRenderer from '@/components/editor/EditorFormRenderer.vue'
import { pageConfigSchema } from '@/components/editor/formSchemas.js'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// 页面配置的双向绑定
const pageConfigData = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
