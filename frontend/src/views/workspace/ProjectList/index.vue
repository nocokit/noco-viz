<template>
  <div class="project-list-page">
    <!-- Header (Moved from Layout to here for full control) -->
    <header class="header">
      <div class="view-tabs">
        <div class="tab-item active">全部项目 (5)</div>
        <div class="tab-item">我创建的</div>
        <div class="tab-item">协作项目</div>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            class="search-input"
            placeholder="搜索项目..."
            prefix-icon="Search"
          />
        </div>
        <el-button type="primary" @click="modalVisible = true">
          <el-icon><Plus /></el-icon>
          新建项目
        </el-button>
      </div>
    </header>

    <div class="content-scroll">
      <div class="grid-container">
        <!-- Project Cards -->
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          :class="`type-${project.type}`"
        >
          <div class="card-image-header">
            <img
              v-if="project.coverImage"
              :src="project.coverImage"
              class="header-img"
              :alt="project.title"
            >
            <div v-else class="header-img-default" :class="`type-${project.type}`">
              <component :is="getIcon(project.type)" class="default-icon" />
              <div class="default-text">{{ project.type === 'screen' ? '数据可视化大屏' : '中国式复杂报表' }}</div>
            </div>
            <div class="card-overlay">
              <button class="overlay-btn btn-edit" @click="handleEnterEditor(project)">
                {{ project.type === 'screen' ? '进入大屏编辑器' : '进入报表编辑器' }}
              </button>
              <button class="overlay-btn btn-preview">预览</button>
            </div>
          </div>
          <div class="card-content">
            <div class="card-header-row">
              <div class="card-title">
                <component :is="getIcon(project.type)" class="type-icon" />
                {{ project.title }}
              </div>
              <div class="card-actions-menu">
                <el-dropdown @command="handleCommand($event, project)">
                  <span class="el-dropdown-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑</el-dropdown-item>
                      <el-dropdown-item command="duplicate">复制</el-dropdown-item>
                      <el-dropdown-item
                        v-if="project.status === 'published'"
                        command="unpublish"
                      >
                        取消发布
                      </el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <span
                  class="status-badge"
                  :class="{ pub: project.status === 'published' }"
                >
                  {{ project.status === 'published' ? '● 已发布' : '草稿' }}
                </span>
              </div>
            </div>
            <div class="card-desc">{{ project.description }}</div>
            <div class="card-footer">
              <span>{{ project.type === 'screen' ? 'Screen Visualization' : 'Enterprise Report' }}</span>
              <span>{{ project.updatedAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div class="modal-overlay" :class="{ open: modalVisible }" @click.self="closeModal">
      <div class="type-modal" :class="{ 'step-2': modalStep === 2 }">
        <div class="modal-header">
          <div class="header-left">
            <div v-if="modalStep === 2" class="back-btn" @click="modalStep = 1">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </div>
            <h3>{{ modalStep === 1 ? '新建项目' : '填写项目信息' }}</h3>
          </div>
          <div class="close-btn" @click="closeModal">✕</div>
        </div>

        <!-- Step 1: 选择类型 -->
        <div v-show="modalStep === 1" class="type-grid">
          <!-- Screen Option -->
          <div class="select-card screen" @click="selectType('screen')">
            <div class="select-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
            </div>
            <div class="select-info">
              <h4>数据可视化大屏</h4>
              <p>Screen Visualization</p>
              <div class="select-desc">适用于指挥中心、行业大屏、汇报演示。支持绝对定位画布、3D 模型集成及炫酷动效。</div>
            </div>
          </div>

          <!-- Report Option -->
          <div class="select-card report" @click="selectType('report')">
            <div class="select-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/></svg>
            </div>
            <div class="select-info">
              <h4>中国式复杂报表</h4>
              <p>Enterprise Report</p>
              <div class="select-desc">适用于业务清单、财务报表、数据填报。支持类 Excel 布局、分页打印及复杂表头。</div>
            </div>
          </div>
        </div>

        <!-- Step 2: 填写信息 -->
        <div v-show="modalStep === 2" class="form-content">
          <div class="selected-type-banner" :class="newProject.type">
            <div class="banner-icon">
              <svg v-if="newProject.type === 'screen'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
              </svg>
              <svg v-else-if="newProject.type === 'report'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/>
              </svg>
            </div>
            <div>
              <div class="banner-title">{{ newProject.type === 'screen' ? '数据可视化大屏' : '中国式复杂报表' }}</div>
              <div class="banner-subtitle">{{ newProject.type === 'screen' ? 'Screen Visualization' : 'Enterprise Report' }}</div>
            </div>
          </div>

          <el-form :model="newProject" label-position="top" :rules="projectRules" ref="projectFormRef">
            <el-form-item label="项目名称" prop="title">
              <el-input
                v-model="newProject.title"
                placeholder="请输入项目名称，例如：智慧城市交通大脑"
                maxlength="50"
                show-word-limit
                size="large"
              />
            </el-form-item>

            <el-form-item label="项目描述" prop="description">
              <el-input
                v-model="newProject.description"
                type="textarea"
                :rows="4"
                placeholder="请简要描述项目用途和功能..."
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="封面图片 (可选)" prop="coverImage">
              <div class="cover-upload-container">
                <!-- 封面预览 -->
                <div v-if="newProject.coverImage" class="cover-preview-box">
                  <img :src="getImageUrl(newProject.coverImage)" alt="封面图" class="cover-preview-img">
                  <div class="cover-actions">
                    <el-button size="small" @click="showMediaSelector">
                      <el-icon><Picture /></el-icon>
                      从资源库选择
                    </el-button>
                    <el-button size="small" @click="removeCoverImage">
                      <el-icon><Delete /></el-icon>
                      移除封面
                    </el-button>
                  </div>
                </div>

                <!-- 选择封面 -->
                <div v-else class="cover-select-box">
                  <el-button type="primary" @click="showMediaSelector" class="select-btn">
                    <el-icon><Picture /></el-icon>
                    从资源库选择封面
                  </el-button>
                  <div class="or-divider">
                    <span>或</span>
                  </div>
                  <el-upload
                    class="cover-uploader"
                    :action="uploadAction"
                    :headers="uploadHeaders"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :before-upload="beforeUpload"
                    accept="image/*"
                    :disabled="uploading"
                  >
                    <el-button :loading="uploading">
                      <el-icon><Upload /></el-icon>
                      {{ uploading ? '上传中...' : '上传本地图片' }}
                    </el-button>
                  </el-upload>
                </div>
                <div class="upload-description">
                  建议尺寸: 16:9, 支持 JPG、PNG 格式
                </div>
              </div>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <el-button @click="modalStep = 1">上一步</el-button>
            <el-button type="primary" @click="handleCreateProject" :loading="creating">
              创建项目
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 媒体选择器对话框 -->
    <MediaSelector
      v-model="mediaSelectorVisible"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup>
import { ref, h, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Delete, ZoomIn, Loading, Picture, Upload } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import MediaSelector from '@/components/MediaSelector.vue'
import {
  getProjectList,
  createProject,
  updateProject,
  deleteProject,
  cloneProject,
  unpublishProject
} from '@/api/project'
import { uploadMedia } from '@/api/media'

const router = useRouter()
const searchQuery = ref('')
const modalVisible = ref(false)
const modalStep = ref(1) // 1: 选择类型, 2: 填写信息
const creating = ref(false)
const projectFormRef = ref(null)
const loading = ref(false)
const uploading = ref(false)
const mediaSelectorVisible = ref(false) // 媒体选择器对话框

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

// Icons components for direct usage in v-for
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
    { min: 2, max: 50, message: '项目名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '项目描述不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 项目列表数据
const projects = ref([])

// 加载项目列表
const loadProjects = async () => {
  try {
    loading.value = true
    const data = await getProjectList()
    projects.value = data.map(project => ({
      ...project,
      updatedAt: formatTime(project.updatedAt)
    }))
  } catch (error) {
    console.error('加载项目列表失败:', error)
    ElMessage.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
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

// 图片上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
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
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error('上传失败，请重试')
  }
}

// 上传失败回调
const handleUploadError = (error) => {
  uploading.value = false
  console.error('上传失败:', error)
  ElMessage.error('上传失败，请重试')
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
    ElMessage.success('封面选择成功')
  }
}

// 获取图片完整URL
const getImageUrl = (url) => {
  if (!url) return ''
  // 如果是完整URL,直接返回
  if (url.startsWith('http')) return url
  // 如果是相对路径,直接使用(由vite proxy处理)
  return url
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

  await projectFormRef.value.validate(async (valid) => {
    if (!valid) return

    creating.value = true

    try {
      const projectData = {
        title: newProject.title,
        type: newProject.type,
        description: newProject.description,
        coverImage: newProject.coverImage,
        status: 'draft'
      }

      const result = await createProject(projectData)

      ElMessage.success(`项目 "${newProject.title}" 创建成功`)
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
      console.error('创建项目失败:', error)
      ElMessage.error('创建项目失败')
      creating.value = false
    }
  })
}

const handleEnterEditor = (project) => {
  if (project.type === 'report') {
    router.push(`/editor/report/${project.id}`)
  } else {
    router.push(`/editor/screen/${project.id}`)
  }
}

// 处理下拉菜单命令
const handleCommand = (command, project) => {
  switch (command) {
    case 'edit':
      handleEnterEditor(project)
      break
    case 'duplicate':
      handleDuplicate(project)
      break
    case 'unpublish':
      handleUnpublish(project)
      break
    case 'delete':
      handleDeleteProject(project)
      break
  }
}

// 复制项目
const handleDuplicate = async (project) => {
  try {
    const newTitle = `${project.title} (副本)`
    await cloneProject(project.id, newTitle)
    ElMessage.success(`项目 "${project.title}" 已复制`)
    // 重新加载项目列表
    await loadProjects()
  } catch (error) {
    console.error('复制项目失败:', error)
    ElMessage.error('复制项目失败')
  }
}

// 取消发布项目
const handleUnpublish = async (project) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消发布项目 "${project.title}" 吗？`,
      '取消发布确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await unpublishProject(project.id)
    ElMessage.success('项目已取消发布')
    // 重新加载项目列表
    await loadProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消发布失败:', error)
      ElMessage.error('取消发布失败')
    }
  }
}

// 删除项目
const handleDeleteProject = async (project) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除项目 "${project.title}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deleteProject(project.id)
    ElMessage.success('项目已删除')
    // 重新加载项目列表
    await loadProjects()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除项目失败:', error)
      ElMessage.error('删除项目失败')
    }
  }
}
</script>

<style scoped>
/* Global Vars from root (implied) */
.project-list-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-body);
  position: relative;
}

/* Header */
.header {
  height: 64px;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
  background: rgba(20, 21, 25, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10;
  flex-shrink: 0;
}

.view-tabs { display: flex; gap: 24px; height: 100%; }
.tab-item {
  display: flex; align-items: center; height: 100%; font-size: 14px; color: var(--el-text-color-regular); cursor: pointer; position: relative;
}
.tab-item:hover { color: #fff; }
.tab-item.active { color: #fff; font-weight: 500; }
.tab-item.active::after {
  content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--el-color-primary);
}

/* Actions */
.header-actions { display: flex; gap: 16px; align-items: center; }
.search-box { width: 240px; }

.btn-create {
  background: var(--el-color-primary); color: #fff; border: none; height: 32px; padding: 0 20px;
  border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.btn-create:hover { background: var(--el-color-primary-dark-2); transform: translateY(-1px); }

/* Content */
.content-scroll { flex: 1; padding: 32px; overflow-y: auto; }
.grid-container {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;
}

/* Project Card */
.project-card {
  background: var(--el-bg-color); border: 1px solid var(--el-border-color); border-radius: 12px;
  overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative; display: flex; flex-direction: column;
}
.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.4);
  border-color: var(--el-text-color-secondary);
}

/* Image Header */
.card-image-header {
  height: 200px; width: 100%; position: relative; overflow: hidden;
}

.header-img {
  width: 100%; height: 100%; object-fit: cover; transition: 0.4s;
  filter: brightness(0.85);
}
.project-card:hover .header-img { transform: scale(1.05); filter: brightness(0.6); }

/* Default Image */
.header-img-default {
  width: 100%; height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  position: relative; overflow: hidden;
}

.header-img-default.type-screen {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.25) 100%);
}

.header-img-default.type-report {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%);
}

.header-img-default::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.default-icon {
  width: 64px;
  height: 64px;
  opacity: 0.6;
  position: relative;
  z-index: 1;
}

.project-card.type-screen .default-icon { color: var(--el-color-primary); }
.project-card.type-report .default-icon { color: #10b981; }

.default-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

/* Overlay */
.card-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px;
  opacity: 0; transition: 0.3s; transform: translateY(10px);
}
.project-card:hover .card-overlay { opacity: 1; transform: translateY(0); }

.overlay-btn {
  padding: 8px 24px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;
  border: none; display: flex; align-items: center; gap: 6px; transition: 0.2s;
}
.project-card.type-screen .btn-edit { background: var(--el-color-primary); color: #fff; }
.project-card.type-report .btn-edit { background: #10b981; color: #fff; }
.btn-edit:hover { filter: brightness(1.1); transform: scale(1.05); }

.btn-preview { background: rgba(255,255,255,0.1); color: #fff; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); }
.btn-preview:hover { background: rgba(255,255,255,0.2); }

/* Card Body */
.card-content { padding: 16px; flex: 1; display: flex; flex-direction: column; }
.card-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.card-actions-menu { display: flex; align-items: center; gap: 12px; }
.el-dropdown-link { cursor: pointer; color: var(--el-text-color-secondary); display: flex; align-items: center; }
.el-dropdown-link:hover { color: var(--el-text-color-primary); }
.card-title {
  font-size: 15px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 6px;
}
.type-icon { width: 16px; height: 16px; }
.project-card.type-screen .type-icon { color: var(--el-color-primary); }
.project-card.type-report .type-icon { color: #10b981; }

.status-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1); color: var(--el-text-color-secondary); }
.status-badge.pub { background: rgba(16, 185, 129, 0.15); color: #10b981; }

.card-desc { font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-footer {
  margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--el-text-color-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.type-modal {
  background: #1e1e20;
  border: 1px solid #303033;
  border-radius: 12px;
  width: 700px;
  overflow: hidden;
  transform: scale(0.9);
  transition: transform 0.3s;
}

.type-modal.step-2 {
  width: 600px;
}

.modal-overlay.open .type-modal {
  transform: scale(1);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #303033;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: #909399;
  transition: 0.2s;
  border: 1px solid #303033;
}

.back-btn:hover {
  background: #303033;
  color: #e5e5e5;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #e5e5e5;
  margin: 0;
}

.close-btn {
  cursor: pointer;
  color: #909399;
  font-size: 24px;
  line-height: 1;
  transition: 0.2s;
  padding: 4px;
}

.close-btn:hover {
  color: #e5e5e5;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #303033;
}

.type-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 40px;
}

/* Select Card */
.select-card {
  background: var(--el-bg-color-page); border: 2px solid transparent; border-radius: 12px;
  padding: 30px 20px; cursor: pointer; transition: 0.2s; position: relative;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
.select-card:hover { transform: translateY(-4px); background: var(--el-fill-color); }

.select-card.screen:hover { border-color: var(--el-color-primary); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15); }
.select-card.screen .select-icon { background: rgba(59, 130, 246, 0.1); color: var(--el-color-primary); }

.select-card.report:hover { border-color: #10b981; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15); }
.select-card.report .select-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.select-icon {
  width: 80px; height: 80px; border-radius: 16px; display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px; transition: 0.3s;
}
.select-icon svg { width: 40px; height: 40px; }
.select-card:hover .select-icon { transform: scale(1.1); }

.select-info h4 { font-size: 18px; color: #fff; margin-bottom: 6px; }
.select-info p { font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 16px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
.select-desc { font-size: 13px; color: var(--el-text-color-secondary); line-height: 1.6; }

/* Step 2: Form Content */
.form-content { padding: 30px; }

.selected-type-banner {
  display: flex; align-items: center; gap: 16px; padding: 20px;
  border-radius: 12px; margin-bottom: 32px; border: 2px solid transparent;
  transition: 0.3s;
}
.selected-type-banner.screen {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}
.selected-type-banner.report {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.banner-icon {
  width: 56px; height: 56px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.selected-type-banner.screen .banner-icon {
  background: rgba(59, 130, 246, 0.2);
  color: var(--el-color-primary);
}
.selected-type-banner.report .banner-icon {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}
.banner-icon svg { width: 28px; height: 28px; }

.banner-title {
  font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px;
}
.banner-subtitle {
  font-size: 12px; color: var(--el-text-color-secondary);
  text-transform: uppercase; letter-spacing: 0.5px;
}

.form-footer {
  display: flex; justify-content: flex-end; gap: 12px;
  margin-top: 32px; padding-top: 24px;
  border-top: 1px solid #303033;
}

/* Element Plus Button Overrides for Modal */
.modal-footer :deep(.el-button),
.form-footer :deep(.el-button) {
  background-color: #1c1d21;
  border-color: #2d2e33;
  color: #9ca3af;
}

.modal-footer :deep(.el-button:hover),
.form-footer :deep(.el-button:hover) {
  border-color: #fff;
  color: #fff;
}

.modal-footer :deep(.el-button--primary),
.form-footer :deep(.el-button--primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.modal-footer :deep(.el-button--primary:hover),
.form-footer :deep(.el-button--primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

/* Cover Upload Styles */
.cover-upload-container {
  width: 100%;
}

/* 封面选择盒子 */
.cover-select-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  border: 2px dashed #303033;
  border-radius: 8px;
  background: #1a1b1e;
}

.select-btn {
  min-width: 200px;
}

.or-divider {
  position: relative;
  width: 100%;
  text-align: center;
  color: #606266;
  font-size: 12px;
}

.or-divider::before,
.or-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #303033;
}

.or-divider::before {
  left: 0;
}

.or-divider::after {
  right: 0;
}

.or-divider span {
  padding: 0 12px;
  background: #1a1b1e;
}

/* 封面预览盒子 */
.cover-preview-box {
  width: 100%;
  border: 2px solid #303033;
  border-radius: 8px;
  overflow: hidden;
  background: #1a1b1e;
}

.cover-preview-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.cover-actions {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #1c1d21;
  border-top: 1px solid #303033;
}

.cover-actions .el-button {
  flex: 1;
}

.upload-description {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  text-align: center;
}

/* 旧样式保留用于兼容 */
.cover-uploader {
  width: 100%;
}

.cover-uploader :deep(.el-upload) {
  width: 100%;
}

.cover-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: 0;
  transition: 0.3s;
}

.cover-preview:hover .cover-mask {
  opacity: 1;
}

.cover-icon {
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
  padding: 8px;
  border-radius: 4px;
}

.cover-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.upload-description {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}
</style>
