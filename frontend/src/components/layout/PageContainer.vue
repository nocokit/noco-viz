<template>
  <div :class="['page-container', paddingClass]" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: '24px',
    validator: (value) => ['24px', '16px', 'none'].includes(value)
  },
  background: {
    type: String,
    default: ''
  },
  fullHeight: {
    type: Boolean,
    default: true
  }
})

const paddingClass = computed(() => {
  return `padding-${props.padding.replace('px', '')}`
})

const containerStyle = computed(() => {
  const style = {}
  if (props.background) {
    style.background = props.background
  }
  if (!props.fullHeight) {
    style.height = 'auto'
  }
  return style
})
</script>

