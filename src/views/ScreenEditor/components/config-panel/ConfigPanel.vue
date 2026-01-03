<!--
  配置面板容器组件
  右侧配置面板，支持多个Tab切换
-->
<template>
  <div class="config-panel" :class="{ collapsed: collapsed }">
    <!-- 面板头部 -->
    <div class="panel-header">
      <div class="panel-title">
        <span>{{ title }}</span>
        <span v-if="componentName" class="component-name">{{ componentName }}</span>
      </div>
      <button class="collapse-btn" @click="toggleCollapse">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M5 3l6 5-6 5V3z" :transform="collapsed ? 'rotate(180 8 8)' : ''" />
        </svg>
      </button>
    </div>

    <!-- Tab 导航 -->
    <div v-if="!collapsed" class="panel-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- Tab 内容 -->
    <div v-if="!collapsed" class="panel-content">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '配置面板'
  },
  componentName: {
    type: String,
    default: ''
  },
  tabs: {
    type: Array,
    default: () => [
      { key: 'style', label: '样式' },
      { key: 'data', label: '数据' },
      { key: 'event', label: '事件' }
    ]
  },
  defaultTab: {
    type: String,
    default: 'style'
  },
  width: {
    type: Number,
    default: 320
  }
})

const activeTab = ref(props.defaultTab)
const collapsed = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

defineExpose({
  activeTab,
  collapsed,
  toggleCollapse
})
</script>

<style scoped>
.config-panel {
  width: v-bind(width + 'px');
  height: 100%;
  background: #18181c;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.config-panel.collapsed {
  width: 40px;
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
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.component-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.collapse-btn {
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

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.panel-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.tab-item {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.tab-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.tab-item.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
