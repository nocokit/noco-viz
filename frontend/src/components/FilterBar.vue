<template>
  <a-flex justify="space-between" align="center" :style="{ marginBottom: '16px' }">
    <!-- 左侧：筛选标签 -->
    <a-space v-if="filters && filters.length > 0">
      <a-button
        v-for="filter in filters"
        :key="filter.id"
        :type="modelValue === filter.id ? 'primary' : 'default'"
        @click="handleFilterChange(filter.id)"
      >
        {{ filter.label }}
      </a-button>
    </a-space>

    <!-- 右侧：搜索和视图切换 -->
    <a-space>
      <!-- 搜索框 -->
      <a-input-search
        v-if="showSearch"
        :value="searchValue"
        @search="handleSearchChange"
        @change="handleSearchChange"
        :placeholder="searchPlaceholder"
        allow-clear
        style="width: 240px"
      />

      <!-- 视图切换器 -->
      <div v-if="viewModes && viewModes.length > 0" class="view-toggle">
        <button
          v-for="mode in viewModes"
          :key="mode.id"
          :class="['toggle-btn', { active: currentView === mode.id }]"
          :title="mode.tooltip || mode.label"
          @click="handleViewChange(mode.id)"
        >
          <svg v-if="mode.id === 'grid'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
          <svg v-else-if="mode.id === 'list'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
          <svg v-else-if="mode.id === 'table'" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10.02H3V19z"/>
          </svg>
        </button>
      </div>

      <!-- 自定义插槽 -->
      <slot name="extra"></slot>
    </a-space>
  </a-flex>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 筛选选项
  filters: {
    type: Array,
    default: () => []
  },
  // 当前激活的筛选
  modelValue: {
    type: String,
    default: ''
  },
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: true
  },
  // 搜索框占位符
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  // 搜索值
  searchValue: {
    type: String,
    default: ''
  },
  // 视图模式
  viewModes: {
    type: Array,
    default: () => []
  },
  // 当前视图
  currentView: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'view-change'])

const handleFilterChange = (filterId) => {
  emit('update:modelValue', filterId)
}

const handleSearchChange = (e) => {
  const value = e.target ? e.target.value : e
  emit('search', value)
}

const handleViewChange = (viewId) => {
  emit('view-change', viewId)
}
</script>

<style scoped>
.view-toggle {
  display: flex;
  gap: 4px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 6px;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #e6e6e6;
  color: #262626;
}

.toggle-btn.active {
  background: #fff;
  color: #1890ff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>

