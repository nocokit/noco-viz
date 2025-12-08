<template>
  <div class="playlist-management">
    <!-- 顶部 -->
    <div class="header">
      <div>
        <h2>多屏轮播 (Playlists)</h2>
        <p>将多个已发布的大屏组合成播放列表，在展厅、大堂等显示器循环播放。</p>
      </div>
      <button class="btn-primary" @click="createPlaylist">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        新建轮播组
      </button>
    </div>

    <!-- 布局容器：左列表，右预览 -->
    <div class="layout-grid">
      <!-- 左侧：轮播组列表 -->
      <div class="playlist-list">
        <div class="list-header">
          所有轮播组 ({{ playlists.length }})
          <input
            v-model="searchKeyword"
            type="text"
            class="search-mini"
            placeholder="搜索..."
          >
        </div>

        <div
          v-for="playlist in filteredPlaylists"
          :key="playlist.id"
          class="playlist-item"
          :class="{ selected: selectedPlaylist?.id === playlist.id }"
          @click="selectPlaylist(playlist)"
        >
          <div class="item-title">
            {{ playlist.name }}
            <span
              :style="{
                color: playlist.status === 'playing' ? '#10b981' : '#9ca3af',
                fontSize: '12px'
              }"
            >
              ● {{ playlist.status === 'playing' ? '播放中' : '闲置' }}
            </span>
          </div>
          <div class="item-meta">
            <span>{{ playlist.slides.length }} 个页面</span>
            <span>{{ playlist.resolution }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧：配置区 -->
      <div class="config-panel">
        <div class="panel-toolbar">
          <div style="font-weight: 600">
            {{ selectedPlaylist?.name }}
            <span
              style="
                font-weight: 400;
                font-size: 12px;
                color: #9ca3af;
                margin-left: 8px;
              "
            >
              总时长: {{ totalDuration }}
            </span>
          </div>
          <div style="display: flex; gap: 12px; align-items: center">
            <div class="playlist-url">
              {{ selectedPlaylist?.url }}
              <span class="copy-btn" @click="copyUrl">复制</span>
            </div>
            <button class="btn-primary" style="padding: 6px 12px" @click="saveConfig">
              保存配置
            </button>
          </div>
        </div>

        <div class="slides-container">
          <!-- 轮播项 -->
          <div
            v-for="(slide, index) in selectedPlaylist?.slides"
            :key="slide.id"
            class="slide-card"
          >
            <div class="drag-handle">☰</div>
            <div class="slide-thumb">
              <img :src="slide.thumbnail" class="thumb-img" />
            </div>
            <div class="slide-info">
              <div class="slide-name">{{ slide.name }}</div>
              <div class="slide-status">{{ slide.version }} • 已发布</div>
            </div>
            <div class="slide-settings">
              <input
                v-model.number="slide.duration"
                type="number"
                class="duration-input"
                min="1"
              />
              <span class="unit">秒</span>
              <div class="remove-btn" @click="removeSlide(index)">✕</div>
            </div>
          </div>

          <!-- 添加按钮 -->
          <button class="add-slide-btn" @click="addSlide">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            添加大屏页面
          </button>
        </div>

        <!-- 底部预览条 -->
        <div class="preview-footer">
          <div class="device-mock">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
              />
            </svg>
            分辨率设置: {{ selectedPlaylist?.resolution }} (16:9)
          </div>
          <div style="font-size: 12px; color: #9ca3af">
            过渡效果:
            <select
              v-model="selectedPlaylist.transition"
              style="
                background: #000;
                color: #fff;
                border: 1px solid #2d2e33;
                padding: 2px;
                border-radius: 4px;
              "
            >
              <option value="fade">淡入淡出 (Fade)</option>
              <option value="none">直接切换 (None)</option>
              <option value="slide">滑动 (Slide)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const selectedPlaylist = ref(null)

// 播放列表数据
const playlists = ref([
  {
    id: 1,
    name: '公司大堂主屏',
    status: 'playing',
    resolution: '1920x1080',
    url: 'http://view.nocoviz.com/p/hall-main',
    transition: 'fade',
    slides: [
      {
        id: 101,
        name: '集团介绍大屏',
        version: 'v2.1',
        duration: 60,
        thumbnail: 'https://picsum.photos/160/90?random=1'
      },
      {
        id: 102,
        name: '全球业务分布图',
        version: 'v1.0',
        duration: 30,
        thumbnail: 'https://picsum.photos/160/90?random=2'
      },
      {
        id: 103,
        name: 'Q4 业绩战报',
        version: 'v3.5',
        duration: 60,
        thumbnail: 'https://picsum.photos/160/90?random=3'
      }
    ]
  },
  {
    id: 2,
    name: '监控室 2 号屏',
    status: 'idle',
    resolution: '3840x2160 (4K)',
    url: 'http://view.nocoviz.com/p/monitor-2',
    transition: 'none',
    slides: [
      {
        id: 201,
        name: '实时监控看板',
        version: 'v1.2',
        duration: 120,
        thumbnail: 'https://picsum.photos/160/90?random=4'
      },
      {
        id: 202,
        name: '告警统计仪表盘',
        version: 'v2.0',
        duration: 60,
        thumbnail: 'https://picsum.photos/160/90?random=5'
      }
    ]
  },
  {
    id: 3,
    name: '销售部电视墙',
    status: 'idle',
    resolution: '1920x1080',
    url: 'http://view.nocoviz.com/p/sales-tv',
    transition: 'slide',
    slides: [
      {
        id: 301,
        name: '销售额趋势',
        version: 'v1.0',
        duration: 45,
        thumbnail: 'https://picsum.photos/160/90?random=6'
      },
      {
        id: 302,
        name: '区域排行榜',
        version: 'v1.5',
        duration: 30,
        thumbnail: 'https://picsum.photos/160/90?random=7'
      },
      {
        id: 303,
        name: '客户分析',
        version: 'v2.0',
        duration: 40,
        thumbnail: 'https://picsum.photos/160/90?random=8'
      },
      {
        id: 304,
        name: '产品销量Top10',
        version: 'v1.3',
        duration: 35,
        thumbnail: 'https://picsum.photos/160/90?random=9'
      },
      {
        id: 305,
        name: '月度目标达成',
        version: 'v2.1',
        duration: 40,
        thumbnail: 'https://picsum.photos/160/90?random=10'
      },
      {
        id: 306,
        name: '团队业绩PK',
        version: 'v1.8',
        duration: 30,
        thumbnail: 'https://picsum.photos/160/90?random=11'
      }
    ]
  }
])

// 初始选中第一个
selectedPlaylist.value = playlists.value[0]

// 过滤后的播放列表
const filteredPlaylists = computed(() => {
  if (!searchKeyword.value) return playlists.value
  const keyword = searchKeyword.value.toLowerCase()
  return playlists.value.filter(p => p.name.toLowerCase().includes(keyword))
})

// 总时长
const totalDuration = computed(() => {
  if (!selectedPlaylist.value) return '0秒'
  const total = selectedPlaylist.value.slides.reduce((sum, slide) => sum + slide.duration, 0)
  if (total >= 60) {
    const minutes = Math.floor(total / 60)
    const seconds = total % 60
    return `${minutes}分${seconds}秒`
  }
  return `${total}秒`
})

// 选择播放列表
const selectPlaylist = (playlist) => {
  selectedPlaylist.value = playlist
}

// 移除轮播项
const removeSlide = (index) => {
  if (selectedPlaylist.value.slides.length === 1) {
    ElMessage.warning('至少保留一个轮播项')
    return
  }
  selectedPlaylist.value.slides.splice(index, 1)
  ElMessage.success('已移除')
}

// 添加轮播项
const addSlide = () => {
  const newSlide = {
    id: Date.now(),
    name: '新增大屏页面',
    version: 'v1.0',
    duration: 30,
    thumbnail: `https://picsum.photos/160/90?random=${Date.now()}`
  }
  selectedPlaylist.value.slides.push(newSlide)
  ElMessage.success('已添加')
}

// 复制链接
const copyUrl = () => {
  ElMessage.success('播放链接已复制到剪贴板')
}

// 保存配置
const saveConfig = () => {
  ElMessage.success('配置已保存')
}

// 新建播放列表
const createPlaylist = () => {
  ElMessage.info('新建轮播组功能')
}
</script>

<style scoped>
.playlist-management {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ========== 顶部 ========== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h2 {
  font-size: 22px;
  margin-bottom: 6px;
}

.header p {
  color: #9ca3af;
  font-size: 13px;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

/* ========== 布局网格 ========== */
.layout-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  flex: 1;
  overflow: hidden;
}

/* ========== 左侧列表 ========== */
.playlist-list {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header {
  padding: 16px;
  border-bottom: 1px solid #2d2e33;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-mini {
  background: #000;
  border: 1px solid #2d2e33;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  width: 120px;
  font-size: 12px;
}

.search-mini::placeholder {
  color: #6b7280;
}

.playlist-item {
  padding: 16px;
  border-bottom: 1px solid #2d2e33;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
}

.playlist-item:hover {
  background: #26272c;
}

.playlist-item.selected {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-meta {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  gap: 10px;
}

/* ========== 右侧配置面板 ========== */
.config-panel {
  background: #1c1d21;
  border: 1px solid #2d2e33;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-toolbar {
  padding: 16px 24px;
  border-bottom: 1px solid #2d2e33;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.playlist-url {
  background: #000;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #2d2e33;
  font-family: monospace;
  color: #3b82f6;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  cursor: pointer;
  color: #9ca3af;
  font-size: 11px;
  transition: 0.2s;
}

.copy-btn:hover {
  color: #fff;
}

/* ========== 轮播项编辑区 ========== */
.slides-container {
  padding: 24px;
  flex: 1;
  overflow-y: auto;
}

.slide-card {
  display: flex;
  align-items: center;
  background: #0a0b0d;
  border: 1px solid #2d2e33;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  transition: 0.2s;
}

.slide-card:hover {
  border-color: #9ca3af;
}

.drag-handle {
  color: #9ca3af;
  cursor: grab;
  padding: 0 10px;
  font-size: 16px;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.slide-thumb {
  width: 80px;
  height: 45px;
  background: #333;
  border-radius: 4px;
  margin-right: 16px;
  position: relative;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.slide-info {
  flex: 1;
}

.slide-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.slide-status {
  font-size: 11px;
  color: #9ca3af;
}

.slide-settings {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
}

.duration-input {
  width: 60px;
  background: #000;
  border: 1px solid #2d2e33;
  color: #fff;
  padding: 4px;
  text-align: center;
  border-radius: 4px;
  font-size: 13px;
}

.duration-input::-webkit-inner-spin-button,
.duration-input::-webkit-outer-spin-button {
  opacity: 1;
}

.unit {
  font-size: 12px;
  color: #9ca3af;
}

.remove-btn {
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  transition: 0.2s;
}

.remove-btn:hover {
  color: #ef4444;
}

.add-slide-btn {
  width: 100%;
  border: 1px dashed #2d2e33;
  background: transparent;
  color: #9ca3af;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.add-slide-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* ========== 底部预览条 ========== */
.preview-footer {
  padding: 16px 24px;
  border-top: 1px solid #2d2e33;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.device-mock {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #9ca3af;
}
</style>
