<template>
  <div class="list-item">
    <div class="list-item-thumb">
      <img
        v-if="template.thumbnail || template.thumbnailMedia?.url"
        :src="getImageUrl(template.thumbnail || template.thumbnailMedia?.url)"
        :alt="template.title"
        @error="handleImageError"
      />
      <div v-else class="list-item-thumb-default">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/>
        </svg>
      </div>
    </div>
    <div class="list-item-content">
      <div class="list-item-header">
        <div class="list-item-title-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="title-icon">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM6 19V5h12v14H6zm2-4h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"/>
          </svg>
          <span class="list-item-title">{{ template.title }}</span>
          <a-tag color="blue" :bordered="false">{{ getCategoryLabel(template.category) }}</a-tag>
        </div>
        <div class="list-item-actions">
          <a-button size="small" type="primary" @click="$emit('use', template)">
            <template #icon><CheckOutlined /></template>
            使用模板
          </a-button>
          <a-button size="small" @click="$emit('preview', template)">
            <template #icon><EyeOutlined /></template>
            预览
          </a-button>
          <a-dropdown>
            <a-button size="small">
              <template #icon><MoreOutlined /></template>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="$emit('edit', template)">
                  <EditOutlined /> 编辑
                </a-menu-item>
                <a-menu-item @click="$emit('duplicate', template)">
                  <CopyOutlined /> 复制
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item danger @click="$emit('delete', template)">
                  <DeleteOutlined /> 删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="list-item-desc">{{ template.description || '暂无描述' }}</div>
      <div class="list-item-meta">
        <a-space :size="16">
          <span class="meta-text">
            <FireOutlined />
            <span class="meta-number">{{ template.usageCount || 0 }}</span> 次使用
          </span>
          <span class="meta-text">
            <ClockCircleOutlined />
            更新于 {{ template.updatedAt }}
          </span>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CheckOutlined, EyeOutlined, MoreOutlined,
  EditOutlined, CopyOutlined, DeleteOutlined,
  FireOutlined, ClockCircleOutlined
} from '@ant-design/icons-vue'
import { getImageUrl, handleImageError } from '@/utils/image'

defineProps({
  template: { type: Object, required: true }
})

defineEmits(['use', 'preview', 'edit', 'duplicate', 'delete'])

const CATEGORY_LABELS = {
  dashboard: '数据看板',
  report: '数据报表',
  screen: '数据大屏',
  chart: '图表组件',
  other: '其他'
}

const getCategoryLabel = (category) => CATEGORY_LABELS[category] || category
</script>

<style scoped>
@import '@/styles/workspace-list-item.css';
</style>
