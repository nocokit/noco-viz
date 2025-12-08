<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

// 初始化主题
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #0a0b0d;
  color: #ffffff;
}

/* Element Plus 暗色主题变量覆盖 */
:root {
  /* 背景色 */
  --el-bg-color: #0a0b0d;
  --el-bg-color-page: #0a0b0d;
  --el-bg-color-overlay: #1c1d21;

  /* 填充色 */
  --el-fill-color-blank: #0f1012;
  --el-fill-color: #26272c;
  --el-fill-color-light: #2d2e33;
  --el-fill-color-lighter: #333439;
  --el-fill-color-extra-light: #3a3b40;
  --el-fill-color-dark: #1c1d21;
  --el-fill-color-darker: #141519;

  /* 边框色 */
  --el-border-color: #2d2e33;
  --el-border-color-light: #333439;
  --el-border-color-lighter: #3a3b40;
  --el-border-color-extra-light: #414247;
  --el-border-color-dark: #26272c;
  --el-border-color-darker: #1c1d21;

  /* 文字色 */
  --el-text-color-primary: #ffffff;
  --el-text-color-regular: #e5e7eb;
  --el-text-color-secondary: #9ca3af;
  --el-text-color-placeholder: #6b7280;
  --el-text-color-disabled: #4b5563;

  /* 主题色 */
  --el-color-primary: #3b82f6;
  --el-color-primary-light-3: #2563eb;
  --el-color-primary-light-5: #1d4ed8;
  --el-color-primary-light-7: #1e40af;
  --el-color-primary-light-8: #1e3a8a;
  --el-color-primary-light-9: rgba(59, 130, 246, 0.1);
  --el-color-primary-dark-2: #60a5fa;

  /* 成功色 */
  --el-color-success: #10b981;
  --el-color-success-light-3: #059669;
  --el-color-success-light-5: #047857;
  --el-color-success-light-9: rgba(16, 185, 129, 0.1);

  /* 警告色 */
  --el-color-warning: #f59e0b;
  --el-color-warning-light-3: #d97706;
  --el-color-warning-light-5: #b45309;
  --el-color-warning-light-9: rgba(245, 158, 11, 0.1);

  /* 危险色 */
  --el-color-danger: #ef4444;
  --el-color-danger-light-3: #dc2626;
  --el-color-danger-light-5: #b91c1c;
  --el-color-danger-light-9: rgba(239, 68, 68, 0.1);

  /* 信息色 */
  --el-color-info: #6b7280;
  --el-color-info-light-3: #4b5563;
  --el-color-info-light-5: #374151;
  --el-color-info-light-9: rgba(107, 114, 128, 0.1);

  /* 遮罩层 */
  --el-overlay-color-light: rgba(0, 0, 0, 0.7);
  --el-overlay-color-lighter: rgba(0, 0, 0, 0.5);

  /* 禁用状态 */
  --el-disabled-bg-color: #1c1d21;
  --el-disabled-text-color: #4b5563;
  --el-disabled-border-color: #26272c;
}

/* Element Plus 组件深色主题样式覆盖 */
.el-input__wrapper,
.el-textarea__inner,
.el-select__wrapper,
.el-input-number {
  background-color: #0f1012 !important;
  box-shadow: 0 0 0 1px var(--el-border-color) inset !important;
}

.el-input__wrapper:hover,
.el-select__wrapper:hover {
  box-shadow: 0 0 0 1px var(--el-text-color-secondary) inset !important;
}

.el-input__wrapper.is-focus,
.el-select__wrapper.is-focus {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
}

.el-dialog,
.el-drawer,
.el-popover,
.el-tooltip__popper,
.el-dropdown-menu {
  background-color: var(--el-bg-color-overlay) !important;
  border-color: var(--el-border-color) !important;
}

.el-button {
  border-color: var(--el-border-color);
}

.el-button--default:hover {
  border-color: var(--el-text-color-primary);
  color: var(--el-text-color-primary);
}

.el-switch__core {
  background-color: #333 !important;
  border-color: #333 !important;
}

.el-switch.is-checked .el-switch__core {
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
