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

    <!-- 中间：对齐工具和状态指示 -->
    <div class="header-center">
 

            <!-- 撤销重做 -->
      <div class="history-controls">
        <button
          v-for="btn in historyButtons"
          :key="btn.action"
          class="icon-btn"
          :class="{ disabled: !btn.canDo }"
          @click="btn.handler"
          :title="btn.title"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="btn.iconPath"/>
          </svg>
        </button>
      </div>

      <div class="divider-v" style="margin: 0 12px;"></div>

     <!-- 复制粘贴工具 -->
      <div class="edit-controls">
        <button
          v-for="btn in editButtons"
          :key="btn.action"
          class="icon-btn"
          :class="{ disabled: btn.disabled }"
          @click="$emit(btn.action)"
          :title="btn.title"
          :disabled="btn.disabled"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path :d="btn.iconPath"/>
          </svg>
        </button>
      </div>

      <div class="divider-v" style="margin: 0 12px;"></div>

      <!-- 对齐和分布工具 -->
      <div class="align-controls">
        <template v-for="(btn, index) in alignButtons" :key="btn.type">
          <div v-if="btn.divider" class="divider-mini"></div>
          <button
            v-else
            class="icon-btn"
            :class="{ disabled: selectedCount < btn.minCount }"
            @click="$emit('align', btn.type)"
            :title="btn.title"
            :disabled="selectedCount < btn.minCount"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path :d="btn.iconPath"/>
            </svg>
          </button>
        </template>
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
    </div>

    <!-- 右侧：协作与发布 -->
    <div class="header-right">
      <!-- 主题切换器 - 暂时屏蔽 -->
      <!-- <ThemeSwitcher /> -->

      <!-- <div class="divider-v"></div> -->

      <!-- 网格辅助线控制 -->
      <div class="grid-controls">
        <button
          class="icon-btn"
          :class="{ active: gridEnabled }"
          @click="$emit('toggle-grid')"
          title="显示/隐藏网格"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M10 10h4v4h-4v-4zm0-6h4v4h-4V4zm0 12h4v4h-4v-4zM4 10h4v4H4v-4zm0-6h4v4H4V4zm0 12h4v4H4v-4zm12-6h4v4h-4v-4zm0-6h4v4h-4V4zm0 12h4v4h-4v-4z"/>
          </svg>
        </button>
        <a-dropdown v-if="gridEnabled" trigger="click">
          <button class="icon-btn" title="网格类型">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          <template #overlay>
            <a-menu @click="({ key }) => $emit('change-grid-type', key)">
              <template v-for="item in gridTypeOptions">
                <a-menu-divider v-if="item.divider" :key="'divider-' + item.key" />
                <a-menu-item v-else :key="item.key">
                  <span :style="{ fontWeight: gridType === item.key ? 'bold' : 'normal' }">{{ item.label }}</span>
                </a-menu-item>
              </template>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <template v-if="gridEnabled">
        <div class="divider-v"></div>

        <!-- 智能布局按钮 -->
        <button
          class="icon-btn"
          :class="{ disabled: componentCount === 0 }"
          @click="$emit('auto-layout')"
          title="智能布局"
          :disabled="componentCount === 0"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
        </button>
      </template>

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
        <button
          v-for="btn in zoomButtons"
          :key="btn.action"
          class="zoom-btn"
          @click="$emit(btn.action)"
          :title="btn.title"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path v-for="(path, idx) in btn.iconPaths" :key="idx" :d="path"/>
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
import {
  historyButtonsConfig,
  editButtonsConfig,
  alignButtonsConfig,
  zoomButtonsConfig,
  gridTypeOptionsConfig
} from '../config/toolbarConfig.js'

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

const handleUndo = () => {
  if (props.canUndo) emit('undo')
}

const handleRedo = () => {
  if (props.canRedo) emit('redo')
}

const handleSave = () => {
  emit('save')
}

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

// 缩放按钮配置
const zoomButtons = zoomButtonsConfig

// 网格类型选项配置
const gridTypeOptions = gridTypeOptionsConfig
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
