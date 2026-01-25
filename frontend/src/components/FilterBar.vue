<template>
  <div class="page-filter-bar">
    <!-- 左侧：筛选标签 -->
    <div class="filter-tabs" v-if="filters && filters.length > 0">
      <button
        v-for="filter in filters"
        :key="filter.id"
        :class="['filter-tab', { active: modelValue === filter.id }]"
        @click="handleFilterChange(filter.id)"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- 右侧：搜索和视图切换 -->
    <div class="filter-controls">
      <!-- 搜索框 -->
      <el-input
        v-if="showSearch"
        :model-value="searchValue"
        @update:model-value="handleSearchChange"
        class="search-input"
        :placeholder="searchPlaceholder"
        prefix-icon="Search"
        clearable
        style="width: 240px"
      />

      <!-- 自定义插槽 -->
      <slot name="extra"></slot>

      <!-- 视图切换器 -->
      <div v-if="viewModes && viewModes.length > 0" class="view-switcher">
        <el-tooltip
          v-for="mode in viewModes"
          :key="mode.id"
          :content="mode.tooltip || mode.label"
          placement="top"
        >
          <button
            :class="['view-btn', { active: currentView === mode.id }]"
            @click="handleViewChange(mode.id)"
          >
            <el-icon v-if="mode.icon">
              <component :is="mode.icon" />
            </el-icon>
            <span v-else>{{ mode.label }}</span>
          </button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
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

const handleSearchChange = (value) => {
  emit('search', value)
}

const handleViewChange = (viewId) => {
  emit('view-change', viewId)
}
</script>

<style scoped>
.page-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  padding-top: 16px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid transparent;
  background: transparent;
}

.filter-tab:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.filter-tab.active {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.view-switcher {
  display: flex;
  gap: 4px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 4px;
  background: var(--el-fill-color-lighter);
}

.view-btn {
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.view-btn.active {
  background: var(--el-color-primary);
  color: #fff;
}
</style>
