<template>
  <div class="editor-toolbar">
    <!-- 撤销重做 -->
    <ToolbarGroup>
      <ToolbarButton
        v-for="btn in historyButtons"
        :key="btn.action"
        v-memo="[btn.canDo]"
        :title="btn.title"
        :disabled="!btn.canDo"
        @click="btn.handler"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="btn.iconPath"/>
        </svg>
      </ToolbarButton>
    </ToolbarGroup>

    <div class="divider-v"></div>

    <!-- 复制粘贴工具 -->
    <ToolbarGroup>
      <ToolbarButton
        v-for="btn in editButtons"
        :key="btn.action"
        v-memo="[btn.disabled]"
        :title="btn.title"
        :disabled="btn.disabled"
        @click="handleEditAction(btn.action)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path :d="btn.iconPath"/>
        </svg>
      </ToolbarButton>
    </ToolbarGroup>

    <div class="divider-v"></div>

    <!-- 对齐和分布工具 -->
    <ToolbarGroup>
      <template v-for="(btn, index) in alignButtons" :key="btn.type || `divider-${index}`">
        <div v-if="btn.divider" class="divider-mini"></div>
        <ToolbarButton
          v-else
          :title="btn.title"
          :disabled="selectedCount < btn.minCount"
          @click="handleAlign(btn.type)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path :d="btn.iconPath"/>
          </svg>
        </ToolbarButton>
      </template>
    </ToolbarGroup>

    <div class="divider-v"></div>

    <!-- 清空画布 -->
    <ToolbarButton
      v-memo="[componentCount === 0]"
      class="danger"
      title="清空画布"
      :disabled="componentCount === 0"
      @click="handleClear"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
      </svg>
    </ToolbarButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ToolbarButton from './ToolbarButton.vue'
import ToolbarGroup from './ToolbarGroup.vue'
import {
  historyButtonsConfig,
  editButtonsConfig,
  alignButtonsConfig
} from '../config/toolbarConfig.js'

const props = defineProps({
  canUndo: Boolean,
  canRedo: Boolean,
  selectedCount: Number,
  componentCount: Number,
  hasCopied: Boolean
})

const emit = defineEmits([
  'undo',
  'redo',
  'copy',
  'paste',
  'duplicate',
  'align',
  'clear'
])

// 提取事件处理器，避免内联函数
const handleUndo = () => emit('undo')
const handleRedo = () => emit('redo')
const handleEditAction = (action) => emit(action)
const handleAlign = (type) => emit('align', type)
const handleClear = () => emit('clear')

// 撤销重做按钮配置
const historyButtons = computed(() => historyButtonsConfig.map(btn => ({
  ...btn,
  canDo: btn.action === 'undo' ? props.canUndo : props.canRedo,
  handler: btn.action === 'undo' ? handleUndo : handleRedo
})))

// 编辑控制按钮配置
const editButtons = computed(() => editButtonsConfig.map(btn => ({
  ...btn,
  disabled: btn.action === 'paste' ? !props.hasCopied : props.selectedCount === 0
})))

// 对齐按钮配置
const alignButtons = alignButtonsConfig
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 12px);
}

.divider-v {
  width: 1px;
  height: 20px;
  background: var(--border, rgba(255, 255, 255, 0.12));
}

.divider-mini {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 2px;
}

.danger {
  color: var(--danger, #ff6b6b);
}

.danger:hover:not(.disabled) {
  color: #fff;
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.3);
}
</style>
