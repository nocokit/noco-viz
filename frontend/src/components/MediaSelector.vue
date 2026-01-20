<template>
  <el-dialog
    v-model="visible"
    title="选择封面图片"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="media-selector">
      <!-- 搜索栏 -->
      <div class="selector-toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索图片..."
          prefix-icon="Search"
          clearable
          style="width: 300px"
        />
        <div class="toolbar-right">
          <span class="selected-info" v-if="selectedMedia">已选择: {{ selectedMedia.name }}</span>
        </div>
      </div>

      <!-- 图片网格 -->
      <div class="media-grid" v-loading="loading">
        <div
          v-for="item in filteredMediaList"
          :key="item.id"
          :class="['media-item', { selected: selectedMedia?.id === item.id }]"
          @click="selectMedia(item)"
        >
          <div class="media-thumb">
            <img :src="getMediaUrl(item)" :alt="item.name" @error="handleImageError" />
            <div class="media-overlay">
              <el-icon class="check-icon"><Check /></el-icon>
            </div>
          </div>
          <div class="media-name">{{ item.name }}</div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && filteredMediaList.length === 0" class="empty-state">
          <el-empty description="暂无图片资源" />
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="!selectedMedia">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Check } from '@element-plus/icons-vue'
import { getMediaList } from '@/api/media'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  currentImage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const searchQuery = ref('')
const mediaList = ref([])
const selectedMedia = ref(null)

// 过滤后的媒体列表
const filteredMediaList = computed(() => {
  return mediaList.value.filter(item => {
    // 只显示图片类型
    if (item.type !== 'image') return false

    // 搜索过滤
    if (searchQuery.value && !item.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false
    }
    return true
  })
})

// 加载媒体列表
const loadMediaList = async () => {
  try {
    loading.value = true
    const response = await getMediaList()
    const mediaData = response.data || response || []
    mediaList.value = mediaData
  } catch (error) {
    console.error('加载媒体列表失败:', error)
    ElMessage.error('加载媒体列表失败')
  } finally {
    loading.value = false
  }
}

// 获取媒体URL
const getMediaUrl = (media) => {
  if (!media) return ''

  // 优先使用缩略图
  if (media.thumbnail) {
    return processUrl(media.thumbnail)
  }

  // 其次使用原始URL
  if (media.url) {
    return processUrl(media.url)
  }

  return '/images/media-placeholder-image.svg'
}

// 处理URL
const processUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
}

// 处理图片加载错误
const handleImageError = (event) => {
  const img = event.target
  if (img && !img.dataset.errorHandled) {
    img.dataset.errorHandled = 'true'
    img.src = '/images/media-placeholder-image.svg'
  }
}

// 选择媒体
const selectMedia = (media) => {
  selectedMedia.value = media
}

// 确认选择
const handleConfirm = () => {
  if (selectedMedia.value) {
    emit('select', selectedMedia.value)
    handleClose()
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  selectedMedia.value = null
  searchQuery.value = ''
}

// 监听对话框打开
watch(visible, (newVal) => {
  if (newVal) {
    loadMediaList()
  }
})
</script>

<style scoped>
.media-selector {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selector-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-info {
  font-size: 13px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
  padding: 4px;
}

.media-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  border: 2px solid transparent;
  background: var(--el-fill-color-lighter);
}

.media-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-item.selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.media-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #f5f5f5;
  overflow: hidden;
}

.media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.media-item.selected .media-overlay {
  opacity: 1;
}

.check-icon {
  font-size: 32px;
  color: white;
}

.media-name {
  padding: 8px 12px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 60px 0;
}

/* 滚动条样式 */
.media-grid::-webkit-scrollbar {
  width: 6px;
}

.media-grid::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

.media-grid::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-darker);
}
</style>
