<template>
  <div class="view-switcher">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="view-switcher__toolbar">
      <slot name="toolbar-left">
        <div class="toolbar-left">
          <slot name="title">
            <h3 v-if="title" class="toolbar-title">{{ title }}</h3>
          </slot>
        </div>
      </slot>

      <div class="toolbar-right">
        <slot name="toolbar-right">
          <!-- 搜索框 -->
          <el-input
            v-if="showSearch"
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            prefix-icon="Search"
            clearable
            class="toolbar-search"
            @input="handleSearch"
          />

          <!-- 视图切换按钮 -->
          <el-radio-group v-model="currentView" size="small" class="view-toggle">
            <el-radio-button value="grid">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button value="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>
        </slot>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="view-switcher__content" :class="`view-${currentView}`">
      <!-- 网格视图 -->
      <div v-if="currentView === 'grid'" class="grid-view" :style="gridStyle">
        <div
          v-for="(item, index) in filteredData"
          :key="getItemKey(item, index)"
          :class="['grid-item', { selected: isSelected(item) }]"
          @click="handleItemClick(item)"
        >
          <slot name="grid-item" :item="item" :index="index">
            <!-- 默认网格项 -->
            <div class="default-grid-item">
              <div class="item-content">{{ item.name || item.title || item.label }}</div>
            </div>
          </slot>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredData.length === 0" class="empty-container">
          <slot name="empty">
            <EmptyState
              :description="emptyText"
              icon="box"
            />
          </slot>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <div
          v-for="(item, index) in filteredData"
          :key="getItemKey(item, index)"
          :class="['list-item', { selected: isSelected(item) }]"
          @click="handleItemClick(item)"
        >
          <slot name="list-item" :item="item" :index="index">
            <!-- 默认列表项 -->
            <div class="default-list-item">
              <div class="item-content">{{ item.name || item.title || item.label }}</div>
            </div>
          </slot>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredData.length === 0" class="empty-container">
          <slot name="empty">
            <EmptyState
              :description="emptyText"
              icon="box"
            />
          </slot>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="showPagination && filteredData.length > 0" class="view-switcher__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Grid, List } from '@element-plus/icons-vue'
import EmptyState from '../EmptyState/index.vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  // 数据
  data: {
    type: Array,
    default: () => []
  },
  // 默认视图模式
  defaultView: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'list'].includes(value)
  },
  // 网格列数
  gridCols: {
    type: Number,
    default: 4
  },
  // 网格间距
  gridGap: {
    type: String,
    default: '20px'
  },
  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示搜索
  showSearch: {
    type: Boolean,
    default: true
  },
  // 搜索占位符
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  // 搜索字段
  searchFields: {
    type: Array,
    default: () => ['name', 'title', 'label']
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: false
  },
  // 分页配置
  pageSizes: {
    type: Array,
    default: () => [12, 24, 48, 96]
  },
  // 分页布局
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 项目唯一键
  itemKey: {
    type: String,
    default: 'id'
  },
  // 选中的项
  selectedItems: {
    type: Array,
    default: () => []
  },
  // 是否支持多选
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:view',
  'update:selectedItems',
  'item-click',
  'search',
  'page-change',
  'size-change'
])

// 当前视图
const currentView = ref(props.defaultView)

// 搜索关键词
const searchQuery = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(props.pageSizes[0])

// 网格样式
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.gridCols}, 1fr)`,
  gap: props.gridGap
}))

// 过滤后的数据
const filteredData = computed(() => {
  let result = props.data

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => {
      return props.searchFields.some(field => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(query)
      })
    })
  }

  // 分页
  if (props.showPagination) {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    result = result.slice(start, end)
  }

  return result
})

// 总数
const total = computed(() => {
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    return props.data.filter(item => {
      return props.searchFields.some(field => {
        const value = item[field]
        return value && String(value).toLowerCase().includes(query)
      })
    }).length
  }
  return props.data.length
})

// 获取项目键
const getItemKey = (item, index) => {
  return item[props.itemKey] || index
}

// 是否选中
const isSelected = (item) => {
  return props.selectedItems.some(selected =>
    getItemKey(selected) === getItemKey(item)
  )
}

// 处理项目点击
const handleItemClick = (item) => {
  emit('item-click', item)

  if (props.multiple) {
    const selected = [...props.selectedItems]
    const index = selected.findIndex(s => getItemKey(s) === getItemKey(item))

    if (index > -1) {
      selected.splice(index, 1)
    } else {
      selected.push(item)
    }

    emit('update:selectedItems', selected)
  } else {
    emit('update:selectedItems', [item])
  }
}

// 搜索处理（防抖）
const handleSearch = debounce(() => {
  currentPage.value = 1
  emit('search', searchQuery.value)
}, 300)

// 分页改变
const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSizeChange = (size) => {
  currentPage.value = 1
  emit('size-change', size)
}

// 监听视图变化
watch(currentView, (newView) => {
  emit('update:view', newView)
})

// 暴露方法
defineExpose({
  currentView,
  searchQuery,
  clearSearch: () => {
    searchQuery.value = ''
  },
  resetPagination: () => {
    currentPage.value = 1
  }
})
</script>

<style scoped>
.view-switcher {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.view-switcher__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.toolbar-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.toolbar-search {
  width: 240px;
}

.view-toggle {
  flex-shrink: 0;
}

.view-switcher__content {
  flex: 1;
  overflow: auto;
  padding: var(--spacing-lg);
}

/* 网格视图 */
.grid-view {
  min-height: 200px;
}

.grid-item {
  cursor: pointer;
  transition: all var(--transition-base);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.grid-item.selected {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.default-grid-item {
  padding: var(--spacing-xl);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
}

/* 列表视图 */
.list-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 200px;
}

.list-item {
  cursor: pointer;
  transition: all var(--transition-base);
  border-radius: var(--radius-md);
}

.list-item:hover {
  background: var(--bg-hover);
}

.list-item.selected {
  background: var(--bg-active);
  border-left: 3px solid var(--color-primary);
}

.default-list-item {
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

/* 空状态 */
.empty-container {
  grid-column: 1 / -1;
  padding: var(--spacing-3xl) 0;
}

/* 分页 */
.view-switcher__pagination {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

/* 响应式 */
@media (max-width: 768px) {
  .view-switcher__toolbar {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .toolbar-right {
    justify-content: space-between;
  }

  .toolbar-search {
    flex: 1;
  }
}
</style>
