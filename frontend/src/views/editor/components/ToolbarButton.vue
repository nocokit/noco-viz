<template>
  <button
    class="toolbar-btn"
    :class="{ active, disabled }"
    :title="title"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  title: String,
  active: Boolean,
  disabled: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.toolbar-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
  background: transparent;
  border: 1px solid transparent;
  padding: 0;
}

.toolbar-btn:hover:not(.disabled) {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.1);
}

.toolbar-btn.active {
  color: var(--primary, #1890ff);
  background: rgba(22, 119, 255, 0.15);
  border-color: rgba(22, 119, 255, 0.3);
}

.toolbar-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
