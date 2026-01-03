<template>
  <div class="media-layout">
    <!-- 1. 文件夹树 (Left Sidebar) -->
    <aside class="folder-panel">
      <div class="panel-header">
        文件夹
        <div class="icon-btn" title="新建文件夹" @click="openCreateFolderDialog">+</div>
      </div>
      <div class="folder-list">
        <div
          v-for="folder in folders"
          :key="folder.id"
          :class="['folder-item', { active: activeFolder === folder.id }]"
          @click="activeFolder = folder.id"
        >
          <svg class="folder-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
          {{ folder.name }}
          <span class="folder-count">{{ folder.count }}</span>
          <div
            v-if="!isDefaultFolder(folder.id)"
            class="folder-delete-btn"
            @click.stop="handleDeleteFolder(folder)"
            title="删除文件夹"
          >
            ✕
          </div>
        </div>
      </div>
      
      <div class="storage-box">
        <div class="storage-info">
          <span>存储空间</span>
          <span>7.5 GB / 10 GB</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </aside>

    <!-- 2. 资源网格 (Main Content) -->
    <section class="asset-container">
      <div class="toolbar">
        <div class="breadcrumb">
          资源库 <span>/</span> {{ currentFolderName }}
        </div>
        <div class="tool-actions">
          <div class="search-box">
             <el-input
              v-model="searchQuery"
              class="search-input"
              placeholder="搜索文件名..."
              prefix-icon="Search"
              clearable
            />
          </div>

          <!-- 视图切换 -->
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button value="grid">
              <el-icon><Grid /></el-icon>
            </el-radio-button>
            <el-radio-button value="list">
              <el-icon><List /></el-icon>
            </el-radio-button>
          </el-radio-group>

          <el-button type="primary" @click="showUploadDialog">
            <el-icon><UploadFilled /></el-icon>
            上传文件
          </el-button>
        </div>
      </div>

      <div class="grid-scroll">
        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="asset-grid">
          <div
            v-for="item in filteredMedia"
            :key="item.id"
            :class="['asset-card', { selected: selectedAsset?.id === item.id }]"
            @click="selectAsset(item)"
          >
            <!-- Thumb Wrapper -->
            <div :class="['thumb-wrapper', { transparent: item.type === 'image' && item.name.endsWith('.png') }]">
              <!-- Badges -->
              <span v-if="item.type === '3d'" class="type-badge badge-3d">GLB</span>
              <span v-else-if="item.type === 'video'" class="type-badge badge-video">{{ item.duration || '0:15' }}</span>

              <!-- Image / Preview -->
              <img
                :src="item.url"
                class="asset-img"
                :style="getFilterStyle(item.type)"
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
          <el-table
            :data="filteredMedia"
            style="width: 100%"
            @row-click="selectAsset"
            :row-class-name="({ row }) => selectedAsset?.id === row.id ? 'selected-row' : ''"
          >
            <el-table-column width="80">
              <template #default="{ row }">
                <div class="list-thumb">
                  <img :src="row.url" />
                  <span v-if="row.type === '3d'" class="type-badge badge-3d">GLB</span>
                  <span v-else-if="row.type === 'video'" class="type-badge badge-video">MP4</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="文件名" min-width="200" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ getMimeType(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="meta1" label="尺寸/分辨率" width="120" />
            <el-table-column label="大小" width="100">
              <template #default="{ row }">
                {{ formatSize(row.size) }}
              </template>
            </el-table-column>
            <el-table-column label="上传时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.uploadTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click.stop="showEditDialog(row)">
                  <el-icon><Edit /></el-icon> 编辑
                </el-button>
                <el-button link type="danger" size="small" @click.stop="handleDelete(row)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </section>

    <!-- 3. 详情面板 (Right Sidebar) -->
    <aside class="detail-panel" v-if="selectedAsset">
      <div class="detail-header">
        资源详情
        <div class="close-detail" @click="selectedAsset = null">✕</div>
      </div>
      <div class="detail-body">
        <div class="preview-box">
          <img :src="selectedAsset.url" class="preview-img">
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
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传文件"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="uploadFileList"
        drag
        multiple
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 jpg/png/gif/mp4/glb 等格式，单个文件不超过 50MB
          </div>
        </template>
      </el-upload>

      <!-- 文件列表及名称编辑 -->
      <div v-if="uploadFileList.length > 0" class="upload-file-list">
        <div v-for="(file, index) in uploadFileList" :key="index" class="upload-file-item">
          <div class="file-info">
            <el-icon><Document /></el-icon>
            <span class="original-name">{{ file.name }}</span>
          </div>
          <el-input
            v-model="file.customName"
            placeholder="自定义文件名"
            style="flex: 1; margin: 0 12px"
          />
          <el-button link type="danger" @click="removeUploadFile(index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload" :loading="uploading">
          上传 ({{ uploadFileList.length }})
        </el-button>
      </template>
    </el-dialog>

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

    <!-- 新建文件夹对话框 -->
    <el-dialog
      v-model="folderDialogVisible"
      title="新建文件夹"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="folderForm" :rules="folderRules" ref="folderFormRef" label-width="80px">
        <el-form-item label="文件夹名" prop="name">
          <el-input
            v-model="folderForm.name"
            placeholder="请输入文件夹名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="folderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateFolder" :loading="folderSubmitting">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, UploadFilled, Grid, List, Edit, Delete, Document } from '@element-plus/icons-vue'

// State
const activeFolder = ref(0) // 0 = All
const searchQuery = ref('')
const selectedAsset = ref(null)
const viewMode = ref('grid') // 'grid' or 'list'

// Upload Dialog
const uploadDialogVisible = ref(false)
const uploadFileList = ref([])
const uploadRef = ref(null)
const uploading = ref(false)

// Edit Dialog
const editDialogVisible = ref(false)
const editForm = ref({
  id: null,
  name: '',
  tags: [],
  folderId: null
})

// Folders Data
const folders = ref([
  { id: 0, name: '全部资源', count: 136, isDefault: true },
  { id: 5, name: '图片资源', count: 8, isDefault: true },
  { id: 6, name: '背景图', count: 15, isDefault: true },
  { id: 1, name: '3D 模型库', count: 12, isDefault: true },
  { id: 2, name: '视频素材', count: 5, isDefault: true },
  { id: 3, name: '装饰素材', count: 86, isDefault: true },
  { id: 4, name: '公司 Logo', count: 25, isDefault: true }
])

// Folder Dialog
const folderDialogVisible = ref(false)
const folderSubmitting = ref(false)
const folderFormRef = ref(null)
const folderForm = ref({
  name: ''
})

const folderRules = {
  name: [
    { required: true, message: '请输入文件夹名称', trigger: 'blur' },
    { min: 2, max: 20, message: '文件夹名称长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

// 判断是否为默认文件夹
const isDefaultFolder = (folderId) => {
  const folder = folders.value.find(f => f.id === folderId)
  return folder?.isDefault === true
}

// 打开新建文件夹对话框
const openCreateFolderDialog = () => {
  folderForm.value.name = ''
  if (folderFormRef.value) {
    folderFormRef.value.resetFields()
  }
  folderDialogVisible.value = true
}

// 创建文件夹
const handleCreateFolder = () => {
  if (!folderFormRef.value) return

  folderFormRef.value.validate((valid) => {
    if (!valid) return

    folderSubmitting.value = true

    // 模拟异步创建
    setTimeout(() => {
      const newFolder = {
        id: Date.now(), // 使用时间戳作为ID
        name: folderForm.value.name,
        count: 0,
        isDefault: false
      }
      folders.value.push(newFolder)
      ElMessage.success(`文件夹 "${folderForm.value.name}" 创建成功`)
      folderSubmitting.value = false
      folderDialogVisible.value = false
    }, 500)
  })
}

// 删除文件夹
const handleDeleteFolder = (folder) => {
  if (folder.isDefault) {
    ElMessage.warning('默认文件夹不能删除')
    return
  }

  ElMessageBox.confirm(
    `确定要删除文件夹 "${folder.name}" 吗？文件夹内的资源将移至"全部资源"。`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      const index = folders.value.findIndex(f => f.id === folder.id)
      if (index !== -1) {
        folders.value.splice(index, 1)
        // 如果删除的是当前选中的文件夹，则切换到"全部资源"
        if (activeFolder.value === folder.id) {
          activeFolder.value = 0
        }
        ElMessage.success(`文件夹 "${folder.name}" 已删除`)
      }
    })
    .catch(() => {})
}

const currentFolderName = computed(() => {
  const f = folders.value.find(i => i.id === activeFolder.value)
  return f ? f.name : '全部资源'
})

// Assets Data
const mockMediaList = ref([
  {
    id: 501,
    name: '项目封面_v1.jpg',
    type: 'image',
    folderId: 5,
    url: '/images/project-cover.svg',
    size: 1800000,
    meta1: '1200x675',
    uploadTime: 1698487605000,
    tags: ['封面', '项目', '展示']
  },
  {
    id: 1,
    name: '科技感背景.jpg',
    type: 'image',
    folderId: 3,
    url: '/images/project-cover.svg',
    size: 2400000,
    meta1: '1920x1080',
    uploadTime: 1698387605000,
    tags: ['背景', '科技风', '蓝色']
  },
  {
    id: 2,
    name: '工厂设备_V2.glb',
    type: '3d',
    folderId: 1,
    url: '/images/project-cover.svg', // Placeholder
    size: 15728640,
    meta1: '3D Model',
    uploadTime: 1698287605000,
    tags: ['设备', '工业', '数字孪生']
  },
  {
    id: 3,
    name: '城市车流.mp4',
    type: 'video',
    folderId: 2,
    url: '/images/project-cover.svg', // Placeholder
    size: 47185920,
    meta1: 'Video',
    duration: '0:15',
    uploadTime: 1698187605000,
    tags: ['城市', '交通', '动态']
  },
  {
    id: 4,
    name: '装饰光效_Blue.png',
    type: 'image',
    folderId: 3,
    url: '/images/project-cover.svg',
    size: 122880,
    meta1: '500x500',
    uploadTime: 1698087605000,
    tags: ['光效', '装饰', '透明']
  }
])

// Filtering Logic
const filteredMedia = computed(() => {
  return mockMediaList.value.filter(item => {
    // Folder Filter
    if (activeFolder.value !== 0) {
      // Simple mapping for demo: 
      // If logic is strict: item.folderId === activeFolder.value
      // But for demo, we might want to show some items in multiple 'categories' or just keep it simple
      if (item.folderId !== activeFolder.value) return false
    }

    // Search Filter
    if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    return true
  })
})

// Methods
const selectAsset = (item) => {
  selectedAsset.value = item
}

const handleDelete = (item) => {
  ElMessageBox.confirm(
    `确定要删除资源 "${item.name}" 吗？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      mockMediaList.value = mockMediaList.value.filter(i => i.id !== item.id)
      selectedAsset.value = null
      ElMessage.success('删除成功')
    })
    .catch(() => {})
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

// Utility: Mime Type
const getMimeType = (type) => {
  if (type === '3d') return 'model/gltf-binary'
  if (type === 'video') return 'video/mp4'
  return 'image/jpeg' // Default
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
    ElMessage.warning('请先选择文件')
    return
  }

  uploading.value = true

  // 模拟上传
  setTimeout(() => {
    uploadFileList.value.forEach(file => {
      const newMedia = {
        id: Date.now() + Math.random(),
        name: file.customName,
        type: getFileType(file.name),
        folderId: activeFolder.value === 0 ? 5 : activeFolder.value,
        url: '/images/project-cover.svg',
        size: file.size,
        meta1: '1920x1080',
        uploadTime: Date.now(),
        tags: []
      }
      mockMediaList.value.push(newMedia)
    })

    uploading.value = false
    uploadDialogVisible.value = false
    ElMessage.success(`成功上传 ${uploadFileList.value.length} 个文件`)
    uploadFileList.value = []
  }, 1500)
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
    folderId: item.folderId
  }
  editDialogVisible.value = true
}

const handleEdit = () => {
  const index = mockMediaList.value.findIndex(m => m.id === editForm.value.id)
  if (index !== -1) {
    mockMediaList.value[index] = {
      ...mockMediaList.value[index],
      name: editForm.value.name,
      tags: editForm.value.tags,
      folderId: editForm.value.folderId
    }
    ElMessage.success('保存成功')
    editDialogVisible.value = false

    // Update selected asset if it's the one being edited
    if (selectedAsset.value?.id === editForm.value.id) {
      selectedAsset.value = mockMediaList.value[index]
    }
  }
}
</script>

<style scoped>
/* =========================================
   Styles from Prototype
   ========================================= */
:deep(*) {
  box-sizing: border-box;
  outline: none;
}

.media-layout {
  /* Local Vars */
  --bg-body: #0a0b0d;
  --bg-sidebar: #141519;
  --bg-card: #1c1d21;
  --bg-input: #0f1012;
  --bg-hover: #26272c;
  
  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --purple: #8b5cf6;
  
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border: #2d2e33;
  
  --folder-width: 260px;
  --detail-width: 300px;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--text-main);
  height: 100%;
  display: flex;
  overflow: hidden;
  background-color: var(--bg-body);
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

/* 1. Folder Panel */
.folder-panel {
  width: var(--folder-width); 
  background: var(--bg-body); 
  border-right: 1px solid var(--border);
  display: flex; 
  flex-direction: column;
  flex-shrink: 0;
}
.panel-header {
  height: 60px; 
  padding: 0 20px; 
  border-bottom: 1px solid var(--border);
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  font-weight: 600;
  color: #fff;
}
.icon-btn { 
  width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-secondary); transition: 0.2s;
}
.icon-btn:hover { background: var(--bg-hover); color: var(--text-main); }

.folder-list { flex: 1; overflow-y: auto; padding: 12px; }
.folder-item {
  display: flex; align-items: center; padding: 10px 12px; border-radius: 6px; cursor: pointer;
  color: var(--text-secondary); font-size: 13px; margin-bottom: 2px;
}
.folder-item:hover { background: var(--bg-hover); color: var(--text-main); }
.folder-item.active { background: rgba(59,130,246,0.1); color: var(--primary); font-weight: 500; }
.folder-icon { margin-right: 10px; color: #6b7280; }
.folder-item.active .folder-icon { color: var(--primary); }
.folder-count { margin-left: auto; font-size: 11px; color: var(--text-muted); }

.folder-delete-btn {
  display: none;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-left: 8px;
  color: #9ca3af;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.folder-item:hover .folder-delete-btn {
  display: flex;
}

.folder-delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Storage Widget */
.storage-box { padding: 20px; border-top: 1px solid var(--border); }
.storage-info { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
.progress-bar { height: 6px; background: #333; border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary); width: 75%; }

/* 2. Asset Grid Area */
.asset-container {
  flex: 1; display: flex; flex-direction: column; background: var(--bg-card); position: relative; overflow: hidden;
}

.toolbar {
  height: 60px; padding: 0 24px; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
}
.breadcrumb { font-size: 14px; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
.breadcrumb span { color: var(--text-muted); }

.tool-actions { display: flex; gap: 12px; align-items: center; }
.search-box { width: 200px; }
/* .search-input removed (global) */
/* .btn-upload removed (global) */

/* Grid Scroll */
.grid-scroll { flex: 1; overflow-y: auto; padding: 24px; }
.asset-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;
}

/* Asset Card */
.asset-card {
  background: var(--bg-body); border: 1px solid var(--border); border-radius: 8px;
  overflow: hidden; cursor: pointer; transition: 0.2s; position: relative;
  display: flex; flex-direction: column;
}
.asset-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); border-color: var(--text-secondary); }
.asset-card.selected { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.3); }

/* Thumb Wrapper */
.thumb-wrapper {
  width: 100%; aspect-ratio: 16/9; background: #111; position: relative;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
/* Transparency Grid for PNG */
.thumb-wrapper.transparent {
  background-image: linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
  background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.asset-img { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
.asset-card:hover .asset-img { opacity: 0.8; }

/* Type Badges */
.type-badge {
  position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 700;
  padding: 2px 6px; border-radius: 3px; color: #fff; text-transform: uppercase;
  z-index: 2;
}
.badge-3d { background: var(--purple); }
.badge-video { background: var(--danger); }

/* Checkbox Overlay */
.select-check {
  position: absolute; top: 8px; right: 8px; width: 18px; height: 18px;
  background: var(--primary); border-radius: 4px; display: none;
  align-items: center; justify-content: center; color: #fff; font-size: 12px;
  z-index: 2;
}
.asset-card:hover .select-check, .asset-card.selected .select-check { display: flex; }

/* Info Footer */
.asset-info { padding: 10px 12px; }
.asset-name { font-size: 13px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
.asset-meta { font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between; }

/* 3. Detail Panel */
.detail-panel {
  width: var(--detail-width); background: var(--bg-body); border-left: 1px solid var(--border);
  display: flex; flex-direction: column;
  flex-shrink: 0;
}
.detail-header {
  padding: 20px; border-bottom: 1px solid var(--border); font-size: 14px; font-weight: 600;
  display: flex; justify-content: space-between; align-items: center;
  color: #fff;
}
.close-detail { cursor: pointer; color: var(--text-secondary); }

.detail-body { flex: 1; padding: 20px; overflow-y: auto; }

.preview-box {
  width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 8px; border: 1px solid var(--border);
  margin-bottom: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.preview-img { max-width: 100%; max-height: 100%; }

.prop-row { margin-bottom: 16px; }
.prop-label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
.prop-value { font-size: 13px; color: var(--text-main); word-break: break-all; }

.tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.tag { background: var(--bg-card); border: 1px solid var(--border); padding: 4px 10px; border-radius: 12px; font-size: 11px; color: var(--text-secondary); }

.detail-footer {
  padding: 20px; border-top: 1px solid var(--border); display: flex; gap: 12px;
}
.btn-full { flex: 1; padding: 8px; border-radius: 6px; font-size: 13px; cursor: pointer; text-align: center; }
.btn-edit { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-main); }
.btn-delete { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--danger); }

/* List View Styles */
.asset-list {
  width: 100%;
}

.list-thumb {
  width: 60px;
  height: 40px;
  background: #111;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.list-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-thumb .type-badge {
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 8px;
  padding: 1px 4px;
}

:deep(.selected-row) {
  background-color: rgba(59, 130, 246, 0.1) !important;
}

:deep(.el-table) {
  background-color: transparent;
  color: var(--text-main);
}

:deep(.el-table th) {
  background-color: var(--bg-body);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}

:deep(.el-table td),
:deep(.el-table th.is-leaf) {
  border-bottom: 1px solid var(--border);
}

:deep(.el-table tr) {
  background-color: transparent;
}

:deep(.el-table__body tr:hover > td) {
  background-color: var(--bg-hover) !important;
}

/* Upload Dialog Styles */
.upload-file-list {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.upload-file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  margin-bottom: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
}

.original-name {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

:deep(.el-upload-dragger) {
  border: 2px dashed var(--el-border-color);
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
}

:deep(.el-icon--upload) {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}
</style>
