<template>
  <div class="template-card" :class="`category-${template.category}`">
    <div class="card-image-header">
      <img
        v-if="template.thumbnail || template.thumbnailMedia?.url"
        :src="getThumbnailUrl(template)"
        class="header-img"
        :alt="template.title"
        @error="handleImageError"
      >
      <div v-else class="header-img-default">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" class="default-cover-svg">
          <defs>
            <linearGradient :id="`bgGrad-${template.id}`" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="getCategoryGradient(template.category).start" />
              <stop offset="100%" :style="getCategoryGradient(template.category).end" />
            </linearGradient>
            <pattern :id="`grid-${template.id}`" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            </pattern>
            <radialGradient :id="`glow-${template.id}`" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:#fff;stop-opacity:0.2" />
              <stop offset="100%" style="stop-color:#fff;stop-opacity:0" />
            </radialGradient>
          </defs>

          <rect width="400" height="180" :fill="`url(#bgGrad-${template.id})`"/>
          <rect width="400" height="180" :fill="`url(#grid-${template.id})`"/>
          <circle cx="200" cy="90" r="60" :fill="`url(#glow-${template.id})`"/>

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
            <component :is="getCategoryIcon(template.category)" class="center-icon" />
          </g>

          <!-- 底部标签 -->
          <text x="200" y="150" text-anchor="middle" fill="#fff" font-size="16" font-weight="500" opacity="0.9">
            {{ getCategoryLabel(template.category) }}
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
        <a-button type="primary" class="overlay-btn" @click="$emit('use', template)">
          <template #icon><CheckOutlined /></template>
          使用模板
        </a-button>
        <a-button class="overlay-btn" @click.stop="$emit('preview', template)">
          <template #icon><EyeOutlined /></template>
          预览
        </a-button>
      </div>
    </div>
    <div class="card-content">
      <div class="card-header-row">
        <div class="card-title">
          <component :is="getCategoryIcon(template.category)" class="type-icon" />
          {{ template.title || template.name }}
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
                  <EditOutlined />
                  编辑
                </a-menu-item>
                <a-menu-item key="duplicate">
                  <CopyOutlined />
                  复制
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="delete" danger>
                  <DeleteOutlined />
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-tag color="blue" :bordered="false">
            {{ getCategoryLabel(template.category) }}
          </a-tag>
        </div>
      </div>
      <div class="card-desc">{{ template.description || '暂无描述' }}</div>
      <div class="card-footer">
        <span><span class="meta-number">{{ template.usageCount || 0 }}</span> 次使用</span>
        <span>{{ template.resolution || '1920x1080' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { EditOutlined, CopyOutlined, DeleteOutlined, CheckOutlined, EyeOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['use', 'preview', 'edit', 'delete'])

// Icons components
const DashboardIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' })
  ])
}

const ReportIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z' })
  ])
}

const ScreenIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z' })
  ])
}

const ChartIcon = {
  render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
    h('path', { d: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z' })
  ])
}

const getCategoryIcon = (category) => {
  const icons = {
    dashboard: DashboardIcon,
    report: ReportIcon,
    screen: ScreenIcon,
    chart: ChartIcon
  }
  return icons[category] || ReportIcon
}

const getThumbnailUrl = (template) => {
  if (template.thumbnailMedia?.url) {
    return template.thumbnailMedia.url
  }
  if (template.thumbnail) {
    if (template.thumbnail.startsWith('http')) return template.thumbnail
    if (template.thumbnail.startsWith('/uploads')) return template.thumbnail
    return template.thumbnail
  }
  return ''
}

const getCategoryLabel = (category) => {
  const labels = {
    dashboard: '数据看板',
    report: '数据报表',
    screen: '数据大屏',
    chart: '图表组件'
  }
  return labels[category] || '企业模板'
}

const getCategoryGradient = (category) => {
  const gradients = {
    dashboard: {
      start: 'stop-color:#667eea;stop-opacity:1',
      end: 'stop-color:#764ba2;stop-opacity:1'
    },
    report: {
      start: 'stop-color:#f093fb;stop-opacity:1',
      end: 'stop-color:#f5576c;stop-opacity:1'
    },
    screen: {
      start: 'stop-color:#4facfe;stop-opacity:1',
      end: 'stop-color:#00f2fe;stop-opacity:1'
    },
    chart: {
      start: 'stop-color:#43e97b;stop-opacity:1',
      end: 'stop-color:#38f9d7;stop-opacity:1'
    }
  }
  return gradients[category] || gradients.dashboard
}

const handleMenuAction = (key) => {
  switch (key) {
    case 'edit':
      emit('edit', props.template)
      break
    case 'duplicate':
      // TODO: 实现复制功能
      break
    case 'delete':
      emit('delete', props.template)
      break
  }
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.template-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.template-card:hover {
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
  width: 40px;
  height: 40px;
  color: #fff;
  opacity: 0.9;
}

.template-card.category-dashboard .header-img-default {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.template-card.category-report .header-img-default {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.template-card.category-screen .header-img-default {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.template-card.category-chart .header-img-default {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
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

.template-card:hover .card-overlay {
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

.meta-number {
  color: #1890ff;
  font-size: 13px;
}
</style>
