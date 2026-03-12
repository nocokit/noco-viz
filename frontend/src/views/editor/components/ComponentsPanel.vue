<template>
  <div class="panel-view">
    <div class="panel-header">
      <span>组件列表</span>
      <svg style="width:16px;height:16px;cursor:pointer" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>
      </svg>
    </div>

    <div class="search-box">
      <input
        type="text"
        class="panel-search-input"
        placeholder="搜索图表..."
        v-model="searchQuery"
        @input="handleSearch"
      >
    </div>

    <div class="panel-body">
      <!-- 动态渲染分类 -->
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        :class="['category-block', { closed: closedCategories[category.id] }]"
      >
        <div class="category-title" @click="toggleCategory(category.id)">
          <svg class="caret" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
          {{ category.name }} ({{ category.charts.length }})
        </div>
        <div class="comp-grid">
          <div
            v-for="chart in category.charts"
            :key="chart.type"
            class="comp-item"
            draggable="true"
            @dragstart="handleDragStart($event, chart)"
            :title="chart.description"
          >
            <div class="chart-preview">
              <svg
                class="chart-icon-mini"
                :viewBox="getChartIconViewBox(chart.icon)"
                v-html="getChartIcon(chart.icon)"
              ></svg>
            </div>
            <div class="comp-label">
              <span class="comp-name">{{ chart.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索无结果 -->
      <div v-if="filteredCategories.length === 0" class="no-results">
        <svg style="width:40px;height:40px;opacity:0.3;margin-bottom:10px" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <div>未找到匹配的组件</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { chartCategories, chartIcons } from '@/config/chartComponents'

const searchQuery = ref('')
const closedCategories = reactive({})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return chartCategories
  }

  const query = searchQuery.value.toLowerCase()
  return chartCategories
    .map(category => ({
      ...category,
      charts: category.charts.filter(chart =>
        chart.name.toLowerCase().includes(query) ||
        chart.description.toLowerCase().includes(query)
      )
    }))
    .filter(category => category.charts.length > 0)
})

const toggleCategory = (categoryId) => {
  closedCategories[categoryId] = !closedCategories[categoryId]
}

const handleSearch = () => {
  // 搜索时自动展开所有分类
  Object.keys(closedCategories).forEach(key => {
    closedCategories[key] = false
  })
}

const getChartIcon = (iconName) => {
  return chartIcons[iconName] || chartIcons.bar
}

const getChartIconViewBox = (iconName) => {
  const largeViewBoxIcons = ['pie', 'word-cloud', 'area', 'line', 'sankey', 'number', 'progress', 'table', 'gauge', 'kpi', 'text', 'funnel', 'liquid', 'heatmap', 'map-3d', 'map-china', 'map']
  return largeViewBoxIcons.includes(iconName) ? '0 0 1024 1024' : '0 0 24 24'
}

const handleDragStart = (event, chart) => {
  event.dataTransfer.setData('chartType', chart.type)
  event.dataTransfer.effectAllowed = 'copy'
}
</script>

<style scoped>
.panel-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  height: 44px;
  min-height: 44px;
  border-bottom: 1px solid #2a2e35;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #9ca3af;
  text-transform: uppercase;
}

.search-box {
  padding: 12px;
  border-bottom: 1px solid #2a2e35;
}

.panel-search-input {
  width: 100%;
  background: #121214;
  border: 1px solid #2a2e35;
  border-radius: 4px;
  padding: 6px 10px;
  color: #e5e7eb;
  font-size: 12px;
  outline: none;
}

.panel-search-input:focus {
  border-color: #3b82f6;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.category-block {
  padding: 0 12px 16px 12px;
}

.category-title {
  padding: 12px 4px 8px 4px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.category-title:hover {
  color: #e5e7eb;
}

.caret {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  transition: 0.2s;
}

.category-block.closed .caret {
  transform: rotate(-90deg);
}

.category-block.closed .comp-grid {
  display: none;
}

.comp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.comp-item {
  background: rgba(10, 28, 48, 0.4);
  border: 1px solid rgba(0, 242, 242, 0.1);
  border-radius: 4px;
  padding: 0;
  display: flex;
  flex-direction: column;
  cursor: grab;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;
}

.comp-item:hover {
  background: rgba(10, 28, 48, 0.6);
  border-color: rgba(0, 242, 242, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 242, 242, 0.2);
}

.chart-preview {
  width: 100%;
  height: 80px;
  background: rgba(5, 13, 25, 0.6);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-preview .chart-icon-mini {
  width: 48px;
  height: 48px;
  opacity: 0.8;
}

.comp-label {
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.chart-icon-mini {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.9;
}

.chart-icon-mini :deep(path) {
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.comp-name {
  font-size: 11px;
  color: #bcd0e3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #666;
  font-size: 13px;
  text-align: center;
}
</style>
