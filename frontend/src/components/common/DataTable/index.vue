<template>
  <div class="data-table">
    <el-table
      ref="tableRef"
      :data="data"
      :loading="loading"
      :stripe="stripe"
      :border="border"
      :height="height"
      :max-height="maxHeight"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :default-sort="defaultSort"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        :selectable="selectable"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        :index="indexMethod"
      />

      <!-- 动态列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :sortable="column.sortable"
        :fixed="column.fixed"
        :align="column.align || 'left'"
      >
        <template #default="scope">
          <slot :name="`column-${column.prop}`" :row="scope.row" :column="column">
            {{ scope.row[column.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="actions && actions.length > 0"
        label="操作"
        :width="actionsWidth"
        :fixed="actionsFixed"
        align="center"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row">
            <el-button
              v-for="action in visibleActions(scope.row)"
              :key="action.label"
              :type="action.type || 'primary'"
              :size="action.size || 'small'"
              :link="action.link !== false"
              @click.stop="action.handler(scope.row)"
            >
              {{ action.label }}
            </el-button>
          </slot>
        </template>
      </el-table-column>

      <!-- 空状态 -->
      <template #empty>
        <slot name="empty">
          <EmptyState description="暂无数据" />
        </slot>
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="pagination" class="data-table__pagination">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EmptyState from '../EmptyState/index.vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  columns: { type: Array, required: true },
  selection: { type: Boolean, default: false },
  selectable: { type: Function, default: null },
  showIndex: { type: Boolean, default: false },
  stripe: { type: Boolean, default: true },
  border: { type: Boolean, default: false },
  height: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  pagination: { type: Object, default: null },
  actions: { type: Array, default: () => [] },
  actionsWidth: { type: [String, Number], default: 150 },
  actionsFixed: { type: String, default: 'right' },
  // 新增：行class名称函数
  rowClassName: { type: Function, default: null },
  // 新增：行样式函数
  rowStyle: { type: Function, default: null },
  // 新增：默认排序
  defaultSort: { type: Object, default: null }
})

const emit = defineEmits([
  'selection-change',
  'row-click',
  'sort-change',
  'page-change',
  'size-change',
  'refresh'
])

const tableRef = ref(null)

const indexMethod = (index) => {
  if (props.pagination) {
    return (props.pagination.page - 1) * props.pagination.pageSize + index + 1
  }
  return index + 1
}

const visibleActions = (row) => {
  return props.actions.filter(action => {
    if (typeof action.visible === 'function') {
      return action.visible(row)
    }
    return action.visible !== false
  })
}

const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}

const handleSortChange = ({ prop, order }) => {
  emit('sort-change', { prop, order })
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 暴露方法给父组件
defineExpose({
  tableRef,
  // 清空选择
  clearSelection: () => tableRef.value?.clearSelection(),
  // 切换所有行选中状态
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  // 切换某一行的选中状态
  toggleRowSelection: (row, selected) => tableRef.value?.toggleRowSelection(row, selected),
  // 设置某一行的展开状态
  toggleRowExpansion: (row, expanded) => tableRef.value?.toggleRowExpansion(row, expanded),
  // 清空排序
  clearSort: () => tableRef.value?.clearSort(),
  // 清空筛选
  clearFilter: (columnKeys) => tableRef.value?.clearFilter(columnKeys),
  // 刷新表格布局
  doLayout: () => tableRef.value?.doLayout()
})
</script>

<style scoped>
.data-table {
  width: 100%;
}

.data-table__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 12px 0;
}

:deep(.el-table) {
  background: var(--bg-card, #1a1b1e);
  color: var(--text-primary, #e8eaed);
}

:deep(.el-table th.el-table__cell) {
  background: var(--bg-elevated, #202124);
  color: var(--text-secondary, #9aa0a6);
  font-weight: 500;
}

:deep(.el-table tr:hover > td) {
  background: var(--bg-hover, #2d2e30) !important;
}

:deep(.el-table td.el-table__cell) {
  border-color: var(--border, #35363a);
}
</style>
