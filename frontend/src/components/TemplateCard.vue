<template>
  <div class="tpl-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- 缩略图 -->
    <div class="tpl-thumb">
      <img :src="getThumbnailUrl(template)" :alt="template.name" class="tpl-img" />

      <!-- Hover 遮罩 -->
      <transition name="overlay-fade">
        <div v-show="isHovered" class="tpl-overlay">
          <a-button class="overlay-btn" type="primary" @click.stop="$emit('use', template)">
            <template #icon><CheckOutlined /></template>
            创建项目
          </a-button>
          <a-button class="overlay-btn" @click.stop="$emit('preview', template)">
            <template #icon><EyeOutlined /></template>
            预览
          </a-button>
          <a-button v-if="!template.isSystem" class="overlay-btn" @click.stop="$emit('edit', template)">
            <template #icon><EditOutlined /></template>
            编辑
          </a-button>
          <a-button v-if="showReview && template.status === 'pending'" class="overlay-btn" @click.stop="$emit('review', template)">
            <template #icon><CheckOutlined /></template>
            审核
          </a-button>
          <a-button v-if="!template.isSystem" class="overlay-btn" danger @click.stop="$emit('delete', template)">
            <template #icon><DeleteOutlined /></template>
            删除
          </a-button>
        </div>
      </transition>
    </div>

    <!-- 卡片信息 -->
    <div class="tpl-info">
      <div class="tpl-header">
        <span class="tpl-name">{{ template.title || template.name }}</span>
        <span :class="['tpl-tag', template.category === 'official' ? 'tag-official' : 'tag-internal']">
          {{ template.category === 'official' ? '官方' : (template.metadata?.department || '共享') }}
        </span>
      </div>
      <div class="tpl-desc">{{ template.description }}</div>
      <div class="tpl-meta">
        <span class="meta-res">{{ template.metadata?.resolution || '1920 x 1080' }}</span>
        <span>{{ formatUsageCount(template.usageCount || 0) }} 使用</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

defineProps({
  template: {
    type: Object,
    required: true
  },
  showReview: {
    type: Boolean,
    default: false
  }
})

defineEmits(['use', 'preview', 'edit', 'delete', 'review'])

const isHovered = ref(false)

// 获取缩略图URL - 优先使用媒体资源库的图片
const getThumbnailUrl = (template) => {
  // 优先使用媒体资源库的图片
  if (template.thumbnailMedia?.url) {
    return template.thumbnailMedia.url
  }
  // 其次使用thumbnail字段
  if (template.thumbnail) {
    if (template.thumbnail.startsWith('http')) return template.thumbnail
    return template.thumbnail
  }
  // 默认占位图
  return '/images/template-placeholder.svg'
}

// 格式化使用次数
const formatUsageCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count
}
</script>

