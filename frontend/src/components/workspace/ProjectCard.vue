<template>
  <div
    class="project-card"
    :class="`type-${project.type}`"
  >
    <div class="card-image-header">
      <img
        v-if="project.coverImage"
        :src="project.coverImage"
        class="header-img"
        :alt="project.title"
      >
      <div v-else class="header-img-default" :class="`type-${project.type}`">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" class="default-cover-svg">
          <defs>
            <linearGradient :id="`projBgGrad-${project.id}`" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="getTypeGradient(project.type).start" />
              <stop offset="100%" :style="getTypeGradient(project.type).end" />
            </linearGradient>
            <pattern :id="`projGrid-${project.id}`" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            </pattern>
            <radialGradient :id="`projGlow-${project.id}`" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:#fff;stop-opacity:0.2" />
              <stop offset="100%" style="stop-color:#fff;stop-opacity:0" />
            </radialGradient>
          </defs>

          <rect width="400" height="180" :fill="`url(#projBgGrad-${project.id})`"/>
          <rect width="400" height="180" :fill="`url(#projGrid-${project.id})`"/>
          <circle cx="200" cy="90" r="60" :fill="`url(#projGlow-${project.id})`"/>

          <!-- 四角装饰 -->
          <g stroke="#fff" stroke-width="2" fill="none" opacity="0.5">
            <path d="M 25,25 L 25,45 M 25,25 L 45,25"/>
            <circle cx="25" cy="25" r="3" fill="#fff"/>
            <path d="M 375,25 L 375,45 M 375,25 L 355,25"/>
            <circle cx="375" cy="25" r="3" fill="#fff"/>
            <path d="M 25,155 L 25,135 M 25,155 L 45,155"/>
            <circle cx="25" cy="155" r="3" fill="#fff"/>
            <path d="M 375,155 L 375,135 M 375,155 L 355,155"/>
            <circle cx="375" cy="155" r="3" fill="#fff"/>
          </g>

          <!-- 中心图标 -->
          <g transform="translate(200, 90)">
            <circle cx="0" cy="0" r="35" stroke="#fff" stroke-width="2" fill="none" opacity="0.4"/>
            <circle cx="0" cy="0" r="42" stroke="#fff" stroke-width="1" fill="none" opacity="0.2"/>
            <g transform="translate(-12, -12)">
              <component :is="getIcon(project.type)" class="center-icon" />
            </g>
          </g>

          <!-- 底部标签 -->
          <text x="200" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="500" opacity="0.9">
            {{ project.type === 'screen' ? '数据可视化大屏' : '中国式复杂报表' }}
          </text>

          <!-- 装饰粒子 -->
          <circle cx="80" cy="50" r="2" fill="#fff" opacity="0.4"/>
          <circle cx="320" cy="60" r="2" fill="#fff" opacity="0.4"/>
          <circle cx="100" cy="140" r="2" fill="#fff" opacity="0.4"/>
          <circle cx="300" cy="130" r="2" fill="#fff" opacity="0.4"/>
          <circle cx="150" cy="40" r="1.5" fill="#fff" opacity="0.3"/>
          <circle cx="250" cy="145" r="1.5" fill="#fff" opacity="0.3"/>
        </svg>
      </div>
      <div class="card-overlay">
        <a-button type="primary" class="overlay-btn" @click="$emit('enter-editor', project)">
          <template #icon><EditOutlined /></template>
          {{ project.type === 'screen' ? '进入大屏编辑器' : '进入报表编辑器' }}
        </a-button>
        <a-button class="overlay-btn" @click="$emit('preview', project)">
          <template #icon><EyeOutlined /></template>
          预览
        </a-button>
      </div>
    </div>
    <div class="card-content">
      <div class="card-header-row">
        <div class="card-title">
          <component :is="getIcon(project.type)" class="type-icon" />
          {{ project.title }}
        </div>
        <div class="card-actions-menu">
          <a-dropdown>
            <span class="dropdown-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </span>
            <template #overlay>
              <a-menu @click="({ key }) => handleMenuAction(key)">
                <a-menu-item key="edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  编辑
                </a-menu-item>
                <a-menu-item key="preview">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  预览
                </a-menu-item>
                <a-menu-item key="duplicate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  复制
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item
                  v-if="project.status === 'published'"
                  key="unpublish"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  取消发布
                </a-menu-item>
                <a-menu-item
                  v-else
                  key="publish"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                    <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"/>
                  </svg>
                  发布
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="delete" danger>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; vertical-align: middle;">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-tag v-if="project.status === 'published'" color="success">
            已发布
          </a-tag>
          <a-tag v-else class="draft-tag">
            草稿
          </a-tag>
        </div>
      </div>
      <div class="card-desc">{{ project.description }}</div>
      <div class="card-footer">
        <span>{{ project.type === 'screen' ? 'Screen Visualization' : 'Enterprise Report' }}</span>
        <span>{{ project.updatedAt }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { EditOutlined, EyeOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['enter-editor', 'preview', 'edit', 'duplicate', 'publish', 'unpublish', 'delete'])

// Icons components
const ScreenIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z' })
  ])
}

const ReportIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z' })
  ])
}

const getIcon = (type) => {
  return type === 'screen' ? ScreenIcon : ReportIcon
}

const getTypeGradient = (type) => {
  if (type === 'screen') {
    return {
      start: 'stop-color:#667eea;stop-opacity:1',
      end: 'stop-color:#764ba2;stop-opacity:1'
    }
  } else {
    return {
      start: 'stop-color:#f093fb;stop-opacity:1',
      end: 'stop-color:#f5576c;stop-opacity:1'
    }
  }
}

const handleMenuAction = (key) => {
  switch (key) {
    case 'edit':
      emit('edit', props.project)
      break
    case 'preview':
      emit('preview', props.project)
      break
    case 'duplicate':
      emit('duplicate', props.project)
      break
    case 'publish':
      emit('publish', props.project)
      break
    case 'unpublish':
      emit('unpublish', props.project)
      break
    case 'delete':
      emit('delete', props.project)
      break
  }
}
</script>

<style scoped>
.project-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-image-header {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #fafafa;
}

.header-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-img-default {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  overflow: hidden;
}

.default-cover-svg {
  width: 100%;
  height: 100%;
}

.center-icon {
  width: 24px;
  height: 24px;
  color: #fff;
  opacity: 0.9;
}

.header-img-default.type-report {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.default-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.default-text {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .card-overlay {
  opacity: 1;
}

.overlay-btn {
  border-radius: 4px;
}

.card-content {
  padding: 16px;
}

.card-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.type-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #8c8c8c;
}

.card-actions-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.dropdown-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-link:hover {
  background: #f5f5f5;
  color: #262626;
}

.draft-tag {
  background: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
  font-weight: 500;
}

.card-desc {
  font-size: 14px;
  color: #8c8c8c;
  line-height: 1.5;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 42px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #bfbfbf;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>