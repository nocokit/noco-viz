<template>
  <div class="text-component" :style="textStyle">{{ displayText }}</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  data: { type: Object, default: null }
})

const displayText = computed(() => props.data?.text || props.config.text || '通用标题')

const textStyle = computed(() => ({
  fontSize: props.config.fontSize || '22px',
  fontWeight: props.config.fontWeight || '700',
  fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
  color: props.config.color || '#e8f4ff',
  textAlign: props.config.textAlign || 'center',
  letterSpacing: '2px',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: props.config.textAlign === 'left' ? 'flex-start' : props.config.textAlign === 'right' ? 'flex-end' : 'center',
  padding: '0 12px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))
</script>
