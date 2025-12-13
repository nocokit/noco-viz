<!--
  通用标题组件
  可自定义样式的文本
-->
<template>
  <div class="text-component" :style="textStyle">
    {{ displayText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: null
  }
})

const displayText = computed(() => {
  return props.data?.text || props.config.text || '通用标题'
})

const textStyle = computed(() => ({
  fontSize: props.config.fontSize || '24px',
  fontWeight: props.config.fontWeight || '600',
  fontFamily: props.config.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  color: props.config.color || '#fff',
  textAlign: props.config.textAlign || 'center',
  padding: props.config.padding || '20px',
  background: props.config.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: props.config.borderRadius || '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}))
</script>

<style scoped>
.text-component {
  user-select: none;
}
</style>
