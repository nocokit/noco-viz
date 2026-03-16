<template>
  <div class="list-item">
    <div class="list-item-thumb" style="width: 160px; height: 90px;">
      <img v-if="playlist.coverImage" :src="getImageUrl(playlist.coverImage)" :alt="playlist.name" />
      <div v-else class="list-item-thumb-default" style="background: #0a1628;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" style="width: 100%; height: 100%;">
          <defs>
            <linearGradient id="listBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0a1628;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#001529;stop-opacity:1" />
            </linearGradient>
            <pattern id="listGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,242,242,0.1)" stroke-width="0.3"/>
            </pattern>
          </defs>
          <rect width="160" height="90" fill="url(#listBgGrad)"/>
          <rect width="160" height="90" fill="url(#listGrid)"/>
          <g transform="translate(80, 45)">
            <circle cx="0" cy="0" r="18" stroke="#00f2f2" stroke-width="1.5" fill="none" opacity="0.4"/>
            <path d="M -6,-8 L -6,8 L 10,0 Z" fill="#00f2f2" opacity="0.7"/>
          </g>
        </svg>
      </div>
    </div>
    <div class="list-item-content">
      <div class="list-item-header">
        <div class="list-item-title-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="title-icon">
            <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
          </svg>
          <span class="list-item-title">{{ playlist.name }}</span>
          <a-tag v-if="playlist.status === 'playing'" color="success">播放中</a-tag>
          <a-tag v-else class="draft-tag">闲置</a-tag>
        </div>
        <div class="list-item-actions">
          <a-button size="small" type="primary" @click="$emit('config', playlist)">
            <template #icon><SettingOutlined /></template>
            配置轮播
          </a-button>
          <a-button size="small" @click="$emit('copy-url', playlist)">
            <template #icon><LinkOutlined /></template>
            复制链接
          </a-button>
          <a-dropdown>
            <a-button size="small">
              <template #icon><MoreOutlined /></template>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="$emit('edit', playlist)">
                  <EditOutlined /> 编辑
                </a-menu-item>
                <a-menu-item @click="$emit('toggle', playlist)">
                  <SwapOutlined /> {{ playlist.status === 'playing' ? '设为闲置' : '设为播放中' }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item danger @click="$emit('delete', playlist)">
                  <DeleteOutlined /> 删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="list-item-desc">{{ playlist.description || '暂无描述' }}</div>
      <div class="list-item-meta">
        <a-space :size="16">
          <span class="meta-text">
            <PlayCircleOutlined />
            <span class="meta-number">{{ playlist.screenCount || 0 }}</span> 个大屏
          </span>
          <span class="meta-text">
            <ClockCircleOutlined />
            间隔 <span class="meta-number">{{ playlist.interval || 10 }}</span> 秒
          </span>
          <span class="meta-text">
            <CalendarOutlined />
            更新于 {{ playlist.updatedAt }}
          </span>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  SettingOutlined, LinkOutlined, MoreOutlined,
  EditOutlined, SwapOutlined, DeleteOutlined,
  PlayCircleOutlined, ClockCircleOutlined, CalendarOutlined
} from '@ant-design/icons-vue'
import { getImageUrl } from '@/utils/image'

defineProps({
  playlist: { type: Object, required: true }
})

defineEmits(['config', 'copy-url', 'edit', 'toggle', 'delete'])
</script>

<style scoped>
@import '@/styles/workspace-list-item.css';
</style>
