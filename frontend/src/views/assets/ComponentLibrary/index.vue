<template>
  <div class="component-library-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <h2>组件库</h2>
        <p class="subtitle">管理和使用自定义组件</p>
      </div>
      <div class="header-actions">
        <el-button @click="handleCreateComponent" type="primary">
          <el-icon><Plus /></el-icon>
          新建组件
        </el-button>
      </div>
    </header>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-box">
        <el-icon class="search-icon"><Search /></el-icon>
        <input
          type="text"
          class="search-input"
          placeholder="搜索组件名称或描述..."
          v-model="searchKeyword"
        />
      </div>
      <div class="toolbar-actions">
        <el-select v-model="filterCategory" placeholder="分类筛选" clearable style="width: 150px; margin-right: 12px;">
          <el-option
            v-for="cat in categories"
            :key="cat.category"
            :label="`${cat.category} (${cat.count})`"
            :value="cat.category"
          />
        </el-select>
        <el-select v-model="filterPublic" placeholder="可见性" clearable style="width: 120px; margin-right: 12px;">
          <el-option label="公开" :value="true" />
          <el-option label="私有" :value="false" />
        </el-select>
        <el-button @click="handleRefresh" :loading="loading">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th width="25%">组件名称</th>
            <th width="12%">分类</th>
            <th width="10%">类型</th>
            <th width="10%" class="text-center">可见性</th>
            <th width="12%">创建者</th>
            <th width="15%">创建时间</th>
            <th width="16%" class="text-center">操作</th>
          </tr>
        </thead>
        <tbody v-if="!loading && filteredComponents.length > 0">
          <tr v-for="component in filteredComponents" :key="component.id">
            <td>
              <div class="component-name-cell">
                <div class="component-name">{{ component.name }}</div>
                <div class="component-desc">{{ component.description }}</div>
              </div>
            </td>
            <td>
              <el-tag size="small">{{ component.category }}</el-tag>
            </td>
            <td>
              <span class="type-text">{{ component.type }}</span>
            </td>
            <td class="text-center">
              <el-tag :type="component.isPublic ? 'success' : 'info'" size="small">
                {{ component.isPublic ? '公开' : '私有' }}
              </el-tag>
            </td>
            <td>
              <span class="creator-text">{{ component.creatorName || '-' }}</span>
            </td>
            <td>
              <span class="time-text">{{ formatDate(component.createdAt) }}</span>
            </td>
            <td class="text-center">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(component)">
                  查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleEdit(component)">
                  编辑
                </el-button>
                <el-button link type="primary" size="small" @click="handleDownload(component)">
                  下载
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(component)">
                  删除
                </el-button>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="!loading && filteredComponents.length === 0">
          <tr>
            <td colspan="7" class="empty-state">
              <el-empty description="暂无组件数据" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="7" class="loading-state">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>加载中...</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="组件名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="formData.category" placeholder="请输入分类，如：数据展示" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="formData.type" placeholder="请输入类型，如：chart" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入组件描述"
          />
        </el-form-item>
        <el-form-item label="可见性" prop="isPublic">
          <el-switch
            v-model="formData.isPublic"
            active-text="公开"
            inactive-text="私有"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="formData.tags"
            multiple
            filterable
            allow-create
            placeholder="请输入标签"
            style="width: 100%"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="formData.version" placeholder="如：1.0.0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- View Dialog -->
    <el-dialog
      v-model="viewDialogVisible"
      title="组件详情"
      width="700px"
    >
      <div v-if="currentComponent" class="component-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="组件名称">{{ currentComponent.name }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ currentComponent.category }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ currentComponent.type }}</el-descriptions-item>
          <el-descriptions-item label="版本">{{ currentComponent.version }}</el-descriptions-item>
          <el-descriptions-item label="可见性">
            <el-tag :type="currentComponent.isPublic ? 'success' : 'info'" size="small">
              {{ currentComponent.isPublic ? '公开' : '私有' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建者" :span="2">{{ currentComponent.creatorName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">
            {{ formatDate(currentComponent.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">
            {{ formatDate(currentComponent.updatedAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ currentComponent.description || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">
            <el-tag
              v-for="tag in currentComponent.tags"
              :key="tag"
              size="small"
              style="margin-right: 8px"
            >
              {{ tag }}
            </el-tag>
            <span v-if="!currentComponent.tags || currentComponent.tags.length === 0">-</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleLike(currentComponent)">
          <el-icon><Star /></el-icon>
          点赞
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Download, Loading, Star } from '@element-plus/icons-vue'
import {
  getComponents,
  createComponent,
  updateComponent,
  deleteComponent,
  cloneComponent,
  incrementDownloads,
  toggleLike,
  getCategories,
  getStatistics
} from '@/api/component'

// 数据
const components = ref([])
const categories = ref([])
const statistics = ref({
  total: 0,
  publicCount: 0,
  privateCount: 0,
  totalDownloads: 0,
  totalLikes: 0
})
const loading = ref(false)
const submitting = ref(false)
const searchKeyword = ref('')
const filterCategory = ref('')
const filterPublic = ref(null)

// 对话框
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('新建组件')
const editingId = ref(null)
const currentComponent = ref(null)
const formRef = ref(null)

// 表单数据
const formData = ref({
  name: '',
  category: '',
  type: '',
  description: '',
  isPublic: false,
  tags: [],
  version: '1.0.0'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入组件名称', trigger: 'blur' },
    { max: 100, message: '名称不能超过100个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请输入分类', trigger: 'blur' },
    { max: 50, message: '分类不能超过50个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入类型', trigger: 'blur' },
    { max: 50, message: '类型不能超过50个字符', trigger: 'blur' }
  ]
}

// 计算属性
const filteredComponents = computed(() => {
  let result = components.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      item =>
        item.name.toLowerCase().includes(keyword) ||
        (item.description && item.description.toLowerCase().includes(keyword))
    )
  }

  if (filterCategory.value) {
    result = result.filter(item => item.category === filterCategory.value)
  }

  if (filterPublic.value !== null) {
    result = result.filter(item => item.isPublic === filterPublic.value)
  }

  return result
})

// 方法
const loadComponents = async () => {
  loading.value = true
  try {
    const res = await getComponents()
    components.value = res.data || []
  } catch (error) {
    ElMessage.error('加载组件列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res || []
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

const loadStatistics = async () => {
  try {
    const res = await getStatistics()
    statistics.value = res || {
      total: 0,
      publicCount: 0,
      privateCount: 0,
      totalDownloads: 0,
      totalLikes: 0
    }
  } catch (error) {
    console.error('加载统计信息失败', error)
  }
}

const handleRefresh = async () => {
  await Promise.all([loadComponents(), loadCategories(), loadStatistics()])
  ElMessage.success('刷新成功')
}

const handleCreateComponent = () => {
  dialogTitle.value = '新建组件'
  editingId.value = null
  formData.value = {
    name: '',
    category: '',
    type: '',
    description: '',
    isPublic: false,
    tags: [],
    version: '1.0.0'
  }
  dialogVisible.value = true
}

const handleEdit = (component) => {
  dialogTitle.value = '编辑组件'
  editingId.value = component.id
  formData.value = {
    name: component.name,
    category: component.category,
    type: component.type,
    description: component.description || '',
    isPublic: component.isPublic,
    tags: component.tags || [],
    version: component.version
  }
  dialogVisible.value = true
}

const handleView = (component) => {
  currentComponent.value = component
  viewDialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (editingId.value) {
        await updateComponent(editingId.value, formData.value)
        ElMessage.success('更新成功')
      } else {
        await createComponent(formData.value)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      await handleRefresh()
    } catch (error) {
      ElMessage.error(editingId.value ? '更新失败' : '创建失败')
      console.error(error)
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = async (component) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除组件 "${component.name}" 吗？`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )

    await deleteComponent(component.id)
    ElMessage.success('删除成功')
    await handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

const handleClone = async (component) => {
  try {
    const { value: newName } = await ElMessageBox.prompt(
      '请输入新组件名称',
      '克隆组件',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: `${component.name}-副本`,
        inputPattern: /.+/,
        inputErrorMessage: '请输入组件名称'
      }
    )

    await cloneComponent(component.id, newName)
    ElMessage.success('克隆成功')
    await handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('克隆失败')
      console.error(error)
    }
  }
}

const handleDownload = async (component) => {
  try {
    await incrementDownloads(component.id)
    ElMessage.success('下载成功')
    await loadComponents()
    await loadStatistics()
  } catch (error) {
    ElMessage.error('下载失败')
    console.error(error)
  }
}

const handleLike = async (component) => {
  try {
    await toggleLike(component.id, 'like')
    ElMessage.success('点赞成功')
    viewDialogVisible.value = false
    await handleRefresh()
  } catch (error) {
    ElMessage.error('点赞失败')
    console.error(error)
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生命周期
onMounted(async () => {
  await Promise.all([loadComponents(), loadCategories(), loadStatistics()])
})
</script>

<style scoped>
.component-library-page {
  --bg-body: #0a0b0d;
  --bg-card: #1c1d21;
  --bg-hover: #25262b;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
  --border: #2d2e33;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #6b7280;

  min-height: 100vh;
  background: var(--bg-body);
  color: var(--text-main);
  padding: 24px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-main);
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--primary);
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 16px;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 36px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-main);
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.toolbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Table */
.table-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: rgba(59, 130, 246, 0.1);
}

.data-table th {
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.data-table th.text-center {
  text-align: center;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}

.data-table tbody tr:hover {
  background: var(--bg-hover);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 14px 16px;
  font-size: 14px;
  color: var(--text-main);
}

.data-table td.text-center {
  text-align: center;
}

.component-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.component-name {
  font-weight: 500;
  color: var(--text-main);
}

.component-desc {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-text,
.creator-text,
.count-text {
  color: var(--text-secondary);
}

.time-text {
  font-size: 13px;
  color: var(--text-tertiary);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 20px !important;
  color: var(--text-secondary);
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Component Detail */
.component-detail {
  padding: 8px 0;
}
</style>
