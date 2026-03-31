<template>
  <a-modal
    v-model:open="visible"
    :title="`数据预览 - ${datasetName}`"
    width="90%"
    :style="{ top: '5vh' }"
    @cancel="handleClose"
  >
    <div class="preview-container">
      <!-- 工具栏 -->
      <div class="preview-toolbar">
        <div class="info">
          <span class="label">总行数:</span>
          <span class="value">{{ totalRows }}</span>
          <span class="label ml-20">列数:</span>
          <span class="value">{{ columns.length }}</span>
        </div>
        <div class="actions">
          <a-button size="small" @click="refreshData">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
          <a-button size="small" @click="exportData">
            <template #icon><DownloadOutlined /></template>
            导出
          </a-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-wrapper">
        <a-spin :spinning="loading">
          <a-table
            :dataSource="tableData"
            :columns="tableColumns"
            :scroll="{ y: 500 }"
            :pagination="false"
            bordered
            :rowKey="(record, index) => index"
          >
            <template #bodyCell="{ column, record }">
              <span :class="getCellClass(record[column.dataIndex])">
                {{ formatCellValue(record[column.dataIndex]) }}
              </span>
            </template>
          </a-table>
        </a-spin>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="totalRows"
          :pageSizeOptions="['50', '100', '200', '500']"
          :showSizeChanger="true"
          :showTotal="total => `共 ${total} 条`"
          @change="handlePageChange"
          @showSizeChange="handleSizeChange"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message, ElMessageBox } from '@/utils/ui'
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { previewDataset } from '@/api/dataset'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  datasetId: {
    type: [Number, String],
    default: null
  },
  datasetName: {
    type: String,
    default: '未命名数据集'
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const tableData = ref([])
const columns = ref([])
const currentPage = ref(1)
const pageSize = ref(100)
const totalRows = ref(0)

// 计算表格列配置
const tableColumns = computed(() => {
  const cols = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      align: 'center',
      customRender: ({ index }) => index + 1 + (currentPage.value - 1) * pageSize.value
    }
  ]

  columns.value.forEach(col => {
    cols.push({
      title: col.label,
      dataIndex: col.field,
      key: col.field,
      width: col.width || 150,
      ellipsis: true
    })
  })

  return cols
})

// 监听对话框打开，加载数据
watch(visible, (newVal) => {
  if (newVal && props.datasetId) {
    loadData()
  }
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await previewDataset(props.datasetId, {
      page: currentPage.value,
      pageSize: pageSize.value
    })

    if (response.code === 200) {
      const { data, columns: cols, total } = response.data

      // 设置列信息
      columns.value = cols.map(col => ({
        field: col.field || col.name,
        label: col.label || col.name,
        width: col.width || null
      }))

      // 设置表格数据
      tableData.value = data || []
      totalRows.value = total || 0
    } else {
      message.error(response.message || '加载数据失败')
    }
  } catch (error) {
    console.error('预览数据错误:', error)
    message.error('加载数据失败')

    // Mock数据用于演示（在后端未就绪时）
    mockData()
  } finally {
    loading.value = false
  }
}

// Mock数据（用于演示）
const mockData = () => {
  columns.value = [
    { field: 'id', label: 'ID', width: 80 },
    { field: 'name', label: '名称', width: 150 },
    { field: 'value', label: '数值', width: 120 },
    { field: 'status', label: '状态', width: 100 },
    { field: 'createTime', label: '创建时间', width: 180 }
  ]

  tableData.value = Array.from({ length: pageSize.value }, (_, i) => ({
    id: (currentPage.value - 1) * pageSize.value + i + 1,
    name: `数据项 ${(currentPage.value - 1) * pageSize.value + i + 1}`,
    value: Math.floor(Math.random() * 10000),
    status: Math.random() > 0.5 ? '正常' : '异常',
    createTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString()
  }))

  totalRows.value = 1000
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 导出数据
const exportData = async () => {
  try {
    const { value: format } = await ElMessageBox.prompt(
      '请选择导出格式',
      '导出数据',
      {
        confirmButtonText: '导出',
        cancelButtonText: '取消',
        inputType: 'select',
        inputOptions: [
          { label: 'CSV', value: 'csv' },
          { label: 'Excel', value: 'xlsx' },
          { label: 'JSON', value: 'json' }
        ],
        inputValue: 'csv'
      }
    )

    const loading = message.loading('正在导出数据...', 0)

    try {
      // 导入导出API
      const { exportDataset } = await import('@/api/dataset')

      const blob = await exportDataset(props.datasetId, format || 'csv')

      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dataset_${props.datasetId}_${Date.now()}.${format || 'csv'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      loading()
      message.success('数据导出成功！')
    } catch (error) {
      loading()
      console.error('导出数据失败:', error)
      message.error('导出数据失败')
    }
  } catch (error) {
    // 用户取消操作
    if (error !== 'cancel') {
      console.error('操作失败:', error)
    }
  }
}

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadData()
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  // 重置数据
  tableData.value = []
  columns.value = []
  currentPage.value = 1
  totalRows.value = 0
}

// 格式化单元格值
const formatCellValue = (value) => {
  if (value === null || value === undefined) {
    return '-'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return value
}

// 获取单元格样式类
const getCellClass = (value) => {
  if (value === null || value === undefined) {
    return 'cell-null'
  }
  if (typeof value === 'number') {
    return 'cell-number'
  }
  return ''
}
</script>

