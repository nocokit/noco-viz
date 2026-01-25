<template>
  <div class="playlist-management">
    <!-- 头部区域 -->
    <PageHeader
      title="轮播管理"
      description="将多个已发布的大屏组合成播放列表，在展厅、大堂等显示器循环播放。"
      :actions="[
        { text: '新建轮播组', icon: 'Plus', type: 'primary', handler: openCreateModal }
      ]"
    />

    <!-- 筛选和搜索 -->
    <FilterBar
      v-model="activeFilter"
      :filters="filters"
      :search-value="searchKeyword"
      search-placeholder="搜索轮播组..."
      @search="searchKeyword = $event"
    />

    <!-- 内容区域 -->
    <div class="content-scroll">
      <div class="grid-container">
        <!-- Playlist Cards -->
        <div
          v-for="playlist in filteredPlaylists"
          :key="playlist.id"
          class="playlist-card"
          :class="{ 'status-playing': playlist.status === 'playing' }"
        >
          <div class="card-image-header">
            <img
              v-if="playlist.coverImage"
              :src="playlist.coverImage"
              class="header-img"
              :alt="playlist.name"
            >
            <div v-else class="header-img-default">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" class="default-icon">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
              </svg>
              <div class="default-text">轮播列表</div>
            </div>
            <div class="card-overlay">
              <button class="overlay-btn btn-edit" @click="handleConfigPlaylist(playlist)">
                配置轮播
              </button>
              <button class="overlay-btn btn-preview" @click.stop="copyPlaylistUrl(playlist)">
                复制链接
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="card-header-row">
              <div class="card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="type-icon">
                  <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
                </svg>
                {{ playlist.name }}
              </div>
              <div class="card-actions-menu">
                <el-dropdown @command="handleCommand($event, playlist)">
                  <span class="el-dropdown-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="edit">编辑信息</el-dropdown-item>
                      <el-dropdown-item command="toggle">
                        {{ playlist.status === 'playing' ? '设为闲置' : '设为播放中' }}
                      </el-dropdown-item>
                      <el-dropdown-item command="copy">复制链接</el-dropdown-item>
                      <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <span
                  class="status-badge"
                  :class="{ playing: playlist.status === 'playing' }"
                >
                  {{ playlist.status === 'playing' ? '● 播放中' : '闲置' }}
                </span>
              </div>
            </div>
            <div class="card-desc">
              {{ playlist.slides.length }} 个页面 · {{ playlist.resolution }} · {{ getTransitionLabel(playlist.transition) }}
            </div>
            <div class="card-footer">
              <span>Playlist Carousel</span>
              <span>{{ playlist.updatedAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑轮播组模态框 -->
    <CommonModal
      v-model:visible="modalVisible"
      :title="isEditMode ? '编辑轮播组' : '新建轮播组'"
      width="600px"
      :confirm-text="isEditMode ? '保存' : '创建'"
      :loading="submitting"
      @close="closeModal"
      @confirm="handleSubmit"
    >
      <el-form :model="formData" label-position="top" :rules="formRules" ref="formRef">
        <el-form-item label="轮播组名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入轮播组名称，例如：公司大堂主屏"
            maxlength="50"
            show-word-limit
            size="large"
          />
        </el-form-item>

        <el-form-item label="分辨率" prop="resolution">
          <el-select
            v-model="formData.resolution"
            placeholder="请选择分辨率"
            size="large"
            style="width: 100%"
          >
            <el-option label="1920x1080 (Full HD)" value="1920x1080" />
            <el-option label="3840x2160 (4K)" value="3840x2160 (4K)" />
            <el-option label="2560x1440 (2K)" value="2560x1440 (2K)" />
            <el-option label="1366x768 (HD)" value="1366x768 (HD)" />
          </el-select>
        </el-form-item>

        <el-form-item label="过渡效果" prop="transition">
          <el-select
            v-model="formData.transition"
            placeholder="请选择过渡效果"
            size="large"
            style="width: 100%"
          >
            <el-option label="淡入淡出 (Fade)" value="fade" />
            <el-option label="直接切换 (None)" value="none" />
            <el-option label="滑动 (Slide)" value="slide" />
          </el-select>
        </el-form-item>
      </el-form>
    </CommonModal>

    <!-- 配置轮播模态框 -->
    <el-dialog
      v-model="configModalVisible"
      :title="`配置轮播组: ${selectedPlaylist?.name}`"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="config-content">
        <div class="config-toolbar">
          <div class="toolbar-info">
            <span class="info-label">总时长:</span>
            <span class="info-value">{{ totalDuration }}</span>
            <span class="info-label" style="margin-left: 24px">分辨率:</span>
            <span class="info-value">{{ selectedPlaylist?.resolution }}</span>
          </div>
          <div class="toolbar-actions">
            <el-button size="small" @click="copyPlaylistUrl">
              <el-icon><Link /></el-icon>
              复制链接
            </el-button>
          </div>
        </div>

        <div class="slides-list">
          <div
            v-for="(slide, index) in selectedPlaylist?.slides"
            :key="slide.id"
            class="slide-item"
          >
            <div class="slide-drag">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="slide-thumb">
              <img :src="slide.thumbnail" />
            </div>
            <div class="slide-info">
              <div class="slide-name">{{ slide.name }}</div>
              <div class="slide-version">{{ slide.version }} • 已发布</div>
            </div>
            <div class="slide-duration">
              <el-input-number
                v-model="slide.duration"
                :min="1"
                :max="3600"
                size="small"
              />
              <span class="duration-unit">秒</span>
            </div>
            <el-button
              type="danger"
              text
              size="small"
              @click="removeSlide(index)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>

          <el-button class="add-slide-btn" @click="addSlide">
            <el-icon><Plus /></el-icon>
            添加大屏页面
          </el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="configModalVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Link, Rank, Delete } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import FilterBar from '@/components/FilterBar.vue'
import CommonModal from '@/components/CommonModal.vue'
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  updateSlides,
  removeSlide as removeSlideApi,
  updatePlaylistStatus
} from '@/api/playlist'

const searchKeyword = ref('')
const selectedPlaylist = ref(null)
const modalVisible = ref(false)
const configModalVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const editingPlaylistId = ref(null)
const loading = ref(false)
const activeFilter = ref('all')

// 筛选选项
const filters = [
  { id: 'all', label: '全部轮播' },
  { id: 'playing', label: '播放中' },
  { id: 'idle', label: '闲置' }
]

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

// 表单数据
const formData = reactive({
  name: '',
  resolution: '1920x1080',
  transition: 'fade'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入轮播组名称', trigger: 'blur' },
    { min: 2, max: 50, message: '轮播组名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  resolution: [
    { required: true, message: '请选择分辨率', trigger: 'change' }
  ],
  transition: [
    { required: true, message: '请选择过渡效果', trigger: 'change' }
  ]
}

// 播放列表数据
const playlists = ref([])

// 加载播放列表
const loadPlaylists = async () => {
  try {
    loading.value = true
    const data = await getPlaylists()
    playlists.value = data.map(playlist => ({
      ...playlist,
      slides: playlist.slides || [],
      updatedAt: formatTime(playlist.updatedAt)
    }))
  } catch (error) {
    console.error('加载轮播列表失败:', error)
    ElMessage.error('加载轮播列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadPlaylists()
})

// 过滤后的播放列表
const filteredPlaylists = computed(() => {
  let result = playlists.value

  // 按状态筛选
  if (activeFilter.value === 'playing') {
    result = result.filter(p => p.status === 'playing')
  } else if (activeFilter.value === 'idle') {
    result = result.filter(p => p.status === 'idle')
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(keyword))
  }

  return result
})

// 总时长
const totalDuration = computed(() => {
  if (!selectedPlaylist.value) return '0秒'
  const total = selectedPlaylist.value.slides.reduce((sum, slide) => sum + slide.duration, 0)
  if (total >= 60) {
    const minutes = Math.floor(total / 60)
    const seconds = total % 60
    return `${minutes}分${seconds}秒`
  }
  return `${total}秒`
})

// 获取过渡效果标签
const getTransitionLabel = (transition) => {
  const labels = {
    fade: '淡入淡出',
    slide: '滑动',
    none: '直接切换'
  }
  return labels[transition] || transition
}

// 打开配置轮播（网格视图）
const handleConfigPlaylist = (playlist) => {
  selectedPlaylist.value = playlist
  configModalVisible.value = true
}

// 复制链接
const copyPlaylistUrl = (playlist) => {
  const url = playlist.url || `http://localhost:8000/playlist/${playlist.id}`
  navigator.clipboard.writeText(url)
  ElMessage.success('播放链接已复制到剪贴板')
}

// 处理下拉菜单命令
const handleCommand = async (command, playlist) => {
  switch (command) {
    case 'edit':
      openEditModal(playlist)
      break
    case 'toggle':
      await togglePlaylistStatus(playlist)
      break
    case 'copy':
      const url = playlist.url || `http://localhost:8000/playlist/${playlist.id}`
      navigator.clipboard.writeText(url)
      ElMessage.success('播放链接已复制到剪贴板')
      break
    case 'delete':
      await handleDelete(playlist)
      break
  }
}

// 移除轮播项
const removeSlide = async (index) => {
  if (selectedPlaylist.value.slides.length === 1) {
    ElMessage.warning('至少保留一个轮播项')
    return
  }

  try {
    const slide = selectedPlaylist.value.slides[index]
    if (slide.id) {
      await removeSlideApi(selectedPlaylist.value.id, slide.id)
    }
    selectedPlaylist.value.slides.splice(index, 1)
    ElMessage.success('已移除')
  } catch (error) {
    console.error('移除轮播项失败:', error)
    ElMessage.error('移除轮播项失败')
  }
}

// 添加轮播项
const addSlide = () => {
  const newSlide = {
    id: Date.now(),
    name: '新增大屏页面',
    version: 'v1.0',
    duration: 30,
    thumbnail: `https://picsum.photos/160/90?random=${Date.now()}`
  }
  selectedPlaylist.value.slides.push(newSlide)
  ElMessage.success('已添加')
}

// 保存配置
const saveConfig = async () => {
  if (!selectedPlaylist.value) return

  try {
    await updateSlides(selectedPlaylist.value.id, selectedPlaylist.value.slides)
    ElMessage.success('配置已保存')
    if (viewMode.value === 'grid') {
      configModalVisible.value = false
    }
    await loadPlaylists()
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  }
}

// 打开新建模态框
const openCreateModal = () => {
  isEditMode.value = false
  editingPlaylistId.value = null
  resetForm()
  modalVisible.value = true
}

// 打开编辑模态框
const openEditModal = (playlist) => {
  isEditMode.value = true
  editingPlaylistId.value = playlist.id
  formData.name = playlist.name
  formData.resolution = playlist.resolution
  formData.transition = playlist.transition
  modalVisible.value = true
}

// 关闭模态框
const closeModal = () => {
  modalVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.resolution = '1920x1080'
  formData.transition = 'fade'
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true

    try {
      const playlistData = {
        name: formData.name,
        resolution: formData.resolution,
        transition: formData.transition,
        status: 'idle',
        slides: []
      }

      if (isEditMode.value) {
        await updatePlaylist(editingPlaylistId.value, playlistData)
        ElMessage.success(`轮播组 "${formData.name}" 已更新`)
      } else {
        await createPlaylist(playlistData)
        ElMessage.success(`轮播组 "${formData.name}" 创建成功`)
      }

      await loadPlaylists()
      closeModal()
    } catch (error) {
      console.error('保存轮播组失败:', error)
      ElMessage.error('保存轮播组失败')
    } finally {
      submitting.value = false
    }
  })
}

// 删除轮播组
const handleDelete = async (playlist) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除轮播组 "${playlist.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await deletePlaylist(playlist.id)
    ElMessage.success('轮播组已删除')

    // 如果删除的是当前选中的，清除选中
    if (selectedPlaylist.value?.id === playlist.id) {
      selectedPlaylist.value = null
    }

    await loadPlaylists()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除轮播组失败:', error)
      ElMessage.error('删除轮播组失败')
    }
  }
}

// 切换轮播状态
const togglePlaylistStatus = async (playlist) => {
  try {
    const newStatus = playlist.status === 'playing' ? 'idle' : 'playing'
    await updatePlaylistStatus(playlist.id, newStatus)

    playlist.status = newStatus
    if (selectedPlaylist.value?.id === playlist.id) {
      selectedPlaylist.value.status = newStatus
    }

    ElMessage.success(`已设为${newStatus === 'playing' ? '播放中' : '闲置'}`)
    await loadPlaylists()
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新播放状态失败')
  }
}
</script>

<style scoped>
/* Global Vars from root (implied) */
.playlist-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  padding: 24px;
  overflow: hidden;
}

/* Content */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  margin-top: 0px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* Playlist Card */
.playlist-card {
  background: var(--el-bg-color); border: 1px solid var(--el-border-color); border-radius: 12px;
  overflow: hidden; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative; display: flex; flex-direction: column;
}
.playlist-card:hover {
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
.playlist-card:hover .header-img { transform: scale(1.05); filter: brightness(0.6); }

/* Default Image */
.header-img-default {
  width: 100%; height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(109, 40, 217, 0.25) 100%);
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
  color: #a78bfa;
}

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
.playlist-card:hover .card-overlay { opacity: 1; transform: translateY(0); }

.overlay-btn {
  padding: 8px 24px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer;
  border: none; display: flex; align-items: center; gap: 6px; transition: 0.2s;
}
.btn-edit { background: #a78bfa; color: #fff; }
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
.type-icon { width: 16px; height: 16px; color: #a78bfa; }

.status-badge { font-size: 10px; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.1); color: var(--el-text-color-secondary); }
.status-badge.playing { background: rgba(16, 185, 129, 0.15); color: #10b981; }

.card-desc { font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-footer {
  margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--el-text-color-secondary);
}

/* ========== 配置对话框 ========== */
.config-content {
  max-height: 600px;
  overflow-y: auto;
}

.config-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  margin-bottom: 20px;
}

.toolbar-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.info-label {
  color: var(--el-text-color-secondary);
}

.info-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.slides-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slide-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
}

.slide-drag {
  cursor: grab;
  color: var(--el-text-color-placeholder);
}

.slide-drag:active {
  cursor: grabbing;
}

.slide-thumb {
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--el-fill-color);
}

.slide-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-info {
  flex: 1;
}

.slide-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.slide-version {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.slide-duration {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.add-slide-btn {
  width: 100%;
  border-style: dashed;
}

/* ========== 分栏视图 ========== */
.split-view {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  height: 100%;
}

/* 左侧列表 */
.playlist-list {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow-y: auto;
  padding: 8px;
}

.playlist-item {
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.playlist-item:hover {
  background: var(--el-fill-color);
}

.playlist-item.selected {
  background: var(--el-color-primary-light-9);
  border-left: 3px solid var(--el-color-primary);
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-text-color-primary);
}

.status-dot {
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--el-text-color-secondary);
}

.status-dot.playing {
  color: #10b981;
}

.item-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  gap: 12px;
}

.item-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.playlist-item:hover .item-actions {
  opacity: 1;
}

/* 右侧配置面板 */
.config-panel {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-toolbar {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.toolbar-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
  margin-left: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.slides-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.slide-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
  margin-bottom: 12px;
  transition: all 0.2s;
}

.slide-card:hover {
  border-color: var(--el-border-color);
  background: var(--el-fill-color);
}

.slide-drag {
  cursor: grab;
  color: var(--el-text-color-placeholder);
}

.slide-drag:active {
  cursor: grabbing;
}

.slide-thumb {
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--el-fill-color);
  flex-shrink: 0;
}

.slide-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-info {
  flex: 1;
  min-width: 0;
}

.slide-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slide-version {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.slide-duration {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-unit {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.panel-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--el-fill-color-lighter);
  flex-shrink: 0;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

/* 右侧空状态 */
.config-panel-empty {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

</style>
