<template>
  <div class="excel-detail">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="breadcrumb">
        <div class="back-btn" @click="goBack">
          <ArrowLeftOutlined />
          <span>数据连接</span>
        </div>
        <span style="color:#666">/</span>
        <span class="current">{{ fileName }}</span>
      </div>
      <div class="actions">
        <button class="btn" @click="resetChanges">
          <ReloadOutlined />
          重置更改
        </button>
        <button class="btn btn-primary" @click="reuploadFile">
          <UploadOutlined />
          重新上传(更新)
        </button>
        <button class="btn btn-save" @click="saveConfig">
          保存配置
        </button>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="main-container">
      <!-- 左侧：字段配置 -->
      <div class="schema-panel">
        <div class="panel-title">
          字段配置 ({{ fields.length }})
          <PlusOutlined style="margin-left:auto; cursor:pointer;" @click="addField" />
        </div>
        <div class="field-list">
          <div
            v-for="(field, index) in fields"
            :key="index"
            class="field-item"
          >
            <div
              class="type-badge"
              :class="field.type"
              :title="`点击切换类型: ${getTypeLabel(field.type)}`"
              @click="toggleFieldType(index)"
            >
              {{ getTypeBadge(field.type) }}
            </div>
            <div class="field-name">{{ field.label }} ({{ field.key }})</div>
            <EditOutlined class="field-edit-icon" @click="editField(index)" />
          </div>
        </div>
      </div>

      <!-- 右侧：数据网格 -->
      <div class="data-panel">
        <div class="data-info-bar">
          <div class="info-item" style="color:#40c4ff;">● 解析成功</div>
          <div class="info-item">总行数: <span>{{ totalRows.toLocaleString() }}</span></div>
          <div class="info-item">文件大小: <span>{{ fileSize }}</span></div>
          <div class="info-item">更新时间: <span>{{ updateTime }}</span></div>

          <div style="margin-left:auto; display:flex; gap:10px;">
            <label style="display:flex; align-items:center; gap:4px; cursor:pointer;">
              <input
                v-model="useFirstRowAsHeader"
                type="checkbox"
                style="accent-color:#26d0ff;"
              >
              首行作为标题
            </label>
          </div>
        </div>

        <div class="grid-container">
          <table>
            <thead>
              <tr>
                <th style="width:50px; text-align:center;">#</th>
                <th v-for="field in fields" :key="field.key">
                  {{ field.key }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in previewData" :key="rowIndex">
                <td style="text-align:center; color:#666;">{{ rowIndex + 1 }}</td>
                <td
                  v-for="field in fields"
                  :key="field.key"
                  contenteditable="true"
                  :style="getCellStyle(field.type)"
                  @blur="updateCell(rowIndex, field.key, $event)"
                >
                  {{ row[field.key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 字段编辑对话框 -->
    <a-modal
      v-model:value="editDialogVisible"
      title="编辑字段"
      width="500px"
    >
      <a-form :model="editingField" label-position="top">
        <a-form-item label="字段名称">
          <a-input v-model:value="editingField.label" placeholder="显示名称" />
        </a-form-item>
        <a-form-item label="字段标识">
          <a-input v-model:value="editingField.key" placeholder="字段key" />
        </a-form-item>
        <a-form-item label="数据类型">
          <a-select v-model:value="editingField.type" style="width: 100%;">
            <a-select-option label="字符串" value="str" />
            <a-select-option label="数值" value="num" />
            <a-select-option label="日期" value="date" />
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-button @click="editDialogVisible = false">取消</a-button>
        <a-button type="primary" @click="saveFieldEdit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, ReloadOutlined, UploadOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 文件基础信息
const fileName = ref('2025Q1_销售报表.xlsx')
const totalRows = ref(12405)
const fileSize = ref('2.4 MB')
const updateTime = ref('2025-12-10 14:30')
const useFirstRowAsHeader = ref(true)

// 字段配置
const fields = ref([
  { key: 'city', label: '城市', type: 'str' },
  { key: 'product', label: '产品名称', type: 'str' },
  { key: 'sales', label: '销售额', type: 'num' },
  { key: 'profit', label: '利润', type: 'num' },
  { key: 'order_time', label: '下单时间', type: 'date' }
])

// 预览数据
const previewData = ref([
  {
    city: '上海',
    product: '机械键盘 Keychron',
    sales: 899.00,
    profit: 240.50,
    order_time: '2025-12-01'
  },
  {
    city: '北京',
    product: '显示器 Dell U2723',
    sales: 3499.00,
    profit: 500.00,
    order_time: '2025-12-02'
  },
  {
    city: '深圳',
    product: '人体工学椅 Herman Miller',
    sales: 12000.00,
    profit: 3000.00,
    order_time: '2025-12-02'
  },
  {
    city: '杭州',
    product: 'MacBook Pro M4',
    sales: 18999.00,
    profit: 2100.00,
    order_time: '2025-12-03'
  },
  {
    city: '广州',
    product: 'iPhone 17',
    sales: 7999.00,
    profit: 800.00,
    order_time: '2025-12-03'
  }
])

// 字段编辑
const editDialogVisible = ref(false)
const editingField = ref({})
const editingIndex = ref(-1)

const getTypeBadge = (type) => {
  const map = {
    str: 'Abc',
    num: '123',
    date: 'Date'
  }
  return map[type] || 'Abc'
}

const getTypeLabel = (type) => {
  const map = {
    str: '字符串',
    num: '数值',
    date: '日期'
  }
  return map[type] || '字符串'
}

const getCellStyle = (type) => {
  if (type === 'num') return { color: '#40c4ff' }
  if (type === 'date') return { color: '#ffd740' }
  return {}
}

const toggleFieldType = (index) => {
  const types = ['str', 'num', 'date']
  const currentType = fields.value[index].type
  const currentIndex = types.indexOf(currentType)
  const nextIndex = (currentIndex + 1) % types.length
  fields.value[index].type = types[nextIndex]
  message.success(`已切换为 ${getTypeLabel(types[nextIndex])}`)
}

const editField = (index) => {
  editingIndex.value = index
  editingField.value = { ...fields.value[index] }
  editDialogVisible.value = true
}

const saveFieldEdit = () => {
  if (editingIndex.value >= 0) {
    fields.value[editingIndex.value] = { ...editingField.value }
    message.success('字段已更新')
  }
  editDialogVisible.value = false
}

const addField = () => {
  editingIndex.value = -1
  editingField.value = { key: '', label: '', type: 'str' }
  editDialogVisible.value = true
}

const updateCell = (rowIndex, fieldKey, event) => {
  const newValue = event.target.innerText
  previewData.value[rowIndex][fieldKey] = newValue
}

const goBack = () => {
  router.push('/datasource')
}

const resetChanges = () => {
  message.info('已重置所有更改')
}

const reuploadFile = () => {
  message.info('打开文件上传对话框')
}

const saveConfig = () => {
  message.success('配置已保存')
}
</script>

