<!--
  图层工具栏组件
-->
<template>
  <div class="layer-tools">
    <button
      class="layer-btn"
      :disabled="disabled"
      title="置于顶层"
      @click="$emit('layer', 'top')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.5 1.5a.5.5 0 0 0-1 0v3.793L5.354 3.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 5.293V1.5z"/>
        <path d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8z"/>
        <path d="M2 11.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
        <path d="M2 14.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </button>

    <button
      class="layer-btn"
      :disabled="disabled"
      title="上移一层"
      @click="$emit('layer', 'up')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.793L5.354 7.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.293V5.5z"/>
        <path d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </button>

    <button
      class="layer-btn"
      :disabled="disabled"
      title="下移一层"
      @click="$emit('layer', 'down')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.5 2.5a.5.5 0 0 0-1 0v3.793L5.354 4.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 6.293V2.5z"/>
        <path d="M2 9.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 9.5z"/>
      </svg>
    </button>

    <button
      class="layer-btn"
      :disabled="disabled"
      title="置于底层"
      @click="$emit('layer', 'bottom')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 1.5z"/>
        <path d="M2 4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 4.5z"/>
        <path d="M2 7.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 7.5z"/>
        <path d="M8.5 10.5a.5.5 0 0 0-1 0v3.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V10.5z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['layer'])
</script>

<style scoped>
.layer-tools {
  display: flex;
  gap: 4px;
}

.layer-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.layer-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
