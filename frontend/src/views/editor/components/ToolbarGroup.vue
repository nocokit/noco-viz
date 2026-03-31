<template>
  <div class="toolbar-group">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  gap: {
    type: String,
    default: '4px'
  }
})
</script>

<style scoped>
.toolbar-group {
  display: flex;
  align-items: center;
  gap: v-bind(gap);
  padding: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md, 6px);
}
</style>
