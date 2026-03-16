<template>
  <div class="template-library-page">
    <WorkspaceLayout
      :breadcrumb-items="breadcrumbItems"
      :filters="filters"
      :search-placeholder="'搜索模板...'"
      :view-modes="viewModes"
      :default-view="'grid'"
      :items="templates"
      :filter-function="filterTemplates"
      :search-function="searchTemplates"
      @filter-change="handleFilterChange"
      @search="handleSearch"
      @view-change="handleViewChange"
    >
      <template #toolbar-extra>
        <a-button @click="loadTemplates" title="刷新">
          <template #icon>
            <ReloadOutlined />
          </template>
        </a-button>
        <a-button type="primary" @click="openCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增模板
        </a-button>
      </template>

      <!-- Grid 视图 -->
      <template #grid="{ items }">
        <TemplateCard
          v-for="template in items"
          :key="template.id"
          :template="template"
          @use="handleUseTemplate"
          @preview="handlePreviewTemplate"
          @edit="handleEditTemplate"
          @delete="handleDeleteTemplate"
        />
      </template>

      <!-- List 视图 -->
      <template #list="{ items }">
        <TemplateListItem
          v-for="template in items"
          :key="template.id"
          :template="template"
          @use="handleUseTemplate"
          @preview="handlePreviewTemplate"
          @edit="handleEditTemplate"
          @duplicate="() => message.info('复制功能开发中')"
          @delete="handleDeleteTemplate"
        />
      </template>
    </WorkspaceLayout>

    <!-- 创建/编辑模板弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalMode === 'create' ? '新增模板' : '编辑模板'"
      :width="600"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-form-item label="模板名称" name="title">
          <a-input
            v-model:value="formData.title"
            placeholder="请输入模板名称"
            :maxlength="100"
          />
        </a-form-item>

        <a-form-item label="分类" name="category">
          <a-select v-model:value="formData.category" placeholder="请选择分类">
            <a-select-option value="dashboard">数据看板</a-select-option>
            <a-select-option value="report">数据报表</a-select-option>
            <a-select-option value="screen">数据大屏</a-select-option>
            <a-select-option value="chart">图表组件</a-select-option>
            <a-select-option value="other">其他</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="分辨率" name="resolution">
          <a-select v-model:value="formData.resolution" placeholder="请选择分辨率">
            <a-select-option value="1920x1080">1920x1080 (Full HD)</a-select-option>
            <a-select-option value="3840x2160">3840x2160 (4K)</a-select-option>
            <a-select-option value="1280x720">1280x720 (HD)</a-select-option>
            <a-select-option value="2560x1440">2560x1440 (2K)</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入模板描述"
            :rows="4"
            :maxlength="500"
            show-count
          />
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="handleModalCancel">取消</a-button>
        <a-button type="primary" @click="handleModalOk" :loading="submitting">
          {{ modalMode === 'create' ? '创建' : '保存' }}
        </a-button>
      </template>
    </a-modal>

    <!-- 预览弹窗 -->
    <a-modal
      v-model:open="previewVisible"
      title="模板预览"
      :width="1200"
      :footer="null"
    >
      <div class="preview-container">
        <img
          v-if="previewTemplate?.thumbnail"
          :src="getImageUrl(previewTemplate.thumbnail)"
          :alt="previewTemplate.title"
          class="preview-image"
        />
        <div class="preview-info">
          <h3>{{ previewTemplate?.title }}</h3>
          <p>{{ previewTemplate?.description }}</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { confirm } from '@/utils/confirm'
import { useViewModes } from '@/composables/useViewModes'
import { getImageUrl } from '@/utils/image'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout.vue'
import TemplateCard from './components/TemplateCard.vue'
import TemplateListItem from './components/TemplateListItem.vue'
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/api/template'

const formRef = ref()
const { viewModes } = useViewModes()

const templates = ref([])
const loading = ref(false)

// 面包屑
const breadcrumbItems = [
  { label: '首页', path: '/' },
  { label: '工作台', path: '/workspace' },
  { label: '企业模板库' }
]

// 筛选器
const filters = [
  { id: 'all', label: '全部', count: computed(() => templates.value.length) },
  { id: 'dashboard', label: '数据看板', count: computed(() => templates.value.filter(t => t.category === 'dashboard').length) },
  { id: 'report', label: '数据报表', count: computed(() => templates.value.filter(t => t.category === 'report').length) },
  { id: 'screen', label: '数据大屏', count: computed(() => templates.value.filter(t => t.category === 'screen').length) },
  { id: 'chart', label: '图表组件', count: computed(() => templates.value.filter(t => t.category === 'chart').length) },
  { id: 'other', label: '其他', count: computed(() => templates.value.filter(t => t.category === 'other').length) }
]

// 筛选和搜索函数
const filterTemplates = (items, filterValue) => {
  if (filterValue === 'all') return items
  return items.filter(item => item.category === filterValue)
}

const searchTemplates = (items, keyword) => {
  if (!keyword) return items
  const lowerKeyword = keyword.toLowerCase()
  return items.filter(item =>
    item.title?.toLowerCase().includes(lowerKeyword) ||
    item.description?.toLowerCase().includes(lowerKeyword)
  )
}

const handleFilterChange = () => {}
const handleSearch = () => {}
const handleViewChange = () => {}

const loadTemplates = async () => {
  try {
    loading.value = true
    templates.value = await getTemplates()
  } catch (error) {
    console.error('加载模板列表失败:', error)
    message.error('加载模板列表失败')
  } finally {
    loading.value = false
  }
}

// 模态框相关
const modalVisible = ref(false)
const modalMode = ref('create')
const currentTemplate = ref(null)
const submitting = ref(false)

const formData = ref({
  title: '',
  category: '',
  resolution: '1920x1080',
  description: ''
})

const formRules = {
  title: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  resolution: [{ required: true, message: '请选择分辨率', trigger: 'change' }]
}

// 打开创建弹窗
const openCreateModal = () => {
  modalMode.value = 'create'
  currentTemplate.value = null
  formData.value = {
    title: '',
    category: '',
    resolution: '1920x1080',
    description: ''
  }
  modalVisible.value = true
}

// 编辑模板
const handleEditTemplate = (template) => {
  modalMode.value = 'edit'
  currentTemplate.value = template
  formData.value = {
    title: template.title,
    category: template.category,
    resolution: template.resolution || '1920x1080',
    description: template.description || ''
  }
  modalVisible.value = true
}

// 弹窗确认
const handleModalOk = async () => {
  try {
    await formRef.value.validate()

    submitting.value = true

    if (modalMode.value === 'create') {
      await createTemplate(formData.value)
      message.success('模板创建成功')
    } else {
      await updateTemplate(currentTemplate.value.id, formData.value)
      message.success('模板更新成功')
    }

    submitting.value = false
    modalVisible.value = false
    await loadTemplates()
  } catch (error) {
    submitting.value = false
    if (error.errorFields) {
      return
    }
    console.error('操作失败:', error)
    message.error('操作失败')
  }
}

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
}

// 使用模板
const handleUseTemplate = () => message.info('使用模板功能开发中')

const previewVisible = ref(false)
const previewTemplate = ref(null)
const handlePreviewTemplate = (template) => {
  previewTemplate.value = template
  previewVisible.value = true
}

const handleDeleteTemplate = async (template) => {
  try {
    await confirm(`确定要删除模板 "${template.title}" 吗？此操作不可恢复。`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteTemplate(template.id)
    message.success('模板已删除')
    await loadTemplates()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除模板失败:', error)
      message.error('删除模板失败')
    }
  }
}

onMounted(() => loadTemplates())
</script>

<style scoped>
.preview-container {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.preview-info h3 {
  margin-bottom: 8px;
}
</style>

