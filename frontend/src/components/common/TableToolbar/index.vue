<template>
  <div class="table-toolbar">
    <div class="toolbar-left">
      <!-- 搜索框 -->
      <el-input
        v-model="searchValue"
        :placeholder="searchPlaceholder"
        :prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
        @clear="handleClear"
      />

      <!-- 批量操作 -->
      <div v-if="hasSelection && batchActions.length > 0" class="batch-actions">
        <span class="selection-info">
          已选择 <strong>{{ selectionCount }}</strong> 项
        </span>
        <el-divider direction="vertical" />
        <el-button
          v-for="action in batchActions"
          :key="action.command"
          :type="action.type || 'default'"
          :icon="action.icon"
          size="small"
          @click="handleBatchAction(action.command)"
        >
          {{ action.label }}
        </el-button>
      </div>
    </div>

    <div class="toolbar-center">
      <!-- 统计信息 -->
      <div v-if="stats" class="toolbar-stats">
        <div class="stat-item">
          <span class="stat-label">总数：</span>
          <span class="stat-value">{{ stats.total || 0 }}</span>
        </div>
        <div v-if="stats.selected !== undefined" class="stat-item">
          <span class="stat-label">已选：</span>
          <span class="stat-value stat-selected">{{ stats.selected }}</span>
        </div>
        <div v-if="stats.filtered !== undefined" class="stat-item">
          <span class="stat-label">筛选后：</span>
          <span class="stat-value">{{ stats.filtered }}</span>
        </div>
      </div>

      <!-- 自定义中间内容 -->
      <slot name="center"></slot>
    </div>

    <div class="toolbar-right">
      <!-- 自定义操作 -->
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

      <!-- 列设置 -->
      <el-popover
        v-if="showColumnSettings"
        placement="bottom-end"
        :width="240"
        trigger="click"
      >
        <template #reference>
          <el-button :icon="Setting">
            列设置
          </el-button>
        </template>
        <div class="column-settings">
          <div class="settings-header">
            <span>显示列</span>
            <el-button link size="small" @click="resetColumns">
              重置
            </el-button>
          </div>
          <el-checkbox-group v-model="visibleColumns" class="column-list">
            <el-checkbox
              v-for="column in columns"
              :key="column.prop"
              :label="column.prop"
              :disabled="column.required"
            >
              {{ column.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-popover>

      <!-- 更多操作 -->
      <slot name="more"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Refresh, Download, Setting } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  // 搜索值
  search: {
    type: String,
    default: ''
  },
  // 搜索占位符
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  // 防抖延迟
  debounce: {
    type: Number,
    default: 300
  },
  // 统计信息
  stats: {
    type: Object,
    default: () => ({})
    // { total: 100, selected: 5, filtered: 80 }
  },
  // 批量操作
  batchActions: {
    type: Array,
    default: () => []
    // [{ label: '删除', command: 'delete', type: 'danger', icon: Delete }]
  },
  // 选中数量
  selectionCount: {
    type: Number,
    default: 0
  },
  // 是否显示刷新
  showRefresh: {
    type: Boolean,
    default: true
  },
  // 刷新按钮文本
  refreshText: {
    type: String,
    default: '刷新'
  },
  // 是否显示导出
  showExport: {
    type: Boolean,
    default: false
  },
  // 导出按钮文本
  exportText: {
    type: String,
    default: '导出'
  },
  // 是否显示列设置
  showColumnSettings: {
    type: Boolean,
    default: false
  },
  // 列配置
  columns: {
    type: Array,
    default: () => []
    // [{ prop: 'name', label: '名称', required: true }]
  }
})

const emit = defineEmits([
  'update:search',
  'search',
  'clear',
  'batch-action',
  'refresh',
  'export',
  'columns-change'
])

// 搜索值
const searchValue = ref(props.search)

// 刷新状态
const refreshing = ref(false)

// 可见列
const visibleColumns = ref(
  props.columns.filter(col => col.visible !== false).map(col => col.prop)
)

// 是否有选中项
const hasSelection = computed(() => props.selectionCount > 0)

// 搜索处理（防抖）
const handleSearch = debounce(() => {
  emit('update:search', searchValue.value)
  emit('search', searchValue.value)
}, props.debounce)

// 清空搜索
const handleClear = () => {
  searchValue.value = ''
  emit('update:search', '')
  emit('clear')
  emit('search', '')
}

// 批量操作
const handleBatchAction = (command) => {
  emit('batch-action', command)
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

// 重置列
const resetColumns = () => {
  visibleColumns.value = props.columns
    .filter(col => col.visible !== false)
    .map(col => col.prop)
}

// 监听外部搜索值变化
watch(() => props.search, (newValue) => {
  searchValue.value = newValue
})

// 监听列变化
watch(visibleColumns, (newColumns) => {
  emit('columns-change', newColumns)
})

// 暴露方法
defineExpose({
  searchValue,
  visibleColumns,
  clearSearch: handleClear,
  resetColumns
})
</script>

<style scoped>
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  margin-bottom: var(--spacing-lg);
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

.batch-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-active);
  border-radius: var(--radius-md);
}

.selection-info {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.selection-info strong {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
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

.stat-selected {
  color: var(--color-primary);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-shrink: 0;
}

/* 列设置 */
.column-settings {
  padding: var(--spacing-sm);
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border);
  font-weight: var(--font-weight-semibold);
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.column-list :deep(.el-checkbox) {
  margin-right: 0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .table-toolbar {
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
  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-center,
  .toolbar-right {
    width: 100%;
  }

  .toolbar-left {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }

  .batch-actions {
    flex-wrap: wrap;
  }

  .toolbar-stats {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }

  .toolbar-right {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>
