<template>
  <div class="media-layout">
    <!-- 1. 文件夹树 (Left Sidebar) -->
    <aside class="folder-panel">
      <div class="panel-header">
        文件夹
        <div class="icon-btn" title="新建文件夹">+</div>
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
          <el-upload
            class="upload-demo"
            action="#"
            multiple
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button type="primary">
              <el-icon><UploadFilled /></el-icon>
              上传文件
            </el-button>
          </el-upload>
        </div>
      </div>

      <div class="grid-scroll">
        <div class="asset-grid">
          
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
        <div class="btn-full btn-edit">替换文件</div>
        <div class="btn-full btn-delete" @click="handleDelete(selectedAsset)">删除</div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, UploadFilled } from '@element-plus/icons-vue'

// State
const activeFolder = ref(0) // 0 = All
const searchQuery = ref('')
const selectedAsset = ref(null)

// Folders Data
const folders = ref([
  { id: 0, name: '全部资源', count: 136 },
  { id: 5, name: '图片', count: 8 },
  { id: 1, name: '3D 模型库', count: 12 },
  { id: 2, name: '背景视频', count: 5 },
  { id: 3, name: '装饰素材', count: 86 },
  { id: 4, name: '公司 Logo', count: 25 }
])

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
</style>
