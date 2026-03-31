<template>
  <a-modal
    v-model:open="visible"
    title="选择封面图片"
    width="900px"
    :maskClosable="false"
    @cancel="handleClose"
  >
    <div class="media-selector">
      <!-- 搜索栏 -->
      <div class="selector-toolbar">
        <a-input
          v-model:value="searchQuery"
          placeholder="搜索图片..."
          allowClear
          style="width: 300px"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <div class="toolbar-right">
          <span class="selected-info" v-if="selectedMedia">已选择: {{ selectedMedia.name }}</span>
        </div>
      </div>

      <!-- 图片网格 -->
      <a-spin :spinning="loading">
        <div class="media-grid">
          <div
            v-for="item in filteredMediaList"
            :key="item.id"
            :class="['media-item', { selected: selectedMedia?.id === item.id }]"
            @click="selectMedia(item)"
          >
            <div class="media-thumb">
              <img :src="getMediaUrl(item)" :alt="item.name" @error="handleImageError" />
              <div class="media-overlay">
                <CheckOutlined class="check-icon" />
              </div>
            </div>
            <div class="media-name">{{ item.name }}</div>
          </div>

          <!-- 空状态 -->
          <div v-if="!loading && filteredMediaList.length === 0" class="empty-state">
            <a-empty description="暂无图片资源" />
          </div>
        </div>
      </a-spin>
    </div>

    <template #footer>
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="handleConfirm" :disabled="!selectedMedia">
        确定
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, CheckOutlined } from '@ant-design/icons-vue'
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
    message.error('加载媒体列表失败')
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

