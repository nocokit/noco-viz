<template>
  <div class="zoom-control">
    <ToolbarButton title="缩小" @click="$emit('zoom-out')">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </ToolbarButton>

    <input
      class="zoom-input"
      type="number"
      :value="Math.round(scale * 100)"
      min="10"
      max="400"
      :title="`缩放: ${Math.round(scale * 100)}%`"
      @change="handleZoomSet"
      @keydown.enter="e => e.target.blur()"
    />
    <span class="zoom-unit">%</span>

    <ToolbarButton
      v-for="btn in zoomButtons"
      :key="btn.action"
      :title="btn.title"
      @click="$emit(btn.action)"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <path v-for="(path, idx) in btn.iconPaths" :key="idx" :d="path"/>
      </svg>
    </ToolbarButton>
  </div>
</template>

<script setup>
import ToolbarButton from './ToolbarButton.vue'
import { zoomButtonsConfig } from '../config/toolbarConfig.js'

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['zoom-in', 'zoom-out', 'zoom-set', 'zoom-reset', 'fit-screen'])

const zoomButtons = zoomButtonsConfig

// 提取事件处理器，避免内联函数
const handleZoomSet = (e) => {
  emit('zoom-set', Number(e.target.value) / 100)
}
</script>

<style scoped>
.zoom-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.zoom-input {
  width: 40px;
  background: transparent;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-sm, 4px);
  color: var(--text-primary, #d4d4d4);
  font-size: 12px;
  font-family: monospace;
  font-weight: 500;
  text-align: center;
  padding: 2px 4px;
  outline: none;
  -moz-appearance: textfield;
}

.zoom-input::-webkit-inner-spin-button,
.zoom-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.zoom-input:focus {
  border-color: var(--border-hover, rgba(255, 255, 255, 0.2));
  background: var(--bg-hover, rgba(255, 255, 255, 0.05));
}

.zoom-unit {
  font-size: 12px;
  color: var(--text-disabled, #888);
  margin-left: 1px;
}
</style>
