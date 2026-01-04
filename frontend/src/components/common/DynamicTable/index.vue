<template>
  <div class="dynamic-table">
    <el-table
      ref="tableRef"
      :data="data"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        fixed="left"
      />

      <!-- 索引列 -->
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
        :fixed="column.fixed"
        :align="column.align || 'left'"
        :sortable="column.sortable"
        :show-overflow-tooltip="column.showOverflowTooltip !== false"
      >
        <!-- 自定义列内容 -->
        <template v-if="column.slot" #default="scope">
          <slot
            :name="column.prop"
            :row="scope.row"
            :column="column"
            :$index="scope.$index"
          >
            <!-- 默认渲染 -->
            {{ scope.row[column.prop] }}
          </slot>
        </template>

        <!-- 格式化显示 -->
        <template v-else-if="column.formatter" #default="scope">
          {{ column.formatter(scope.row, column, scope.row[column.prop], scope.$index) }}
        </template>

        <!-- 标签显示 -->
        <template v-else-if="column.type === 'tag'" #default="scope">
          <el-tag
            :type="getTagType(scope.row, column)"
            :size="column.size || 'small'"
          >
            {{ getTagLabel(scope.row, column) }}
          </el-tag>
        </template>

        <!-- 开关显示 -->
        <template v-else-if="column.type === 'switch'" #default="scope">
          <el-switch
            v-model="scope.row[column.prop]"
            :disabled="column.disabled"
            @change="handleSwitchChange(scope.row, column)"
          />
        </template>

        <!-- 图片显示 -->
        <template v-else-if="column.type === 'image'" #default="scope">
          <el-image
            :src="scope.row[column.prop]"
            :style="{ width: column.imageWidth || '50px', height: column.imageHeight || '50px' }"
            :preview-src-list="[scope.row[column.prop]]"
            fit="cover"
          />
        </template>

        <!-- 链接显示 -->
        <template v-else-if="column.type === 'link'" #default="scope">
          <el-link
            :type="column.linkType || 'primary'"
            @click="handleLinkClick(scope.row, column)"
          >
            {{ scope.row[column.prop] }}
          </el-link>
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
          <slot name="actions" :row="scope.row" :$index="scope.$index">
            <el-button
              v-for="action in getRowActions(scope.row)"
              :key="action.command"
              :type="action.type || 'primary'"
              :icon="action.icon"
              :disabled="action.disabled"
              link
              size="small"
              @click="handleAction(action.command, scope.row, scope.$index)"
            >
              {{ action.label }}
            </el-button>
          </slot>
        </template>
      </el-table-column>

      <!-- 展开行 -->
      <template v-if="$slots.expand" #expand="scope">
        <slot name="expand" :row="scope.row" />
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination && pagination" class="table-pagination">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    required: true
  },
  // 列配置
  columns: {
    type: Array,
    required: true
    /* 列配置格式：
    {
      prop: 'name',              // 字段名
      label: '名称',             // 列标题
      width: 150,                // 固定宽度
      minWidth: 100,             // 最小宽度
      fixed: 'left',             // 固定列
      align: 'center',           // 对齐方式
      sortable: true,            // 是否可排序
      slot: true,                // 是否使用插槽
      formatter: (row) => {},    // 格式化函数
      type: 'tag',               // 特殊类型：tag/switch/image/link
      showOverflowTooltip: true  // 是否显示溢出提示
    }
    */
  },
  // 操作按钮配置
  actions: {
    type: Array,
    default: () => []
    /* 操作配置格式：
    {
      command: 'edit',
      label: '编辑',
      type: 'primary',
      icon: Edit,
      disabled: false,
      show: (row) => true  // 动态显示
    }
    */
  },
  // 操作列宽度
  actionsWidth: {
    type: [String, Number],
    default: 200
  },
  // 操作列固定
  actionsFixed: {
    type: String,
    default: 'right'
  },
  // 是否显示选择框
  showSelection: {
    type: Boolean,
    default: false
  },
  // 是否显示索引
  showIndex: {
    type: Boolean,
    default: false
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: false
  },
  // 分页配置
  pagination: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'selection-change',
  'sort-change',
  'page-change',
  'size-change',
  'action',
  'switch-change',
  'link-click'
])

const tableRef = ref(null)

// 索引方法
const indexMethod = (index) => {
  if (props.pagination) {
    return (props.pagination.currentPage - 1) * props.pagination.pageSize + index + 1
  }
  return index + 1
}

// 获取行的操作按钮
const getRowActions = (row) => {
  return props.actions.filter(action => {
    if (typeof action.show === 'function') {
      return action.show(row)
    }
    return action.show !== false
  })
}

// 获取标签类型
const getTagType = (row, column) => {
  if (typeof column.tagType === 'function') {
    return column.tagType(row)
  }
  return column.tagType || 'primary'
}

// 获取标签文本
const getTagLabel = (row, column) => {
  if (column.tagMap) {
    return column.tagMap[row[column.prop]] || row[column.prop]
  }
  return row[column.prop]
}

// 选择改变
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 排序改变
const handleSortChange = (sort) => {
  emit('sort-change', sort)
}

// 分页改变
const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 操作按钮点击
const handleAction = (command, row, index) => {
  emit('action', { command, row, index })
}

// 开关改变
const handleSwitchChange = (row, column) => {
  emit('switch-change', { row, column, value: row[column.prop] })
}

// 链接点击
const handleLinkClick = (row, column) => {
  emit('link-click', { row, column })
}

// 暴露方法
defineExpose({
  tableRef,
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowSelection: (row, selected) => tableRef.value?.toggleRowSelection(row, selected),
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: (columnKeys) => tableRef.value?.clearFilter(columnKeys),
  doLayout: () => tableRef.value?.doLayout()
})
</script>

<style scoped>
.dynamic-table {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-pagination {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}
</style>
