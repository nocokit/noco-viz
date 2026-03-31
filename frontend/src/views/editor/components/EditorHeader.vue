<template>
  <header class="editor-header">
    <!-- 左侧：导航 -->
    <div class="header-left">
      <!-- 返回工作台 -->
      <button class="home-btn" @click="handleBackToHome" title="返回工作台">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <div class="divider-v"></div>

      <!-- 项目名称 -->
      <div class="project-info">
        <input
          type="text"
          class="project-title"
          :value="projectName"
          @input="$emit('update:projectName', $event.target.value)"
          placeholder="未命名大屏项目"
          @blur="handleSave"
        />
        <span class="status-badge">草稿</span>

        <!-- 状态指示 -->
        <div class="save-status">
          <div v-if="isSaving" class="saving-spinner"></div>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="color: var(--text-sub)">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
          </svg>
          <span class="status-text">{{ saveStatus }}</span>
        </div>
      </div>
    </div>

    <!-- 中间：编辑工具栏 -->
    <div class="header-center">
      <EditorToolbar
        :can-undo="canUndo"
        :can-redo="canRedo"
        :selected-count="selectedCount"
        :component-count="componentCount"
        :has-copied="hasCopied"
        @undo="$emit('undo')"
        @redo="$emit('redo')"
        @copy="$emit('copy')"
        @paste="$emit('paste')"
        @duplicate="$emit('duplicate')"
        @align="$emit('align', $event)"
        @clear="$emit('clear')"
      />
    </div>

    <!-- 右侧：协作与发布 -->
    <div class="header-right">
      <!-- 画布工具栏（大屏幕显示） -->
      <CanvasToolbar
        :grid-enabled="gridEnabled"
        :grid-type="gridType"
        :component-count="componentCount"
        :scale="canvasScale"
        :floating="false"
        @toggle-grid="$emit('toggle-grid')"
        @change-grid-type="$emit('change-grid-type', $event)"
        @auto-layout="$emit('auto-layout')"
        @zoom-out="$emit('zoom-out')"
        @zoom-in="$emit('zoom-in')"
        @zoom-set="$emit('zoom-set', $event)"
        @zoom-reset="$emit('zoom-reset')"
        @fit-screen="$emit('fit-screen')"
      />

      <div class="divider-v"></div>

      <!-- 核心操作按钮 -->
      <button class="btn btn-ghost" @click="$emit('preview')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        预览
      </button>

      <button class="btn btn-primary" @click="handleSave" :disabled="isSaving">
        <SendOutlined />
        {{ isSaving ? '发布中...' : '发布' }}
      </button>

      <!-- 更多设置 -->
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { SendOutlined } from '@ant-design/icons-vue'
import CanvasToolbar from './CanvasToolbar.vue'
import EditorToolbar from './EditorToolbar.vue'

const props = defineProps({
  projectName: String,
  saveStatus: String,
  isSaving: Boolean,
  canUndo: Boolean,
  canRedo: Boolean,
  selectedCount: Number,
  componentCount: Number,
  hasCopied: Boolean,
  canvasScale: Number,
  canvasPanX: Number,
  canvasPanY: Number,
  gridEnabled: Boolean,
  gridType: String
})

const emit = defineEmits([
  'update:projectName',
  'save',
  'undo',
  'redo',
  'copy',
  'paste',
  'duplicate',
  'align',
  'clear',
  'zoom-in',
  'zoom-out',
  'zoom-set',
  'zoom-reset',
  'fit-screen',
  'preview',
  'toggle-grid',
  'change-grid-type',
  'auto-layout'
])

const router = useRouter()

const handleBackToHome = () => {
  router.push('/projects')
}

const handleSave = () => {
  emit('save')
}
</script>

<style scoped>
.editor-header {
  height: 56px;
  background: #18181c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.home-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  color: #e5e5e5;
  background: transparent;
  border: none;
  padding: 0;
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.divider-v {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.12);
}

.history-controls {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
}

.align-controls {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
}

.edit-controls {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
}

.divider-mini {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0 2px;
}

.icon-btn {
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

.icon-btn:hover:not(.disabled) {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.1);
}

.icon-btn.active {
  color: var(--primary);
  background: rgba(22, 119, 255, 0.15);
  border-color: rgba(22, 119, 255, 0.3);
}

.icon-btn.disabled {
  opacity: 0.95;
  cursor: not-allowed;
}

.icon-btn.danger {
  color: #ff6b6b;
}

.icon-btn.danger:hover:not(.disabled) {
  color: #fff;
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.3);
}

.project-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.project-title {
  background: transparent;
  border: 1px solid transparent;
  color: #e5e5e5;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  width: 200px;
  transition: 0.2s;
  outline: none;
}

.project-title:hover {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
}

.project-title:focus {
  border-color: #409eff;
  background: #000;
}

.status-badge {
  background: rgba(255, 152, 0, 0.15);
  color: #ffa940;
  border: 1px solid rgba(255, 152, 0, 0.3);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: 500;
}

.header-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
  opacity: 0.8;
}

.saving-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-text {
  font-family: monospace;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

/* 网格控制 */
.grid-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.canvas-zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  border-right: none;
}

.zoom-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #d4d4d4;
  cursor: pointer;
  transition: 0.2s;
  padding: 0;
}

.zoom-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.1);
}

.zoom-text {
  font-size: 12px;
  color: #d4d4d4;
  min-width: 45px;
  text-align: center;
  font-family: monospace;
  font-weight: 500;
}

.zoom-input {
  width: 40px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #d4d4d4;
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
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.zoom-unit {
  font-size: 12px;
  color: #888;
  margin-left: 1px;
}

.btn {
  height: 34px;
  padding: 0 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
  color: #e5e5e5;
}

.btn-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.25);
}

.btn-auto-layout {
  background: rgba(22, 119, 255, 0.12);
  border-color: rgba(22, 119, 255, 0.35);
  color: #4096ff;
  font-size: 13px;
  padding: 0 12px;
  height: 32px;
  gap: 6px;
}

.btn-auto-layout:hover:not(:disabled) {
  background: rgba(22, 119, 255, 0.22);
  border-color: rgba(22, 119, 255, 0.6);
  color: #69b1ff;
}

.btn-primary {
  background: #1890ff;
  color: white;
  font-weight: 500;
  box-shadow: none;
  border-color: #1890ff;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
  border-color: #40a9ff;
}

.btn-more {
  width: 34px;
  padding: 0;
  justify-content: center;
  color: #b8b8b8;
}

.btn-more:hover {
  color: white;
}
</style>
