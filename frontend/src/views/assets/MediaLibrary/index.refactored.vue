<template>
  <div class="media-layout">
    <!-- 1. 文件夹树面板 - 使用新组件 FolderTreePanel -->
    <FolderTreePanel
      v-model="activeFolder"
      :folders="folders"
      title="文件夹"
      :show-count="true"
      :allow-create="true"
      :allow-edit="true"
      :allow-delete="true"
      @create="handleCreateFolder"
      @rename="handleRenameFolder"
      @delete="handleDeleteFolder"
    >
      <template #footer>
        <div class="storage-box">
          <div class="storage-info">
            <span>存储空间</span>
            <span>7.5 GB / 10 GB</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 75%"></div>
          </div>
        </div>
      </template>
    </FolderTreePanel>

    <!-- 2. 主内容区 - 使用新组件 ViewSwitcher -->
    <section class="asset-container">
      <!-- 面包屑 -->
      <Breadcrumb
        :items="breadcrumbItems"
        class="media-breadcrumb"
      />

      <ViewSwitcher
        v-model:view="viewMode"
        :data="mediaList"
        :grid-cols="4"
        :show-toolbar="true"
        :show-search="true"
        search-placeholder="搜索文件名..."
        :search-fields="['name', 'type']"
        :show-pagination="true"
        :page-sizes="[12, 24, 48, 96]"
        empty-text="暂无文件"
        @item-click="selectAsset"
      >
        <template #toolbar-right>
          <el-button type="primary" @click="showUploadDialog">
            <el-icon><UploadFilled /></el-icon>
            上传文件
          </el-button>
        </template>

        <!-- 网格视图项 -->
        <template #grid-item="{ item }">
          <div class="asset-card">
            <div :class="['thumb-wrapper', { transparent: item.type === 'image' && item.name.endsWith('.png') }]">
              <!-- 类型徽章 -->
              <span v-if="item.type === '3d'" class="type-badge badge-3d">GLB</span>
              <span v-else-if="item.type === 'video'" class="type-badge badge-video">{{ item.duration || '0:15' }}</span>

              <!-- 预览图 -->
              <img
                :src="item.url"
                class="asset-img"
                :style="getFilterStyle(item.type)"
                alt=""
              >

              <div class="select-check">✓</div>

              <!-- 视频播放图标 -->
              <svg v-if="item.type === 'video'" class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </div>

            <!-- 文件信息 -->
            <div class="asset-info">
              <div class="asset-name">{{ item.name }}</div>
              <div class="asset-meta">
                <span>{{ item.meta1 }}</span>
                <span>{{ formatSize(item.size) }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 列表视图项 -->
        <template #list-item="{ item }">
          <div class="list-item-wrapper">
            <div class="list-thumb">
              <img :src="item.url" alt="">
              <span v-if="item.type === '3d'" class="type-badge badge-3d">GLB</span>
              <span v-else-if="item.type === 'video'" class="type-badge badge-video">MP4</span>
            </div>
            <div class="list-info">
              <div class="list-name">{{ item.name }}</div>
              <MetaInfoList
                :items="[
                  { label: '类型', value: getMimeType(item.type) },
                  { label: '尺寸', value: item.meta1 },
                  { label: '大小', value: formatSize(item.size) },
                  { label: '上传时间', value: formatDate(item.uploadTime) }
                ]"
                layout="horizontal"
              />
            </div>
            <div class="list-actions">
              <el-button link type="primary" size="small" @click.stop="showEditDialog(item)">
                <el-icon><Edit /></el-icon> 编辑
              </el-button>
              <el-button link type="danger" size="small" @click.stop="handleDelete(item)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
          </div>
        </template>
      </ViewSwitcher>
    </section>

    <!-- 3. 详情面板 -->
    <aside v-if="selectedAsset" class="detail-panel">
      <div class="detail-header">
        <span>资源详情</span>
        <el-icon class="close-icon" @click="selectedAsset = null">
          <Close />
        </el-icon>
      </div>

      <div class="detail-body">
        <!-- 预览 -->
        <div class="preview-box">
          <img :src="selectedAsset.url" class="preview-img" alt="">
        </div>

        <!-- 详细信息 -->
        <MetaInfoList
          :items="[
            { label: '文件名称', value: selectedAsset.name },
            { label: '文件类型', value: getMimeType(selectedAsset.type) },
            { label: '分辨率/尺寸', value: selectedAsset.meta1 },
            { label: '文件大小', value: formatSize(selectedAsset.size) },
            { label: '上传时间', value: formatDate(selectedAsset.uploadTime) },
            { label: '上传人', value: 'David Miller' }
          ]"
          layout="vertical"
          class="detail-meta"
        />

        <div class="prop-row">
          <div class="prop-label">引用项目</div>
          <div class="prop-value" style="color:var(--color-primary); cursor:pointer">
            智慧城市大屏, 销售战报
          </div>
        </div>

        <div class="prop-row">
          <div class="prop-label">标签</div>
          <div class="tag-list">
            <el-tag
              v-for="tag in selectedAsset.tags"
              :key="tag"
              size="small"
              class="tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="detail-footer">
        <el-button class="btn-full" @click="showEditDialog(selectedAsset)">
          编辑
        </el-button>
        <el-button class="btn-full" type="danger" @click="handleDelete(selectedAsset)">
          删除
        </el-button>
      </div>
    </aside>

    <!-- 上传对话框 - 使用 ResourceUploader 组件 -->
    <ResourceUploader
      v-model="uploadDialogVisible"
      title="上传文件"
      :accept="['image/*', 'video/*', '.glb']"
      :max-size="50"
      :multiple="true"
      :custom-fields="[
        { key: 'customName', label: '自定义文件名', type: 'input', placeholder: '请输入文件名' },
        { key: 'folderId', label: '所属文件夹', type: 'select', options: folderOptions }
      ]"
      @success="handleUploadSuccess"
    />

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资源"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="文件名">
          <el-input v-model="editForm.name" placeholder="请输入文件名" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="editForm.tags"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入标签"
            style="width: 100%"
          >
            <el-option label="背景" value="背景" />
            <el-option label="科技风" value="科技风" />
            <el-option label="装饰" value="装饰" />
            <el-option label="工业" value="工业" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属文件夹">
          <el-select v-model="editForm.folderId" placeholder="请选择文件夹" style="width: 100%">
            <el-option
              v-for="folder in folders.filter(f => f.id !== 0)"
              :key="folder.id"
              :label="folder.name"
              :value="folder.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, Edit, Delete, Close } from '@element-plus/icons-vue'

// 状态
const activeFolder = ref(0)
const selectedAsset = ref(null)
const viewMode = ref('grid')

// 上传对话框
const uploadDialogVisible = ref(false)

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = ref({
  id: null,
  name: '',
  tags: [],
  folderId: null
})

// 文件夹数据
const folders = ref([
  { id: 0, name: '全部资源', count: 136, isDefault: true },
  { id: 5, name: '图片资源', count: 8, isDefault: true },
  { id: 6, name: '背景图', count: 15, isDefault: true },
  { id: 1, name: '3D 模型库', count: 12, isDefault: true },
  { id: 2, name: '视频素材', count: 5, isDefault: true },
  { id: 3, name: '装饰素材', count: 86, isDefault: true },
  { id: 4, name: '公司 Logo', count: 25, isDefault: true }
])

// 媒体数据
const mediaList = ref([
  {
    id: 1,
    name: 'city_bg_01.png',
    type: 'image',
    url: 'https://picsum.photos/400/300?random=1',
    size: 2048576,
    meta1: '1920x1080',
    uploadTime: '2024-01-15 10:30:00',
    tags: ['背景', '科技风'],
    folderId: 6
  },
  {
    id: 2,
    name: 'tech_border.png',
    type: 'image',
    url: 'https://picsum.photos/400/300?random=2',
    size: 512000,
    meta1: '800x600',
    uploadTime: '2024-01-14 15:20:00',
    tags: ['装饰', '边框'],
    folderId: 3
  },
  {
    id: 3,
    name: 'robot_model.glb',
    type: '3d',
    url: 'https://picsum.photos/400/300?random=3',
    size: 5242880,
    meta1: '3D Model',
    uploadTime: '2024-01-13 09:15:00',
    tags: ['3D', '机器人'],
    folderId: 1
  },
  {
    id: 4,
    name: 'promo_video.mp4',
    type: 'video',
    url: 'https://picsum.photos/400/300?random=4',
    size: 10485760,
    meta1: '1920x1080',
    duration: '0:45',
    uploadTime: '2024-01-12 14:00:00',
    tags: ['视频', '宣传'],
    folderId: 2
  }
])

// 面包屑
const breadcrumbItems = computed(() => {
  const items = [{ label: '资源库', to: '/assets/media' }]
  const currentFolder = folders.value.find(f => f.id === activeFolder.value)
  if (currentFolder && currentFolder.id !== 0) {
    items.push({ label: currentFolder.name })
  }
  return items
})

// 当前文件夹名称
const currentFolderName = computed(() => {
  const folder = folders.value.find(f => f.id === activeFolder.value)
  return folder?.name || '全部资源'
})

// 文件夹选项（用于上传）
const folderOptions = computed(() => {
  return folders.value
    .filter(f => f.id !== 0)
    .map(f => ({ label: f.name, value: f.id }))
})

// 选择资源
const selectAsset = (asset) => {
  selectedAsset.value = asset
}

// 显示上传对话框
const showUploadDialog = () => {
  uploadDialogVisible.value = true
}

// 上传成功
const handleUploadSuccess = (files) => {
  ElMessage.success(`成功上传 ${files.length} 个文件`)
  // TODO: 刷新列表
}

// 显示编辑对话框
const showEditDialog = (asset) => {
  editForm.value = {
    id: asset.id,
    name: asset.name,
    tags: asset.tags || [],
    folderId: asset.folderId
  }
  editDialogVisible.value = true
}

// 保存编辑
const handleEdit = () => {
  ElMessage.success('保存成功')
  editDialogVisible.value = false
  // TODO: 更新数据
}

// 删除资源
const handleDelete = async (asset) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除"${asset.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('删除成功')
    // TODO: 删除数据
  } catch (error) {
    // 用户取消
  }
}

// 创建文件夹
const handleCreateFolder = (name) => {
  const newFolder = {
    id: Date.now(),
    name: name,
    count: 0,
    isDefault: false
  }
  folders.value.push(newFolder)
  ElMessage.success('文件夹创建成功')
}

// 重命名文件夹
const handleRenameFolder = ({ folder, newName }) => {
  const target = folders.value.find(f => f.id === folder.id)
  if (target) {
    target.name = newName
    ElMessage.success('重命名成功')
  }
}

// 删除文件夹
const handleDeleteFolder = (folder) => {
  const index = folders.value.findIndex(f => f.id === folder.id)
  if (index > -1) {
    folders.value.splice(index, 1)
    ElMessage.success('文件夹删除成功')
  }
}

// 工具函数
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateStr) => {
  return dateStr
}

const getMimeType = (type) => {
  const types = {
    image: 'Image',
    video: 'Video',
    '3d': '3D Model'
  }
  return types[type] || type
}

const getFilterStyle = (type) => {
  return type === '3d' ? { filter: 'brightness(0.9)' } : {}
}
</script>

<style scoped>
.media-layout {
  display: flex;
  height: 100vh;
  background: var(--bg-primary);
}

.asset-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: var(--spacing-lg);
}

.media-breadcrumb {
  margin-bottom: var(--spacing-lg);
}

/* 存储空间 */
.storage-box {
  padding: var(--spacing-md);
}

.storage-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.progress-bar {
  height: 4px;
  background: var(--bg-elevated);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--transition-base);
}

/* 资源卡片 */
.asset-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.asset-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hover);
}

.thumb-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: var(--bg-elevated);
  overflow: hidden;
}

.thumb-wrapper.transparent {
  background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}

.asset-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: #fff;
}

.badge-3d {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.badge-video {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.select-check {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  display: none;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
}

.asset-card.selected .select-check {
  display: flex;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;
}

.asset-info {
  padding: var(--spacing-md);
}

.asset-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* 列表视图 */
.list-item-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.list-thumb {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-elevated);
}

.list-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-thumb .type-badge {
  top: 4px;
  right: 4px;
  font-size: 10px;
  padding: 1px 4px;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

/* 详情面板 */
.detail-panel {
  width: 320px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
  font-weight: var(--font-weight-semibold);
}

.close-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-base);
}

.close-icon:hover {
  background: var(--bg-hover);
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.preview-box {
  width: 100%;
  aspect-ratio: 4/3;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.detail-meta {
  margin-bottom: var(--spacing-lg);
}

.prop-row {
  margin-bottom: var(--spacing-md);
}

.prop-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.prop-value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.detail-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--spacing-sm);
}

.btn-full {
  flex: 1;
}

/* 响应式 */
@media (max-width: 1200px) {
  .detail-panel {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    box-shadow: var(--shadow-xl);
  }
}
</style>
