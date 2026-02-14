<template>
  <div class="simple-crud-container">
    <!-- 高级搜索表单 -->
    <SimpleSearchForm
      v-if="config.searchForm"
      :config="config.searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 工具栏组件 -->
    <SimpleToolbar
      v-model:search="searchValue"
      :search-placeholder="config.searchPlaceholder"
      :show-search="showSearch && !config.searchForm"
      :show-refresh="config.showRefresh !== false"
      :actions="config.actions"
      @action="handleAction"
      @refresh="$emit('refresh')"
    />

    <!-- 表格组件 -->
    <SimpleTable
      :columns="config.columns"
      :data="filteredData"
      :row-key="config.rowKey"
      :empty-text="config.emptyText"
      :loading="loading"
      :pagination="pagination"
      :sort="sort"
      @row-action="handleRowAction"
      @page-change="$emit('page-change', $event)"
      @page-size-change="$emit('page-size-change', $event)"
      @sort-change="$emit('sort-change', $event)"
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
    required: true,
    // 配置示例：
    // {
    //   searchPlaceholder: '搜索...',
    //   searchForm: {  // 高级搜索表单配置（可选）
    //     fields: [
    //       { key: 'keyword', label: '关键词', type: 'text' },
    //       { key: 'type', label: '类型', type: 'select', options: [...] }
    //     ]
    //   },
    //   rowKey: 'id',
    //   emptyText: '暂无数据',
    //   actions: [
    //     { key: 'add', label: '添加', type: 'primary', icon: 'plus' }
    //   ],
    //   columns: [
    //     { key: 'name', label: '名称', width: '30%' },
    //     { key: 'desc', label: '描述', width: '40%' },
    //     { key: 'actions', label: '操作', width: '15%', type: 'actions',
    //       actions: [
    //         { key: 'edit', label: '编辑' },
    //         { key: 'delete', label: '删除', danger: true }
    //       ]
    //     }
    //   ]
    // }
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
    // 格式: { page: 1, pageSize: 10, total: 0 }
  },
  // 排序配置
  sort: {
    type: Object,
    default: null
    // 格式: { key: 'name', order: 'asc' | 'desc' }
  }
})

const emit = defineEmits(['action', 'row-action', 'refresh', 'page-change', 'page-size-change', 'sort-change'])

// 搜索值
const searchValue = ref('')
const advancedSearchData = ref({})

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
const handleSearch = (searchData) => {
  advancedSearchData.value = searchData
}

// 处理重置
const handleReset = () => {
  advancedSearchData.value = {}
}

// 处理工具栏操作
const handleAction = (actionKey) => {
  emit('action', actionKey)
}

// 处理行操作
const handleRowAction = (actionKey, row) => {
  emit('row-action', actionKey, row)
}
</script>

<style scoped>
.simple-crud-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}
</style>
