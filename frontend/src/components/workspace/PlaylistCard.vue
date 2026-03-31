<template>
  <div class="playlist-card">
    <div class="card-cover">
      <img
        v-if="playlist.coverImage"
        :src="playlist.coverImage"
        :alt="playlist.name"
      >
      <div v-else class="cover-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" class="default-cover">
          <!-- 深色科技背景 -->
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0a1628;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#001529;stop-opacity:1" />
            </linearGradient>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,242,242,0.1)" stroke-width="0.5"/>
            </pattern>
            <radialGradient id="glow" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:#00f2f2;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#00f2f2;stop-opacity:0" />
            </radialGradient>
          </defs>

          <!-- 背景 -->
          <rect width="400" height="225" fill="url(#bgGrad)"/>
          <rect width="400" height="225" fill="url(#grid)"/>

          <!-- 中心光晕 -->
          <circle cx="200" cy="112" r="80" fill="url(#glow)"/>

          <!-- 科技线条装饰 -->
          <g stroke="#00f2f2" stroke-width="1.5" fill="none" opacity="0.6">
            <!-- 左上角 -->
            <path d="M 30,30 L 30,50 M 30,30 L 50,30"/>
            <circle cx="30" cy="30" r="3" fill="#00f2f2"/>

            <!-- 右上角 -->
            <path d="M 370,30 L 370,50 M 370,30 L 350,30"/>
            <circle cx="370" cy="30" r="3" fill="#00f2f2"/>

            <!-- 左下角 -->
            <path d="M 30,195 L 30,175 M 30,195 L 50,195"/>
            <circle cx="30" cy="195" r="3" fill="#00f2f2"/>

            <!-- 右下角 -->
            <path d="M 370,195 L 370,175 M 370,195 L 350,195"/>
            <circle cx="370" cy="195" r="3" fill="#00f2f2"/>
          </g>

          <!-- 中心播放图标 -->
          <g transform="translate(200, 112)">
            <!-- 外圈 -->
            <circle cx="0" cy="0" r="35" stroke="#00f2f2" stroke-width="2" fill="none" opacity="0.4"/>
            <circle cx="0" cy="0" r="42" stroke="#00f2f2" stroke-width="1" fill="none" opacity="0.2"/>

            <!-- 播放按钮 -->
            <path d="M -12,-15 L -12,15 L 18,0 Z" fill="#00f2f2" opacity="0.8"/>

            <!-- 装饰点 -->
            <circle cx="-30" cy="0" r="2" fill="#00f2f2" opacity="0.6"/>
            <circle cx="30" cy="0" r="2" fill="#00f2f2" opacity="0.6"/>
            <circle cx="0" cy="-30" r="2" fill="#00f2f2" opacity="0.6"/>
            <circle cx="0" cy="30" r="2" fill="#00f2f2" opacity="0.6"/>
          </g>

          <!-- 底部文字 -->
          <text x="200" y="180" text-anchor="middle" fill="#00f2f2" font-size="14" font-family="Arial, sans-serif" opacity="0.5">
            轮播大屏
          </text>

          <!-- 装饰粒子 -->
          <circle cx="80" cy="60" r="1.5" fill="#00f2f2" opacity="0.4"/>
          <circle cx="320" cy="80" r="1.5" fill="#00f2f2" opacity="0.4"/>
          <circle cx="100" cy="170" r="1.5" fill="#00f2f2" opacity="0.4"/>
          <circle cx="300" cy="160" r="1.5" fill="#00f2f2" opacity="0.4"/>
          <circle cx="150" cy="50" r="1" fill="#66ffff" opacity="0.3"/>
          <circle cx="250" cy="180" r="1" fill="#66ffff" opacity="0.3"/>
        </svg>
      </div>
      <div class="card-overlay">
        <a-space direction="vertical" :size="8">
          <a-button type="primary" block @click="$emit('config', playlist)">
            <template #icon><SettingOutlined /></template>
            配置轮播
          </a-button>
          <a-button block @click.stop="$emit('copy-url', playlist)">
            <template #icon><LinkOutlined /></template>
            复制链接
          </a-button>
        </a-space>
      </div>
    </div>

    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">{{ playlist.name }}</h3>
        <a-dropdown placement="bottomRight">
          <a-button type="text" size="small" class="more-btn">
            <template #icon><MoreOutlined /></template>
          </a-button>
          <template #overlay>
            <a-menu @click="({ key }) => $emit('action', key, playlist)">
              <a-menu-item key="edit">
                <EditOutlined />
                编辑
              </a-menu-item>
              <a-menu-item key="toggle">
                <SwapOutlined />
                {{ playlist.status === 'playing' ? '设为闲置' : '设为播放中' }}
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="delete" danger>
                <DeleteOutlined />
                删除
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <div class="card-meta">
        <a-space :size="8" wrap>
          <a-tag v-if="playlist.status === 'playing'" color="success">
            播放中
          </a-tag>
          <a-tag v-else class="draft-tag">
            闲置
          </a-tag>
          <span class="meta-item">
            <PlayCircleOutlined />
            <span class="meta-number">{{ playlist.screenCount || playlist.slides?.length || 0 }}</span> 个大屏
          </span>
          <span class="meta-item">
            <ClockCircleOutlined />
            间隔 <span class="meta-number">{{ playlist.interval || 10 }}</span>秒
          </span>
        </a-space>
      </div>

      <div class="card-footer">
        <span class="footer-time">
          <CalendarOutlined />
          {{ playlist.updatedAt }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PlayCircleOutlined,
  SettingOutlined,
  LinkOutlined,
  MoreOutlined,
  EditOutlined,
  SwapOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'

defineProps({
  playlist: {
    type: Object,
    required: true
  }
})

defineEmits(['config', 'copy-url', 'action'])
</script>

<style scoped>
.playlist-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.playlist-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #fafafa;
  overflow: hidden;
}

.card-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a1628;
}

.default-cover {
  width: 100%;
  height: 100%;
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
  opacity: 0;
  transition: opacity 0.3s ease;
}

.playlist-card:hover .card-overlay {
  opacity: 1;
}

.card-body {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 8px;
}

.more-btn {
  color: #8c8c8c;
  flex-shrink: 0;
}

.more-btn:hover {
  color: #262626;
}

.card-meta {
  margin-bottom: 12px;
}

.draft-tag {
  background: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
  font-weight: 500;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #8c8c8c;
}

.meta-item :deep(.anticon) {
  font-size: 12px;
}

.meta-number {
  color: #1890ff;
  font-size: 14px;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.footer-time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #bfbfbf;
}

.footer-time :deep(.anticon) {
  font-size: 12px;
}
</style>

