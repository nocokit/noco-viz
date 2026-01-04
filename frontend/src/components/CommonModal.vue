<!--
  公共模态框组件
  基于 PlaylistManagement 模态框模板
  通过 props 和 slots 控制样式和内容
-->
<template>
  <div
    class="modal-overlay"
    :class="{ open: visible }"
    @click.self="handleClickOverlay"
  >
    <div
      class="common-modal"
      :style="{
        width: width,
        maxWidth: maxWidth,
        maxHeight: maxHeight
      }"
    >
      <!-- 头部 -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <div class="close-btn" @click="handleClose">✕</div>
      </div>

      <!-- 内容区 -->
      <div class="modal-body" :style="bodyStyle">
        <slot></slot>
      </div>

      <!-- 底部 -->
      <div v-if="showFooter" class="modal-footer">
        <slot name="footer">
          <el-button @click="handleClose" :disabled="loading">
            {{ cancelText }}
          </el-button>
          <el-button
            type="primary"
            @click="handleConfirm"
            :loading="loading"
            :disabled="confirmDisabled"
          >
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 控制显示/隐藏
  visible: {
    type: Boolean,
    default: false
  },
  // 标题
  title: {
    type: String,
    default: '提示'
  },
  // 宽度
  width: {
    type: String,
    default: '600px'
  },
  // 最大宽度
  maxWidth: {
    type: String,
    default: '90%'
  },
  // 最大高度
  maxHeight: {
    type: String,
    default: '80vh'
  },
  // 是否显示底部
  showFooter: {
    type: Boolean,
    default: true
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: '确认'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 确认按钮禁用状态
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  // 点击遮罩层是否关闭
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  // body样式
  bodyStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'confirm', 'close', 'cancel'])

// 关闭模态框
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
  emit('cancel')
}

// 点击遮罩层
const handleClickOverlay = () => {
  if (props.closeOnClickModal) {
    handleClose()
  }
}

// 确认
const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
/* ========== 模态框遮罩 ========== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1000;
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

/* ========== 模态框容器 ========== */
.common-modal {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 12px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  transform: scale(0.9);
  transition: transform 0.3s;
}

.modal-overlay.open .common-modal {
  transform: scale(1);
}

/* ========== 模态框头部 ========== */
.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #303033;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #e5e5e5;
}

.close-btn {
  color: #909399;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition: 0.2s;
  padding: 4px;
  user-select: none;
}

.close-btn:hover {
  color: #e5e5e5;
}

/* ========== 模态框内容区 ========== */
.modal-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  color: #fff;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #303033;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #404040;
}

/* ========== 模态框底部 ========== */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #303033;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

/* ========== Element Plus 表单样式覆盖 ========== */
.modal-body :deep(.el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.modal-body :deep(.el-input__inner) {
  color: #fff;
}

.modal-body :deep(.el-input__inner::placeholder) {
  color: #6b7280;
}

.modal-body :deep(.el-form-item__label) {
  color: #9ca3af;
}

.modal-body :deep(.el-select .el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.modal-body :deep(.el-textarea__inner) {
  background-color: #000;
  border-color: #2d2e33;
  color: #fff;
}

.modal-body :deep(.el-textarea__inner::placeholder) {
  color: #6b7280;
}

.modal-body :deep(.el-radio__label) {
  color: #9ca3af;
}

.modal-body :deep(.el-radio__input.is-checked + .el-radio__label) {
  color: #3b82f6;
}

.modal-body :deep(.el-checkbox__label) {
  color: #9ca3af;
}

.modal-body :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #3b82f6;
}

.modal-body :deep(.el-switch__core) {
  background-color: #2d2e33;
}

.modal-body :deep(.el-switch.is-checked .el-switch__core) {
  background-color: #3b82f6;
}

.modal-body :deep(.el-input-number .el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

.modal-body :deep(.el-date-editor .el-input__wrapper) {
  background-color: #000;
  box-shadow: 0 0 0 1px #2d2e33 inset;
}

/* ========== Element Plus 按钮样式覆盖 ========== */
.modal-footer :deep(.el-button) {
  background-color: #1c1d21;
  border-color: #2d2e33;
  color: #9ca3af;
}

.modal-footer :deep(.el-button:hover) {
  border-color: #fff;
  color: #fff;
  background-color: #1c1d21;
}

.modal-footer :deep(.el-button--primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.modal-footer :deep(.el-button--primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.modal-footer :deep(.el-button.is-loading) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.modal-footer :deep(.el-button:disabled) {
  background-color: #1c1d21;
  border-color: #2d2e33;
  color: #6b7280;
  cursor: not-allowed;
}

/* ========== Element Plus 下拉菜单样式 ========== */
:deep(.el-select-dropdown) {
  background-color: #1c1d21;
  border-color: #2d2e33;
}

:deep(.el-select-dropdown__item) {
  color: #fff;
}

:deep(.el-select-dropdown__item:hover) {
  background-color: #26272c;
}

:deep(.el-select-dropdown__item.selected) {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

/* ========== Element Plus 上传组件样式 ========== */
.modal-body :deep(.el-upload) {
  width: 100%;
}

.modal-body :deep(.el-upload-dragger) {
  background-color: #000;
  border-color: #2d2e33;
}

.modal-body :deep(.el-upload-dragger:hover) {
  border-color: #3b82f6;
}

.modal-body :deep(.el-upload__text) {
  color: #9ca3af;
}

.modal-body :deep(.el-upload__text em) {
  color: #3b82f6;
}

.modal-body :deep(.el-upload__tip) {
  color: #6b7280;
}

/* ========== Element Plus Tree 样式 ========== */
.modal-body :deep(.el-tree) {
  background-color: transparent;
  color: #fff;
}

.modal-body :deep(.el-tree-node__content) {
  background-color: transparent;
  color: #fff;
}

.modal-body :deep(.el-tree-node__content:hover) {
  background-color: #26272c;
}

.modal-body :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}
</style>
