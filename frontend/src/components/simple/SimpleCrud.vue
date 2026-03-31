<template>
  <div class="simple-crud-container">
    <!-- 工具栏组件（包含搜索表单和操作按钮） -->
    <SimpleToolbar
      v-model:search="searchValue"
      :search-placeholder="config?.searchPlaceholder || '搜索...'"
      :show-search="showSearch && !config?.search"
      :show-refresh="config?.showRefresh !== false"
      :actions="config?.actions"
      :search-form="config?.search"
      :selected-count="selectedKeys.length"
      @action="handleAction"
      @refresh="$emit('refresh')"
      @search="handleAdvancedSearch"
      @reset="handleReset"
      @batch-delete="handleBatchDelete"
    />

    <!-- 表格组件 -->
    <SimpleTable
      :columns="config?.columns || []"
      :data="filteredData"
      :row-key="config?.rowKey || 'id'"
      :empty-text="config?.emptyText"
      :loading="loading"
      :pagination="pagination"
      :sort="sort"
      :selectable="config?.selectable"
      :selected-keys="selectedKeys"
      @row-action="handleRowAction"
      @page-change="$emit('page-change', $event)"
      @page-size-change="$emit('page-size-change', $event)"
      @sort-change="$emit('sort-change', $event)"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <!-- 透传自定义列插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps"></slot>
      </template>
    </SimpleTable>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SimpleToolbar from './SimpleToolbar.vue'
import SimpleTable from './SimpleTable.vue'
import SimpleSearchForm from './SimpleSearchForm.vue'

const props = defineProps({
  // JSON 配置
  config: {
    type: Object,
    required: true
  },
  // 数据源
  data: {
    type: Array,
    default: () => []
  },
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 分页配置
  pagination: {
    type: Object,
    default: null
  },
  // 排序配置
  sort: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['action', 'row-action', 'refresh', 'page-change', 'page-size-change', 'sort-change', 'batch-delete'])

// 搜索值
const searchValue = ref('')
const advancedSearchData = ref({})

// 选中的行
const selectedKeys = ref([])

// 过滤后的数据
const filteredData = computed(() => {
  let result = props.data

  // 高级搜索
  if (props.config.searchForm && Object.keys(advancedSearchData.value).length > 0) {
    result = result.filter(item => {
      return Object.entries(advancedSearchData.value).every(([key, value]) => {
        if (!value) return true // 空值不过滤

        const itemValue = item[key]
        if (!itemValue) return false

        // 字符串匹配（模糊搜索）
        return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
      })
    })
  }
  // 简单搜索
  else if (props.showSearch && searchValue.value) {
    const keyword = searchValue.value.toLowerCase()
    result = result.filter(item => {
      // 搜索所有列的值
      return props.config.columns.some(col => {
        if (col.type === 'actions') return false
        const value = item[col.key]
        return value && String(value).toLowerCase().includes(keyword)
      })
    })
  }

  return result
})

// 处理高级搜索
const handleAdvancedSearch = (searchData) => {
  advancedSearchData.value = searchData
  emit('action', 'search', searchData)
}

// 处理重置
const handleReset = () => {
  advancedSearchData.value = {}
  emit('action', 'reset')
}

// 处理工具栏操作
const handleAction = (actionKey) => {
  emit('action', actionKey)
}

// 处理行操作
const handleRowAction = (actionKey, row) => {
  emit('row-action', actionKey, row)
}

// 处理行选择
const handleSelect = (key) => {
  const index = selectedKeys.value.indexOf(key)
  if (index > -1) {
    selectedKeys.value.splice(index, 1)
  } else {
    selectedKeys.value.push(key)
  }
}

// 处理全选
const handleSelectAll = () => {
  if (selectedKeys.value.length === filteredData.value.length) {
    selectedKeys.value = []
  } else {
    selectedKeys.value = filteredData.value.map(item => item[props.config?.rowKey || 'id'])
  }
}

// 处理批量删除
const handleBatchDelete = () => {
  const selectedItems = props.data.filter(item =>
    selectedKeys.value.includes(item[props.config?.rowKey || 'id'])
  )
  emit('batch-delete', selectedItems)
  selectedKeys.value = []
}
</script>

<style scoped>
.simple-crud-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0px;
}

.simple-crud-container :deep(.simple-table-container) {
  flex: 1;
  min-height: 0;
}
</style>
