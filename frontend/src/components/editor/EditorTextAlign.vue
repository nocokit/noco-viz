<!--
  文本对齐控件 - 居左/居中/居右
-->
<template>
  <div class="editor-text-align">
    <button
      v-for="item in options"
      :key="item.value"
      class="align-btn"
      :class="{ active: modelValue === item.value }"
      :title="item.title"
      @click="emit('update:modelValue', item.value)"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <path v-if="item.value === 'left'" d="M2 3h12v1.5H2V3zm0 3h8v1.5H2V6zm0 3h12v1.5H2V9zm0 3h8v1.5H2V12z"/>
        <path v-else-if="item.value === 'center'" d="M2 3h12v1.5H2V3zm2 3h8v1.5H4V6zm-2 3h12v1.5H2V9zm2 3h8v1.5H4V12z"/>
        <path v-else d="M2 3h12v1.5H2V3zm4 3h8v1.5H6V6zm-4 3h12v1.5H2V9zm4 3h8v1.5H6V12z"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'left'
  }
})

const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'left',   title: '居左' },
  { value: 'center', title: '居中' },
  { value: 'right',  title: '居右' }
]
</script>

<style scoped>
.editor-text-align {
  display: flex;
  gap: 4px;
  width: 100%;
}

.align-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.15s;
}

.align-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.35);
}

.align-btn.active {
  background: rgba(64, 158, 255, 0.2);
  border-color: rgba(64, 158, 255, 0.6);
  color: #40a9ff;
}
</style>
