<template>
  <ToolbarButton
    :disabled="componentCount === 0"
    title="智能布局"
    @click="$emit('auto-layout')"
  >
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
    </svg>
  </ToolbarButton>
</template>

<script setup>
import ToolbarButton from './ToolbarButton.vue'

defineProps({
  componentCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['auto-layout'])
</script>
