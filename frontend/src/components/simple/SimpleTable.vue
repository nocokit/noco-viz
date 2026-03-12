<template>
  <div class="simple-table-container">
    <a-table
      :columns="tableColumns"
      :data-source="data"
      :loading="loading"
      :row-key="actualRowKey"
      :pagination="paginationConfig"
      :row-selection="rowSelectionConfig"
      :locale="{ emptyText: actualEmptyText }"
      @change="handleTableChange"
    >
      <!-- 自定义列渲染 -->
      <template
        v-for="col in actualColumns"
        :key="col.key || col.prop"
        #[`bodyCell`]="{ column, record, text }"
      >
        <template v-if="column.dataIndex === (col.key || col.prop)">
          <!-- 自定义渲染函数 -->
          <RenderCell v-if="col.render" :render="col.render" :row="record" />

          <!-- 操作列 -->
          <template v-else-if="col.type === 'actions'">
            <div class="actions-cell">
              <!-- 显示列数据（如果有format或自定义插槽） -->
              <span v-if="col.format" class="cell-data">
                {{ formatValue(record[col.key || col.prop], col.format) }}
              </span>
              <span v-else-if="$slots[`column-${col.key || col.prop}`]" class="cell-data">
                <slot :name="`column-${col.key || col.prop}`" :row="record" :value="record[col.key || col.prop]"></slot>
              </span>

              <!-- 操作按钮 -->
              <a-space class="actions-group">
                <a
                  v-for="action in col.actions"
                  :key="action.key"
                  :class="{ 'ant-typography-danger': action.danger || action.class === 'danger' }"
                  @click="$emit('row-action', action.key, record)"
                >
                  <EditOutlined v-if="action.icon === 'edit'" />
                  <DeleteOutlined v-if="action.icon === 'delete'" />
                  {{ action.label }}
                </a>
              </a-space>
            </div>
          </template>

          <!-- 自定义插槽 -->
          <template v-else-if="$slots[`column-${col.key || col.prop}`]">
            <slot :name="`column-${col.key || col.prop}`" :row="record" :value="record[col.key || col.prop]"></slot>
          </template>

          <!-- 默认显示 -->
          <template v-else>
            {{ col.format ? formatValue(text, col.format) : (text || '-') }}
          </template>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

// RenderCell 组件：智能处理 render 函数返回值（支持 HTML 字符串和 VNode）
const RenderCell = {
  props: ['render', 'row'],
  setup(props) {
    return () => {
      const result = props.render(props.row)
      // 如果返回的是字符串，使用 v-html 渲染
      if (typeof result === 'string') {
        return h('div', { innerHTML: result })
      }
      // 如果返回的是 VNode，直接返回
      return result
    }
  }
}

const props = defineProps({
  // 配置对象（支持两种方式）
  config: {
    type: Object,
    default: null
  },
  columns: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
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
  },
  // 选择功能
  selectable: {
    type: Boolean,
    default: false
  },
  selectedKeys: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['row-action', 'page-change', 'page-size-change', 'sort-change', 'select', 'select-all'])

// 支持 config 对象或直接传递 props
const actualColumns = computed(() => props.config?.columns || props.columns)
const actualRowKey = computed(() => props.config?.rowKey || props.rowKey)
const actualEmptyText = computed(() => props.config?.emptyText || props.emptyText)
const actualSelectable = computed(() => props.config?.selectable || props.selectable)

// 转换列配置为 a-table 格式
const tableColumns = computed(() => {
  return actualColumns.value.map(col => {
    const column = {
      title: col.label,
      dataIndex: col.key || col.prop,
      key: col.key || col.prop,
      width: col.width,
      align: col.align || 'left',
      ellipsis: col.ellipsis !== false,
    }

    // 排序
    if (col.sortable) {
      column.sorter = true
      if (props.sort?.key === (col.key || col.prop)) {
        column.sortOrder = props.sort.order === 'asc' ? 'ascend' : 'descend'
      }
    }

    return column
  })
})

// 分页配置
const paginationConfig = computed(() => {
  if (!props.pagination) return false

  return {
    current: props.pagination.page,
    pageSize: props.pagination.pageSize,
    total: props.pagination.total,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '50', '100'],
  }
})

// 行选择配置
const rowSelectionConfig = computed(() => {
  if (!actualSelectable.value) return null

  return {
    selectedRowKeys: props.selectedKeys,
    onChange: (selectedRowKeys) => {
      // 如果是全选/取消全选
      if (selectedRowKeys.length === props.data.length || selectedRowKeys.length === 0) {
        emit('select-all')
      } else {
        // 单选：找出新增或移除的key
        const added = selectedRowKeys.find(key => !props.selectedKeys.includes(key))
        const removed = props.selectedKeys.find(key => !selectedRowKeys.includes(key))
        emit('select', added || removed)
      }
    },
  }
})

// 处理表格变化（分页、排序）
const handleTableChange = (pagination, filters, sorter) => {
  // 处理分页
  if (pagination.current !== props.pagination?.page) {
    emit('page-change', pagination.current)
  }
  if (pagination.pageSize !== props.pagination?.pageSize) {
    emit('page-size-change', pagination.pageSize)
  }

  // 处理排序
  if (sorter.column) {
    const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : null
    if (order) {
      emit('sort-change', { key: sorter.field, order })
    } else {
      emit('sort-change', null)
    }
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化值
const formatValue = (value, format) => {
  if (!value) return '-'

  switch (format) {
    case 'datetime':
      return formatDate(value)
    case 'date':
      return new Date(value).toLocaleDateString('zh-CN')
    case 'time':
      return new Date(value).toLocaleTimeString('zh-CN')
    default:
      return value
  }
}
</script>

<style scoped>
.simple-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.simple-table-container :deep(.ant-table-wrapper) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.simple-table-container :deep(.ant-spin-nested-loading) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.simple-table-container :deep(.ant-spin-container) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.simple-table-container :deep(.ant-table) {
  flex: 1;
}

.simple-table-container :deep(.ant-table-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.simple-table-container :deep(.ant-table-content) {
  flex: 1;
}

.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cell-data {
  margin-right: 8px;
}

.actions-group {
  display: flex;
  gap: 8px;
}

.ant-typography-danger {
  color: #ff4d4f;
}

.ant-typography-danger:hover {
  color: #ff7875;
}
</style>
