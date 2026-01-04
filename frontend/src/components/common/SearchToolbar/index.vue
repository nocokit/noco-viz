<template>
  <div class="search-toolbar">
    <div class="toolbar-left">
      <!-- 搜索框 -->
      <el-input
        v-model="searchValue"
        :placeholder="placeholder"
        :prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
        @clear="handleClear"
      >
        <template v-if="$slots['search-prefix']" #prefix>
          <slot name="search-prefix"></slot>
        </template>
        <template v-if="$slots['search-suffix']" #suffix>
          <slot name="search-suffix"></slot>
        </template>
      </el-input>

      <!-- 筛选器 -->
      <slot name="filters">
        <el-select
          v-if="filters && filters.length > 0"
          v-model="selectedFilter"
          :placeholder="filterPlaceholder"
          clearable
          class="filter-select"
          @change="handleFilterChange"
        >
          <el-option
            v-for="filter in filters"
            :key="filter.value"
            :label="filter.label"
            :value="filter.value"
          />
        </el-select>
      </slot>
    </div>

    <div class="toolbar-center">
      <!-- 统计信息 -->
      <div v-if="stats && stats.length > 0" class="toolbar-stats">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-item"
        >
          <span class="stat-label">{{ stat.label }}：</span>
          <span class="stat-value" :style="{ color: stat.color }">
            {{ stat.value }}
          </span>
        </div>
      </div>

      <!-- 自定义中间内容 -->
      <slot name="center"></slot>
    </div>

    <div class="toolbar-right">
      <!-- 自定义操作按钮 -->
      <slot name="actions"></slot>

      <!-- 刷新按钮 -->
      <el-button
        v-if="showRefresh"
        :icon="Refresh"
        :loading="refreshing"
        @click="handleRefresh"
      >
        {{ refreshText }}
      </el-button>

      <!-- 导出按钮 -->
      <el-button
        v-if="showExport"
        :icon="Download"
        @click="handleExport"
      >
        {{ exportText }}
      </el-button>

      <!-- 更多操作 -->
      <slot name="more"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  // 搜索值
  modelValue: {
    type: String,
    default: ''
  },
  // 搜索占位符
  placeholder: {
    type: String,
    default: '搜索...'
  },
  // 防抖延迟（毫秒）
  debounce: {
    type: Number,
    default: 300
  },
  // 筛选器选项
  filters: {
    type: Array,
    default: () => []
  },
  // 筛选器占位符
  filterPlaceholder: {
    type: String,
    default: '选择筛选条件'
  },
  // 统计信息
  stats: {
    type: Array,
    default: () => []
    // 格式: [{ label: '总数', value: 100, color: '#409eff' }]
  },
  // 是否显示刷新按钮
  showRefresh: {
    type: Boolean,
    default: false
  },
  // 刷新按钮文本
  refreshText: {
    type: String,
    default: '刷新'
  },
  // 是否显示导出按钮
  showExport: {
    type: Boolean,
    default: false
  },
  // 导出按钮文本
  exportText: {
    type: String,
    default: '导出'
  }
})

const emit = defineEmits([
  'update:modelValue',
  'search',
  'filter-change',
  'refresh',
  'export',
  'clear'
])

// 搜索值
const searchValue = ref(props.modelValue)

// 选中的筛选器
const selectedFilter = ref('')

// 刷新状态
const refreshing = ref(false)

// 搜索处理（防抖）
const handleSearch = debounce(() => {
  emit('update:modelValue', searchValue.value)
  emit('search', searchValue.value)
}, props.debounce)

// 清空搜索
const handleClear = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
  emit('search', '')
}

// 筛选改变
const handleFilterChange = (value) => {
  emit('filter-change', value)
}

// 刷新
const handleRefresh = async () => {
  refreshing.value = true
  try {
    await emit('refresh')
  } finally {
    setTimeout(() => {
      refreshing.value = false
    }, 500)
  }
}

// 导出
const handleExport = () => {
  emit('export')
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

// 暴露方法
defineExpose({
  searchValue,
  selectedFilter,
  clearSearch: handleClear,
  clearFilter: () => {
    selectedFilter.value = ''
  }
})
</script>

<style scoped>
.search-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.search-input {
  width: 300px;
  max-width: 100%;
}

.filter-select {
  width: 180px;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-shrink: 0;
}

.toolbar-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  white-space: nowrap;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .search-toolbar {
    flex-wrap: wrap;
  }

  .toolbar-left {
    flex: 1 1 100%;
  }

  .toolbar-center {
    flex: 1 1 auto;
  }

  .toolbar-right {
    flex: 0 0 auto;
  }
}

@media (max-width: 768px) {
  .search-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-center,
  .toolbar-right {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .toolbar-stats {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .toolbar-right {
    justify-content: flex-end;
  }
}
</style>
