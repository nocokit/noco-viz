<template>
  <el-dialog
    v-model="visible"
    :title="`数据预览 - ${datasetName}`"
    width="90%"
    top="5vh"
    @close="handleClose"
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
          <el-button size="small" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button size="small" @click="exportData">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div v-loading="loading" class="table-wrapper">
        <el-table
          :data="tableData"
          border
          stripe
          height="500"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column
            v-for="col in columns"
            :key="col.field"
            :prop="col.field"
            :label="col.label"
            :width="col.width || 150"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span :class="getCellClass(row[col.field])">
                {{ formatCellValue(row[col.field]) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[50, 100, 200, 500]"
          :total="totalRows"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Download } from '@element-plus/icons-vue'
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
      ElMessage.error(response.message || '加载数据失败')
    }
  } catch (error) {
    console.error('预览数据错误:', error)
    ElMessage.error('加载数据失败')

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
const exportData = () => {
  ElMessage.info('导出功能开发中...')
  // TODO: 实现数据导出功能
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

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.ml-20 {
  margin-left: 20px;
}

.actions {
  display: flex;
  gap: 8px;
}

.table-wrapper {
  flex: 1;
  min-height: 500px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.cell-null {
  color: #909399;
  font-style: italic;
}

.cell-number {
  color: #409eff;
  font-weight: 500;
}
</style>
