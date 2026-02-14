<template>
  <div class="simple-table-container">
    <!-- Loading 遮罩 -->
    <div v-if="loading" class="table-loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <table class="simple-table">
      <thead>
        <tr>
          <!-- 选择列 -->
          <th v-if="actualSelectable" width="5%" class="checkbox-col">
            <input
              type="checkbox"
              class="checkbox"
              :checked="isAllSelected"
              @change="handleSelectAll"
            >
          </th>
          <th
            v-for="col in actualColumns"
            :key="col.key"
            :width="col.width"
            :class="{
              'text-right': col.align === 'right',
              'sortable': col.sortable,
              'sorted': sort && sort.key === col.key
            }"
            @click="col.sortable && handleSort(col.key)"
          >
            <div class="th-content">
              <span>{{ col.label }}</span>
              <span v-if="col.sortable" class="sort-icons">
                <span
                  :class="['sort-icon', 'sort-asc', { active: sort?.key === col.key && sort?.order === 'asc' }]"
                >▲</span>
                <span
                  :class="['sort-icon', 'sort-desc', { active: sort?.key === col.key && sort?.order === 'desc' }]"
                >▼</span>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row[actualRowKey]">
          <!-- 选择列 -->
          <td v-if="actualSelectable" class="checkbox-col">
            <input
              type="checkbox"
              class="checkbox"
              :checked="selectedKeys.includes(row[actualRowKey])"
              @change="handleSelect(row[actualRowKey])"
            >
          </td>
          <td v-for="col in actualColumns" :key="col.key" :class="{ 'text-right': col.align === 'right' }">
            <!-- 自定义渲染函数 -->
            <template v-if="col.render">
              <component :is="col.render(row)" />
            </template>

            <!-- 操作列（可能包含数据） -->
            <template v-else-if="col.type === 'actions'">
              <div class="actions-cell">
                <!-- 显示列数据（如果有format或自定义插槽） -->
                <span v-if="col.format" class="cell-data">
                  {{ formatValue(row[col.key], col.format) }}
                </span>
                <span v-else-if="$slots[`column-${col.key}`]" class="cell-data">
                  <slot :name="`column-${col.key}`" :row="row" :value="row[col.key]"></slot>
                </span>

                <!-- 操作按钮 -->
                <span class="actions-group">
                  <span
                    v-for="action in col.actions"
                    :key="action.key"
                    :class="['action-link', action.class]"
                    :style="action.style"
                    @click="$emit('row-action', action.key, row)"
                  >
                    <EditOutlined v-if="action.icon === 'edit'" />
                    <DeleteOutlined v-if="action.icon === 'delete'" />
                    {{ action.label }}
                  </span>
                </span>
              </div>
            </template>

            <!-- 自定义插槽 -->
            <template v-else-if="$slots[`column-${col.key}`]">
              <slot :name="`column-${col.key}`" :row="row" :value="row[col.key]"></slot>
            </template>

            <!-- 默认显示 -->
            <template v-else>
              {{ col.format ? formatValue(row[col.key], col.format) : (row[col.key] || '-') }}
            </template>
          </td>
        </tr>

        <!-- 空状态 -->
        <tr v-if="!loading && data.length === 0">
          <td
            :colspan="actualSelectable ? actualColumns.length + 1 : actualColumns.length"
            style="text-align: center; color: var(--el-text-color-secondary); padding: 40px;"
          >
            {{ actualEmptyText }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div v-if="pagination" class="table-pagination">
      <div class="pagination-info">
        共 {{ pagination.total }} 条
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-btn"
          :disabled="pagination.page === 1"
          @click="handlePageChange(pagination.page - 1)"
        >
          上一页
        </button>
        <div class="pagination-pages">
          <span
            v-for="page in visiblePages"
            :key="page"
            :class="['pagination-page', { active: page === pagination.page }]"
            @click="page !== '...' && handlePageChange(page)"
          >
            {{ page }}
          </span>
        </div>
        <button
          class="pagination-btn"
          :disabled="pagination.page === totalPages"
          @click="handlePageChange(pagination.page + 1)"
        >
          下一页
        </button>
        <select
          class="pagination-size"
          :value="pagination.pageSize"
          @change="handlePageSizeChange($event.target.value)"
        >
          <option :value="10">10 条/页</option>
          <option :value="20">20 条/页</option>
          <option :value="50">50 条/页</option>
          <option :value="100">100 条/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

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

// 是否全选
const isAllSelected = computed(() => {
  if (!props.data.length) return false
  return props.data.every(row => props.selectedKeys.includes(row[actualRowKey.value]))
})

// 处理全选
const handleSelectAll = () => {
  emit('select-all')
}

// 处理单选
const handleSelect = (rowId) => {
  emit('select', rowId)
}

// 计算总页数
const totalPages = computed(() => {
  if (!props.pagination) return 0
  return Math.ceil(props.pagination.total / props.pagination.pageSize)
})

// 计算可见页码
const visiblePages = computed(() => {
  if (!props.pagination) return []

  const current = props.pagination.page
  const total = totalPages.value
  const pages = []

  if (total <= 7) {
    // 总页数小于等于7，全部显示
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7，显示省略号
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// 处理页码变化
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  emit('page-change', page)
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize) => {
  emit('page-size-change', Number(pageSize))
}

// 处理排序
const handleSort = (key) => {
  let order = 'asc'

  // 如果当前列已经是升序，切换为降序
  if (props.sort?.key === key && props.sort?.order === 'asc') {
    order = 'desc'
  }
  // 如果当前列已经是降序，取消排序
  else if (props.sort?.key === key && props.sort?.order === 'desc') {
    emit('sort-change', null)
    return
  }

  emit('sort-change', { key, order })
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
  flex: 1;
  overflow: auto;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  position: relative;
}

/* Loading 样式 */
.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--el-border-color);
  border-top-color: var(--el-color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  margin-top: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.simple-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
}

.simple-table th {
  text-align: left;
  padding: 12px 20px;
  color: var(--el-text-color-secondary);
  border-bottom: 1px solid var(--el-border-color);
  font-weight: 500;
  background: var(--el-bg-color);
  position: sticky;
  top: 0;
  z-index: 1;
}

.simple-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.simple-table th.sortable:hover {
  background: var(--el-fill-color-light);
}

.simple-table th.sorted {
  color: var(--el-color-primary);
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icons {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1;
}

.sort-icon {
  font-size: 8px;
  color: var(--el-text-color-disabled);
  transition: color 0.2s;
}

.sort-icon.active {
  color: var(--el-color-primary);
}

.sort-asc {
  margin-bottom: -2px;
}

.sort-desc {
  margin-top: -2px;
}

.simple-table th:first-child {
  border-top-left-radius: 8px;
}

.simple-table th:last-child {
  border-top-right-radius: 8px;
}

.simple-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  vertical-align: middle;
}

.simple-table tr:hover td {
  background: var(--el-fill-color-light);
}

.action-link {
  color: var(--el-color-primary);
  cursor: pointer;
  margin-right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-link.danger {
  color: var(--el-color-danger);
}

.action-link:hover {
  text-decoration: underline;
}

.text-right {
  text-align: right;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  width: 100%;
}

.cell-data {
  flex-shrink: 0;
  margin-right: auto;
}

.actions-group {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
}

/* 分页样式 */
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.pagination-info {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 6px 12px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.pagination-btn:disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-page {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-page:hover:not(.active) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.pagination-page.active {
  color: #fff;
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  cursor: default;
}

.pagination-size {
  padding: 6px 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.pagination-size:hover {
  border-color: var(--el-color-primary);
}

.pagination-size:focus {
  border-color: var(--el-color-primary);
}

/* Checkbox 样式 */
.checkbox-col {
  text-align: center;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
