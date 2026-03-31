<template>
  <div class="media-layout">
    <!-- 面包屑导航 -->
    <BreadcrumbHeader :items="[
      { label: '首页', path: '/' },
      { label: '资产管理', path: '/media' },
      { label: '媒体资源库' }
    ]" />

    <!-- 主内容区 -->
    <div class="media-content">
      <!-- 左侧筛选面板 -->
      <aside class="filter-panel">
        <div class="filter-header">类型筛选</div>
        <div class="filter-list">
          <div
            :class="['filter-item', { active: activeTypeFilter === 'all' }]"
            @click="activeTypeFilter = 'all'"
          >
            <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
            <span>全部资源</span>
            <span class="filter-count">{{ mockMediaList.length }}</span>
          </div>
          <div
            :class="['filter-item', { active: activeTypeFilter === 'image' }]"
            @click="activeTypeFilter = 'image'"
          >
            <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span>图片</span>
            <span class="filter-count">{{ getTypeCount('image') }}</span>
          </div>
          <div
            :class="['filter-item', { active: activeTypeFilter === 'video' }]"
            @click="activeTypeFilter = 'video'"
          >
            <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
            <span>视频</span>
            <span class="filter-count">{{ getTypeCount('video') }}</span>
          </div>
          <div
            :class="['filter-item', { active: activeTypeFilter === '3d' }]"
            @click="activeTypeFilter = '3d'"
          >
            <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9M12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15M5 15.91l6 3.38v-6.71L5 9.21v6.7m14 0v-6.7l-6 3.37v6.71l6-3.38z"/>
            </svg>
            <span>3D模型</span>
            <span class="filter-count">{{ getTypeCount('3d') }}</span>
          </div>
          <div
            :class="['filter-item', { active: activeTypeFilter === 'audio' }]"
            @click="activeTypeFilter = 'audio'"
          >
            <svg class="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/>
            </svg>
            <span>音频</span>
            <span class="filter-count">{{ getTypeCount('audio') }}</span>
          </div>
        </div>

        <!-- 分类筛选 -->
      </aside>

      <!-- 右侧内容区 -->
      <div class="content-main">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="tool-actions">
            <div class="toolbar-left">
              <div class="search-box">
                <input
                  v-model="searchQuery"
                  class="search-input"
                  type="text"
                  placeholder="搜索文件名..."
                />
              </div>

              <!-- 批量删除按钮 -->
              <button
                v-if="selectedAssets.length > 0"
                class="btn btn-danger"
                @click="handleBatchDelete"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                删除选中 ({{ selectedAssets.length }})
              </button>
            </div>

            <div class="toolbar-right">
              <!-- 刷新按钮 -->
              <button
                class="btn btn-default"
                @click="handleRefresh"
                title="刷新"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>

              <!-- 视图切换 -->
              <div class="view-toggle">
                <button
                  :class="['toggle-btn', { active: viewMode === 'grid' }]"
                  @click="viewMode = 'grid'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                  </svg>
                </button>
                <button
                  :class="['toggle-btn', { active: viewMode === 'list' }]"
                  @click="viewMode = 'list'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </button>
              </div>

              <button class="btn btn-primary" @click="showUploadDialog">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                </svg>
              上传文件
            </button>
            </div>
          </div>
        </div>

      <!-- 资源网格 -->
      <div class="grid-scroll">
        <!-- 空状态 -->
        <div v-if="!loading && filteredMedia.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" class="empty-icon">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <div class="empty-title">{{ searchQuery ? '未找到匹配的文件' : '暂无媒体资源' }}</div>
          <div class="empty-desc">{{ searchQuery ? '尝试修改搜索关键词' : '点击「上传文件」添加图片、视频等媒体资源' }}</div>
          <button v-if="!searchQuery" class="btn btn-primary" @click="showUploadDialog" style="margin-top: 16px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            上传文件
          </button>
        </div>

        <!-- 网格视图 -->
        <div v-else-if="viewMode === 'grid'" class="asset-grid">
          <div
            v-for="item in filteredMedia"
            :key="item.id"
            :class="['asset-card', {
              selected: selectedAssets.some(a => a.id === item.id)
            }]"
            @click="toggleAssetSelection(item, $event)"
          >
            <!-- Thumb Wrapper -->
            <div :class="['thumb-wrapper', { transparent: item.type === 'image' && item.name.endsWith('.png') }]">
              <!-- Badges -->
              <span v-if="item.type === '3d'" class="type-badge badge-3d">GLB</span>
              <span v-else-if="item.type === 'video'" class="type-badge badge-video">{{ item.duration || '0:15' }}</span>

              <!-- Image / Preview -->
              <img
                :src="getMediaUrl(item)"
                class="asset-img"
                :style="getFilterStyle(item.type)"
                @error="handleImageError"
              >

              <div class="select-check">✓</div>

              <!-- Video Play Icon -->
              <svg v-if="item.type === 'video'" style="position:absolute; width:32px; height:32px; color:rgba(255,255,255,0.8); pointer-events:none" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
            </div>

            <!-- Info -->
            <div class="asset-info">
              <div class="asset-name">{{ item.name }}</div>
              <div class="asset-meta">
                <span>{{ item.meta1 }}</span>
                <span>{{ formatSize(item.size) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else class="asset-list">
          <table class="media-table">
            <thead>
              <tr>
                <th style="width: 80px">预览</th>
                <th style="min-width: 200px">文件名</th>
                <th style="width: 100px">类型</th>
                <th style="width: 120px">尺寸/分辨率</th>
                <th style="width: 100px">大小</th>
                <th style="width: 180px">上传时间</th>
                <th style="width: 180px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in filteredMedia"
                :key="row.id"
                :class="{ 'selected-row': selectedAssets.some(a => a.id === row.id) }"
                @click="toggleAssetSelection(row, $event)"
              >
                <td>
                  <div class="list-thumb">
                    <img :src="getMediaUrl(row)" @error="handleImageError" />
                    <span v-if="row.type === '3d'" class="type-badge badge-3d">GLB</span>
                    <span v-else-if="row.type === 'video'" class="type-badge badge-video">MP4</span>
                  </div>
                </td>
                <td>{{ row.name }}</td>
                <td>
                  <span class="type-tag">{{ getMimeType(row.type) }}</span>
                </td>
                <td>{{ row.meta1 }}</td>
                <td>{{ formatSize(row.size) }}</td>
                <td>{{ formatDate(row.uploadTime) }}</td>
                <td>
                  <button class="btn-link btn-primary" @click.stop="showEditDialog(row)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    编辑
                  </button>
                  <button class="btn-link btn-danger" @click.stop="handleDelete(row)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>

    <!-- 3. 详情面板 (Right Sidebar) -->
    <aside class="detail-panel" v-if="selectedAsset">
      <div class="detail-header">
        资源详情
        <div class="close-detail" @click="selectedAsset = null">✕</div>
      </div>
      <div class="detail-body">
        <div class="preview-box">
          <img :src="getMediaUrl(selectedAsset)" class="preview-img" @error="handleImageError">
        </div>

        <div class="prop-row">
          <div class="prop-label">文件名称</div>
          <div class="prop-value">{{ selectedAsset.name }}</div>
        </div>
        
        <div class="prop-row">
          <div class="prop-label">文件类型</div>
          <div class="prop-value">{{ getMimeType(selectedAsset.type) }}</div>
        </div>

        <div class="prop-row">
          <div class="prop-label">分辨率 / 尺寸</div>
          <div class="prop-value">{{ selectedAsset.meta1 }}</div>
        </div>

        <div class="prop-row">
          <div class="prop-label">文件大小</div>
          <div class="prop-value">{{ formatSize(selectedAsset.size) }}</div>
        </div>

        <div class="prop-row">
          <div class="prop-label">上传时间</div>
          <div class="prop-value">{{ formatDate(selectedAsset.uploadTime) }}</div>
        </div>

        <div class="prop-row">
          <div class="prop-label">上传人</div>
          <div class="prop-value">David Miller</div>
        </div>

        <div class="prop-row">
          <div class="prop-label">引用项目</div>
          <div class="prop-value" style="color:var(--primary); cursor:pointer">智慧城市大屏, 销售战报</div>
        </div>

        <div class="prop-row">
          <div class="prop-label">标签</div>
          <div class="tag-list">
            <span v-for="tag in selectedAsset.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="detail-footer">
        <div class="btn-full btn-edit" @click="showEditDialog(selectedAsset)">编辑</div>
        <div class="btn-full btn-delete" @click="handleDelete(selectedAsset)">删除</div>
      </div>
    </aside>

    <!-- 上传对话框 -->
    <div v-if="uploadDialogVisible" class="modal-overlay" @click.self="uploadDialogVisible = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>上传文件</h3>
          <button class="modal-close" @click="uploadDialogVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="upload-area" @click="triggerFileInput">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,video/*,.glb,.gltf"
              style="display: none"
              @change="handleFileInputChange"
            />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="color: var(--text-secondary)">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <div class="upload-text">
              拖拽文件到此处或 <span style="color: var(--primary)">点击上传</span>
            </div>
            <div class="upload-tip">
              支持 jpg/png/gif/mp4/glb 等格式，单个文件不超过 50MB
            </div>
          </div>

          <!-- 文件列表 -->
          <div v-if="uploadFileList.length > 0" class="upload-file-list">
            <div v-for="(file, index) in uploadFileList" :key="index" class="upload-file-item">
              <div class="file-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
                </svg>
                <span class="original-name">{{ file.name }}</span>
              </div>
              <input
                v-model="file.customName"
                class="file-name-input"
                placeholder="自定义文件名"
              />
              <button class="btn-icon btn-danger" @click="removeUploadFile(index)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="uploadDialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="handleUpload" :disabled="uploading">
            {{ uploading ? '上传中...' : `上传 (${uploadFileList.length})` }}
          </button>
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div v-if="editDialogVisible" class="modal-overlay" @click.self="editDialogVisible = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>编辑资源</h3>
          <button class="modal-close" @click="editDialogVisible = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>文件名</label>
            <input v-model="editForm.name" class="form-input" placeholder="请输入文件名" />
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="editForm.category" class="form-input">
              <option value="">无分类</option>
              <option value="screen-bg">大屏背景</option>
            </select>
          </div>
          <div class="form-group">
            <label>标签</label>
            <div class="tag-input-wrapper">
              <div class="selected-tags">
                <span v-for="tag in editForm.tags" :key="tag" class="selected-tag">
                  {{ tag }}
                  <button class="tag-remove" @click="removeTag(tag)">✕</button>
                </span>
              </div>
              <input
                v-model="newTag"
                class="form-input"
                placeholder="输入标签后按回车添加"
                @keyup.enter="addTag"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="editDialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="handleEdit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BreadcrumbHeader from '@/components/BreadcrumbHeader.vue'
import {
  getMediaList,
  uploadMedia,
  updateMedia,
  deleteMedia,
  batchDeleteMedia
} from '@/api/media'

// 简单的消息提示函数
const showMessage = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => toast.classList.add('show'), 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 3000)
}

// 简单的确认对话框
const showConfirm = (message) => {
  return new Promise((resolve) => {
    if (window.confirm(message)) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

// State
const activeTypeFilter = ref('all') // 类型筛选
const searchQuery = ref('')
const selectedAsset = ref(null)
const selectedAssets = ref([]) // 批量选择
const viewMode = ref('grid') // 'grid' or 'list'

// Upload Dialog
const uploadDialogVisible = ref(false)
const uploadFileList = ref([])
const fileInput = ref(null)
const uploading = ref(false)

// Edit Dialog
const editDialogVisible = ref(false)
const newTag = ref('')
const editForm = ref({
  id: null,
  name: '',
  tags: [],
  category: '',
  folderId: null
})

// Assets Data
const mockMediaList = ref([])
const loading = ref(false)

// 加载媒体列表
const loadMediaList = async () => {
  try {
    loading.value = true
    const response = await getMediaList()
    // 后端返回 { data: [], total: number } 结构
    const mediaData = response.data?.data || response.data || []
    mockMediaList.value = mediaData.map(item => ({
      ...item,
      meta1: item.metadata?.resolution || item.metadata?.dimensions || 'N/A',
      uploadTime: new Date(item.createdAt).getTime(),
      tags: item.tags || []
    }))
  } catch (error) {
    console.error('加载媒体列表失败:', error)
    showMessage('加载媒体列表失败', 'error')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadMediaList()
})

// 刷新媒体列表
const handleRefresh = async () => {
  showMessage('正在刷新...', 'info')
  await loadMediaList()
  showMessage('刷新成功', 'success')
}

// Filtering Logic
const filteredMedia = computed(() => {
  return mockMediaList.value.filter(item => {
    // Type Filter
    if (activeTypeFilter.value !== 'all' && item.type !== activeTypeFilter.value) {
      return false
    }

    // Search Filter
    if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    return true
  })
})

// 获取指定类型的资源数量
const getTypeCount = (type) => {
  return mockMediaList.value.filter(item => item.type === type).length
}

// 获取指定分类的资源数量
const getCategoryCount = (category) => {
  return mockMediaList.value.filter(item => item.category === category).length
}

// 获取媒体URL（优先使用thumbnail，其次url）
const getMediaUrl = (media) => {
  if (!media) return getDefaultMediaThumbnail(media?.type)

  // 优先使用缩略图
  if (media.thumbnail) {
    return processUrl(media.thumbnail)
  }

  // 其次使用原始URL
  if (media.url) {
    return processUrl(media.url)
  }

  // 返回默认占位图
  return getDefaultMediaThumbnail(media.type)
}

// 处理URL（支持相对路径和绝对路径）
const processUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url // 相对路径由vite代理处理
}

// 获取默认媒体缩略图
const getDefaultMediaThumbnail = (type) => {
  switch (type) {
    case 'image':
      return '/images/media-placeholder-image.svg'
    case 'video':
      return '/images/media-placeholder-video.svg'
    case '3d':
      return '/images/media-placeholder-3d.svg'
    case 'audio':
      return '/images/media-placeholder-audio.svg'
    default:
      return '/images/media-placeholder.svg'
  }
}

// 处理图片加载错误
const handleImageError = (event) => {
  const img = event.target
  if (img && !img.dataset.errorHandled) {
    img.dataset.errorHandled = 'true'
    img.src = '/images/media-placeholder.svg'
  }
}

// Methods
const selectAsset = (item) => {
  selectedAsset.value = item
}

// 切换资源选择（支持多选）
const toggleAssetSelection = (item, event) => {
  const index = selectedAssets.value.findIndex(a => a.id === item.id)

  if (event.ctrlKey || event.metaKey) {
    // Ctrl/Cmd 多选
    if (index > -1) {
      selectedAssets.value.splice(index, 1)
    } else {
      selectedAssets.value.push(item)
    }
  } else {
    // 单选
    if (index > -1) {
      selectedAssets.value = []
    } else {
      selectedAssets.value = [item]
    }
  }

  // 不再自动显示详情面板
  // selectedAsset.value = selectedAssets.value[0] || null
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedAssets.value.length === 0) return

  try {
    const confirmed = await showConfirm(
      `确定要删除选中的 ${selectedAssets.value.length} 个文件吗？此操作不可恢复。`
    )

    if (!confirmed) return

    const ids = selectedAssets.value.map(item => item.id)
    await batchDeleteMedia(ids)

    showMessage(`成功删除 ${ids.length} 个文件`, 'success')

    // 清除选中状态
    selectedAssets.value = []
    selectedAsset.value = null

    // 重新加载列表
    await loadMediaList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      showMessage('批量删除失败', 'error')
    }
  }
}

const handleDelete = async (item) => {
  try {
    const confirmed = await showConfirm(`确定要删除资源 "${item.name}" 吗？`)

    if (!confirmed) return

    await deleteMedia(item.id)
    mockMediaList.value = mockMediaList.value.filter(i => i.id !== item.id)
    selectedAsset.value = null
    showMessage('删除成功', 'success')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      showMessage('删除失败', 'error')
    }
  }
}

// Utility: Format Size
const formatSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}

// Utility: Format Date
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// Utility: Mime Type - 返回中文类型名称
const getMimeType = (type) => {
  const typeMap = {
    'image': '图片',
    'video': '视频',
    'audio': '音频',
    '3d': '3D模型',
    'document': '文档',
    'other': '其他'
  }
  return typeMap[type] || '未知'
}

// Utility: Filter Style for thumbnails (to match prototype look)
const getFilterStyle = (type) => {
  if (type === '3d') return 'filter: hue-rotate(90deg)'
  if (type === 'video') return 'filter: grayscale(100%)'
  return ''
}

// Upload Methods
const showUploadDialog = () => {
  uploadFileList.value = []
  uploadDialogVisible.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileInputChange = (event) => {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    uploadFileList.value.push({
      name: file.name,
      customName: file.name,
      raw: file,
      uid: Date.now() + Math.random()
    })
  })
  event.target.value = '' // 清空input以便重复选择
}

const handleFileChange = (file) => {
  const existingFile = uploadFileList.value.find(f => f.uid === file.uid)
  if (!existingFile) {
    uploadFileList.value.push({
      ...file,
      customName: file.name
    })
  }
}

const removeUploadFile = (index) => {
  uploadFileList.value.splice(index, 1)
}

const handleUpload = async () => {
  if (uploadFileList.value.length === 0) {
    showMessage('请先选择文件', 'warning')
    return
  }

  uploading.value = true

  try {
    // 上传所有文件
    const uploadPromises = uploadFileList.value.map(async (file) => {
      try {
        const result = await uploadMedia(file.raw, (progress) => {
          console.log(`上传进度: ${progress}%`)
        })

        // 如果自定义了文件名，更新文件名
        if (file.customName !== file.name) {
          await updateMedia(result.id, { name: file.customName })
        }

        return result
      } catch (error) {
        console.error(`上传文件 ${file.name} 失败:`, error)
        throw error
      }
    })

    await Promise.all(uploadPromises)

    showMessage(`成功上传 ${uploadFileList.value.length} 个文件`, 'success')
    uploadDialogVisible.value = false
    uploadFileList.value = []

    // 重新加载媒体列表
    await loadMediaList()
  } catch (error) {
    console.error('上传失败:', error)
    showMessage('部分文件上传失败', 'error')
  } finally {
    uploading.value = false
  }
}

const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video'
  if (['glb', 'gltf'].includes(ext)) return '3d'
  return 'image'
}

// Edit Methods
const showEditDialog = (item) => {
  editForm.value = {
    id: item.id,
    name: item.name,
    tags: [...(item.tags || [])],
    category: item.category || '',
    folderId: item.folderId
  }
  newTag.value = ''
  editDialogVisible.value = true
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !editForm.value.tags.includes(tag)) {
    editForm.value.tags.push(tag)
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  const index = editForm.value.tags.indexOf(tag)
  if (index > -1) {
    editForm.value.tags.splice(index, 1)
  }
}

const handleEdit = async () => {
  try {
    await updateMedia(editForm.value.id, {
      name: editForm.value.name,
      category: editForm.value.category,
      tags: editForm.value.tags
    })

    const index = mockMediaList.value.findIndex(m => m.id === editForm.value.id)
    if (index !== -1) {
      mockMediaList.value[index] = {
        ...mockMediaList.value[index],
        name: editForm.value.name,
        tags: editForm.value.tags,
        category: editForm.value.category
      }

      // Update selected asset if it's the one being edited
      if (selectedAsset.value?.id === editForm.value.id) {
        selectedAsset.value = mockMediaList.value[index]
      }
    }

    showMessage('保存成功', 'success')
    editDialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    showMessage('保存失败', 'error')
  }
}
</script>

<style scoped>
/* 整体布局 */
.media-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

/* 主内容区 */
.media-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 8px;
}

/* 左侧筛选面板 */
.filter-panel {
  width: 240px;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.filter-header {
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
}

.filter-list {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #595959;
  font-size: 14px;
}

.filter-item:hover {
  background: #f5f5f5;
  color: #262626;
}

.filter-item.active {
  background: #e6f7ff;
  color: #1890ff;
}

.filter-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.filter-item.active .filter-icon {
  opacity: 1;
}

.filter-count {
  margin-left: auto;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.filter-item.active .filter-count {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

/* 右侧内容区 */
.content-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

/* 工具栏 */
.toolbar {
  padding: 8px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.tool-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.category-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 6px;
  flex-shrink: 0;
}

.category-tab {
  padding: 4px 12px;
  font-size: 13px;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  user-select: none;
}

.category-tab:hover {
  color: #262626;
  background: #e6e6e6;
}

.category-tab.active {
  background: #fff;
  color: #1890ff;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}


.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:hover {
  border-color: #40a9ff;
}

.search-input:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 4px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: #262626;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}

.btn-default {
  min-width: 32px;
  padding: 4px 8px;
}

.btn-primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  color: #fff;
}

.btn-danger {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

.btn-danger:hover {
  background: #ff7875;
  border-color: #ff7875;
}

.view-toggle {
  display: flex;
  gap: 4px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 6px;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: #595959;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #e6e6e6;
  color: #262626;
}

.toggle-btn.active {
  background: #fff;
  color: #1890ff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 资源网格 */
.grid-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15%;
  min-height: 320px;
  color: #bfbfbf;
  text-align: center;
}

.empty-icon {
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #bfbfbf;
}

.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.asset-card {
  position: relative;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}

.asset-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.asset-card.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.thumb-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: #fafafa;
  overflow: hidden;
}

.thumb-wrapper.transparent {
  background:
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.thumb-wrapper img,
.thumb-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-wrapper .placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #bfbfbf;
}

.thumb-wrapper .placeholder svg {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.thumb-wrapper .placeholder-text {
  font-size: 12px;
}

.type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  backdrop-filter: blur(4px);
}

.badge-3d {
  background: rgba(82, 196, 26, 0.9);
}

.badge-video {
  background: rgba(24, 144, 255, 0.9);
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  backdrop-filter: blur(4px);
}

.asset-info {
  padding: 12px;
}

.asset-name {
  font-size: 14px;
  color: #262626;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-meta {
  font-size: 12px;
  color: #8c8c8c;
}

/* 列表视图 */
.asset-list {
  width: 100%;
}

.media-table {
  width: 100%;
  border-collapse: collapse;
}

.media-table thead {
  background: #fafafa;
}

.media-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #f0f0f0;
}

.media-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
  cursor: pointer;
}

.media-table tbody tr:hover {
  background: #fafafa;
}

.media-table tbody tr.selected-row {
  background: #e6f7ff;
}

.media-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #595959;
}

.list-thumb {
  position: relative;
  width: 60px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  color: #595959;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

/* Toast 消息 */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  padding: 12px 24px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  color: #262626;
  opacity: 0;
  transition: all 0.3s;
  z-index: 9999;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-success {
  border-left: 4px solid #52c41a;
}

.toast-error {
  border-left: 4px solid #ff4d4f;
}

.toast-info {
  border-left: 4px solid #1890ff;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  background: #fff;
  border-radius: 8px;
  width: 560px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.modal-close {
  background: none;
  border: none;
  font-size: 16px;
  color: #8c8c8c;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  line-height: 1;
  transition: 0.2s;
}

.modal-close:hover {
  color: #262626;
  background: #f5f5f5;
}

.modal-body {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px;
  border-top: 1px solid #f0f0f0;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #1890ff;
  background: #e6f7ff;
}

.upload-text {
  margin-top: 12px;
  font-size: 14px;
  color: #595959;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #8c8c8c;
}

/* Upload File List */
.upload-file-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  color: #595959;
}

.original-name {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-name-input {
  width: 160px;
  padding: 4px 8px;
  font-size: 13px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  transition: 0.2s;
}

.file-name-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.btn-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  transition: 0.2s;
  flex-shrink: 0;
}

.btn-icon.btn-danger {
  color: #ff4d4f;
}

.btn-icon.btn-danger:hover {
  background: #fff1f0;
}

</style>

