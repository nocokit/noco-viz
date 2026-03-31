<template>
  <div class="media-library-panel">
    <div class="panel-header">
      <span>媒体资源库</span>
      <button class="btn-refresh" @click="loadMedia" title="刷新">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>

    <div class="search-box">
      <input v-model="searchQuery" placeholder="搜索图片..." class="panel-search-input" />
    </div>

    <div class="media-grid">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="filteredMedia.length === 0" class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        <div>暂无图片资源</div>
      </div>
      <div
        v-else
        v-for="item in filteredMedia"
        :key="item.id"
        class="media-item"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
      >
        <img :src="getMediaUrl(item)" :alt="item.name" @error="handleImageError" />
        <div class="media-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMediaList } from '@/api/media'

const loading = ref(false)
const searchQuery = ref('')
const mediaList = ref([])

const filteredMedia = computed(() => {
  return mediaList.value.filter(item => {
    if (item.type !== 'image') return false
    if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    return true
  })
})

const loadMedia = async () => {
  try {
    loading.value = true
    const response = await getMediaList()
    const data = response.data?.data || response.data || []
    mediaList.value = data
  } catch (error) {
    console.error('加载媒体失败:', error)
  } finally {
    loading.value = false
  }
}

const getMediaUrl = (media) => {
  if (!media) return '/images/media-placeholder-image.svg'
  if (media.thumbnail) return media.thumbnail.startsWith('http') ? media.thumbnail : media.thumbnail
  if (media.url) return media.url.startsWith('http') ? media.url : media.url
  return '/images/media-placeholder-image.svg'
}

const handleImageError = (event) => {
  const img = event.target
  if (img && !img.dataset.errorHandled) {
    img.dataset.errorHandled = 'true'
    img.src = '/images/media-placeholder-image.svg'
  }
}

const handleDragStart = (event, item) => {
  event.dataTransfer.setData('mediaItem', JSON.stringify(item))
  event.dataTransfer.setData('mediaUrl', getMediaUrl(item))
  event.dataTransfer.effectAllowed = 'copy'
}

onMounted(() => {
  loadMedia()
})
</script>

<style scoped>
.media-library-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0px;
  background: linear-gradient(180deg, #16171b 0%, #18181c 100%);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  font-weight: 600;
  font-size: 13px;
  color: #e0e0e0;
}

.btn-refresh {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #999;
  display: flex;
  align-items: center;
}

.btn-refresh:hover {
  background: rgba(255,255,255,0.1);
  color: #e0e0e0;
}

.search-box {
  padding: 12px;
  border-bottom: 1px solid #2a2e35;
}

.panel-search-input {
  width: 100%;
  background: #121214;
  border: 1px solid #2a2e35;
  border-radius: 4px;
  padding: 6px 10px;
  color: #e5e7eb;
  font-size: 12px;
  outline: none;
}

.panel-search-input::placeholder {
  color: #666;
}

.panel-search-input:focus {
  border-color: #3b82f6;
}

.media-grid {
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  align-content: start;
  padding: 12px;
}

.media-grid::-webkit-scrollbar {
  width: 6px;
}

.media-grid::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.media-grid::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 3px;
}

.media-grid::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

.loading-state, .empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 13px;
}

.empty-state svg {
  margin-bottom: 8px;
}

.media-item {
  cursor: grab;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s;
  background: #2a2a2a;
}

.media-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.media-item:active {
  cursor: grabbing;
}

.media-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}

.media-name {
  padding: 4px 6px;
  font-size: 11px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: #252525;
}
</style>
