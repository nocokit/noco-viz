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
          <a-button
            v-if="primaryAction"
            type="primary"
            class="overlay__btn"
            @click.stop="handlePrimaryAction"
          >
            {{ primaryAction.text }}
          </a-button>
          <a-button
            v-if="secondaryAction"
            class="overlay__btn"
            @click.stop="handleSecondaryAction"
          >
            {{ secondaryAction.text }}
          </a-button>
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
            <a-dropdown v-if="actions && actions.length" @command="handleAction" trigger="click">
              <span class="action-menu" @click.stop>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </span>
              <template #dropdown>
                <a-menu>
                  <a-menu-item
                    v-for="action in actions"
                    :key="action.command"
                    :command="action.command"
                    :disabled="action.disabled"
                    :divided="action.divided"
                  >
                    {{ action.label }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
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
            <User />
            <span>{{ meta.author }}</span>
          </div>
          <div v-if="meta?.updatedAt" class="meta__item">
            <Clock />
            <span>{{ formatTime(meta.updatedAt) }}</span>
          </div>
          <div v-if="meta?.views !== undefined" class="meta__item">
            <View />
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
import { UserOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons-vue'
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

