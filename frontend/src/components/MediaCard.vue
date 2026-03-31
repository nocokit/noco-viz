<template>
  <div class="media-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- 缩略图 -->
    <div class="media-thumb">
      <img :src="media.url" :alt="media.name" class="media-img" />

      <!-- Hover 遮罩 -->
      <transition name="overlay-fade">
        <div v-show="isHovered" class="media-overlay">
          <a-button
            v-if="media.type === 'logo' && !media.isDefault"
            class="overlay-btn"
            @click.stop="$emit('setDefault', media)"
          >
            <template #icon><StarOutlined /></template>
            设为默认
          </a-button>
          <a-button class="overlay-btn" @click.stop="$emit('preview', media)">
            <template #icon><EyeOutlined /></template>
            预览
          </a-button>
          <a-button danger class="overlay-btn" @click.stop="$emit('delete', media)">
            <template #icon><DeleteOutlined /></template>
            删除
          </a-button>
        </div>
      </transition>
    </div>

    <!-- 卡片信息 -->
    <div class="media-info">
      <div class="media-header">
        <span class="media-name" :title="media.name">{{ media.name }}</span>
        <div class="tags-container">
          <span v-if="media.isDefault" class="media-tag tag-default">默认</span>
          <span class="media-tag">{{ media.type.toUpperCase() }}</span>
        </div>
      </div>
      <div class="media-meta">
        <span class="meta-size">{{ formatSize(media.size) }}</span>
        <span class="meta-date">{{ formatDate(media.uploadTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EyeOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons-vue'

defineProps({
  media: {
    type: Object,
    required: true
  }
})

defineEmits(['preview', 'delete', 'setDefault'])

const isHovered = ref(false)

// 格式化文件大小
const formatSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
}

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}
</script>

