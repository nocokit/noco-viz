<template>
  <a-space direction="vertical" :size="16" :style="{ width: '100%' }">
    <!-- 页面头部 -->
    <PageHeader
      v-if="showHeader"
      :title="title"
      :description="description"
      :actions="headerActions"
    />

    <!-- CRUD 表格 -->
    <CrudTable
      ref="crudTableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page-size="pageSize"
      :view-mode="viewMode"
      :searchable="searchable"
      :search-placeholder="searchPlaceholder"
      :selectable="selectable"
      :show-index="showIndex"
      :show-actions="showActions"
      :actions-width="actionsWidth"
      :creatable="creatable"
      :editable="editable"
      :deletable="deletable"
      :refreshable="refreshable"
      :create-button-text="createButtonText"
      :batch-actions="batchActions"
      :pageable="pageable"
      :empty-text="emptyText"
      :table-props="tableProps"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
      @batch-action="handleBatchAction"
      @refresh="loadData"
      @search="handleSearch"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 透传所有插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </CrudTable>

    <!-- 创建/编辑对话框 -->
    <a-modal
      v-model:open="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :mask-closable="false"
      @cancel="handleDialogClose"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <slot name="form" :form-data="formData" :is-edit="isEdit">
          <!-- 默认表单字段 -->
          <a-form-item
            v-for="field in formFields"
            :key="field.prop"
            :label="field.label"
            :name="field.prop"
          >
            <!-- 输入框 -->
            <a-input
              v-if="!field.type || field.type === 'input'"
              v-model:value="formData[field.prop]"
              :placeholder="field.placeholder"
              :maxlength="field.maxlength"
              :show-count="field.showWordLimit"
            />

            <!-- 文本域 -->
            <a-textarea
              v-else-if="field.type === 'textarea'"
              v-model:value="formData[field.prop]"
              :rows="field.rows || 4"
              :placeholder="field.placeholder"
              :maxlength="field.maxlength"
              :show-count="field.showWordLimit"
            />

            <!-- 选择器 -->
            <a-select
              v-else-if="field.type === 'select'"
              v-model:value="formData[field.prop]"
              :placeholder="field.placeholder"
              :mode="field.multiple ? 'multiple' : undefined"
              :allow-clear="field.clearable"
            >
              <a-select-option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>

            <!-- 日期选择器 -->
            <a-date-picker
              v-else-if="field.type === 'date'"
              v-model:value="formData[field.prop]"
              :show-time="field.dateType === 'datetime'"
              :placeholder="field.placeholder"
              :style="{ width: '100%' }"
            />

            <!-- 数字输入框 -->
            <a-input-number
              v-else-if="field.type === 'number'"
              v-model:value="formData[field.prop]"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :style="{ width: '100%' }"
            />

            <!-- 开关 -->
            <a-switch
              v-else-if="field.type === 'switch'"
              v-model:checked="formData[field.prop]"
            />
          </a-form-item>
        </slot>
      </a-form>

      <template #footer>
        <a-space>
          <a-button @click="dialogVisible = false">取消</a-button>
          <a-button type="primary" :loading="submitting" @click="handleSubmit">
            {{ isEdit ? '保存' : '创建' }}
          </a-button>
        </a-space>
      </template>
    </a-modal>
  </a-space>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import CrudTable from './CrudTable.vue'
import PageHeader from '../PageHeader.vue'

const props = defineProps({
  // 页面配置
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },

  // API 配置
  api: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.list && value.create && value.update && value.delete
    }
  },

  // 表格配置
  columns: {
    type: Array,
    required: true
  },
  viewMode: {
    type: String,
    default: 'table'
  },
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  selectable: {
    type: Boolean,
    default: false
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  actionsWidth: {
    type: [String, Number],
    default: 150
  },
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
  batchActions: {
    type: Array,
    default: () => []
  },
  pageable: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  tableProps: {
    type: Object,
    default: () => ({})
  },

  // 表单配置
  formFields: {
    type: Array,
    default: () => []
  },
  formRules: {
    type: Object,
    default: () => ({})
  },
  dialogWidth: {
    type: String,
    default: '600px'
  },
  createTitle: {
    type: String,
    default: '新建'
  },
  editTitle: {
    type: String,
    default: '编辑'
  },

  // 数据转换
  transformRequest: {
    type: Function,
    default: null
  },
  transformResponse: {
    type: Function,
    default: null
  },

  // 自动加载
  autoLoad: {
    type: Boolean,
    default: true
  },

  // 删除确认
  deleteConfirm: {
    type: Boolean,
    default: true
  },
  deleteConfirmMessage: {
    type: Function,
    default: (row) => `确定要删除 "${row.name || row.title || '该项'}" 吗？`
  }
})

const emit = defineEmits([
  'before-create',
  'after-create',
  'before-edit',
  'after-edit',
  'before-delete',
  'after-delete',
  'before-load',
  'after-load',
  'selection-change',
  'sort-change'
])

// 状态
const crudTableRef = ref(null)
const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const currentPageSize = ref(props.pageSize)
const searchQuery = ref('')
const sortInfo = ref(null)
const formData = ref({})
const editingRow = ref(null)

// 计算属性
const dialogTitle = computed(() => {
  return isEdit.value ? props.editTitle : props.createTitle
})

const headerActions = computed(() => {
  const actions = []
  if (props.creatable) {
    actions.push({
      text: props.createButtonText,
      icon: 'Plus',
      type: 'primary',
      handler: handleCreate
    })
  }
  return actions
})

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    emit('before-load')

    const params = {
      page: currentPage.value,
      pageSize: currentPageSize.value
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (sortInfo.value) {
      params.sortBy = sortInfo.value.prop
      params.sortOrder = sortInfo.value.order
    }

    const response = await props.api.list(params)

    // 转换响应数据
    if (props.transformResponse) {
      const transformed = props.transformResponse(response)
      tableData.value = transformed.data || transformed
      total.value = transformed.total || tableData.value.length
    } else {
      tableData.value = response.data || response
      total.value = response.total || tableData.value.length
    }

    emit('after-load', tableData.value)
  } catch (error) {
    console.error('加载数据失败:', error)
    message.error(error.message || '加载数据失败')
  } finally {
    loading.value = false
  }
}

// 创建
const handleCreate = () => {
  isEdit.value = false
  editingRow.value = null
  formData.value = {}

  // 初始化表单默认值
  props.formFields.forEach(field => {
    if (field.defaultValue !== undefined) {
      formData.value[field.prop] = field.defaultValue
    }
  })

  emit('before-create', formData.value)
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  editingRow.value = row
  formData.value = { ...row }

  emit('before-edit', formData.value, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row) => {
  try {
    if (props.deleteConfirm) {
      await Modal.confirm({
        title: '删除确认',
        content: props.deleteConfirmMessage(row),
        okText: '删除',
        cancelText: '取消',
      })
    }

    emit('before-delete', row)

    await props.api.delete(row.id)

    message.success('删除成功')
    emit('after-delete', row)

    // 重新加载数据
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      message.error(error.message || '删除失败')
    }
  }
}

// 批量操作
const handleBatchAction = async (command, selectedRows) => {
  try {
    if (command === 'delete') {
      await Modal.confirm({
        title: '批量删除确认',
        content: `确定要删除选中的 ${selectedRows.length} 项吗？`,
        okText: '删除',
        cancelText: '取消',
      })

      const ids = selectedRows.map(row => row.id)

      if (props.api.batchDelete) {
        await props.api.batchDelete(ids)
      } else {
        // 逐个删除
        await Promise.all(ids.map(id => props.api.delete(id)))
      }

      message.success('批量删除成功')
      await loadData()
      crudTableRef.value?.clearSelection()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量操作失败:', error)
      message.error(error.message || '批量操作失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitting.value = true

    // 转换请求数据
    let requestData = { ...formData.value }
    if (props.transformRequest) {
      requestData = props.transformRequest(requestData, isEdit.value)
    }

    if (isEdit.value) {
      await props.api.update(editingRow.value.id, requestData)
      message.success('更新成功')
      emit('after-edit', requestData, editingRow.value)
    } else {
      await props.api.create(requestData)
      message.success('创建成功')
      emit('after-create', requestData)
    }

    dialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('提交失败:', error)
    if (error.message) {
      message.error(error.message)
    }
  } finally {
    submitting.value = false
  }
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.clearValidate()
  formData.value = {}
  editingRow.value = null
}

// 搜索
const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  loadData()
}

// 分页
const handlePageChange = (page) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size) => {
  currentPageSize.value = size
  currentPage.value = 1
  loadData()
}

// 选择变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 排序变化
const handleSortChange = (sort) => {
  sortInfo.value = sort
  loadData()
  emit('sort-change', sort)
}

// 刷新
const refresh = () => {
  loadData()
}

// 清空选择
const clearSelection = () => {
  crudTableRef.value?.clearSelection()
}

// 组件挂载
onMounted(() => {
  if (props.autoLoad) {
    loadData()
  }
})

// 暴露方法
defineExpose({
  loadData,
  refresh,
  clearSelection,
  crudTableRef,
  formRef
})
</script>

