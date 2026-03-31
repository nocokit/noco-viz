<template>
  <div class="list-item">
    <div class="list-item-thumb">
      <img
        v-if="project.coverImage"
        :src="getImageUrl(project.coverImage)"
        :alt="project.title"
      />
      <div v-else class="list-item-thumb-default" :class="`type-${project.type}`">
        <component :is="getIcon(project.type)" class="thumb-icon" />
      </div>
    </div>
    <div class="list-item-content">
      <div class="list-item-header">
        <div class="list-item-title-row">
          <component :is="getIcon(project.type)" class="title-icon" />
          <span class="list-item-title">{{ project.title }}</span>
          <a-tag v-if="project.status === 'published'" color="success">
            已发布
          </a-tag>
          <a-tag v-else class="draft-tag" color="default">
            草稿
          </a-tag>
        </div>
        <div class="list-item-actions">
          <a-button size="small" type="primary" @click="$emit('edit', project)">
            <template #icon><EditOutlined /></template>
            编辑
          </a-button>
          <a-button size="small" @click="$emit('preview', project)">
            <template #icon><EyeOutlined /></template>
            预览
          </a-button>
          <a-dropdown>
            <a-button size="small">
              <template #icon><MoreOutlined /></template>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="$emit('duplicate', project)">
                  <CopyOutlined />
                  复制
                </a-menu-item>
                <a-menu-item
                  v-if="project.status === 'published'"
                  @click="$emit('unpublish', project)"
                >
                  <CloseCircleOutlined />
                  取消发布
                </a-menu-item>
                <a-menu-item v-else @click="$emit('publish', project)">
                  <CheckCircleOutlined />
                  发布
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item danger @click="$emit('delete', project)">
                  <DeleteOutlined />
                  删除
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="list-item-desc">{{ project.description || '暂无描述' }}</div>
      <div class="list-item-meta">
        <a-space :size="16">
          <span>
            <a-tag :bordered="false" color="blue">
              {{ project.type === 'screen' ? '数据大屏' : '复杂报表' }}
            </a-tag>
          </span>
          <span class="meta-text">
            <ClockCircleOutlined />
            更新于 {{ project.updatedAt }}
          </span>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import {
  EditOutlined, EyeOutlined, MoreOutlined,
  CopyOutlined, CloseCircleOutlined, CheckCircleOutlined,
  DeleteOutlined, ClockCircleOutlined
} from '@ant-design/icons-vue'
import { getImageUrl } from '@/utils/image'

defineProps({
  project: { type: Object, required: true }
})

defineEmits(['edit', 'preview', 'duplicate', 'publish', 'unpublish', 'delete'])

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

const getIcon = (type) => type === 'screen' ? ScreenIcon : ReportIcon
</script>

<style scoped>
@import '@/styles/workspace-list-item.css';

.list-item-thumb-default.type-report {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.thumb-icon {
  width: 32px;
  height: 32px;
  color: #fff;
}
</style>
