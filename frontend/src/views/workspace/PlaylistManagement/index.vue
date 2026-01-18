<template>
  <div class="playlist-management">
    <!-- 顶部 -->
    <div class="header">
      <div>
        <h2>多屏轮播 (Playlists)</h2>
        <p>将多个已发布的大屏组合成播放列表，在展厅、大堂等显示器循环播放。</p>
      </div>
      <el-button type="primary" @click="openCreateModal">
        <el-icon><Plus /></el-icon>
        新建轮播组
      </el-button>
    </div>

    <!-- 布局容器：左列表，右预览 -->
    <div class="layout-grid">
      <!-- 左侧：轮播组列表 -->
      <div class="playlist-list">
        <div class="list-header">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-mini"
            placeholder="搜索轮播组..."
          >
        </div>

        <div
          v-for="playlist in filteredPlaylists"
          :key="playlist.id"
          class="playlist-item"
          :class="{ selected: selectedPlaylist?.id === playlist.id }"
          @click="selectPlaylist(playlist)"
        >
          <div class="item-content">
            <div class="item-title">
              {{ playlist.name }}
              <span
                :style="{
                  color: playlist.status === 'playing' ? '#10b981' : '#9ca3af',
                  fontSize: '12px',
                  cursor: 'pointer'
                }"
                @click.stop="togglePlaylistStatus(playlist)"
                :title="playlist.status === 'playing' ? '点击设为闲置' : '点击设为播放中'"
              >
                ● {{ playlist.status === 'playing' ? '播放中' : '闲置' }}
              </span>
            </div>
            <div class="item-meta">
              <span>{{ playlist.slides.length }} 个页面</span>
              <span>{{ playlist.resolution }}</span>
            </div>
          </div>
          <div class="item-actions" @click.stop>
            <button class="action-btn" @click="openEditModal(playlist)" title="编辑">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button class="action-btn delete" @click="handleDelete(playlist)" title="删除">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：配置区 -->
      <div class="config-panel">
        <div class="panel-toolbar">
          <div style="font-weight: 600">
            {{ selectedPlaylist?.name }}
            <span
              style="
                font-weight: 400;
                font-size: 12px;
                color: #9ca3af;
                margin-left: 8px;
              "
            >
              总时长: {{ totalDuration }}
            </span>
          </div>
          <div style="display: flex; gap: 12px; align-items: center">
            <div class="playlist-url">
              {{ selectedPlaylist?.url }}
              <span class="copy-btn" @click="copyUrl">复制</span>
            </div>
            <button class="btn-primary" style="padding: 6px 12px" @click="saveConfig">
              保存配置
            </button>
          </div>
        </div>

        <div class="slides-container">
          <!-- 轮播项 -->
          <div
            v-for="(slide, index) in selectedPlaylist?.slides"
            :key="slide.id"
            class="slide-card"
          >
            <div class="drag-handle">☰</div>
            <div class="slide-thumb">
              <img :src="slide.thumbnail" class="thumb-img" />
            </div>
            <div class="slide-info">
              <div class="slide-name">{{ slide.name }}</div>
              <div class="slide-status">{{ slide.version }} • 已发布</div>
            </div>
            <div class="slide-settings">
              <input
                v-model.number="slide.duration"
                type="number"
                class="duration-input"
                min="1"
              />
              <span class="unit">秒</span>
              <div class="remove-btn" @click="removeSlide(index)">✕</div>
            </div>
          </div>

          <!-- 添加按钮 -->
          <button class="add-slide-btn" @click="addSlide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            添加大屏页面
          </button>
        </div>

        <!-- 底部预览条 -->
        <div v-if="selectedPlaylist" class="preview-footer">
          <div class="device-mock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
              />
            </svg>
            分辨率设置: {{ selectedPlaylist.resolution }} (16:9)
          </div>
          <div style="font-size: 12px; color: #9ca3af">
            过渡效果:
            <select
              v-model="selectedPlaylist.transition"
              style="
                background: #000;
                color: #fff;
                border: 1px solid #2d2e33;
                padding: 2px;
                border-radius: 4px;
              "
            >
              <option value="fade">淡入淡出 (Fade)</option>
              <option value="none">直接切换 (None)</option>
              <option value="slide">滑动 (Slide)</option>
            </select>
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
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
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
const isEditMode = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const editingPlaylistId = ref(null)
const loading = ref(false)

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
      slides: playlist.slides || []
    }))

    // 初始选中第一个
    if (playlists.value.length > 0 && !selectedPlaylist.value) {
      selectedPlaylist.value = playlists.value[0]
    }
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
  if (!searchKeyword.value) return playlists.value
  const keyword = searchKeyword.value.toLowerCase()
  return playlists.value.filter(p => p.name.toLowerCase().includes(keyword))
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

// 选择播放列表
const selectPlaylist = (playlist) => {
  selectedPlaylist.value = playlist
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

// 复制链接
const copyUrl = () => {
  ElMessage.success('播放链接已复制到剪贴板')
}

// 保存配置
const saveConfig = async () => {
  if (!selectedPlaylist.value) return

  try {
    await updateSlides(selectedPlaylist.value.id, selectedPlaylist.value.slides)
    ElMessage.success('配置已保存')
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
        // 编辑模式
        await updatePlaylist(editingPlaylistId.value, playlistData)
        ElMessage.success(`轮播组 "${formData.name}" 已更新`)
      } else {
        // 新建模式
        await createPlaylist(playlistData)
        ElMessage.success(`轮播组 "${formData.name}" 创建成功`)
      }

      // 重新加载列表
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

    // 清除选中
    if (selectedPlaylist.value?.id === playlist.id) {
      selectedPlaylist.value = null
    }

    // 重新加载列表
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

    // 更新本地数据
    playlist.status = newStatus
    if (selectedPlaylist.value?.id === playlist.id) {
      selectedPlaylist.value.status = newStatus
    }

    ElMessage.success(`已设为${newStatus === 'playing' ? '播放中' : '闲置'}`)
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新播放状态失败')
  }
}
</script>

<style scoped>
.playlist-management {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ========== 顶部 ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

.header p {
  color: #9ca3af;
  font-size: 13px;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

/* ========== 布局网格 ========== */
.layout-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  flex: 1;
  overflow: hidden;
}

/* ========== 左侧列表 ========== */
.playlist-list {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  padding: 16px;
  border-bottom: 1px solid #2d2e33;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-mini {
  background: #000;
  border: 1px solid #2d2e33;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  width: 120px;
  font-size: 12px;
}

.search-mini::placeholder {
  color: #6b7280;
}

.playlist-item {
  padding: 16px;
  border-bottom: 1px solid #2d2e33;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.playlist-item:hover {
  background: #26272c;
}

.playlist-item.selected {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
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
}

.item-meta {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  gap: 10px;
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

.action-btn {
  background: transparent;
  border: 1px solid #2d2e33;
  color: #9ca3af;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #26272c;
  color: #fff;
  border-color: #3b82f6;
}

.action-btn.delete:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* ========== 右侧配置面板 ========== */
.config-panel {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid #2d2e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.playlist-url {
  background: #000;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #2d2e33;
  font-family: monospace;
  color: #3b82f6;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  cursor: pointer;
  color: #9ca3af;
  font-size: 11px;
  transition: 0.2s;
}

.copy-btn:hover {
  color: #fff;
}

/* ========== 轮播项编辑区 ========== */
.slides-container {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.slide-card {
  display: flex;
  align-items: center;
  background: #0a0b0d;
  border: 1px solid #2d2e33;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  transition: 0.2s;
}

.slide-card:hover {
  border-color: #9ca3af;
}

.drag-handle {
  color: #9ca3af;
  cursor: grab;
  padding: 0 10px;
  font-size: 16px;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.slide-thumb {
  width: 80px;
  height: 45px;
  background: #333;
  border-radius: 4px;
  margin-right: 16px;
  position: relative;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.slide-info {
  flex: 1;
}

.slide-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.slide-status {
  font-size: 11px;
  color: #9ca3af;
}

.slide-settings {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
}

.duration-input {
  width: 60px;
  background: #000;
  border: 1px solid #2d2e33;
  color: #fff;
  padding: 4px;
  text-align: center;
  border-radius: 4px;
  font-size: 13px;
}

.duration-input::-webkit-inner-spin-button,
.duration-input::-webkit-outer-spin-button {
  opacity: 1;
}

.unit {
  font-size: 12px;
  color: #9ca3af;
}

.remove-btn {
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  transition: 0.2s;
}

.remove-btn:hover {
  color: #ef4444;
}

.add-slide-btn {
  width: 100%;
  border: 1px dashed #2d2e33;
  background: transparent;
  color: #9ca3af;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.add-slide-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* ========== 底部预览条 ========== */
.preview-footer {
  padding: 16px 24px;
  border-top: 1px solid #2d2e33;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.device-mock {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #9ca3af;
}
</style>
