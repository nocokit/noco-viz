<template>
  <div class="project-list-page">
    <WorkspaceLayout
      :breadcrumb-items="breadcrumbItems"
      :filters="filters"
      :search-placeholder="'搜索项目...'"
      :view-modes="viewModes"
      :default-view="'grid'"
      :items="projects"
      :filter-function="filterProjects"
      :search-function="searchProjects"
      @filter-change="handleFilterChange"
      @search="handleSearch"
      @view-change="handleViewChange"
    >
      <template #toolbar-extra>
        <a-button @click="loadProjects" title="刷新">
          <template #icon>
            <ReloadOutlined />
          </template>
        </a-button>
        <a-button type="primary" @click="openCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增
        </a-button>
      </template>
      <!-- Grid 视图 -->
      <template #grid="{ items }">
        <ProjectCard
          v-for="project in items"
          :key="project.id"
          :project="project"
          @enter-editor="handleEnterEditor"
          @preview="handlePreview"
          @edit="handleEnterEditor"
          @duplicate="handleDuplicate"
          @publish="handlePublish"
          @unpublish="handleUnpublish"
          @delete="handleDeleteProject"
        />
      </template>

      <!-- List 视图 -->
      <template #list="{ items }">
        <div
          v-for="project in items"
          :key="project.id"
          class="project-list-item"
        >
          <div class="list-item-thumb">
            <img
              v-if="project.coverImage"
              :src="getImageUrl(project.coverImage)"
              :alt="project.title"
            />
            <div v-else class="list-item-thumb-default" :class="`type-${project.type}`">
              <component :is="getIcon(project.type)" class="thumb-icon" />
            </div>
          </div>
          <div class="list-item-content">
            <div class="list-item-header">
              <div class="list-item-title-row">
                <component :is="getIcon(project.type)" class="title-icon" />
                <span class="list-item-title">{{ project.title }}</span>
                <a-tag v-if="project.status === 'published'" color="success">
                  已发布
                </a-tag>
                <a-tag v-else class="draft-tag" color="default">
                  草稿
                </a-tag>
              </div>
              <div class="list-item-actions">
                <a-button size="small" type="primary" @click="handleEnterEditor(project)">
                  <template #icon><EditOutlined /></template>
                  编辑
                </a-button>
                <a-button size="small" @click="handlePreview(project)">
                  <template #icon><EyeOutlined /></template>
                  预览
                </a-button>
                <a-dropdown>
                  <a-button size="small">
                    <template #icon><MoreOutlined /></template>
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="handleDuplicate(project)">
                        <CopyOutlined />
                        复制
                      </a-menu-item>
                      <a-menu-item
                        v-if="project.status === 'published'"
                        @click="handleUnpublish(project)"
                      >
                        <CloseCircleOutlined />
                        取消发布
                      </a-menu-item>
                      <a-menu-item v-else @click="handlePublish(project)">
                        <CheckCircleOutlined />
                        发布
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item danger @click="handleDeleteProject(project)">
                        <DeleteOutlined />
                        删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
            <div class="list-item-desc">{{ project.description || '暂无描述' }}</div>
            <div class="list-item-meta">
              <a-space :size="16">
                <span>
                  <a-tag :bordered="false" color="blue">
                    {{ project.type === 'screen' ? '数据大屏' : '复杂报表' }}
                  </a-tag>
                </span>
                <span class="meta-text">
                  <ClockCircleOutlined />
                  更新于 {{ project.updatedAt }}
                </span>
              </a-space>
            </div>
          </div>
        </div>
      </template>
    </WorkspaceLayout>

    <!-- 新增/编辑项目模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalStep === 1 ? '新建项目' : '填写项目信息'"
      :width="modalStep === 1 ? 800 : 600"
      :footer="null"
      :destroy-on-close="true"
      @cancel="closeModal"
    >
      <!-- Step 1: 选择类型 -->
      <div v-if="modalStep === 1" class="type-selection">
        <div class="type-grid">
          <div
            v-for="type in projectTypes"
            :key="type.key"
            class="type-card"
            :class="type.key"
            @click="selectType(type.key)"
          >
            <div class="type-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <path :d="type.icon" />
              </svg>
            </div>
            <div class="type-info">
              <h4>{{ type.title }}</h4>
              <p class="type-subtitle">{{ type.subtitle }}</p>
              <p class="type-desc">{{ type.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: 填写信息 -->
      <div v-else class="project-form">
        <a-form
          ref="projectFormRef"
          :model="newProject"
          :rules="projectRules"
          layout="vertical"
        >
          <a-form-item label="项目名称" name="title">
            <a-input
              v-model:value="newProject.title"
              placeholder="请输入项目名称"
              :maxlength="100"
              size="large"
            />
          </a-form-item>

          <a-form-item label="项目描述" name="description">
            <a-textarea
              v-model:value="newProject.description"
              placeholder="请简要描述项目用途"
              :rows="4"
              :maxlength="500"
              show-count
            />
          </a-form-item>

          <a-form-item label="封面图片">
            <div class="cover-upload-area">
              <!-- 已选择封面 -->
              <div v-if="newProject.coverImage" class="cover-preview">
                <img :src="getImageUrl(newProject.coverImage)" alt="封面" />
                <div class="cover-overlay">
                  <a-space>
                    <a-button size="small" @click="showMediaSelector">
                      <template #icon><PictureOutlined /></template>
                      更换
                    </a-button>
                    <a-button size="small" danger @click="removeCoverImage">
                      <template #icon><DeleteOutlined /></template>
                      移除
                    </a-button>
                  </a-space>
                </div>
              </div>

              <!-- 未选择封面 -->
              <div v-else class="cover-empty">
                <a-space direction="vertical" :size="16" style="width: 100%">
                  <a-button type="primary" block @click="showMediaSelector">
                    <template #icon><PictureOutlined /></template>
                    从资源库选择
                  </a-button>
                  <a-divider style="margin: 0">或</a-divider>
                  <a-upload
                    :action="uploadAction"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :before-upload="beforeUpload"
                    accept="image/*"
                    :disabled="uploading"
                  >
                    <a-button block :loading="uploading">
                      <template #icon><UploadOutlined /></template>
                      {{ uploading ? '上传中...' : '上传本地图片' }}
                    </a-button>
                  </a-upload>
                  <div class="upload-hint">建议尺寸 16:9，支持 JPG、PNG 格式</div>
                </a-space>
              </div>
            </div>
          </a-form-item>
        </a-form>

        <div class="modal-footer">
          <a-space>
            <a-button @click="modalStep = 1">上一步</a-button>
            <a-button type="primary" @click="handleCreateProject" :loading="creating">
              创建项目
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

    <!-- 媒体选择器对话框 -->
    <MediaSelector
      v-model:value="mediaSelectorVisible"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup>
import { ref, h, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import {
  PictureOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  CopyOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout.vue'
import ProjectCard from '@/components/workspace/ProjectCard.vue'
import MediaSelector from '@/components/MediaSelector.vue'
import { projectTypes } from './crudConfig'
import { useProjectOperations } from './useProjectOperations'
import { createProject } from '@/api/project'

const router = useRouter()
const userStore = useUserStore()

// 使用项目操作 composable
const {
  projects,
  loading,
  loadProjects,
  handleEnterEditor,
  handlePreview,
  handleDuplicate,
  handlePublish,
  handleUnpublish,
  handleDeleteProject
} = useProjectOperations()

// 模态框状态
const modalVisible = ref(false)
const modalStep = ref(1) // 1: 选择类型, 2: 填写信息
const creating = ref(false)
const projectFormRef = ref(null)
const uploading = ref(false)
const mediaSelectorVisible = ref(false)

// 面包屑配置
const breadcrumbItems = [
  { label: '工作台', path: '/workspace' },
  { label: '项目管理' }
]

// 筛选器配置
const filters = [
  { id: 'all', label: '全部项目' },
  { id: 'mine', label: '我创建的' },
  { id: 'shared', label: '协作项目' }
]

// 视图模式配置
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

// Icons components
const ScreenIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z' })
  ])
}

const ReportIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z' })
  ])
}

const getIcon = (type) => {
  return type === 'screen' ? ScreenIcon : ReportIcon
}

// 获取图片完整URL
const getImageUrl = (url) => {
  if (!url) return ''
  // 如果是完整URL,直接返回
  if (url.startsWith('http')) return url
  // 如果是相对路径,直接使用(由vite proxy处理)
  return url
}

// 获取上传配置
const uploadAction = computed(() => {
  return '/api/media/upload'
})

const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`
  }
})

// 新项目表单数据
const newProject = reactive({
  type: '',
  title: '',
  description: '',
  coverImage: ''
})

// 表单验证规则
const projectRules = {
  title: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 100, message: '项目名称长度在 2 到 100 个字符', trigger: 'blur' }
  ]
}

// 筛选和搜索函数
const filterProjects = (items, filterId) => {
  console.log('filterProjects called:', { filterId, itemsCount: items.length, currentUserId: userStore.userInfo?.id })

  if (filterId === 'all') return items

  if (filterId === 'mine') {
    // 根据当前用户ID筛选我创建的项目
    const currentUserId = userStore.userInfo?.id
    if (!currentUserId) {
      console.log('No current user ID found')
      return items
    }

    const filtered = items.filter(item => {
      // 处理 createdBy 可能是对象或ID的情况
      const creatorId = typeof item.createdBy === 'object' ? item.createdBy?.id : item.createdBy
      const userId = typeof item.userId === 'object' ? item.userId?.id : item.userId
      const createdById = item.createdById

      const isMatch = creatorId === currentUserId || userId === currentUserId || createdById === currentUserId
      console.log('Checking item:', {
        title: item.title,
        creatorId,
        userId,
        createdById,
        currentUserId,
        isMatch
      })

      return isMatch
    })

    console.log('Filtered mine projects:', filtered.length)
    return filtered
  }

  if (filterId === 'shared') {
    // 协作项目：排除我创建的项目
    const currentUserId = userStore.userInfo?.id
    if (!currentUserId) return []

    const filtered = items.filter(item => {
      const creatorId = typeof item.createdBy === 'object' ? item.createdBy?.id : item.createdBy
      const userId = typeof item.userId === 'object' ? item.userId?.id : item.userId
      const createdById = item.createdById

      // 不是我创建的项目
      return creatorId !== currentUserId && userId !== currentUserId && createdById !== currentUserId
    })

    console.log('Filtered shared projects:', filtered.length)
    return filtered
  }

  return items
}

const searchProjects = (items, query) => {
  if (!query) return items
  const lowerQuery = query.toLowerCase()
  return items.filter(project =>
    project.title?.toLowerCase().includes(lowerQuery) ||
    project.description?.toLowerCase().includes(lowerQuery)
  )
}

// 处理筛选变化
const handleFilterChange = (filterId) => {
  // 筛选逻辑已在 WorkspaceLayout 中处理
}

// 处理搜索
const handleSearch = (query) => {
  // 搜索逻辑已在 WorkspaceLayout 中处理
}

// 处理视图切换
const handleViewChange = (viewId) => {
  // 视图切换逻辑已在 WorkspaceLayout 中处理
}

// 组件挂载时加载数据
onMounted(() => {
  loadProjects()
})

// 选择项目类型
const selectType = (type) => {
  newProject.type = type
  modalStep.value = 2
}

// 打开创建模态框
const openCreateModal = () => {
  modalVisible.value = true
}

// 图片上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    message.error('图片大小不能超过 5MB!')
    return false
  }
  uploading.value = true
  return true
}

// 上传成功回调
const handleUploadSuccess = (response) => {
  uploading.value = false
  if (response && response.url) {
    newProject.coverImage = response.url
    message.success('封面上传成功')
  } else {
    message.error('上传失败，请重试')
  }
}

// 上传失败回调
const handleUploadError = (error) => {
  uploading.value = false
  console.error('上传失败:', error)
  message.error('上传失败，请重试')
}

// 移除封面图片
const removeCoverImage = () => {
  newProject.coverImage = ''
}

// 显示媒体选择器
const showMediaSelector = () => {
  mediaSelectorVisible.value = true
}

// 处理媒体选择
const handleMediaSelect = (media) => {
  if (media && media.url) {
    newProject.coverImage = media.url
    message.success('封面选择成功')
  }
}

// 关闭弹窗
const closeModal = () => {
  modalVisible.value = false
  setTimeout(() => {
    modalStep.value = 1
    newProject.type = ''
    newProject.title = ''
    newProject.description = ''
    newProject.coverImage = ''
    projectFormRef.value?.clearValidate()
  }, 300)
}

// 创建项目
const handleCreateProject = async () => {
  if (!projectFormRef.value) return

  try {
    // 使用 Promise 方式验证表单
    await projectFormRef.value.validate()

    creating.value = true

    const projectData = {
      title: newProject.title,
      type: newProject.type,
      description: newProject.description,
      coverImage: newProject.coverImage,
      status: 'draft'
    }

    const result = await createProject(projectData)

    message.success(`项目 "${newProject.title}" 创建成功`)
    creating.value = false
    closeModal()

    // 重新加载项目列表
    await loadProjects()

    // 跳转到编辑器
    setTimeout(() => {
      if (newProject.type === 'report') {
        router.push(`/editor/report/${result.id}`)
      } else {
        router.push(`/editor/screen/${result.id}`)
      }
    }, 500)
  } catch (error) {
    // 验证失败或创建失败
    if (error.errorFields) {
      // 表单验证失败
      console.log('表单验证失败:', error)
    } else {
      // 创建项目失败
      console.error('创建项目失败:', error)
      message.error('创建项目失败')
    }
    creating.value = false
  }
}
</script>

<style scoped>
/* 类型选择 */
.type-selection {
  padding: 8px 0;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.type-card {
  padding: 24px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.type-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.type-card.screen {
  background: linear-gradient(135deg, #f5f7ff 0%, #fff 100%);
}

.type-card.report {
  background: linear-gradient(135deg, #f0fff4 0%, #fff 100%);
}

.type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 12px;
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.type-card.report .type-icon {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.type-info {
  text-align: center;
}

.type-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px;
}

.type-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 12px;
}

.type-desc {
  font-size: 13px;
  color: #bfbfbf;
  line-height: 1.6;
  margin: 0;
}

/* 项目表单 */
.project-form {
  padding: 8px 0;
}

.modal-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

/* 封面上传区域 */
.cover-upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview:hover .cover-overlay {
  opacity: 1;
}

.cover-empty {
  padding: 32px;
  text-align: center;
}

.upload-hint {
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
}

/* 列表视图样式 */
.project-list-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.project-list-item:hover {
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

.list-item-thumb-default.type-report {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
}

.meta-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #8c8c8c;
}

.meta-text .anticon {
  font-size: 12px;
}

/* 草稿标签样式 */
.draft-tag {
  background: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
  font-weight: 500;
}
</style>