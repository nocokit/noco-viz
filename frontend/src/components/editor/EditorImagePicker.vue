<!--
  图片选择器组件
  支持直接输入 URL 或从媒体库选择图片
-->
<template>
  <div class="editor-image-picker">
    <!-- 预览区 -->
    <div class="preview-area" :class="{ 'has-image': modelValue }" @click="openPicker">
      <img v-if="modelValue" :src="modelValue" class="preview-img" @error="onImgError" />
      <div v-else class="preview-placeholder">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        <span>点击选择图片</span>
      </div>
      <div v-if="modelValue" class="preview-overlay">
        <span>更换图片</span>
      </div>
    </div>

    <!-- URL 输入 + 清除 -->
    <div class="url-row">
      <input
        class="url-input"
        :value="modelValue"
        placeholder="图片 URL"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button v-if="modelValue" class="clear-btn" @click.stop="$emit('update:modelValue', '')" title="清除">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>

    <!-- 媒体库弹窗 -->
    <div v-if="pickerVisible" class="picker-modal" @click.self="pickerVisible = false">
      <div class="picker-dialog">
        <div class="picker-header">
          <span>选择图片</span>
          <button class="picker-close" @click="pickerVisible = false">✕</button>
        </div>
        <div class="picker-search">
          <input v-model="searchQuery" class="search-input" placeholder="搜索图片..." />
        </div>
        <div class="picker-body">
          <div v-if="loading" class="picker-loading">加载中...</div>
          <div v-else-if="filteredList.length === 0" class="picker-empty">暂无图片资源</div>
          <div v-else class="picker-grid">
            <div
              v-for="item in filteredList"
              :key="item.id"
              class="picker-item"
              :class="{ selected: modelValue === getUrl(item) }"
              @click="selectImage(item)"
            >
              <img :src="getUrl(item)" @error="onImgError" />
              <div class="picker-item-name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getMediaList } from '@/api/media'

// 内置预设图片（始终可用，不依赖后端）
const PRESET_IMAGES = [
  { id: 'preset-top-bar', name: '顶部装饰条', type: 'image', url: 'https://www.gaobug.com/bigscreen/static/img/top.41ada94a.png' }
]

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const pickerVisible = ref(false)
const loading = ref(false)
const mediaList = ref([])
const searchQuery = ref('')

const filteredList = computed(() =>
  mediaList.value.filter(item =>
    item.type === 'image' &&
    (!searchQuery.value || item.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
)

const getUrl = (item) => item.thumbnail || item.url || ''

const openPicker = async () => {
  pickerVisible.value = true
  if (mediaList.value.length === 0) {
    loading.value = true
    try {
      const res = await getMediaList({ type: 'image', limit: 200 })
      mediaList.value = [...PRESET_IMAGES, ...(res.data || res || [])]
    } catch (e) {
      console.error('加载媒体列表失败', e)
      mediaList.value = [...PRESET_IMAGES]
    } finally {
      loading.value = false
    }
  }
}

const selectImage = (item) => {
  emit('update:modelValue', getUrl(item))
  pickerVisible.value = false
}

const onImgError = (e) => {
  e.target.src = ''
}
</script>

<style scoped>
.editor-image-picker {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.preview-area {
  position: relative;
  width: 100%;
  height: 80px;
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 4px;
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
}

.preview-area:hover {
  border-color: rgba(64, 158, 255, 0.5);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 6px;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-area:hover .preview-overlay {
  opacity: 1;
}

.url-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.url-input {
  flex: 1;
  height: 28px;
  padding: 0 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  outline: none;
  min-width: 0;
}

.url-input:focus {
  border-color: rgba(64,158,255,0.5);
}

.clear-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: rgba(255,255,255,0.45);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: rgba(255,77,79,0.2);
  border-color: rgba(255,77,79,0.4);
  color: #ff4d4f;
}

/* 弹窗 */
.picker-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-dialog {
  width: 640px;
  max-height: 520px;
  background: #1e2130;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}

.picker-close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.45);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
}

.picker-close:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.85);
}

.picker-search {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: rgba(64,158,255,0.5);
}

.picker-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.picker-loading,
.picker-empty {
  text-align: center;
  padding: 40px;
  color: rgba(255,255,255,0.3);
  font-size: 13px;
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.picker-item {
  border: 2px solid transparent;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(255,255,255,0.03);
  transition: all 0.2s;
}

.picker-item:hover {
  border-color: rgba(64,158,255,0.5);
}

.picker-item.selected {
  border-color: #409eff;
}

.picker-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}

.picker-item-name {
  padding: 4px 6px;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
