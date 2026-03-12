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
        <div
          v-for="template in items"
          :key="template.id"
          class="template-list-item"
        >
          <div class="list-item-thumb">
            <img
              v-if="template.thumbnail || template.thumbnailMedia?.url"
              :src="getImageUrl(template.thumbnail || template.thumbnailMedia?.url)"
              :alt="template.title"
              @error="handleImageError"
            />
            <div v-else class="list-item-thumb-default">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="thumb-icon">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/>
              </svg>
            </div>
          </div>
          <div class="list-item-content">
            <div class="list-item-header">
              <div class="list-item-title-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="title-icon">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/>
                </svg>
                <span class="list-item-title">{{ template.title }}</span>
                <a-tag color="blue" :bordered="false">
                  {{ getCategoryLabel(template.category) }}
                </a-tag>
              </div>
              <div class="list-item-actions">
                <a-button size="small" type="primary" @click="handleUseTemplate(template)">
                  <template #icon><CheckOutlined /></template>
                  使用模板
                </a-button>
                <a-button size="small" @click="handlePreviewTemplate(template)">
                  <template #icon><EyeOutlined /></template>
                  预览
                </a-button>
                <a-dropdown>
                  <a-button size="small">
                    <template #icon><MoreOutlined /></template>
                  </a-button>
                  <template #overlay>
                    <a-menu @click="({ key }) => handleMenuAction(key, template)">
                      <a-menu-item key="edit">
                        <EditOutlined />
                        编辑
                      </a-menu-item>
                      <a-menu-item key="duplicate">
                        <CopyOutlined />
                        复制
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="delete" danger>
                        <DeleteOutlined />
                        删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
            <div class="list-item-desc">{{ template.description || '暂无描述' }}</div>
            <div class="list-item-meta">
              <a-space :size="16">
                <span class="meta-text">
                  <FireOutlined />
                  <span class="meta-number">{{ template.usageCount || 0 }}</span> 次使用
                </span>
                <span class="meta-text">
                  <ClockCircleOutlined />
                  更新于 <span v-html="formatTimeWithColor(template.updatedAt)"></span>
                </span>
              </a-space>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import {
  PlusOutlined,
  ReloadOutlined,
  CheckOutlined,
  EyeOutlined,
  MoreOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  FireOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { confirm } from '@/utils/confirm'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout.vue'
import TemplateCard from './components/TemplateCard.vue'
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '@/api/template'

const router = useRouter()
const formRef = ref()

// 数据
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

// 视图模式
const viewModes = [
  {
    id: 'grid',
    label: '网格视图',
    tooltip: '网格视图',
    icon: h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z' })
    ])
  },
  {
    id: 'list',
    label: '列表视图',
    tooltip: '列表视图',
    icon: h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z' })
    ])
  }
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

// 事件处理
const handleFilterChange = (value) => {
  console.log('Filter changed:', value)
}

const handleSearch = (keyword) => {
  console.log('Search:', keyword)
}

const handleViewChange = (view) => {
  console.log('View changed:', view)
}

// 加载模板列表
const loadTemplates = async () => {
  try {
    loading.value = true
    const data = await getTemplates()
    // 不在这里格式化时间，保留原始数据
    templates.value = data
  } catch (error) {
    console.error('加载模板列表失败:', error)
    message.error('加载模板列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return '-'

  try {
    const date = new Date(dateStr)

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr)
      return '-'
    }

    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    // 返回格式化的日期
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', dateStr, error)
    return '-'
  }
}

// 格式化时间并给数字添加颜色
const formatTimeWithColor = (dateStr) => {
  const timeStr = formatTime(dateStr)
  // 使用正则表达式匹配数字，并给数字添加颜色样式
  return timeStr.replace(/(\d+)/g, '<span class="meta-number">$1</span>')
}

// 获取图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // 如果路径以 /uploads 开头，说明是静态资源，直接使用
  if (path.startsWith('/uploads')) return path
  // 否则拼接 API 基础路径
  return `${import.meta.env.VITE_API_BASE_URL || ''}${path}`
}

// 处理图片加载错误
const handleImageError = (e) => {
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  if (parent) {
    const defaultDiv = parent.querySelector('.list-item-thumb-default')
    if (defaultDiv) {
      defaultDiv.style.display = 'flex'
    }
  }
}

// 获取分类标签
const getCategoryLabel = (category) => {
  const labels = {
    dashboard: '数据看板',
    report: '数据报表',
    screen: '数据大屏',
    chart: '图表组件',
    other: '其他'
  }
  return labels[category] || category
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
const handleUseTemplate = (template) => {
  message.info('使用模板功能开发中')
}

// 预览模板
const previewVisible = ref(false)
const previewTemplate = ref(null)

const handlePreviewTemplate = (template) => {
  previewTemplate.value = template
  previewVisible.value = true
}

// 删除模板
const handleDeleteTemplate = async (template) => {
  try {
    await confirm(
      `确定要删除模板 "${template.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

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

// 菜单操作
const handleMenuAction = (key, template) => {
  switch (key) {
    case 'edit':
      handleEditTemplate(template)
      break
    case 'duplicate':
      message.info('复制功能开发中')
      break
    case 'delete':
      handleDeleteTemplate(template)
      break
  }
}

// 初始化
onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
/* 列表视图样式 */
.template-list-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.template-list-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #d9d9d9;
}

.list-item-thumb {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #fafafa;
}

.list-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-item-thumb-default {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.thumb-icon {
  width: 32px;
  height: 32px;
  color: #fff;
}

.list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.list-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.list-item-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.list-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title-icon {
  width: 18px;
  height: 18px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.list-item-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.list-item-desc {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.list-item-meta {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #8c8c8c;
}

.meta-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #8c8c8c;
}

.meta-number {
  color: #40a9ff;
  font-weight: 600;
  font-size: 14px;
}
</style>

