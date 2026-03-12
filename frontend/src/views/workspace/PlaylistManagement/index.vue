<template>
  <div class="playlist-management-page">
    <WorkspaceLayout
      :breadcrumb-items="breadcrumbItems"
      :filters="filters"
      :search-placeholder="'搜索轮播组...'"
      :view-modes="viewModes"
      :default-view="'grid'"
      :items="playlists"
      :filter-function="filterPlaylists"
      :search-function="searchPlaylists"
      @filter-change="handleFilterChange"
      @search="handleSearch"
      @view-change="handleViewChange"
    >
      <template #toolbar-extra>
        <a-button @click="loadPlaylists" title="刷新">
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
        <PlaylistCard
          v-for="playlist in items"
          :key="playlist.id"
          :playlist="playlist"
          @config="handleConfigPlaylist"
          @copy-url="copyPlaylistUrl"
          @action="handleMenuAction"
        />
      </template>

      <!-- List 视图 -->
      <template #list="{ items }">
        <div
          v-for="playlist in items"
          :key="playlist.id"
          class="playlist-list-item"
        >
          <div class="list-item-thumb">
            <img
              v-if="playlist.coverImage"
              :src="playlist.coverImage"
              :alt="playlist.name"
            />
            <div v-else class="list-item-thumb-default">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="thumb-icon">
                <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
              </svg>
            </div>
          </div>
          <div class="list-item-content">
            <div class="list-item-header">
              <div class="list-item-title-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="title-icon">
                  <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
                </svg>
                <span class="list-item-title">{{ playlist.name }}</span>
                <a-tag v-if="playlist.status === 'playing'" color="success">
                  播放中
                </a-tag>
                <a-tag v-else class="draft-tag">
                  闲置
                </a-tag>
              </div>
              <div class="list-item-actions">
                <a-button size="small" type="primary" @click="handleConfigPlaylist(playlist)">
                  <template #icon><SettingOutlined /></template>
                  配置轮播
                </a-button>
                <a-button size="small" @click="copyPlaylistUrl(playlist)">
                  <template #icon><LinkOutlined /></template>
                  复制链接
                </a-button>
                <a-dropdown>
                  <a-button size="small">
                    <template #icon><MoreOutlined /></template>
                  </a-button>
                  <template #overlay>
                    <a-menu @click="({ key }) => handleMenuAction(key, playlist)">
                      <a-menu-item key="edit">
                        <EditOutlined />
                        编辑信息
                      </a-menu-item>
                      <a-menu-item key="toggle">
                        <SwapOutlined />
                        {{ playlist.status === 'playing' ? '设为闲置' : '设为播放中' }}
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
            <div class="list-item-desc">{{ playlist.description || '暂无描述' }}</div>
            <div class="list-item-meta">
              <a-space :size="16">
                <span class="meta-text">
                  <PlayCircleOutlined />
                  <span class="meta-number">{{ playlist.screenCount || 0 }}</span> 个大屏
                </span>
                <span class="meta-text">
                  <ClockCircleOutlined />
                  间隔 <span class="meta-number">{{ playlist.interval || 10 }}</span> 秒
                </span>
                <span class="meta-text">
                  <CalendarOutlined />
                  更新于 {{ playlist.updatedAt }}
                </span>
              </a-space>
            </div>
          </div>
        </div>
      </template>
    </WorkspaceLayout>

    <!-- 创建/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalMode === 'create' ? '新增轮播组' : '编辑轮播组'"
      :width="600"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-form-item label="轮播名称" name="name">
          <a-input
            v-model:value="formData.name"
            placeholder="请输入轮播名称"
            :maxlength="100"
          />
        </a-form-item>

        <a-form-item label="分辨率" name="resolution">
          <a-select v-model:value="formData.resolution" placeholder="请选择分辨率">
            <a-select-option value="1920x1080">1920x1080 (Full HD)</a-select-option>
            <a-select-option value="3840x2160">3840x2160 (4K)</a-select-option>
            <a-select-option value="1280x720">1280x720 (HD)</a-select-option>
            <a-select-option value="2560x1440">2560x1440 (2K)</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="切换效果" name="transition">
          <a-select v-model:value="formData.transition" placeholder="请选择切换效果">
            <a-select-option value="fade">淡入淡出</a-select-option>
            <a-select-option value="slide">滑动</a-select-option>
            <a-select-option value="zoom">缩放</a-select-option>
            <a-select-option value="none">无</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="切换间隔（秒）" name="interval">
          <a-input-number
            v-model:value="formData.interval"
            :min="10"
            :max="300"
            placeholder="秒"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入描述"
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

    <!-- 轮播配置抽屉 -->
    <a-drawer
      v-model:open="configDrawerVisible"
      title="轮播配置"
      placement="right"
      :width="drawerWidth"
      :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }"
      destroy-on-close
    >
      <template #extra>
        <a-space>
          <a-button @click="configDrawerVisible = false">
            关闭
          </a-button>
          <a-button type="primary" @click="handleSaveConfig" :loading="savingConfig">
            <template #icon>
              <SaveOutlined />
            </template>
            保存
          </a-button>
        </a-space>
      </template>
      <div class="config-drawer-content">
        <!-- 主体内容 -->
        <div class="config-body">
          <!-- 左侧：页面列表 -->
          <div class="slides-panel">
            <div class="panel-header">
              <h4>轮播页面序列</h4>
              <a-button type="link" size="small" @click="showPageSelector">
                <template #icon>
                  <PlusOutlined />
                </template>
                添加页面
              </a-button>
            </div>

            <div class="slides-list">
              <div v-if="configSlides.length === 0" class="empty-state">
                <a-empty description="">
                  <template #image>
                    <FileImageOutlined :style="{ fontSize: '64px', color: '#d9d9d9' }" />
                  </template>
                  <template #description>
                    <div class="empty-description">
                      <p class="empty-title">暂无轮播页面</p>
                      <p class="empty-text">点击下方按钮添加页面到轮播序列</p>
                    </div>
                  </template>
                  <a-button type="primary" @click="showPageSelector">
                    <template #icon>
                      <PlusOutlined />
                    </template>
                    添加页面
                  </a-button>
                </a-empty>
              </div>

              <draggable
                v-else
                v-model="configSlides"
                item-key="id"
                handle=".drag-handle"
                animation="200"
                class="draggable-list"
              >
                <template #item="{ element, index }">
                  <div class="slide-item">
                    <div class="drag-handle">
                      <HolderOutlined />
                    </div>
                    <div class="slide-index">{{ index + 1 }}</div>
                    <div class="slide-thumb">
                      <img v-if="element.thumbnail" :src="getImageUrl(element.thumbnail)" :alt="element.title" />
                      <div v-else class="thumb-placeholder">
                        <FileImageOutlined :style="{ fontSize: '24px', color: '#d9d9d9' }" />
                      </div>
                    </div>
                    <div class="slide-info">
                      <div class="slide-title">{{ element.title || '未命名页面' }}</div>
                      <a-space :size="12" class="slide-meta">
                        <a-tag size="small">
                          {{ element.type === 'screen' ? '大屏' : '报表' }}
                        </a-tag>
                        <span class="meta-text">
                          <ClockCircleOutlined />
                          {{ element.duration || 10 }}秒
                        </span>
                      </a-space>
                    </div>
                    <div class="slide-actions">
                      <a-button type="link" size="small" @click="handleEditSlide(element, index)">
                        <EditOutlined />
                      </a-button>
                      <a-button type="link" size="small" danger @click="handleRemoveSlide(index)">
                        <DeleteOutlined />
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
              <h4>轮播设置</h4>
            </div>
            <div class="panel-body">
              <a-form layout="vertical">
                <a-form-item label="轮播名称">
                  <a-input v-model:value="configFormData.name" placeholder="请输入轮播名称" />
                </a-form-item>

                <a-form-item label="分辨率">
                  <a-select v-model:value="configFormData.resolution">
                    <a-select-option value="1920x1080">1920x1080 (Full HD)</a-select-option>
                    <a-select-option value="3840x2160">3840x2160 (4K)</a-select-option>
                    <a-select-option value="1280x720">1280x720 (HD)</a-select-option>
                    <a-select-option value="2560x1440">2560x1440 (2K)</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="切换效果">
                  <a-select v-model:value="configFormData.transition">
                    <a-select-option value="fade">淡入淡出</a-select-option>
                    <a-select-option value="slide">滑动</a-select-option>
                    <a-select-option value="zoom">缩放</a-select-option>
                    <a-select-option value="none">无</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="默认切换间隔（秒）">
                  <a-input-number
                    v-model:value="configFormData.interval"
                    :min="10"
                    :max="300"
                    style="width: 100%"
                  />
                </a-form-item>

                <a-form-item label="描述">
                  <a-textarea
                    v-model:value="configFormData.description"
                    :rows="4"
                    placeholder="请输入描述"
                  />
                </a-form-item>
              </a-form>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 页面选择器弹窗 -->
    <a-modal
      v-model:open="pageSelectorVisible"
      title="选择页面"
      :width="800"
      @cancel="pageSelectorVisible = false"
    >
      <div class="page-selector-content">
        <a-input
          v-model:value="projectSearchKeyword"
          placeholder="搜索项目..."
          allow-clear
          style="margin-bottom: 16px"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>

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
                <FileImageOutlined :style="{ fontSize: '32px', color: '#d9d9d9' }" />
              </div>
              <div v-if="isProjectSelected(project.id)" class="selected-badge">
                <CheckOutlined />
              </div>
            </div>
            <div class="project-info">
              <div class="project-title">{{ project.title }}</div>
              <a-tag size="small">{{ project.type === 'screen' ? '大屏' : '报表' }}</a-tag>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <a-button @click="pageSelectorVisible = false">取消</a-button>
        <a-button type="primary" @click="handleAddSelectedProjects" :disabled="selectedProjects.length === 0">
          添加 {{ selectedProjects.length }} 个页面
        </a-button>
      </template>
    </a-modal>

    <!-- 编辑页面弹窗 -->
    <a-modal
      v-model:open="editSlideVisible"
      title="编辑页面"
      :width="500"
      @cancel="editSlideVisible = false"
    >
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

      <template #footer>
        <a-button @click="editSlideVisible = false">取消</a-button>
        <a-button type="primary" @click="handleSaveSlideEdit">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, h } from 'vue'
import { message, Empty } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  LinkOutlined,
  MoreOutlined,
  EditOutlined,
  SwapOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SearchOutlined,
  FileImageOutlined,
  CheckOutlined,
  SaveOutlined,
  HolderOutlined
} from '@ant-design/icons-vue'
import WorkspaceLayout from '@/components/workspace/WorkspaceLayout.vue'
import PlaylistCard from '@/components/workspace/PlaylistCard.vue'
import { usePlaylistOperations } from './usePlaylistOperations'
import draggable from 'vuedraggable'
import {
  createPlaylist,
  updatePlaylist,
  getPlaylistDetail,
  updateSlides
} from '@/api/playlist'
import { getProjectList } from '@/api/project'

const router = useRouter()
const formRef = ref()

// 使用轮播操作 hook
const {
  playlists,
  loading,
  loadPlaylists,
  copyPlaylistUrl,
  handleToggleStatus,
  handleDeletePlaylist
} = usePlaylistOperations()

// 面包屑
const breadcrumbItems = [
  { label: '首页', path: '/' },
  { label: '工作台', path: '/workspace' },
  { label: '轮播管理' }
]

// 筛选器
const filters = [
  { id: 'all', label: '全部', count: computed(() => playlists.value.length) },
  { id: 'playing', label: '播放中', count: computed(() => playlists.value.filter(p => p.status === 'playing').length) },
  { id: 'idle', label: '闲置', count: computed(() => playlists.value.filter(p => p.status === 'idle').length) }
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

// 当前筛选
const currentFilter = ref('all')
const searchKeyword = ref('')

// 筛选和搜索函数
const filterPlaylists = (items, filterValue) => {
  if (filterValue === 'all') return items
  return items.filter(item => item.status === filterValue)
}

const searchPlaylists = (items, keyword) => {
  if (!keyword) return items
  const lowerKeyword = keyword.toLowerCase()
  return items.filter(item =>
    item.name?.toLowerCase().includes(lowerKeyword) ||
    item.description?.toLowerCase().includes(lowerKeyword)
  )
}

// 处理筛选变化
const handleFilterChange = (value) => {
  currentFilter.value = value
}

// 处理搜索
const handleSearch = (keyword) => {
  searchKeyword.value = keyword
}

// 处理视图变化
const handleViewChange = (view) => {
  console.log('View changed to:', view)
}

// 弹窗相关
const modalVisible = ref(false)
const modalMode = ref('create')
const currentPlaylist = ref(null)
const submitting = ref(false)

// 抽屉相关
const configDrawerVisible = ref(false)
const currentConfigPlaylist = ref(null)
const configSlides = ref([])
const savingConfig = ref(false)
const drawerWidth = computed(() => {
  return 'calc(100% - 240px)'
})

// 配置表单数据
const configFormData = reactive({
  name: '',
  resolution: '1920x1080',
  transition: 'fade',
  interval: 60,
  description: ''
})

// 页面选择器
const pageSelectorVisible = ref(false)
const projectSearchKeyword = ref('')
const selectedProjects = ref([])
const projects = ref([])

// 编辑页面
const editSlideVisible = ref(false)
const editingSlide = ref({})
const editingIndex = ref(-1)

const formData = reactive({
  name: '',
  resolution: '1920x1080',
  transition: 'fade',
  interval: 60,
  description: ''
})

const formRules = {
  name: [{ required: true, message: '请输入轮播名称', trigger: 'blur' }],
  resolution: [{ required: true, message: '请选择分辨率', trigger: 'change' }],
  transition: [{ required: true, message: '请选择切换效果', trigger: 'change' }],
  interval: [{ required: true, message: '请输入切换间隔', trigger: 'blur' }]
}

// 打开创建弹窗
const openCreateModal = () => {
  modalMode.value = 'create'
  currentPlaylist.value = null
  Object.assign(formData, {
    name: '',
    resolution: '1920x1080',
    transition: 'fade',
    interval: 60,
    description: ''
  })
  modalVisible.value = true
}

// 编辑轮播
const handleEditPlaylist = (playlist) => {
  modalMode.value = 'edit'
  currentPlaylist.value = playlist
  Object.assign(formData, {
    name: playlist.name,
    resolution: playlist.resolution,
    transition: playlist.transition,
    interval: playlist.interval,
    description: playlist.description || ''
  })
  modalVisible.value = true
}

// 配置轮播
const handleConfigPlaylist = async (playlist) => {
  currentConfigPlaylist.value = playlist
  await loadConfigData(playlist.id)
  configDrawerVisible.value = true
}

// 加载配置数据
const loadConfigData = async (playlistId) => {
  try {
    const data = await getPlaylistDetail(playlistId)
    Object.assign(configFormData, {
      name: data.name || '',
      resolution: data.resolution || '1920x1080',
      transition: data.transition || 'fade',
      interval: data.interval || 10,
      description: data.description || ''
    })

    configSlides.value = (data.slides || []).map((slide, index) => ({
      id: slide.id || `slide_${Date.now()}_${index}`,
      projectId: slide.projectId,
      title: slide.name || slide.title || '未命名页面',
      type: slide.type || 'screen',
      thumbnail: slide.thumbnail || '',
      duration: slide.duration || data.interval || 10
    }))

    await loadProjects()
  } catch (error) {
    console.error('加载轮播详情失败:', error)
    message.error('加载轮播详情失败')
  }
}

// 加载项目列表
const loadProjects = async () => {
  try {
    const data = await getProjectList()
    projects.value = data.filter(p => p.status === 'published')

    if (configSlides.value.length > 0 && projects.value.length > 0) {
      configSlides.value = configSlides.value.map(slide => {
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

// 保存配置
const handleSaveConfig = async () => {
  try {
    savingConfig.value = true
    const id = currentConfigPlaylist.value.id

    await updatePlaylist(id, {
      name: configFormData.name,
      resolution: configFormData.resolution,
      transition: configFormData.transition,
      interval: configFormData.interval,
      description: configFormData.description
    })

    const slidesData = configSlides.value.map(slide => ({
      projectId: slide.projectId,
      duration: slide.duration || configFormData.interval
    }))
    await updateSlides(id, slidesData)

    message.success('配置已保存')
    configDrawerVisible.value = false
    await loadPlaylists()
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
  } finally {
    savingConfig.value = false
  }
}

// 预览
const handlePreview = () => {
  message.info('预览功能开发中')
}

// 显示页面选择器
const showPageSelector = () => {
  selectedProjects.value = []
  pageSelectorVisible.value = true
}

// 过滤项目
const filteredProjects = computed(() => {
  if (!projectSearchKeyword.value) return projects.value
  const keyword = projectSearchKeyword.value.toLowerCase()
  return projects.value.filter(p =>
    p.title?.toLowerCase().includes(keyword) ||
    p.description?.toLowerCase().includes(keyword)
  )
})

// 判断项目是否被选中
const isProjectSelected = (projectId) => {
  return selectedProjects.value.some(p => p.id === projectId)
}

// 切换项目选择
const toggleProjectSelection = (project) => {
  const index = selectedProjects.value.findIndex(p => p.id === project.id)
  if (index > -1) {
    selectedProjects.value.splice(index, 1)
  } else {
    selectedProjects.value.push(project)
  }
}

// 添加选中的项目
const handleAddSelectedProjects = () => {
  selectedProjects.value.forEach(project => {
    configSlides.value.push({
      id: `slide_${Date.now()}_${Math.random()}`,
      projectId: project.id,
      title: project.title,
      type: project.type,
      thumbnail: project.coverImage,
      duration: configFormData.interval
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

// 保存页面编辑
const handleSaveSlideEdit = () => {
  if (editingIndex.value > -1) {
    configSlides.value[editingIndex.value] = { ...editingSlide.value }
    editSlideVisible.value = false
    message.success('页面已更新')
  }
}

// 移除页面
const handleRemoveSlide = (index) => {
  configSlides.value.splice(index, 1)
  message.success('页面已移除')
}

// 获取图片URL
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  // 如果路径以 / 开头，直接使用（由 vite proxy 处理）
  if (path.startsWith('/')) return path
  // 否则拼接完整路径
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${path}`
}

// 弹窗确认
const handleModalOk = async () => {
  try {
    await formRef.value.validate()

    submitting.value = true

    if (modalMode.value === 'create') {
      await createPlaylist(formData)
      message.success('轮播组创建成功')
    } else {
      await updatePlaylist(currentPlaylist.value.id, formData)
      message.success('轮播组更新成功')
    }

    submitting.value = false
    modalVisible.value = false
    await loadPlaylists()
  } catch (error) {
    submitting.value = false
    if (error.errorFields) {
      // 表单验证错误
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

// 菜单操作
const handleMenuAction = (key, playlist) => {
  switch (key) {
    case 'edit':
      handleEditPlaylist(playlist)
      break
    case 'toggle':
      handleToggleStatus(playlist)
      break
    case 'copy':
      copyPlaylistUrl(playlist)
      break
    case 'delete':
      handleDeletePlaylist(playlist)
      break
  }
}

// 获取切换效果标签
const getTransitionLabel = (transition) => {
  const labels = {
    fade: '淡入淡出',
    slide: '滑动',
    zoom: '缩放',
    none: '无'
  }
  return labels[transition] || transition
}

// 初始化
onMounted(() => {
  loadPlaylists()
})
</script>

<style scoped>
/* 配置抽屉样式 */
.config-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.config-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧页面列表 */
.slides-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
  background: #fff;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.panel-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.slides-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
}

.empty-description {
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.draggable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slide-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.slide-item:hover {
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #bfbfbf;
  cursor: grab;
  flex-shrink: 0;
}

.drag-handle:active {
  cursor: grabbing;
}

.slide-index {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  flex-shrink: 0;
}

.slide-thumb {
  width: 80px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
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
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
}

.slide-info {
  flex: 1;
  min-width: 0;
}

.slide-title {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slide-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.meta-text :deep(.anticon) {
  font-size: 12px;
}

.meta-number {
  color: #1890ff;
  font-size: 13px;
}

.slide-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

/* 右侧配置面板 */
.config-panel {
  width: 320px;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 页面选择器样式 */
.page-selector-content {
  max-height: 500px;
  overflow-y: auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.project-item {
  position: relative;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.project-item.selected {
  border-color: #1890ff;
  background: #e6f7ff;
}

.project-thumb {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #f5f5f5;
}

.project-thumb img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: #1890ff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.project-info {
  padding: 8px;
  background: #fff;
}

.project-title {
  font-size: 13px;
  color: #262626;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 列表视图样式 */
.playlist-list-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.playlist-list-item:hover {
  border-color: #d9d9d9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.list-item-thumb {
  width: 160px;
  height: 90px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
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
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
}

.list-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.list-item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
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
  font-weight: 500;
  color: #262626;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.list-item-desc {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-meta {
  margin-top: auto;
}

.draft-tag {
  background: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
  font-weight: 500;
}
</style>


