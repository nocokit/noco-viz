<template>
  <div class="excel-detail">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="breadcrumb">
        <div class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>数据连接</span>
        </div>
        <span style="color:#666">/</span>
        <span class="current">{{ fileName }}</span>
      </div>
      <div class="actions">
        <button class="btn" @click="resetChanges">
          <el-icon><RefreshLeft /></el-icon>
          重置更改
        </button>
        <button class="btn btn-primary" @click="reuploadFile">
          <el-icon><Upload /></el-icon>
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
          <el-icon style="margin-left:auto; cursor:pointer;" @click="addField">
            <Plus />
          </el-icon>
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
            <el-icon class="field-edit-icon" @click="editField(index)">
              <Edit />
            </el-icon>
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
    <el-dialog
      v-model="editDialogVisible"
      title="编辑字段"
      width="500px"
    >
      <el-form :model="editingField" label-position="top">
        <el-form-item label="字段名称">
          <el-input v-model="editingField.label" placeholder="显示名称" />
        </el-form-item>
        <el-form-item label="字段标识">
          <el-input v-model="editingField.key" placeholder="字段key" />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="editingField.type" style="width: 100%;">
            <el-option label="字符串" value="str" />
            <el-option label="数值" value="num" />
            <el-option label="日期" value="date" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFieldEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, RefreshLeft, Upload, Plus, Edit } from '@element-plus/icons-vue'

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
  ElMessage.success(`已切换为 ${getTypeLabel(types[nextIndex])}`)
}

const editField = (index) => {
  editingIndex.value = index
  editingField.value = { ...fields.value[index] }
  editDialogVisible.value = true
}

const saveFieldEdit = () => {
  if (editingIndex.value >= 0) {
    fields.value[editingIndex.value] = { ...editingField.value }
    ElMessage.success('字段已更新')
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
  ElMessage.info('已重置所有更改')
}

const reuploadFile = () => {
  ElMessage.info('打开文件上传对话框')
}

const saveConfig = () => {
  ElMessage.success('配置已保存')
}
</script>

<style scoped>
/* --- 全局变量：保持 DataV 风格 --- */
.excel-detail {
  --bg-body: #101216;
  --bg-panel: #171b22;
  --bg-header: #1e2229;
  --border-color: #303640;
  --theme-cyan: #26d0ff;
  --theme-blue: #007aff;
  --text-main: #a1aeb3;
  --text-value: #ffffff;
  --bg-table-head: #262a30;
  --bg-table-row: #171b22;
  --bg-table-hover: #2b313a;

  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-body);
  color: var(--text-main);
}

/* --- 顶部导航栏 --- */
.header {
  height: 50px;
  background-color: var(--bg-header);
  border-bottom: 1px solid #000;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  flex-shrink: 0;
}

.breadcrumb {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb .current {
  color: var(--text-value);
  font-weight: bold;
}

.back-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-main);
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--theme-cyan);
}

.actions {
  display: flex;
  gap: 10px;
}

/* 按钮样式 */
.btn {
  height: 28px;
  padding: 0 12px;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn:hover {
  border-color: var(--theme-cyan);
  color: var(--theme-cyan);
}

.btn-primary {
  background: rgba(38, 208, 255, 0.1);
  border-color: var(--theme-cyan);
  color: var(--theme-cyan);
}

.btn-primary:hover {
  background: rgba(38, 208, 255, 0.2);
  box-shadow: 0 0 10px rgba(38, 208, 255, 0.2);
}

.btn-save {
  background: var(--theme-cyan);
  color: #000;
  border-color: var(--theme-cyan);
  font-weight: 600;
}

.btn-save:hover {
  background: #40dcff;
  box-shadow: 0 0 12px rgba(38, 208, 255, 0.4);
}

/* --- 主内容区 --- */
.main-container {
  flex: 1;
  display: flex;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

/* --- 左侧：字段配置 --- */
.schema-panel {
  width: 280px;
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-title {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: bold;
  color: var(--text-value);
  background: rgba(255, 255, 255, 0.02);
}

.field-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.field-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  transition: all 0.2s;
}

.field-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #444;
}

/* 字段类型图标 */
.type-badge {
  width: 36px;
  height: 20px;
  background: #333;
  color: #ccc;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  margin-right: 10px;
  font-family: 'SF Mono', Monaco, monospace;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.type-badge:hover {
  transform: scale(1.1);
}

.type-badge.num {
  color: #40c4ff;
  border: 1px solid rgba(64, 196, 255, 0.3);
  background: rgba(64, 196, 255, 0.1);
}

.type-badge.str {
  color: #69f0ae;
  border: 1px solid rgba(105, 240, 174, 0.3);
  background: rgba(105, 240, 174, 0.1);
}

.type-badge.date {
  color: #ffd740;
  border: 1px solid rgba(255, 215, 64, 0.3);
  background: rgba(255, 215, 64, 0.1);
}

.field-name {
  flex: 1;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-edit-icon {
  width: 14px;
  height: 14px;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color: #999;
}

.field-item:hover .field-edit-icon {
  opacity: 0.7;
}

.field-edit-icon:hover {
  opacity: 1 !important;
  color: var(--theme-cyan);
}

/* --- 右侧：数据预览 --- */
.data-panel {
  flex: 1;
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.data-info-bar {
  height: 36px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 16px;
  font-size: 12px;
  flex-shrink: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item span {
  color: var(--text-value);
  font-family: 'SF Mono', Monaco, monospace;
}

/* 表格容器 */
.grid-container {
  flex: 1;
  overflow: auto;
  position: relative;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  font-size: 12px;
}

th {
  background-color: var(--bg-table-head);
  color: var(--text-value);
  position: sticky;
  top: 0;
  padding: 8px 12px;
  text-align: left;
  font-weight: normal;
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  white-space: nowrap;
  z-index: 10;
}

td {
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  padding: 6px 12px;
  color: var(--text-main);
  white-space: nowrap;
  background: var(--bg-table-row);
  cursor: cell;
}

tr:hover td {
  background-color: var(--bg-table-hover);
}

/* 选中单元格效果 */
td:focus {
  outline: 2px solid var(--theme-cyan);
  background-color: rgba(38, 208, 255, 0.05);
  color: #fff;
  position: relative;
  z-index: 5;
}

/* 滚动条 */
.field-list::-webkit-scrollbar,
.grid-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.field-list::-webkit-scrollbar-thumb,
.grid-container::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.field-list::-webkit-scrollbar-corner,
.grid-container::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
