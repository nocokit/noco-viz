<template>
  <div class="tpl-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- 缩略图 -->
    <div class="tpl-thumb">
      <img :src="getThumbnailUrl(template)" :alt="template.name" class="tpl-img" />

      <!-- Hover 遮罩 -->
      <transition name="overlay-fade">
        <div v-show="isHovered" class="tpl-overlay">
          <button class="overlay-btn btn-use" @click.stop="$emit('use', template)">
            <el-icon><Check /></el-icon>
            创建项目
          </button>
          <button class="overlay-btn btn-preview" @click.stop="$emit('preview', template)">
            <el-icon><View /></el-icon>
            预览
          </button>
          <button v-if="!template.isSystem" class="overlay-btn btn-edit" @click.stop="$emit('edit', template)">
            <el-icon><Edit /></el-icon>
            编辑
          </button>
          <button v-if="showReview && template.status === 'pending'" class="overlay-btn btn-review" @click.stop="$emit('review', template)">
            <el-icon><Check /></el-icon>
            审核
          </button>
          <button v-if="!template.isSystem" class="overlay-btn btn-delete" @click.stop="$emit('delete', template)">
            <el-icon><Delete /></el-icon>
            删除
          </button>
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
import { Check, View, Edit, Delete } from '@element-plus/icons-vue'

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

<style scoped>
/* Template Card */
.tpl-card {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.tpl-card:hover {
  transform: translateY(-6px);
  border-color: var(--el-color-primary);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Thumbnail */
.tpl-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--el-fill-color-darker);
  position: relative;
  overflow: hidden;
}

.tpl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  transition: all 0.4s;
}

.tpl-card:hover .tpl-img {
  opacity: 0.4;
  transform: scale(1.05);
  filter: blur(2px);
}

/* Hover Overlay */
.tpl-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.overlay-btn {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-use {
  background: var(--el-color-primary);
  color: #fff;
}

.btn-use:hover {
  background: var(--el-color-primary-light-3);
  transform: scale(1.05);
}

.btn-preview {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-preview:hover {
  background: rgba(255, 255, 255, 0.25);
}

.btn-edit {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.btn-edit:hover {
  background: rgba(245, 158, 11, 0.3);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.3);
}

.btn-review {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.btn-review:hover {
  background: rgba(16, 185, 129, 0.3);
}

/* Card Info */
.tpl-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tpl-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
}

.tpl-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
  flex: 1;
}

.tpl-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
  white-space: nowrap;
}

.tag-official {
  background: #8b5cf6;
  color: #fff;
}

.tag-internal {
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.tpl-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  flex: 1;
}

.tpl-meta {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--el-text-color-secondary);
}

.meta-res {
  font-family: 'Courier New', monospace;
  background: var(--el-fill-color-darker);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid var(--el-border-color);
}
</style>
