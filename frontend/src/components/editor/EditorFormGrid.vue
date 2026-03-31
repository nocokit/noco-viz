<!--
  编辑器网格布局组件
  用于 W/H/X/Y 这种 2x2 网格布局
-->
<template>
  <div class="editor-form-grid" :class="`grid-cols-${columns}`">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Number,
    default: 2
  }
})
</script>

<style scoped>
.editor-form-grid {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}
</style>
