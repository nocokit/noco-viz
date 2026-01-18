<template>
  <div class="crud-table">
    <!-- 额外内容插槽 -->
    <slot name="toolbar-extra"></slot>

    <!-- 工具栏 -->
    <div class="crud-toolbar" v-if="showToolbar">
      <div class="toolbar-left">
        <!-- 搜索框 -->
        <el-input
          v-if="searchable"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          clearable
          class="search-input"
          @clear="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- 筛选器 -->
        <slot name="filters"></slot>
      </div>

      <div class="toolbar-right">
        <!-- 视图切换 -->
        <el-button-group v-if="viewSwitchable">
          <el-button
            :type="currentView === 'table' ? 'primary' : ''"
            @click="switchView('table')"
          >
            <el-icon><List /></el-icon>
          </el-button>
          <el-button
            :type="currentView === 'grid' ? 'primary' : ''"
            @click="switchView('grid')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-button-group>

        <!-- 批量操作 -->
        <el-dropdown v-if="batchActions.length > 0 && selectedRows.length > 0" @command="handleBatchAction">
          <el-button>
            批量操作 ({{ selectedRows.length }})
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="action in batchActions"
                :key="action.command"
                :command="action.command"
                :icon="action.icon"
              >
                {{ action.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 自定义操作按钮 -->
        <slot name="actions"></slot>

        <!-- 创建按钮 -->
        <el-button
          v-if="creatable"
          type="primary"
          @click="handleCreate"
        >
          <el-icon><Plus /></el-icon>
          {{ createButtonText }}
        </el-button>

        <!-- 刷新按钮 -->
        <el-button
          v-if="refreshable"
          :loading="loading"
          @click="handleRefresh"
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 表格视图 -->
    <el-table
      v-if="currentView === 'table'"
      ref="tableRef"
      :data="tableData"
      :loading="loading"
      v-bind="tableProps"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      class="crud-table-view"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        :selectable="selectableFunc"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        :index="indexMethod"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        v-bind="column"
      >
        <template #default="{ row, $index }">
          <slot
            :name="`column-${column.prop}`"
            :row="row"
            :column="column"
            :index="$index"
          >
            {{ row[column.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionsWidth"
        :fixed="actionsFixed"
      >
        <template #default="{ row, $index }">
          <slot name="row-actions" :row="row" :index="$index">
            <el-button
              v-if="editable"
              link
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="deletable"
              link
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 网格视图 -->
    <div v-else-if="currentView === 'grid'" class="crud-grid-view" v-loading="loading">
      <div class="grid-container">
        <div
          v-for="(item, index) in tableData"
          :key="item.id || index"
          class="grid-item"
          :class="{ selected: isSelected(item) }"
          @click="handleGridItemClick(item)"
        >
          <slot name="grid-item" :item="item" :index="index">
            <div class="grid-item-content">
              <div class="grid-item-title">{{ item.name || item.title }}</div>
              <div class="grid-item-actions">
                <el-button link type="primary" @click.stop="handleEdit(item)">编辑</el-button>
                <el-button link type="danger" @click.stop="handleDelete(item)">删除</el-button>
              </div>
            </div>
          </slot>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="tableData.length === 0" :description="emptyText" />
    </div>

    <!-- 分页 -->
    <div class="crud-pagination" v-if="pageable && tableData.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="internalPageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Search,
  List,
  Grid,
  Plus,
  Refresh,
  ArrowDown
} from '@element-plus/icons-vue'

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

// 方法
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

const handleBatchAction = (command) => {
  emit('batch-action', command, selectedRows.value)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

const handleSortChange = (sortInfo) => {
  emit('sort-change', sortInfo)
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSizeChange = (size) => {
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

<style scoped lang="scss">
.crud-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.crud-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .toolbar-left,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search-input {
    width: 300px;
  }
}

.crud-table-view {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.crud-grid-view {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  overflow-y: auto;

  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .grid-item {
    padding: 16px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    }

    &.selected {
      border-color: #409eff;
      background: #ecf5ff;
    }
  }

  .grid-item-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .grid-item-title {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }

  .grid-item-actions {
    display: flex;
    gap: 8px;
  }
}

.crud-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
