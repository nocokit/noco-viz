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
    <div class="filter-header">
      <div class="filter-tabs">
        <div
          v-for="filter in filters"
          :key="filter.id"
          :class="['filter-tab', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </div>
      </div>
      <div class="view-controls">
        <el-input
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索轮播组..."
          prefix-icon="Search"
          clearable
        />
        <div class="view-switcher">
          <el-tooltip content="网格视图" placement="top">
            <button
              :class="['view-btn', { active: viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
            >
              <el-icon><Grid /></el-icon>
            </button>
          </el-tooltip>
          <el-tooltip content="分栏视图" placement="top">
            <button
              :class="['view-btn', { active: viewMode === 'split' }]"
              @click="viewMode = 'split'"
            >
              <el-icon><Menu /></el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 空状态 -->
      <div v-if="filteredPlaylists.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: #6b7280; margin-bottom: 16px;">
          <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
        </svg>
        <div class="empty-title">暂无轮播组</div>
        <div class="empty-desc">暂时没有找到符合条件的轮播组</div>
      </div>

      <!-- 网格视图 -->
      <div v-else-if="viewMode === 'grid'" class="playlist-grid">
        <div
          v-for="playlist in filteredPlaylists"
          :key="playlist.id"
          class="playlist-card"
          @click="handleConfigPlaylist(playlist)"
        >
          <div class="card-header">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
              </svg>
            </div>
            <div class="card-status" :class="{ playing: playlist.status === 'playing' }">
              {{ playlist.status === 'playing' ? '● 播放中' : '闲置' }}
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ playlist.name }}</h3>
            <div class="card-meta">
              <span>{{ playlist.slides.length }} 个页面</span>
              <span>·</span>
              <span>{{ playlist.resolution }}</span>
            </div>
            <div class="card-info">
              <span>过渡: {{ getTransitionLabel(playlist.transition) }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" @click.stop="handleConfigPlaylist(playlist)">
              配置轮播
            </el-button>
            <el-dropdown @command="handleCommand($event, playlist)" @click.stop>
              <el-button size="small" text>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
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
          </div>
        </div>
      </div>

      <!-- 分栏视图 -->
      <div v-else-if="viewMode === 'split'" class="split-view">
        <!-- 左侧：轮播组列表 -->
        <div class="playlist-list">
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
                  :class="['status-dot', { playing: playlist.status === 'playing' }]"
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
              <el-button size="small" text @click="openEditModal(playlist)" title="编辑">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" text type="danger" @click="handleDelete(playlist)" title="删除">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 右侧：配置区 -->
        <div class="config-panel" v-if="selectedPlaylist">
          <div class="panel-toolbar">
            <div class="toolbar-title">
              {{ selectedPlaylist.name }}
              <span class="toolbar-subtitle">
                总时长: {{ totalDuration }}
              </span>
            </div>
            <div class="toolbar-actions">
              <el-button size="small" @click="copyPlaylistUrl">
                <el-icon><Link /></el-icon>
                复制链接
              </el-button>
              <el-button type="primary" size="small" @click="saveConfig">
                保存配置
              </el-button>
            </div>
          </div>

          <div class="slides-container">
            <!-- 轮播项 -->
            <div
              v-for="(slide, index) in selectedPlaylist.slides"
              :key="slide.id"
              class="slide-card"
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

            <!-- 添加按钮 -->
            <el-button class="add-slide-btn" @click="addSlide">
              <el-icon><Plus /></el-icon>
              添加大屏页面
            </el-button>
          </div>

          <!-- 底部信息栏 -->
          <div class="panel-footer">
            <div class="footer-info">
              <el-icon><Monitor /></el-icon>
              分辨率: {{ selectedPlaylist.resolution }}
            </div>
            <div class="footer-info">
              过渡效果:
              <el-select
                v-model="selectedPlaylist.transition"
                size="small"
                style="width: 140px; margin-left: 8px"
              >
                <el-option label="淡入淡出" value="fade" />
                <el-option label="直接切换" value="none" />
                <el-option label="滑动" value="slide" />
              </el-select>
            </div>
          </div>
        </div>

        <!-- 右侧空状态 -->
        <div v-else class="config-panel-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="color: #6b7280; margin-bottom: 16px;">
            <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
          </svg>
          <div class="empty-title">请选择轮播组</div>
          <div class="empty-desc">从左侧列表选择一个轮播组进行配置</div>
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
import { Plus, MoreFilled, Link, Rank, Delete, Edit, Grid, Menu, Monitor } from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
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
const viewMode = ref('grid') // 'grid' 或 'split'

// 筛选选项
const filters = [
  { id: 'all', label: '全部轮播' },
  { id: 'playing', label: '播放中' },
  { id: 'idle', label: '闲置' }
]

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

// 选择播放列表（分栏视图）
const selectPlaylist = (playlist) => {
  selectedPlaylist.value = playlist
}

// 打开配置轮播（网格视图）
const handleConfigPlaylist = (playlist) => {
  selectedPlaylist.value = playlist
  configModalVisible.value = true
}

// 复制链接
const copyPlaylistUrl = () => {
  const url = selectedPlaylist.value?.url || `http://localhost:8000/playlist/${selectedPlaylist.value?.id}`
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
.playlist-management {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
  padding: 24px;
}

/* ========== 头部区域 ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.header p {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* ========== 筛选头部 ========== */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.2s;
  white-space: nowrap;
  border: 1px solid transparent;
}

.filter-tab:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.filter-tab.active {
  background: var(--el-color-primary);
  color: #fff;
  border-color: var(--el-color-primary);
}

.view-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 240px;
}

.view-switcher {
  display: flex;
  gap: 4px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 4px;
  background: var(--el-fill-color-lighter);
}

.view-btn {
  padding: 6px 10px;
  border: none;
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

.view-btn.active {
  background: var(--el-color-primary);
  color: #fff;
}

/* ========== 内容区域 ========== */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding-top: 4px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--el-text-color-secondary);
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.empty-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* ========== 轮播网格 ========== */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.playlist-card {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.playlist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: var(--el-color-primary-light-9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
}

.card-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.card-status.playing {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.card-body {
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.card-meta {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
}

.card-info {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
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
