<!--
  组件库面板
  显示可用的图表和组件
-->
<template>
  <div class="component-library">
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="searchText"
        type="text"
        placeholder="搜索组件..."
        class="search-input"
      />
    </div>

    <!-- 组件分类 -->
    <div v-for="category in filteredCategories" :key="category.key" class="component-category">
      <div class="category-header" @click="toggleCategory(category.key)">
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="chevron"
          :class="{ expanded: expandedCategories.includes(category.key) }"
        >
          <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
        </svg>
        <span>{{ category.label }}</span>
        <span class="count">{{ category.components.length }}</span>
      </div>

      <transition name="expand">
        <div v-show="expandedCategories.includes(category.key)" class="component-list">
          <div
            v-for="comp in category.components"
            :key="comp.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, comp)"
            @dragend="handleDragEnd"
          >
            <div class="component-icon">
              <component :is="comp.icon" />
            </div>
            <span class="component-name">{{ comp.label }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

const searchText = ref('')
const expandedCategories = ref(['basic', 'advanced'])

const categories = [
  {
    key: 'basic',
    label: '基础图表',
    components: [
      { type: 'bar', label: '柱状图', icon: () => h('div', '📊') },
      { type: 'line', label: '折线图', icon: () => h('div', '📈') },
      { type: 'pie', label: '饼图', icon: () => h('div', '🥧') },
      { type: 'area', label: '面积图', icon: () => h('div', '📉') }
    ]
  },
  {
    key: 'advanced',
    label: '高级图表',
    components: [
      { type: 'scatter', label: '散点图', icon: () => h('div', '⚫') },
      { type: 'radar', label: '雷达图', icon: () => h('div', '🎯') },
      { type: 'gauge', label: '仪表盘', icon: () => h('div', '⏱') },
      { type: 'funnel', label: '漏斗图', icon: () => h('div', '🎪') }
    ]
  },
  {
    key: 'map',
    label: '地图',
    components: [
      { type: 'china-map', label: '中国地图', icon: () => h('div', '🗺') },
      { type: 'heatmap', label: '热力图', icon: () => h('div', '🔥') },
      { type: '3d-map', label: '3D地图', icon: () => h('div', '🌏') }
    ]
  },
  {
    key: 'info',
    label: '信息组件',
    components: [
      { type: 'text', label: '文本', icon: () => h('div', '📝') },
      { type: 'table', label: '表格', icon: () => h('div', '📋') },
      { type: 'number', label: '数字翻牌', icon: () => h('div', '🔢') },
      { type: 'kpi', label: 'KPI卡片', icon: () => h('div', '📊') }
    ]
  },
  {
    key: 'decoration',
    label: '装饰',
    components: [
      { type: 'border', label: '边框', icon: () => h('div', '🖼') },
      { type: 'decoration', label: '装饰', icon: () => h('div', '✨') },
      { type: 'bg-box', label: '背景框', icon: () => h('div', '📦') }
    ]
  }
]

const filteredCategories = computed(() => {
  if (!searchText.value) return categories

  return categories
    .map(cat => ({
      ...cat,
      components: cat.components.filter(comp =>
        comp.label.toLowerCase().includes(searchText.value.toLowerCase())
      )
    }))
    .filter(cat => cat.components.length > 0)
})

const toggleCategory = (key) => {
  const index = expandedCategories.value.indexOf(key)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(key)
  }
}

const handleDragStart = (event, comp) => {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('component-type', comp.type)
  event.dataTransfer.setData('component-label', comp.label)
}

const handleDragEnd = () => {
  // 拖拽结束
}
</script>

<style scoped>
.component-library {
  padding: 16px;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #409eff;
  background: rgba(255, 255, 255, 0.08);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.component-category {
  margin-bottom: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.category-header:hover {
  background: rgba(255, 255, 255, 0.08);
}

.chevron {
  color: rgba(255, 255, 255, 0.6);
  transition: transform 0.2s;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.category-header span {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.count {
  font-size: 11px !important;
  color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 400 !important;
}

.component-list {
  padding: 8px 0 0 20px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  cursor: move;
  transition: all 0.2s;
}

.component-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #409eff;
  transform: translateX(4px);
}

.component-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.component-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
