<template>
  <div class="simple-crud-modal">
    <!-- CRUD 列表 -->
    <SimpleCrud
      :config="config.table"
      :data="data"
      :loading="loading"
      :show-search="config.showSearch !== false"
      :pagination="pagination"
      :sort="sort"
      @action="handleAction"
      @row-action="handleRowAction"
      @refresh="$emit('refresh')"
      @page-change="$emit('page-change', $event)"
      @page-size-change="$emit('page-size-change', $event)"
      @sort-change="$emit('sort-change', $event)"
    >
      <!-- 透传所有插槽 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps"></slot>
      </template>
    </SimpleCrud>

    <!-- 新增/编辑模态框 -->
    <CommonModal
      v-model:visible="modalVisible"
      :title="isEditing ? modalConfig.editTitle : modalConfig.addTitle"
      :width="modalConfig.width"
      :show-footer="true"
      @close="handleCloseModal"
    >
      <SimpleForm
        ref="formRef"
        :modelValue="formData"
        @update:modelValue="handleFormUpdate"
        :config="config.form"
      />

      <template #footer>
        <button class="btn" @click="handleCloseModal">
          {{ modalConfig.cancelText }}
        </button>
        <button
          class="btn btn-primary"
          @click="handleSubmit"
          :disabled="submitting"
        >
          {{ submitting ? modalConfig.submittingText :
             (isEditing ? modalConfig.editSubmitText : modalConfig.addSubmitText) }}
        </button>
      </template>
    </CommonModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import SimpleCrud from './SimpleCrud.vue'
import SimpleForm from './SimpleForm.vue'
import CommonModal from '@/components/CommonModal.vue'

const props = defineProps({
  // 配置对象
  config: {
    type: Object,
    required: true,
    // 配置示例：
    // {
    //   showSearch: false,  // 是否显示搜索
    //   table: {  // SimpleCrud 配置
    //     rowKey: 'id',
    //     emptyText: '暂无数据',
    //     actions: [{ key: 'add', label: '添加', type: 'primary', icon: 'plus' }],
    //     columns: [...]
    //   },
    //   form: {  // SimpleForm 配置
    //     fields: [...]
    //   },
    //   modal: {  // Modal 配置
    //     addTitle: '添加',
    //     editTitle: '编辑',
    //     width: '520px',
    //     cancelText: '取消',
    //     addSubmitText: '确认添加',
    //     editSubmitText: '保存修改',
    //     submittingText: '保存中...'
    //   }
    // }
  },
  // 数据源
  data: {
    type: Array,
    default: () => []
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

const emit = defineEmits([
  'add',      // 添加事件 (formData)
  'edit',     // 编辑事件 (formData, editingItem)
  'delete',   // 删除事件 (item)
  'refresh',  // 刷新事件
  'page-change',      // 页码变化
  'page-size-change', // 每页条数变化
  'sort-change'       // 排序变化
])

// 状态
const modalVisible = ref(false)
const submitting = ref(false)
const editingItem = ref(null)
const formRef = ref(null)

// 表单数据
const formData = reactive({})

// 是否编辑模式
const isEditing = computed(() => !!editingItem.value)

// 模态框配置（支持简化配置）
const modalConfig = computed(() => {
  const modal = props.config.modal || {}

  // 如果提供了 title，自动生成 addTitle 和 editTitle
  if (modal.title) {
    return {
      addTitle: modal.addTitle || `添加${modal.title}`,
      editTitle: modal.editTitle || `编辑${modal.title}`,
      width: modal.width || '520px',
      cancelText: modal.cancelText || '取消',
      addSubmitText: modal.addSubmitText || '确定',
      editSubmitText: modal.editSubmitText || '确定',
      submittingText: modal.submittingText || '保存中...'
    }
  }

  // 兼容旧的完整配置
  return {
    addTitle: modal.addTitle || '添加',
    editTitle: modal.editTitle || '编辑',
    width: modal.width || '520px',
    cancelText: modal.cancelText || '取消',
    addSubmitText: modal.addSubmitText || '确认添加',
    editSubmitText: modal.editSubmitText || '保存修改',
    submittingText: modal.submittingText || '保存中...'
  }
})

// 初始化表单数据
const initFormData = () => {
  const fields = props.config.form.fields || []
  fields.forEach(field => {
    formData[field.key] = ''
  })
}

// 初始化
initFormData()

// 处理表单更新
const handleFormUpdate = (newData) => {
  Object.assign(formData, newData)
}

// 处理工具栏操作
const handleAction = (actionKey) => {
  if (actionKey === 'add') {
    openModal()
  }
}

// 处理行操作
const handleRowAction = (actionKey, row) => {
  if (actionKey === 'edit') {
    openModal(row)
  } else if (actionKey === 'delete') {
    emit('delete', row)
  }
}

// 打开模态框
const openModal = (item = null) => {
  editingItem.value = item

  // 填充表单数据
  const fields = props.config.form.fields || []
  if (item) {
    fields.forEach(field => {
      formData[field.key] = item[field.key] || ''
    })
  } else {
    fields.forEach(field => {
      formData[field.key] = ''
    })
  }

  modalVisible.value = true

  // 清除表单错误
  setTimeout(() => {
    formRef.value?.clearErrors()
  }, 0)
}

// 关闭模态框
const handleCloseModal = () => {
  modalVisible.value = false
  editingItem.value = null

  // 重置表单数据
  const fields = props.config.form.fields || []
  fields.forEach(field => {
    formData[field.key] = ''
  })

  formRef.value?.clearErrors()
}

// 提交表单
const handleSubmit = async () => {
  // 验证表单
  if (!formRef.value?.validate()) {
    return
  }

  submitting.value = true

  try {
    // 复制表单数据
    const data = { ...formData }

    // 触发事件
    if (isEditing.value) {
      emit('edit', data, editingItem.value)
    } else {
      emit('add', data)
    }

    // 等待一小段时间让父组件处理完成
    await new Promise(resolve => setTimeout(resolve, 300))

    // 成功后关闭模态框
    handleCloseModal()
  } catch (err) {
    // 如果有错误，不关闭模态框
    console.error('提交失败:', err)
  } finally {
    submitting.value = false
  }
}

// 暴露方法
defineExpose({
  openModal,
  closeModal: handleCloseModal
})
</script>

<style scoped>
.simple-crud-modal {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Button Styles */
.btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  transition: 0.2s;
}

.btn:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.btn-primary {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
