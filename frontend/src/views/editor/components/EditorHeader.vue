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
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="color: var(--primary)">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        <input
          type="text"
          class="project-title"
          :value="projectName"
          @input="$emit('update:projectName', $event.target.value)"
          placeholder="未命名大屏项目"
          @blur="handleSave"
        />
        <span class="status-badge">草稿</span>
      </div>
    </div>

    <!-- 中间：对齐工具和状态指示 -->
    <div class="header-center">
      <!-- 复制粘贴工具 -->
      <div class="edit-controls">
        <button
          class="icon-btn"
          :class="{ disabled: selectedCount === 0 }"
          @click="$emit('copy')"
          title="复制 (Ctrl+C)"
          :disabled="selectedCount === 0"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
        <button
          class="icon-btn"
          :class="{ disabled: !hasCopied }"
          @click="$emit('paste')"
          title="粘贴 (Ctrl+V)"
          :disabled="!hasCopied"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/>
          </svg>
        </button>
        <button
          class="icon-btn"
          :class="{ disabled: selectedCount === 0 }"
          @click="$emit('duplicate')"
          title="快速复制 (Ctrl+D)"
          :disabled="selectedCount === 0"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"/>
          </svg>
        </button>
      </div>

      <div class="divider-v" style="margin: 0 12px;"></div>

      <!-- 撤销重做 -->
      <div class="history-controls">
        <button class="icon-btn" :class="{ disabled: !canUndo }" @click="handleUndo" title="撤销 (Ctrl+Z)">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-9 9"/>
          </svg>
        </button>
        <button class="icon-btn" :class="{ disabled: !canRedo }" @click="handleRedo" title="重做 (Ctrl+Y)">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 9 9"/>
          </svg>
        </button>
      </div>

      <div class="divider-v" style="margin: 0 12px;"></div>

      <!-- 对齐和分布工具 -->
      <div class="align-controls">
        <button class="icon-btn" :class="{ disabled: selectedCount < 2 }" @click="$emit('align', 'left')" title="左对齐" :disabled="selectedCount < 2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 22H2V2h2v20zM22 7H6v3h16V7zm-6 7H6v3h10v-3z"/></svg>
        </button>
        <button class="icon-btn" :class="{ disabled: selectedCount < 2 }" @click="$emit('align', 'center-x')" title="水平居中" :disabled="selectedCount < 2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 2h2v5h8v3h-8v4h5v3h-5v5h-2v-5H6v-3h5v-4H3V7h8z"/></svg>
        </button>
        <button class="icon-btn" :class="{ disabled: selectedCount < 2 }" @click="$emit('align', 'right')" title="右对齐" :disabled="selectedCount < 2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 2h2v20h-2V2zM2 7h16v3H2V7zm6 7h10v3H8v-3z"/></svg>
        </button>

        <div class="divider-mini"></div>

        <button class="icon-btn" :class="{ disabled: selectedCount < 2 }" @click="$emit('align', 'top')" title="顶对齐" :disabled="selectedCount < 2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2 2h20v2H2V2zm5 16h3V6H7v12zm7-6h3V6h-3v6z"/></svg>
        </button>
        <button class="icon-btn" :class="{ disabled: selectedCount < 2 }" @click="$emit('align', 'center-y')" title="垂直居中" :disabled="selectedCount < 2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 11v2h-5v8h-3v-8H10v5H7v-5H2v-2h5V6h3v5h4V3h3v8z"/></svg>
        </button>
        <button class="icon-btn" :class="{ disabled: selectedCount < 2 }" @click="$emit('align', 'bottom')" title="底对齐" :disabled="selectedCount < 2">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 22H2v-2h20v2zM7 6h3v12H7V6zm7 6h3v6h-3v-6z"/></svg>
        </button>

        <div class="divider-mini"></div>

        <button class="icon-btn" :class="{ disabled: selectedCount < 3 }" @click="$emit('align', 'dist-h')" title="水平分布" :disabled="selectedCount < 3">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 22H2V2h2v20zM22 2h-2v20h2V2zm-5 5H7v10h10V7z"/></svg>
        </button>
        <button class="icon-btn" :class="{ disabled: selectedCount < 3 }" @click="$emit('align', 'dist-v')" title="垂直分布" :disabled="selectedCount < 3">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 4v2H2V4h20zM2 22h20v-2H2v2zm5-5h10V7H7v10z"/></svg>
        </button>
      </div>

      <div class="divider-v" style="margin: 0 12px;"></div>

      <!-- 清空画布 -->
      <button
        class="icon-btn danger"
        :class="{ disabled: componentCount === 0 }"
        @click="$emit('clear')"
        title="清空画布"
        :disabled="componentCount === 0"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>

      <div class="divider-v" style="margin: 0 12px;"></div>

      <!-- 状态指示 -->
      <div class="save-status">
        <div v-if="isSaving" class="saving-spinner"></div>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="color: var(--text-sub)">
          <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
        </svg>
        <span class="status-text">{{ saveStatus }}</span>
      </div>
    </div>

    <!-- 右侧：协作与发布 -->
    <div class="header-right">
      <!-- 主题切换器 -->
      <ThemeSwitcher />

      <div class="divider-v"></div>

      <!-- 画布缩放工具 -->
      <div class="canvas-zoom-controls">
        <button class="zoom-btn" @click="$emit('zoom-out')" title="缩小">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <input
          class="zoom-input"
          type="number"
          :value="Math.round(canvasScale * 100)"
          min="10"
          max="400"
          :title="`缩放: ${Math.round(canvasScale * 100)}%`"
          @change="e => $emit('zoom-set', Number(e.target.value) / 100)"
          @keydown.enter="e => e.target.blur()"
        />
        <span class="zoom-unit">%</span>
        <button class="zoom-btn" @click="$emit('zoom-in')" title="放大">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button class="zoom-btn" @click="$emit('zoom-reset')" title="重置为100%">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </button>
        <button class="zoom-btn" @click="$emit('fit-screen')" title="适应屏幕">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      </div>

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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { SendOutlined } from '@ant-design/icons-vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

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
  canvasPanY: Number
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
  'preview'
])

const router = useRouter()

const handleBackToHome = () => {
  router.push('/projects')
}

const handleUndo = () => {
  if (props.canUndo) emit('undo')
}

const handleRedo = () => {
  if (props.canRedo) emit('redo')
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
