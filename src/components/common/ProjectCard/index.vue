<template>
  <div
    class="project-card"
    :class="[
      `project-card--${type}`,
      `project-card--${status}`,
      { 'project-card--hoverable': hoverable }
    ]"
    @click="handleClick"
  >
    <!-- 封面区域 -->
    <div class="project-card__cover">
      <img
        v-if="cover"
        :src="cover"
        :alt="title"
        class="project-card__image"
      >
      <div v-else class="project-card__placeholder" :class="`placeholder--${type}`">
        <component :is="placeholderIcon" class="placeholder__icon" />
        <div class="placeholder__text">{{ placeholderText }}</div>
      </div>

      <!-- 悬浮操作层 -->
      <div v-if="showOverlay" class="project-card__overlay">
        <slot name="overlay">
          <button
            v-if="primaryAction"
            class="overlay__btn overlay__btn--primary"
            @click.stop="handlePrimaryAction"
          >
            {{ primaryAction.text }}
          </button>
          <button
            v-if="secondaryAction"
            class="overlay__btn overlay__btn--secondary"
            @click.stop="handleSecondaryAction"
          >
            {{ secondaryAction.text }}
          </button>
        </slot>
      </div>

      <!-- 角标 -->
      <div v-if="badge" class="project-card__badge" :class="`badge--${badge.type || 'default'}`">
        {{ badge.text }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="project-card__content">
      <!-- 头部行 -->
      <div class="project-card__header">
        <div class="header__title">
          <component v-if="typeIcon" :is="typeIcon" class="title__icon" />
          <span class="title__text" :title="title">{{ title }}</span>
        </div>

        <div class="header__actions">
          <slot name="actions">
            <!-- 状态标签 -->
            <span
              v-if="status && showStatus"
              class="status-badge"
              :class="`status-badge--${status}`"
            >
              <span class="status-badge__dot"></span>
              {{ statusText }}
            </span>

            <!-- 下拉菜单 -->
            <el-dropdown v-if="actions && actions.length" @command="handleAction" trigger="click">
              <span class="action-menu" @click.stop>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="action in actions"
                    :key="action.command"
                    :command="action.command"
                    :disabled="action.disabled"
                    :divided="action.divided"
                  >
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </slot>
        </div>
      </div>

      <!-- 描述 -->
      <div v-if="description" class="project-card__description" :title="description">
        {{ description }}
      </div>

      <!-- 元信息 -->
      <div v-if="meta || $slots.meta" class="project-card__meta">
        <slot name="meta">
          <div v-if="meta?.author" class="meta__item">
            <el-icon><User /></el-icon>
            <span>{{ meta.author }}</span>
          </div>
          <div v-if="meta?.updatedAt" class="meta__item">
            <el-icon><Clock /></el-icon>
            <span>{{ formatTime(meta.updatedAt) }}</span>
          </div>
          <div v-if="meta?.views !== undefined" class="meta__item">
            <el-icon><View /></el-icon>
            <span>{{ meta.views }}</span>
          </div>
        </slot>
      </div>

      <!-- 底部插槽 -->
      <div v-if="$slots.footer" class="project-card__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Clock, View } from '@element-plus/icons-vue'
import { formatRelativeTime } from '@/utils/formatters'

const props = defineProps({
  // 基础信息
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },

  // 类型和状态
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['screen', 'report', 'template', 'media', 'default'].includes(value)
  },
  status: {
    type: String,
    default: 'draft',
    validator: (value) => ['draft', 'published', 'archived', ''].includes(value)
  },

  // 元信息
  meta: {
    type: Object,
    default: null
  },

  // 角标
  badge: {
    type: Object,
    default: null
  },

  // 操作
  actions: {
    type: Array,
    default: () => []
  },
  primaryAction: {
    type: Object,
    default: null
  },
  secondaryAction: {
    type: Object,
    default: null
  },

  // 显示控制
  showOverlay: {
    type: Boolean,
    default: true
  },
  showStatus: {
    type: Boolean,
    default: true
  },
  hoverable: {
    type: Boolean,
    default: true
  },

  // 图标
  typeIcon: {
    type: Object,
    default: null
  },
  placeholderIcon: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['click', 'action', 'primary-action', 'secondary-action'])

// 占位符文本
const placeholderText = computed(() => {
  const textMap = {
    screen: '数据可视化大屏',
    report: '中国式复杂报表',
    template: '模板',
    media: '媒体文件',
    default: '项目'
  }
  return textMap[props.type] || textMap.default
})

// 状态文本
const statusText = computed(() => {
  const textMap = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档'
  }
  return textMap[props.status] || props.status
})

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  return formatRelativeTime(time)
}

// 事件处理
const handleClick = () => {
  emit('click')
}

const handleAction = (command) => {
  emit('action', command)
}

const handlePrimaryAction = () => {
  if (props.primaryAction?.handler) {
    props.primaryAction.handler()
  }
  emit('primary-action')
}

const handleSecondaryAction = () => {
  if (props.secondaryAction?.handler) {
    props.secondaryAction.handler()
  }
  emit('secondary-action')
}
</script>

<style scoped>
.project-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid var(--border-light);
}

.project-card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border);
}

/* 封面区域 */
.project-card__cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
  overflow: hidden;
  background: var(--bg-secondary);
}

.project-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-card__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.placeholder--screen {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder--report {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.placeholder--template {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.placeholder--media {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.placeholder__icon {
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.9);
}

.placeholder__text {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

/* 悬浮层 */
.project-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.project-card:hover .project-card__overlay {
  opacity: 1;
}

.overlay__btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-md);
  border: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.overlay__btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.overlay__btn--primary:hover {
  background: #3a8ee6;
}

.overlay__btn--secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(4px);
}

.overlay__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 角标 */
.project-card__badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.badge--new {
  background: var(--color-success);
}

.badge--hot {
  background: var(--color-danger);
}

/* 内容区域 */
.project-card__content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 头部 */
.project-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.header__title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.title__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.title__text {
  flex: 1;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

/* 状态标签 */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background: var(--bg-secondary);
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-tertiary);
}

.status-badge--published .status-badge__dot {
  background: var(--color-success);
}

.status-badge--draft .status-badge__dot {
  background: var(--color-warning);
}

.status-badge--archived .status-badge__dot {
  background: var(--text-disabled);
}

/* 操作菜单 */
.action-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.action-menu:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

/* 描述 */
.project-card__description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 元信息 */
.project-card__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.meta__item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta__item .el-icon {
  font-size: 14px;
}

/* 底部 */
.project-card__footer {
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-lighter);
}
</style>
