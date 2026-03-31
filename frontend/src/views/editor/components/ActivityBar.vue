<template>
  <aside class="activity-bar">
    <div class="nav-group">
      <div
        :class="['nav-item', { active: currentTab === 'components' }]"
        @click="$emit('switch-tab', 'components')"
        title="组件库"
      >
        <svg class="nav-icon" viewBox="0 0 24 24">
          <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z" fill="currentColor"></path>
        </svg>
      </div>
      <div
        :class="['nav-item', { active: currentTab === 'layers' }]"
        @click="$emit('switch-tab', 'layers')"
        title="图层管理"
      >
        <svg class="nav-icon" viewBox="0 0 24 24">
          <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" fill="currentColor"></path>
        </svg>
      </div>
      <div
        :class="['nav-item', { active: currentTab === 'assets' }]"
        @click="$emit('switch-tab', 'assets')"
        title="资源中心"
      >
        <svg class="nav-icon" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"></path>
        </svg>
      </div>
    </div>

    <div class="nav-group">
      <div class="nav-item" @click="$emit('exit')" title="退出编辑器">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
      <div class="nav-item" @click="$emit('toggle-panel')" title="收起/展开">
        <svg class="nav-icon" :style="{ transform: isPanelOpen ? 'rotate(0deg)' : 'rotate(180deg)' }" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  currentTab: {
    type: String,
    required: true
  },
  isPanelOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['switch-tab', 'toggle-panel', 'exit'])
</script>

<style scoped>
.activity-bar {
  width: 48px;
  min-width: 48px;
  background-color: #0f1115;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 0;
  border-right: 1px solid #2a2e35;
}

.nav-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nav-item {
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #9ca3af;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  color: #e5e7eb;
}

.nav-item.active {
  color: #e5e7eb;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  width: 22px;
  height: 22px;
  fill: currentColor;
  transition: transform 0.3s;
}
</style>
