<template>
  <div class="page-container component-library-page">
    <!-- Header -->
    <PageHeader
      title="自定义组件库"
      description="管理和使用自定义组件"
      :actions="[
        { text: '新建组件', icon: 'Plus', type: 'primary', handler: handleCreateComponent }
      ]"
    />

    <!-- Toolbar -->
    <Toolbar
      v-model:search-value="searchKeyword"
      search-placeholder="搜索组件名称或描述..."
      :refresh-loading="loading"
      @refresh="handleRefresh"
    >
      <template #filters>
        <el-select v-model="filterCategory" placeholder="分类筛选" clearable style="width: 150px;">
          <el-option
            v-for="cat in categories"
            :key="cat.category"
            :label="`${cat.category} (${cat.count})`"
            :value="cat.category"
          />
        </el-select>
        <el-select v-model="filterPublic" placeholder="可见性" clearable style="width: 120px;">
          <el-option label="公开" :value="true" />
          <el-option label="私有" :value="false" />
        </el-select>
      </template>
    </Toolbar>

    <!-- Table -->
    <DataTable
      :data="filteredComponents"
      :columns="tableColumns"
      :loading="loading"
      variant="default"
      empty-text="暂无组件数据"
    >
      <!-- 组件名称列 -->
      <template #name="{ row }">
        <div class="component-name-cell">
          <div class="component-name">{{ row.name }}</div>
          <div class="component-desc">{{ row.description }}</div>
        </div>
      </template>

      <!-- 分类列 -->
      <template #category="{ row }">
        <el-tag size="small">{{ row.category }}</el-tag>
      </template>

      <!-- 类型列 -->
      <template #type="{ row }">
        <span class="type-text">{{ row.type }}</span>
      </template>

      <!-- 可见性列 -->
      <template #isPublic="{ row }">
        <el-tag :type="row.isPublic ? 'success' : 'info'" size="small">
          {{ row.isPublic ? '公开' : '私有' }}
        </el-tag>
      </template>

      <!-- 创建者列 -->
      <template #creatorName="{ row }">
        <span class="creator-text">{{ row.creatorName || '-' }}</span>
      </template>

      <!-- 创建时间列 -->
      <template #createdAt="{ row }">
        <span class="time-text">{{ formatDate(row.createdAt) }}</span>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <div class="action-buttons">
          <el-button link type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="primary" size="small" @click="handleDownload(row)">
            下载
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </div>
      </template>
    </DataTable>

    <!-- Create/Edit Dialog -->
    <CommonModal
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :loading="submitting"
      @confirm="handleSubmit"
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
    </CommonModal>

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
import PageHeader from '@/components/PageHeader.vue'
import Toolbar from '@/components/Toolbar.vue'
import DataTable from '@/components/DataTable.vue'
import CommonModal from '@/components/CommonModal.vue'
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

// 表格列配置
const tableColumns = [
  { label: '组件名称', prop: 'name', width: '25%', slot: 'name' },
  { label: '分类', prop: 'category', width: '12%', slot: 'category' },
  { label: '类型', prop: 'type', width: '10%', slot: 'type' },
  { label: '可见性', prop: 'isPublic', width: '10%', align: 'center', slot: 'isPublic' },
  { label: '创建者', prop: 'creatorName', width: '12%', slot: 'creatorName' },
  { label: '创建时间', prop: 'createdAt', width: '15%', slot: 'createdAt' },
  { label: '操作', prop: 'actions', width: '16%', align: 'center', slot: 'actions' }
]

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
.page-container  {
  padding: 24px;
}
/* Table Cell Styles - 保留自定义单元格样式 */
.component-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.component-name {
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.component-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-text,
.creator-text {
  color: var(--el-text-color-secondary);
}

.time-text {
  font-size: 13px;
  color: var(--el-text-color-placeholder);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Component Detail */
.component-detail {
  padding: 8px 0;
}
</style>
