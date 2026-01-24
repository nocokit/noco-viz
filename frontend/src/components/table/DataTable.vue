<template>
  <div class="data-table-wrapper">
    <el-table
      :data="data"
      :loading="loading"
      :stripe="stripe"
      :border="border"
      :empty-text="emptyText"
      :row-key="rowKey"
      :height="height"
      :max-height="maxHeight"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        fixed="left"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || 'left'"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :formatter="column.formatter"
      >
        <template v-if="column.slot" #default="scope">
          <slot :name="`column-${column.prop}`" :row="scope.row" :column="column" :$index="scope.$index">
            {{ scope.row[column.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="$slots.actions"
        label="操作"
        :width="actionsWidth"
        :fixed="actionsFixed"
        align="center"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index"></slot>
        </template>
      </el-table-column>

      <!-- 空状态 -->
      <template #empty>
        <slot name="empty">
          <EmptyState
            icon="default"
            :title="emptyText"
            description=""
          />
        </slot>
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="pagination" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import EmptyState from '../state/EmptyState.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  stripe: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  maxHeight: {
    type: [String, Number],
    default: undefined
  },
  selectable: {
    type: Boolean,
    default: false
  },
  actionsWidth: {
    type: String,
    default: '150'
  },
  actionsFixed: {
    type: String,
    default: 'right'
  },
  pagination: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'selection-change',
  'row-click',
  'sort-change',
  'page-change',
  'size-change'
])

const currentPage = ref(1)
const pageSize = ref(10)

watch(() => props.pagination, (val) => {
  if (val) {
    currentPage.value = val.currentPage || 1
    pageSize.value = val.pageSize || 10
  }
}, { immediate: true })

const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}

const handleSortChange = ({ column, prop, order }) => {
  emit('sort-change', { column, prop, order })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  emit('size-change', size)
  emit('page-change', { page: currentPage.value, size })
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  emit('page-change', { page, size: pageSize.value })
}
</script>

<style scoped>
.data-table-wrapper {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

.table-pagination {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table) {
  background: transparent;
}

:deep(.el-table th.el-table__cell) {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-weight: 600;
}

:deep(.el-table tr) {
  background: transparent;
}

:deep(.el-table tr:hover > td) {
  background: var(--el-fill-color-light);
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
