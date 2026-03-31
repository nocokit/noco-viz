<template>
  <div class="playlist-config-page">
    <!-- 头部 -->
    <div class="config-header">
      <div class="header-left">
        <button class="back-btn" @click="handleBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <div class="header-info">
          <h1>{{ playlist?.name || '轮播配置' }}</h1>
          <div class="header-meta">
            <span>{{ playlist?.resolution }}</span>
            <span>{{ playlist?.slides?.length || 0 }} 个页面</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <a-button @click="handlePreview">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </template>
          预览
        </a-button>
        <a-button type="primary" @click="handleSave" :loading="saving">
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
          </template>
          保存配置
        </a-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="config-body">
      <!-- 左侧：页面列表 -->
      <div class="slides-panel">
        <div class="panel-header">
          <h3>轮播页面</h3>
          <a-button type="primary" size="small" @click="showPageSelector">
            <template #icon>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </template>
            添加页面
          </a-button>
        </div>

        <div class="slides-list">
          <div v-if="slides.length === 0" class="empty-slides">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/>
            </svg>
            <p>暂无页面，点击"添加页面"开始配置</p>
          </div>

          <draggable
            v-else
            v-model="slides"
            item-key="id"
            handle=".drag-handle"
            animation="200"
            class="draggable-list"
          >
            <template #item="{ element, index }">
              <div class="slide-item">
                <div class="drag-handle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <div class="slide-index">{{ index + 1 }}</div>
                <div class="slide-thumb">
                  <img v-if="element.thumbnail" :src="getImageUrl(element.thumbnail)" :alt="element.title" />
                  <div v-else class="thumb-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
                    </svg>
                  </div>
                </div>
                <div class="slide-info">
                  <div class="slide-title">{{ element.title || '未命名页面' }}</div>
                  <div class="slide-meta">
                    <span>{{ element.type === 'screen' ? '大屏' : '报表' }}</span>
                    <span>{{ element.duration || 10 }}秒</span>
                  </div>
                </div>
                <div class="slide-actions">
                  <a-button size="small" @click="handleEditSlide(element, index)">
                    编辑
                  </a-button>
                  <a-button size="small" danger @click="handleRemoveSlide(index)">
                    移除
                  </a-button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <!-- 右侧：配置面板 -->
      <div class="config-panel">
        <div class="panel-header">
          <h3>轮播设置</h3>
        </div>
        <div class="panel-body">
          <a-form layout="vertical">
            <a-form-item label="轮播名称">
              <a-input v-model:value="playlist.name" placeholder="请输入轮播名称" />
            </a-form-item>

            <a-form-item label="分辨率">
              <a-select v-model:value="playlist.resolution">
                <a-select-option value="1920x1080">1920x1080 (Full HD)</a-select-option>
                <a-select-option value="3840x2160">3840x2160 (4K)</a-select-option>
                <a-select-option value="1280x720">1280x720 (HD)</a-select-option>
                <a-select-option value="2560x1440">2560x1440 (2K)</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="切换效果">
              <a-select v-model:value="playlist.transition">
                <a-select-option value="fade">淡入淡出</a-select-option>
                <a-select-option value="slide">滑动</a-select-option>
                <a-select-option value="zoom">缩放</a-select-option>
                <a-select-option value="none">无</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="默认切换间隔（秒）">
              <a-input-number
                v-model:value="playlist.interval"
                :min="1"
                :max="300"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item label="描述">
              <a-textarea
                v-model:value="playlist.description"
                :rows="4"
                placeholder="请输入描述"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>

    <!-- 页面选择器弹窗 -->
    <div class="modal-overlay" :class="{ open: pageSelectorVisible }" @click.self="pageSelectorVisible = false">
      <div class="page-selector-modal">
        <div class="modal-header">
          <h3>选择页面</h3>
          <div class="close-btn" @click="pageSelectorVisible = false">✕</div>
        </div>
        <div class="modal-body">
          <div class="search-bar">
            <a-input
              v-model:value="searchKeyword"
              placeholder="搜索项目..."
              allow-clear
            >
              <template #prefix>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </template>
            </a-input>
          </div>

          <div class="projects-grid">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="project-item"
              :class="{ selected: isProjectSelected(project.id) }"
              @click="toggleProjectSelection(project)"
            >
              <div class="project-thumb">
                <img v-if="project.coverImage" :src="getImageUrl(project.coverImage)" :alt="project.title" />
                <div v-else class="thumb-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
                  </svg>
                </div>
                <div v-if="isProjectSelected(project.id)" class="selected-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              <div class="project-info">
                <div class="project-title">{{ project.title }}</div>
                <div class="project-type">{{ project.type === 'screen' ? '大屏' : '报表' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a-button @click="pageSelectorVisible = false">取消</a-button>
          <a-button type="primary" @click="handleAddSelectedProjects">
            添加 {{ selectedProjects.length }} 个页面
          </a-button>
        </div>
      </div>
    </div>

    <!-- 编辑页面弹窗 -->
    <div class="modal-overlay" :class="{ open: editSlideVisible }" @click.self="editSlideVisible = false">
      <div class="edit-slide-modal">
        <div class="modal-header">
          <h3>编辑页面</h3>
          <div class="close-btn" @click="editSlideVisible = false">✕</div>
        </div>
        <div class="modal-body">
          <a-form layout="vertical">
            <a-form-item label="页面标题">
              <a-input v-model:value="editingSlide.title" placeholder="请输入页面标题" />
            </a-form-item>
            <a-form-item label="停留时长（秒）">
              <a-input-number
                v-model:value="editingSlide.duration"
                :min="1"
                :max="300"
                style="width: 100%"
              />
            </a-form-item>
          </a-form>
        </div>
        <div class="modal-footer">
          <a-button @click="editSlideVisible = false">取消</a-button>
          <a-button type="primary" @click="handleSaveSlideEdit">保存</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import draggable from 'vuedraggable'
import { getPlaylistDetail, updatePlaylist, updateSlides } from '@/api/playlist'
import { getProjectList } from '@/api/project'

const route = useRoute()
const router = useRouter()

// 数据
const playlist = ref({
  name: '',
  resolution: '1920x1080',
  transition: 'fade',
  interval: 10,
  description: '',
  slides: []
})
const slides = ref([])
const projects = ref([])
const saving = ref(false)

// 页面选择器
const pageSelectorVisible = ref(false)
const searchKeyword = ref('')
const selectedProjects = ref([])

// 编辑页面
const editSlideVisible = ref(false)
const editingSlide = ref({})
const editingIndex = ref(-1)

// 计算属性
const filteredProjects = computed(() => {
  if (!searchKeyword.value) return projects.value
  const keyword = searchKeyword.value.toLowerCase()
  return projects.value.filter(p =>
    p.title?.toLowerCase().includes(keyword) ||
    p.description?.toLowerCase().includes(keyword)
  )
})

// 加载数据
const loadPlaylist = async () => {
  try {
    const id = route.params.id
    const data = await getPlaylistDetail(id)
    playlist.value = {
      name: data.name || '',
      resolution: data.resolution || '1920x1080',
      transition: data.transition || 'fade',
      interval: data.interval || 10,
      description: data.description || '',
      slides: data.slides || []
    }

    // 处理 slides 数据，确保每个 slide 都有完整的信息
    slides.value = (data.slides || []).map((slide, index) => ({
      id: slide.id || `slide_${Date.now()}_${index}`,
      projectId: slide.projectId,
      title: slide.name || slide.title || '未命名页面',
      type: slide.type || 'screen',
      thumbnail: slide.thumbnail || '',
      duration: slide.duration || data.interval || 10
    }))
  } catch (error) {
    console.error('加载轮播详情失败:', error)
    message.error('加载轮播详情失败')
  }
}

const loadProjects = async () => {
  try {
    const data = await getProjectList()
    projects.value = data.filter(p => p.status === 'published')

    // 如果 slides 中有项目 ID 但缺少详细信息，从 projects 中补充
    if (slides.value.length > 0 && projects.value.length > 0) {
      slides.value = slides.value.map(slide => {
        const project = projects.value.find(p => p.id === slide.projectId)
        if (project && !slide.title) {
          return {
            ...slide,
            title: project.title,
            type: project.type,
            thumbnail: project.coverImage
          }
        }
        return slide
      })
    }
  } catch (error) {
    console.error('加载项目列表失败:', error)
    message.error('加载项目列表失败')
  }
}

// 获取图片 URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`
}

// 页面选择
const showPageSelector = () => {
  selectedProjects.value = []
  pageSelectorVisible.value = true
}

const isProjectSelected = (projectId) => {
  return selectedProjects.value.some(p => p.id === projectId)
}

const toggleProjectSelection = (project) => {
  const index = selectedProjects.value.findIndex(p => p.id === project.id)
  if (index > -1) {
    selectedProjects.value.splice(index, 1)
  } else {
    selectedProjects.value.push(project)
  }
}

const handleAddSelectedProjects = () => {
  selectedProjects.value.forEach(project => {
    slides.value.push({
      id: `slide_${Date.now()}_${Math.random()}`,
      projectId: project.id,
      title: project.title,
      type: project.type,
      thumbnail: project.coverImage,
      duration: playlist.value.interval
    })
  })
  pageSelectorVisible.value = false
  message.success(`已添加 ${selectedProjects.value.length} 个页面`)
}

// 编辑页面
const handleEditSlide = (slide, index) => {
  editingSlide.value = { ...slide }
  editingIndex.value = index
  editSlideVisible.value = true
}

const handleSaveSlideEdit = () => {
  if (editingIndex.value > -1) {
    slides.value[editingIndex.value] = { ...editingSlide.value }
    editSlideVisible.value = false
    message.success('页面已更新')
  }
}

// 移除页面
const handleRemoveSlide = (index) => {
  slides.value.splice(index, 1)
  message.success('页面已移除')
}

// 保存配置
const handleSave = async () => {
  try {
    saving.value = true
    const id = route.params.id

    // 更新轮播基本信息
    await updatePlaylist(id, {
      name: playlist.value.name,
      resolution: playlist.value.resolution,
      transition: playlist.value.transition,
      interval: playlist.value.interval,
      description: playlist.value.description
    })

    // 更新轮播页面 - 转换为后端需要的格式
    const slidesData = slides.value.map(slide => ({
      projectId: slide.projectId,
      duration: slide.duration || playlist.value.interval
    }))
    await updateSlides(id, slidesData)

    message.success('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 预览
const handlePreview = () => {
  message.info('预览功能开发中')
}

// 返回
const handleBack = () => {
  router.push('/workspace/playlist')
}

// 初始化
onMounted(async () => {
  await loadPlaylist()
  await loadProjects()
})
</script>

<style scoped>
.playlist-config-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

/* 头部 */
.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #f0f0f0;
}

.header-info h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-meta {
  display: flex;
  gap: 16px;
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 主体内容 */
.config-body {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

/* 左侧页面列表 */
.slides-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.slides-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-slides {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-slides p {
  margin-top: 16px;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slide-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: all 0.2s;
}

.slide-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.drag-handle {
  cursor: move;
  color: #999;
}

.slide-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
}

.slide-thumb {
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
}

.slide-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.slide-info {
  flex: 1;
}

.slide-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.slide-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.slide-actions {
  display: flex;
  gap: 8px;
}

/* 右侧配置面板 */
.config-panel {
  width: 320px;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

/* 页面选择器模态框 - 加大尺寸 */
.page-selector-modal {
  width: 60vw;
  max-height: 85vh;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 20px;
  color: #666;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.search-bar {
  margin-bottom: 24px;
}

/* 项目网格 - 加大卡片尺寸 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.project-item {
  cursor: pointer;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
  background: white;
}

.project-item:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-item.selected {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.project-thumb {
  position: relative;
  width: 100%;
  height: 160px;
  background: #f5f5f5;
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.project-info {
  padding: 16px;
}

.project-title {
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-type {
  font-size: 13px;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e8e8e8;
}

/* 编辑页面模态框 */
.edit-slide-modal {
  width: 500px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
</style>

