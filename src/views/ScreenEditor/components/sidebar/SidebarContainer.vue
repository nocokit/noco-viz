<!--
  侧边栏容器组件（左侧）
  包含Activity Bar和可切换的面板
-->
<template>
  <div class="sidebar-container">
    <!-- Activity Bar - 一级导航 -->
    <div class="activity-bar">
      <div
        v-for="item in menuItems"
        :key="item.key"
        class="activity-item"
        :class="{ active: activePanel === item.key }"
        :title="item.label"
        @click="handlePanelSwitch(item.key)"
      >
        <component :is="item.icon" />
      </div>
    </div>

    <!-- Side Panel - 二级面板 -->
    <transition name="slide-fade">
      <div v-if="activePanel" class="side-panel">
        <div class="panel-header">
          <span class="panel-title">{{ activePanelLabel }}</span>
          <button class="close-btn" @click="activePanel = null">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
            </svg>
          </button>
        </div>

        <div class="panel-content">
          <slot :name="activePanel"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 280
  }
})

const activePanel = ref('components')

const menuItems = [
  {
    key: 'components',
    label: '组件库',
    icon: () => h('svg', { width: 20, height: 20, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z' })
    ])
  },
  {
    key: 'layers',
    label: '图层',
    icon: () => h('svg', { width: 20, height: 20, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4z' })
    ])
  },
  {
    key: 'assets',
    label: '资源',
    icon: () => h('svg', { width: 20, height: 20, viewBox: '0 0 16 16', fill: 'currentColor' }, [
      h('path', { d: 'M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z' }),
      h('path', { d: 'M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z' })
    ])
  }
]

const activePanelLabel = computed(() => {
  const item = menuItems.find(i => i.key === activePanel.value)
  return item?.label || ''
})

const handlePanelSwitch = (key) => {
  activePanel.value = activePanel.value === key ? null : key
}

defineExpose({
  activePanel
})
</script>

<style scoped>
.sidebar-container {
  display: flex;
  height: 100%;
  background: #18181c;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.activity-bar {
  width: 56px;
  background: #0f1115;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  gap: 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.activity-item {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.activity-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: #409eff;
  transition: height 0.2s;
}

.activity-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.activity-item.active {
  color: #409eff;
}

.activity-item.active::before {
  height: 24px;
}

.side-panel {
  width: v-bind(width + 'px');
  display: flex;
  flex-direction: column;
  background: #18181c;
}

.panel-header {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.panel-title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
