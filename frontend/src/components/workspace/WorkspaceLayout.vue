<template>
  <div class="workspace-layout-wrapper">
    <!-- 面包屑导航 - 在 padding 外面 -->
    <BreadcrumbHeader :items="breadcrumbItems" />

    <div class="workspace-layout">
      <!-- 筛选和搜索栏 -->
      <FilterBar
        v-model="activeFilter"
        :filters="filters"
        :search-value="searchQuery"
        :search-placeholder="searchPlaceholder"
        :view-modes="viewModes"
        :current-view="currentView"
        @search="handleSearch"
        @view-change="handleViewChange"
      >
        <template #extra>
          <slot name="toolbar-extra"></slot>
        </template>
      </FilterBar>

      <!-- 内容区域 -->
      <div class="content-scroll">
        <!-- 空状态 -->
        <EmptyState
          v-if="filteredItems.length === 0"
          :title="emptyTitle"
          :description="emptyDescription"
        />

        <!-- Grid 视图 -->
        <div v-else-if="currentView === 'grid'" class="grid-container">
          <slot name="grid" :items="filteredItems"></slot>
        </div>

        <!-- List 视图 -->
        <div v-else-if="currentView === 'list'" class="list-container">
          <slot name="list" :items="paginatedItems"></slot>

          <!-- 分页器 -->
          <div v-if="filteredItems.length > pageSize" class="pagination-container">
            <a-pagination
              v-model:current="currentPage"
              v-model:page-size="pageSize"
              :total="filteredItems.length"
              :show-size-changer="false"
              :show-total="total => `共 ${total} 条`"
            />
          </div>
        </div>

        <!-- Table 视图 -->
        <div v-else-if="currentView === 'table'" class="table-container">
          <slot name="table" :items="filteredItems"></slot>
        </div>
      </div>

      <!-- 底部插槽 -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BreadcrumbHeader from '@/components/BreadcrumbHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import EmptyState from '@/components/EmptyState.vue'

const props = defineProps({
  // 面包屑配置
  breadcrumbItems: {
    type: Array,
    required: true
  },
  // 筛选器配置
  filters: {
    type: Array,
    default: () => [
      { id: 'all', label: '全部' },
      { id: 'mine', label: '我创建的' },
      { id: 'shared', label: '协作的' }
    ]
  },
  // 默认筛选器
  defaultFilter: {
    type: String,
    default: 'all'
  },
  // 搜索占位符
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  // 视图模式配置
  viewModes: {
    type: Array,
    default: () => [
      { id: 'grid', label: '网格视图', tooltip: '网格视图' },
      { id: 'list', label: '列表视图', tooltip: '列表视图' },
      { id: 'table', label: '表格视图', tooltip: '表格视图' }
    ]
  },
  // 默认视图
  defaultView: {
    type: String,
    default: 'grid'
  },
  // 数据列表
  items: {
    type: Array,
    default: () => []
  },
  // 自定义筛选函数
  filterFunction: {
    type: Function,
    default: null
  },
  // 自定义搜索函数
  searchFunction: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['filter-change', 'search', 'view-change'])

// 状态
const activeFilter = ref(props.defaultFilter)
const searchQuery = ref('')
const currentView = ref(props.defaultView)
const currentPage = ref(1)
const pageSize = ref(6)

// 处理筛选变化
watch(activeFilter, (newValue) => {
  emit('filter-change', newValue)
})

// 处理搜索
const handleSearch = (value) => {
  searchQuery.value = value
  emit('search', value)
}

// 处理视图切换
const handleViewChange = (viewId) => {
  currentView.value = viewId
  emit('view-change', viewId)
}

// 过滤后的数据
const filteredItems = computed(() => {
  let result = props.items

  // 应用筛选
  if (props.filterFunction) {
    result = props.filterFunction(result, activeFilter.value)
  }

  // 应用搜索
  if (searchQuery.value && props.searchFunction) {
    result = props.searchFunction(result, searchQuery.value)
  }

  return result
})

// 分页后的数据（仅用于列表视图）
const paginatedItems = computed(() => {
  if (currentView.value !== 'list') {
    return filteredItems.value
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// 监听筛选和搜索变化，重置页码
watch([activeFilter, searchQuery], () => {
  currentPage.value = 1
})

// 空状态文案
const emptyTitle = computed(() => {
  if (searchQuery.value) {
    return '未找到匹配的结果'
  }
  if (activeFilter.value === 'mine') {
    return '暂无我创建的项目'
  }
  if (activeFilter.value === 'shared') {
    return '暂无协作项目'
  }
  return '暂无数据'
})

const emptyDescription = computed(() => {
  if (searchQuery.value) {
    return '请尝试其他搜索关键词'
  }
  if (activeFilter.value === 'mine') {
    return '点击右上角"新增"按钮创建您的第一个项目'
  }
  if (activeFilter.value === 'shared') {
    return '暂时没有与您协作的项目'
  }
  return '暂时没有任何数据'
})

// 暴露方法和状态
defineExpose({
  activeFilter,
  searchQuery,
  currentView,
  filteredItems
})
</script>

<style scoped>
.workspace-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.workspace-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 8px;
  overflow: hidden;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px 0;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}
</style>
