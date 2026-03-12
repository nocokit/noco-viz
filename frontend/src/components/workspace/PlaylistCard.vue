<template>
  <div class="playlist-card">
    <div class="card-cover">
      <img
        v-if="playlist.coverImage"
        :src="playlist.coverImage"
        :alt="playlist.name"
      >
      <div v-else class="cover-placeholder">
        <PlayCircleOutlined :style="{ fontSize: '48px', color: '#bfbfbf' }" />
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
                编辑信息
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
  background: #f5f5f5;
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

