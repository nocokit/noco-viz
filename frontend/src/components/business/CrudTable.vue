<template>
  <a-space direction="vertical" :size="16" :style="{ width: '100%' }">
    <!-- 额外内容插槽 -->
    <slot name="toolbar-extra"></slot>

    <!-- 工具栏 -->
    <a-flex v-if="showToolbar" justify="space-between" align="center" :wrap="true" :gap="12">
      <a-flex align="center" :gap="12" :wrap="true">
        <!-- 搜索框 -->
        <a-input-search
          v-if="searchable"
          v-model:value="searchQuery"
          :placeholder="searchPlaceholder"
          :style="{ width: '240px' }"
          allow-clear
          @search="handleSearch"
        />

        <!-- 筛选器 -->
        <slot name="filters"></slot>
      </a-flex>

      <a-flex align="center" :gap="8">
        <!-- 视图切换 -->
        <a-segmented
          v-if="viewSwitchable"
          v-model:value="currentView"
          :options="[
            { label: '列表', value: 'table', icon: h(UnorderedListOutlined) },
            { label: '网格', value: 'grid', icon: h(AppstoreOutlined) }
          ]"
          @change="handleViewChange"
        />

        <!-- 批量操作 -->
        <a-dropdown v-if="batchActions.length > 0 && selectedRows.length > 0">
          <a-button>
            批量操作 ({{ selectedRows.length }})
            <DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleBatchAction">
              <a-menu-item
                v-for="action in batchActions"
                :key="action.command"
              >
                <component v-if="action.icon" :is="action.icon" />
                {{ action.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <!-- 自定义操作按钮 -->
        <slot name="actions"></slot>

        <!-- 创建按钮 -->
        <a-button
          v-if="creatable"
          type="primary"
          @click="handleCreate"
        >
          <template #icon><PlusOutlined /></template>
          {{ createButtonText }}
        </a-button>

        <!-- 刷新按钮 -->
        <a-button
          v-if="refreshable"
          :loading="loading"
          @click="handleRefresh"
        >
          <template #icon><ReloadOutlined /></template>
        </a-button>
      </a-flex>
    </a-flex>

    <!-- 表格视图 -->
    <a-table
      v-if="currentView === 'table'"
      ref="tableRef"
      :data-source="tableData"
      :loading="loading"
      :row-selection="selectable ? rowSelection : null"
      :columns="tableColumns"
      v-bind="tableProps"
      @change="handleTableChange"
    />

    <!-- 网格视图 -->
    <a-spin v-else-if="currentView === 'grid'" :spinning="loading">
      <a-row :gutter="[16, 16]" v-if="tableData.length > 0">
        <a-col
          v-for="(item, index) in tableData"
          :key="item.id || index"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <a-card
            hoverable
            :class="{ 'ant-card-selected': isSelected(item) }"
            @click="handleGridItemClick(item)"
          >
            <slot name="grid-item" :item="item" :index="index">
              <a-space direction="vertical" :size="8" :style="{ width: '100%' }">
                <a-typography-text strong>{{ item.name || item.title }}</a-typography-text>
                <a-space :size="8">
                  <a-button type="link" size="small" @click.stop="handleEdit(item)">编辑</a-button>
                  <a-button type="link" danger size="small" @click.stop="handleDelete(item)">删除</a-button>
                </a-space>
              </a-space>
            </slot>
          </a-card>
        </a-col>
      </a-row>

      <!-- 空状态 -->
      <a-empty v-else :description="emptyText" />
    </a-spin>

    <!-- 分页 -->
    <a-flex v-if="pageable && tableData.length > 0" justify="flex-end">
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="internalPageSize"
        :total="total"
        :page-size-options="pageSizes.map(String)"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="(total) => `共 ${total} 条`"
        @change="handlePageChange"
        @showSizeChange="handleSizeChange"
      />
    </a-flex>
  </a-space>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'
import { SearchOutlined, UnorderedListOutlined, AppstoreOutlined, PlusOutlined, ReloadOutlined, DownOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  // 数据
  data: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 视图模式
  viewMode: {
    type: String,
    default: 'table', // 'table' | 'grid'
    validator: (value) => ['table', 'grid'].includes(value)
  },
  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true
  },
  // 搜索
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  // 视图切换
  viewSwitchable: {
    type: Boolean,
    default: true
  },
  // 多选
  selectable: {
    type: Boolean,
    default: false
  },
  selectableFunc: {
    type: Function,
    default: null
  },
  // 序号
  showIndex: {
    type: Boolean,
    default: false
  },
  indexMethod: {
    type: Function,
    default: null
  },
  // 操作列
  showActions: {
    type: Boolean,
    default: true
  },
  actionsWidth: {
    type: [String, Number],
    default: 150
  },
  actionsFixed: {
    type: String,
    default: 'right'
  },
  // CRUD 操作
  creatable: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: true
  },
  deletable: {
    type: Boolean,
    default: true
  },
  refreshable: {
    type: Boolean,
    default: true
  },
  createButtonText: {
    type: String,
    default: '新建'
  },
  // 批量操作
  batchActions: {
    type: Array,
    default: () => []
  },
  // 分页
  pageable: {
    type: Boolean,
    default: true
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  // 空状态
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 表格属性
  tableProps: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'create',
  'edit',
  'delete',
  'batch-action',
  'refresh',
  'search',
  'selection-change',
  'sort-change',
  'page-change',
  'size-change',
  'view-change'
])

// 状态
const tableRef = ref(null)
const currentView = ref(props.viewMode)
const searchQuery = ref('')
const selectedRows = ref([])
const currentPage = ref(1)
const internalPageSize = ref(props.pageSize)

// 计算属性
const tableData = computed(() => props.data)

const visibleColumns = computed(() => {
  return props.columns.filter(col => col.visible !== false)
})

const tableColumns = computed(() => {
  const cols = []

  // 序号列
  if (props.showIndex) {
    cols.push({
      title: '序号',
      width: 60,
      customRender: ({ index }) => {
        return props.indexMethod ? props.indexMethod(index) : index + 1
      }
    })
  }

  // 数据列
  visibleColumns.value.forEach(column => {
    cols.push({
      title: column.label || column.title,
      dataIndex: column.prop || column.dataIndex,
      key: column.prop || column.dataIndex,
      width: column.width,
      align: column.align,
      fixed: column.fixed,
      sorter: column.sortable,
      customRender: column.customRender
    })
  })

  // 操作列
  if (props.showActions) {
    cols.push({
      title: '操作',
      key: 'actions',
      width: props.actionsWidth,
      fixed: props.actionsFixed,
      customRender: ({ record, index }) => {
        return h('div', [
          props.editable && h('a-button', {
            type: 'link',
            onClick: () => handleEdit(record)
          }, '编辑'),
          props.deletable && h('a-button', {
            type: 'link',
            danger: true,
            onClick: () => handleDelete(record)
          }, '删除')
        ])
      }
    })
  }

  return cols
})

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRows.value.map(row => row.id),
  onChange: (selectedRowKeys, selectedRowsData) => {
    selectedRows.value = selectedRowsData
    emit('selection-change', selectedRowsData)
  },
  getCheckboxProps: props.selectableFunc ? (record) => ({
    disabled: !props.selectableFunc(record)
  }) : undefined
}))

// 方法
const handleViewChange = (view) => {
  emit('view-change', view)
}

const switchView = (view) => {
  currentView.value = view
  emit('view-change', view)
}

const handleCreate = () => {
  emit('create')
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleDelete = (row) => {
  emit('delete', row)
}

const handleBatchAction = ({ key }) => {
  emit('batch-action', key, selectedRows.value)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleTableChange = (pagination, filters, sorter) => {
  if (sorter.field) {
    emit('sort-change', {
      prop: sorter.field,
      order: sorter.order === 'ascend' ? 'ascending' : sorter.order === 'descend' ? 'descending' : null
    })
  }
}

const handlePageChange = (page, pageSize) => {
  currentPage.value = page
  emit('page-change', page)
}

const handleSizeChange = (current, size) => {
  internalPageSize.value = size
  emit('size-change', size)
}

// 监听 props.pageSize 变化
watch(() => props.pageSize, (newVal) => {
  internalPageSize.value = newVal
})

const handleGridItemClick = (item) => {
  if (!props.selectable) return

  const index = selectedRows.value.findIndex(row => row.id === item.id)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(item)
  }
  emit('selection-change', selectedRows.value)
}

const isSelected = (item) => {
  return selectedRows.value.some(row => row.id === item.id)
}

// 清空选择
const clearSelection = () => {
  tableRef.value?.clearSelection()
  selectedRows.value = []
}

// 切换选择
const toggleRowSelection = (row, selected) => {
  tableRef.value?.toggleRowSelection(row, selected)
}

// 监听搜索
watch(searchQuery, () => {
  handleSearch()
})

// 暴露方法
defineExpose({
  clearSelection,
  toggleRowSelection,
  tableRef
})
</script>

