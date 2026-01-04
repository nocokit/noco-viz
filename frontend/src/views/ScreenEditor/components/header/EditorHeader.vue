<!--
  编辑器顶部导航栏组件
-->
<template>
  <header class="editor-header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <button class="home-btn" @click="$emit('back')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        <span>返回</span>
      </button>

      <div class="divider"></div>

      <div class="project-info">
        <span class="project-name">{{ projectName }}</span>
        <span v-if="lastSaved" class="last-saved">上次保存: {{ lastSaved }}</span>
      </div>
    </div>

    <!-- 中间区域 - 工具栏 -->
    <div class="header-center">
      <HistoryControls
        :can-undo="canUndo"
        :can-redo="canRedo"
        @undo="$emit('undo')"
        @redo="$emit('redo')"
      />

      <div class="divider"></div>

      <AlignTools
        :disabled="selectedCount < 2"
        @align="$emit('align', $event)"
      />

      <div class="divider"></div>

      <LayerTools
        :disabled="selectedCount === 0"
        @layer="$emit('layer', $event)"
      />
    </div>

    <!-- 右侧区域 -->
    <div class="header-right">
      <ZoomControls
        :scale="scale"
        @zoom-in="$emit('zoom-in')"
        @zoom-out="$emit('zoom-out')"
        @zoom-fit="$emit('zoom-fit')"
        @zoom-reset="$emit('zoom-reset')"
      />

      <div class="divider"></div>

      <button class="action-btn preview-btn" @click="$emit('preview')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8z"/>
          <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
        </svg>
        <span>预览</span>
      </button>

      <button class="action-btn primary-btn" @click="$emit('save')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
        </svg>
        <span>保存</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import HistoryControls from './HistoryControls.vue'
import AlignTools from './AlignTools.vue'
import LayerTools from './LayerTools.vue'
import ZoomControls from './ZoomControls.vue'

defineProps({
  projectName: {
    type: String,
    default: '未命名项目'
  },
  lastSaved: {
    type: String,
    default: ''
  },
  canUndo: {
    type: Boolean,
    default: false
  },
  canRedo: {
    type: Boolean,
    default: false
  },
  selectedCount: {
    type: Number,
    default: 0
  },
  scale: {
    type: Number,
    default: 1
  }
})

defineEmits([
  'back',
  'undo',
  'redo',
  'align',
  'layer',
  'zoom-in',
  'zoom-out',
  'zoom-fit',
  'zoom-reset',
  'preview',
  'save'
])
</script>

<style scoped>
.editor-header {
  height: 56px;
  background: #18181c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.home-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-name {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.last-saved {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.primary-btn {
  background: #409eff;
  border-color: #409eff;
}

.primary-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}
</style>
