<template>
  <div class="media-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- 缩略图 -->
    <div class="media-thumb">
      <img :src="media.url" :alt="media.name" class="media-img" />

      <!-- Hover 遮罩 -->
      <transition name="overlay-fade">
        <div v-show="isHovered" class="media-overlay">
          <button 
            v-if="media.type === 'logo' && !media.isDefault"
            class="overlay-btn btn-default" 
            @click.stop="$emit('setDefault', media)"
          >
            <el-icon><Star /></el-icon>
            设为默认
          </button>
          <button class="overlay-btn btn-preview" @click.stop="$emit('preview', media)">
            <el-icon><View /></el-icon>
            预览
          </button>
          <button class="overlay-btn btn-delete" @click.stop="$emit('delete', media)">
            <el-icon><Delete /></el-icon>
            删除
          </button>
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
import { View, Delete, Star } from '@element-plus/icons-vue'

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

<style scoped>
/* Media Card */
.media-card {
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

.media-card:hover {
  transform: translateY(-6px);
  border-color: var(--el-color-primary);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Thumbnail */
.media-thumb {
  width: 100%;
  aspect-ratio: 16 / 9; /* 保持统一比例，或者可以用 1/1 方形 */
  background: var(--el-fill-color-darker);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 或者是 cover，看需求 */
  background-color: #f0f2f5;
  transition: all 0.4s;
}

.media-card:hover .media-img {
  filter: blur(2px);
  transform: scale(1.05);
}

/* Hover Overlay */
.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row; /* 水平排列按钮 */
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  flex-wrap: wrap; /* Prevent overflow on small cards */
  padding: 10px;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-btn {
  padding: 6px 12px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  color: #fff;
  white-space: nowrap;
}

.btn-preview {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-preview:hover {
  background: rgba(255, 255, 255, 0.4);
}

.btn-delete {
  background: rgba(245, 108, 108, 0.8);
  border: 1px solid rgba(245, 108, 108, 0.9);
}

.btn-delete:hover {
  background: #f56c6c;
}

.btn-default {
  background: rgba(230, 162, 60, 0.8);
  border: 1px solid rgba(230, 162, 60, 0.9);
}

.btn-default:hover {
  background: #e6a23c;
}

/* Card Info */
.media-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.media-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.media-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.tags-container {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.media-tag {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  font-weight: 600;
  text-transform: uppercase;
}

.tag-default {
  background: var(--el-color-warning-light-8);
  color: var(--el-color-warning);
}

.media-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-top: auto;
}

.meta-size {
  font-family: 'Courier New', monospace;
}
</style>
