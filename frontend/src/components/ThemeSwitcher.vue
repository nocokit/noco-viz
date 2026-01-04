<template>
  <div class="theme-switcher">
    <el-dropdown trigger="click" @command="handleThemeChange">
      <div class="theme-trigger">
        <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span class="theme-name">{{ currentTheme.name }}</span>
        <svg class="caret" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"></path>
        </svg>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="theme-dropdown">
          <div class="theme-dropdown-header">选择主题</div>
          <el-dropdown-item
            v-for="theme in themeList"
            :key="theme.id"
            :command="theme.id"
            :class="{ 'is-active': currentThemeId === theme.id }"
            class="theme-dropdown-item"
          >
            <div class="theme-item-content">
              <div
                class="theme-preview"
                :style="{
                  background: theme.gradients.primary,
                  boxShadow: `0 0 12px ${theme.colors.primary}40`
                }"
              ></div>
              <div class="theme-info">
                <div class="theme-item-name">{{ theme.name }}</div>
                <div class="theme-item-desc">{{ theme.description }}</div>
              </div>
              <svg v-if="currentThemeId === theme.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12l5 5L20 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { themeList, applyTheme, getCurrentThemeId, getTheme } from '@/config/themes'

const currentThemeId = ref('datav')
const currentTheme = computed(() => getTheme(currentThemeId.value))

const handleThemeChange = (themeId) => {
  currentThemeId.value = themeId
  applyTheme(themeId)

  // 触发自定义事件，通知其他组件主题已更改
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { themeId } }))
}

onMounted(() => {
  currentThemeId.value = getCurrentThemeId()
})
</script>

<style scoped>
.theme-switcher {
  display: inline-block;
}

.theme-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--theme-bg-card, rgba(15, 31, 58, 0.4));
  border: 1px solid var(--theme-border, rgba(0, 242, 242, 0.15));
  border-radius: var(--theme-radius-md, 6px);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.theme-trigger:hover {
  background: var(--theme-bg-card, rgba(15, 31, 58, 0.6));
  border-color: var(--theme-border-hover, rgba(0, 242, 242, 0.3));
}

.theme-icon {
  width: 18px;
  height: 18px;
  color: var(--theme-primary, #00f2f2);
  flex-shrink: 0;
}

.theme-name {
  font-size: 13px;
  color: var(--theme-text-main, #ffffff);
  font-weight: 500;
}

.caret {
  width: 16px;
  height: 16px;
  color: var(--theme-text-secondary, #bcd0e3);
  opacity: 0.6;
  flex-shrink: 0;
}

/* 下拉菜单样式 */
.theme-dropdown {
  background: var(--theme-bg-card, #0f1f3a) !important;
  border: 1px solid var(--theme-border, rgba(0, 242, 242, 0.15)) !important;
  box-shadow: var(--theme-shadow-lg, 0 8px 32px rgba(0, 242, 242, 0.3)) !important;
  padding: 4px !important;
  min-width: 280px;
}

.theme-dropdown-header {
  padding: 10px 12px 8px;
  font-size: 12px;
  color: var(--theme-text-secondary, #bcd0e3);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--theme-border-light, rgba(0, 242, 242, 0.08));
  margin-bottom: 4px;
}

.theme-dropdown-item {
  padding: 0 !important;
  margin: 2px 0;
}

.theme-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--theme-radius-sm, 4px);
  transition: all 0.2s;
}

.theme-dropdown-item:hover .theme-item-content {
  background: var(--theme-bg-input, rgba(10, 22, 40, 0.6));
}

.theme-dropdown-item.is-active .theme-item-content {
  background: var(--theme-bg-input, rgba(10, 22, 40, 0.8));
}

.theme-preview {
  width: 40px;
  height: 40px;
  border-radius: var(--theme-radius-sm, 4px);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.theme-preview::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.theme-info {
  flex: 1;
  min-width: 0;
}

.theme-item-name {
  font-size: 13px;
  color: var(--theme-text-main, #ffffff);
  font-weight: 500;
  margin-bottom: 2px;
}

.theme-item-desc {
  font-size: 11px;
  color: var(--theme-text-secondary, #bcd0e3);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: var(--theme-primary, #00f2f2);
  flex-shrink: 0;
}
</style>
