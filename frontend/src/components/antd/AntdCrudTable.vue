<template>
  <div class="antd-crud-table">
    <!-- 搜索表单区域 -->
    <a-card class="search-card" :bordered="false">
      <a-form
        :model="searchForm"
        layout="inline"
        @finish="handleSearch"
      >
        <a-row :gutter="16" style="width: 100%">
          <!-- 搜索表单插槽 -->
          <slot name="search-form" :form="searchForm">
            <a-col :span="6">
              <a-form-item label="关键词" name="keyword">
                <a-input
                  v-model:value="searchForm.keyword"
                  placeholder="请输入关键词"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </slot>

          <!-- 操作按钮 -->
          <a-col :span="6" style="text-align: right; margin-left: auto">
            <a-space>
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" html-type="submit">
                <template #icon><SearchOutlined /></template>
                查询
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 表格工具栏 -->
    <a-card class="table-card" :bordered="false">
      <div class="table-toolbar">
        <div class="toolbar-left">
          <slot name="toolbar-left">
            <a-space>
              <a-button
                v-if="creatable"
                type="primary"
                @click="handleCreate"
              >
                <template #icon><PlusOutlined /></template>
                {{ createButtonText }}
              </a-button>
              <slot name="toolbar-actions"></slot>
            </a-space>
          </slot>
        </div>

        <div class="toolbar-right">
          <a-space>
            <slot name="toolbar-right"></slot>
            <a-tooltip title="刷新">
              <a-button @click="handleRefresh">
                <template #icon><ReloadOutlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="列设置">
              <a-dropdown>
                <a-button>
                  <template #icon><SettingOutlined /></template>
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="col in allColumns"
                      :key="col.dataIndex"
                    >
                      <a-checkbox
                        v-model:checked="col.visible"
                        @change="handleColumnVisibleChange"
                      >
                        {{ col.title }}
                      </a-checkbox>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-tooltip>
          </a-space>
        </div>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="visibleColumns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="paginationConfig"
        :row-selection="rowSelection"
        :scroll="scroll"
        :row-key="rowKey"
        @change="handleTableChange"
        class="antd-table"
      >
        <!-- 自定义列插槽 -->
        <template
          v-for="col in visibleColumns"
          :key="col.dataIndex"
          #[`bodyCell`]="{ column, record, index }"
        >
          <slot
            v-if="column.dataIndex !== 'action'"
            :name="`column-${column.dataIndex}`"
            :record="record"
            :column="column"
            :index="index"
          >
            {{ record[column.dataIndex] }}
          </slot>

          <!-- 操作列 -->
          <template v-if="column.dataIndex === 'action'">
            <slot name="action" :record="record" :index="index">
              <a-space>
                <a-button
                  v-if="editable"
                  type="link"
                  size="small"
                  @click="handleEdit(record)"
                >
                  编辑
                </a-button>
                <a-popconfirm
                  v-if="deletable"
                  title="确定要删除吗？"
                  @confirm="handleDelete(record)"
                >
                  <a-button type="link" size="small" danger>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </slot>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  // 数据源
  dataSource: {
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
  // 行键
  rowKey: {
    type: [String, Function],
    default: 'id'
  },
  // 分页配置
  pagination: {
    type: [Object, Boolean],
    default: () => ({
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条`
    })
  },
  // 滚动配置
  scroll: {
    type: Object,
    default: () => ({ x: 'max-content' })
  },
  // 是否可选择
  selectable: {
    type: Boolean,
    default: false
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
  createButtonText: {
    type: String,
    default: '新建'
  },
  // 初始搜索表单
  initialSearchForm: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits([
  'search',
  'reset',
  'create',
  'edit',
  'delete',
  'refresh',
  'selection-change',
  'page-change',
  'size-change'
])

// 搜索表单
const searchForm = reactive({ ...props.initialSearchForm })

// 选中的行
const selectedRowKeys = ref([])
const selectedRows = ref([])

// 列配置（包含可见性控制）
const allColumns = ref(
  props.columns.map(col => ({
    ...col,
    visible: col.visible !== false
  }))
)

// 可见列
const visibleColumns = computed(() => {
  const cols = allColumns.value.filter(col => col.visible)

  // 如果有操作列，添加操作列
  if (props.editable || props.deletable) {
    cols.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      visible: true
    })
  }

  return cols
})

// 分页配置
const paginationConfig = computed(() => {
  if (props.pagination === false) return false

  return {
    ...props.pagination,
    onChange: (page, pageSize) => {
      emit('page-change', page, pageSize)
    },
    onShowSizeChange: (current, size) => {
      emit('size-change', current, size)
    }
  }
})

// 行选择配置
const rowSelection = computed(() => {
  if (!props.selectable) return null

  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys, rows) => {
      selectedRowKeys.value = keys
      selectedRows.value = rows
      emit('selection-change', keys, rows)
    }
  }
})

// 搜索
const handleSearch = () => {
  emit('search', { ...searchForm })
}

// 重置
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = undefined
  })
  emit('reset')
  handleSearch()
}

// 创建
const handleCreate = () => {
  emit('create')
}

// 编辑
const handleEdit = (record) => {
  emit('edit', record)
}

// 删除
const handleDelete = (record) => {
  emit('delete', record)
}

// 刷新
const handleRefresh = () => {
  emit('refresh')
}

// 表格变化
const handleTableChange = (pagination, filters, sorter) => {
  emit('page-change', pagination.current, pagination.pageSize)
}

// 列可见性变化
const handleColumnVisibleChange = () => {
  // 触发重新渲染
}

// 监听 columns 变化
watch(() => props.columns, (newColumns) => {
  allColumns.value = newColumns.map(col => ({
    ...col,
    visible: col.visible !== false
  }))
}, { deep: true })

// 暴露方法
defineExpose({
  searchForm,
  selectedRowKeys,
  selectedRows,
  clearSelection: () => {
    selectedRowKeys.value = []
    selectedRows.value = []
  }
})
</script>

